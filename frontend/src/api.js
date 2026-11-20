const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function callApi(reqMethod, endPoint, jsonData, formData, resHandler, jwtToken = "", errorHandler = null)
{
    const URL = VITE_API_BASE_URL + endPoint;
    
    const headers = {};
    if (jsonData) headers["Content-Type"] = "application/json";
    if (jwtToken) headers["Authorization"] = `Bearer ${jwtToken}`;

    const options = {
        method: reqMethod,
        headers: headers,
        credentials: "include",
        body: jsonData ? JSON.stringify(jsonData) : formData ? formData : undefined
    };

    fetch(URL, options)
        .then(async (res) => {
            if(res.status == 401){
                localStorage.clear();
                window.location.replace("/login");
                throw new Error("Session Expired!")
            }
            
            if (!res.ok) 
                throw new Error(res.status + ": " + res.statusText);
            return res.json();
        })
        .then((data) => resHandler(data))
        .catch((err) => {
            if (errorHandler)
                errorHandler(err);
            else
                alert(err);
        });
}

export async function callApiStream(endPoint, jsonData, jwtToken, onChunk, signal)
{
    const URL = VITE_API_BASE_URL + endPoint;
    const headers = {"Content-Type": "application/json"};
    if (jwtToken) headers["Authorization"] = `Bearer ${jwtToken}`;

    const res = await fetch(URL, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(jsonData),
        signal
    });

    if (res.status === 401) {
        localStorage.clear();
        window.location.replace("/login");
        throw new Error("Session Expired!");
    }

    if (!res.ok) {
        throw new Error(res.status + ": " + res.statusText);
    }

    if (!res.body) {
        throw new Error("This browser does not support streaming responses.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let response = "";

    while (true) {
        const {done, value} = await reader.read();
        const chunk = decoder.decode(value, {stream: !done});
        if (chunk) {
            response += chunk;
            onChunk(chunk, response);
        }
        if (done) break;
    }

    return response;
}

export function callApiDownload(reqMethod, endPoint, resHandler, progressHandler, jwtToken = "", isRetry = false)
{
    const URL = VITE_API_BASE_URL + endPoint;
    
    const headers = {};
    if (jwtToken) headers["Authorization"] = `Bearer ${jwtToken}`;

    const options = {
        method: reqMethod,
        headers: headers,
        credentials: "include"
    };

    fetch(URL, options)
        .then(async (res) => {
            if(res.status == 401){
                localStorage.clear();
                window.location.replace("/login");
                throw new Error("Session Expired!")
            }

            if (!res.ok) 
                throw new Error(res.status + ": " + res.statusText);
            
            const contentLength = res.headers.get("Content-Length");
            const total = contentLength ? parseInt(contentLength, 10) : 0;

            const contentDisposition = res.headers.get("Content-Disposition");
            
            let fileName = "submission.pptx";
            if (contentDisposition) {
                const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
                if (utf8Match && utf8Match[1]) 
                    fileName = decodeURIComponent(utf8Match[1]);
                else {
                    const filenameMatch = contentDisposition.match(/filename="([^"]+)"/i);
                    if (filenameMatch && filenameMatch[1]) 
                        fileName = filenameMatch[1];
                }
            }

            const reader = res.body.getReader();

            const chunks = [];
            let receivedLength = 0;

            while (true) {
                const { done, value } = await reader.read();

                if (done)
                    break;

                chunks.push(value);
                receivedLength += value.length;

                const progress = total > 0 ? Math.round((receivedLength / total) * 100) : 0;

                if (progressHandler)
                    progressHandler(progress, receivedLength, total);
            }

            const blob = new Blob(chunks, {
                type: res.headers.get("Content-Type") || "application/octet-stream"
            });

            resHandler({blob, fileName, totalSize: receivedLength});
        })
        .catch((err) => alert(err));
}
