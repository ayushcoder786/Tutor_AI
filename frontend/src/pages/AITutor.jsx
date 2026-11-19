<<<<<<< HEAD
import {useEffect, useRef, useState} from "react";
import {
    Lightbulb,
    LoaderCircle,
    MessageCircle,
    RotateCcw,
    Send,
    Sparkles,
    Zap
} from "lucide-react";
import {callApi, callApiStream} from "../api";
import {useAuth} from "../context/AuthContext";
import "./AITutor.css";

const renderInlineMarkdown = (text) => text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
});

const renderTutorResponse = (content) => content.split(/\r?\n/).map((line, index) => {
    const heading = line.match(/^#{1,3}\s+(.+)/);
    const bullet = line.match(/^\s*[-*]\s+(.+)/);
    const numberedItem = line.match(/^\s*(\d+)\.\s+(.+)/);

    if (heading) {
        return <span className="tutor-answer-heading" key={index}>{renderInlineMarkdown(heading[1])}</span>;
    }
    if (bullet) {
        return <span className="tutor-answer-list-line" key={index}><span aria-hidden="true">•</span>{renderInlineMarkdown(bullet[1])}</span>;
    }
    if (numberedItem) {
        return <span className="tutor-answer-list-line" key={index}><span aria-hidden="true">{numberedItem[1]}.</span>{renderInlineMarkdown(numberedItem[2])}</span>;
    }
    return <span className="tutor-answer-line" key={index}>{line ? renderInlineMarkdown(line) : <br />}</span>;
});

const AITutor = () => {
    const {csrf} = useAuth();
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("standard");
    const [standardMessages, setStandardMessages] = useState([]);
    const [streamMessages, setStreamMessages] = useState([]);
    const [standardLoading, setStandardLoading] = useState(false);
    const [streamLoading, setStreamLoading] = useState(false);
    const [standardError, setStandardError] = useState("");
    const [streamError, setStreamError] = useState("");
    const conversationRef = useRef(null);
    const streamAbortRef = useRef(null);
    const streamRevealRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const messages = activeTab === "stream" ? streamMessages : standardMessages;
    const isLoading = activeTab === "stream" ? streamLoading : standardLoading;
    const error = activeTab === "stream" ? streamError : standardError;

    useEffect(() => {
        if (scrollTimeoutRef.current !== null) return;
        scrollTimeoutRef.current = window.setTimeout(() => {
            const conversation = conversationRef.current;
            if (conversation) conversation.scrollTop = conversation.scrollHeight;
            scrollTimeoutRef.current = null;
        }, 80);
    }, [messages, isLoading]);

    useEffect(() => () => {
        streamAbortRef.current?.abort();
        if (streamRevealRef.current !== null) {
            window.clearInterval(streamRevealRef.current);
        }
        if (scrollTimeoutRef.current !== null) {
            window.clearTimeout(scrollTimeoutRef.current);
        }
    }, []);

    const askTutor = (question, mode = activeTab) => {
        const cleanedQuestion = question.trim();
        if (!cleanedQuestion || (mode === "stream" ? streamLoading : standardLoading)) return;

        setQuery("");
        if (mode === "stream") {
            const messageIndex = streamMessages.length;
            const answerId = `stream-answer-${messageIndex}`;
            setStreamMessages((currentMessages) => [
                ...currentMessages,
                {id: `stream-question-${messageIndex}`, role: "user", content: cleanedQuestion},
                {id: answerId, role: "assistant", content: ""}
            ]);
            setStreamError("");
            setStreamLoading(true);

            const controller = new AbortController();
            streamAbortRef.current = controller;
            let pendingChunks = [];
            let currentChunk = [];
            let currentChunkIndex = 0;
            let displayedContent = "";
            let requestFinished = false;
            let receivedAnyText = false;

            streamRevealRef.current = window.setInterval(() => {
                let revealedCharacters = 0;
                while (revealedCharacters < 4) {
                    if (currentChunkIndex >= currentChunk.length) {
                        currentChunk = pendingChunks.shift() || [];
                        currentChunkIndex = 0;
                        if (currentChunk.length === 0) break;
                    }
                    displayedContent += currentChunk[currentChunkIndex];
                    currentChunkIndex += 1;
                    revealedCharacters += 1;
                }

                if (revealedCharacters > 0) {
                    setStreamMessages((currentMessages) => currentMessages.map((message) =>
                        message.id === answerId ? {...message, content: displayedContent} : message
                    ));
                }

                const hasPendingText = currentChunkIndex < currentChunk.length || pendingChunks.length > 0;
                if (requestFinished && !hasPendingText) {
                    window.clearInterval(streamRevealRef.current);
                    streamRevealRef.current = null;
                    if (!controller.signal.aborted) setStreamLoading(false);
                }
            }, 16);

            callApiStream(
                "/gemini/stream/ai",
                {query: cleanedQuestion},
                csrf,
                (chunk) => {
                    receivedAnyText = receivedAnyText || chunk.length > 0;
                    pendingChunks.push(Array.from(chunk));
                },
                controller.signal
            ).catch((requestError) => {
                if (requestError.name !== "AbortError") {
                    if (!receivedAnyText) {
                        setStreamMessages((currentMessages) => currentMessages.filter((message) => message.id !== answerId));
                    }
                    setStreamError(requestError.message || "The tutor couldn't finish the response. Please try again.");
                }
            }).finally(() => {
                if (streamAbortRef.current === controller) streamAbortRef.current = null;
                requestFinished = true;
            });
            return;
        }

        setStandardMessages((currentMessages) => [
            ...currentMessages,
            {id: `${Date.now()}-question`, role: "user", content: cleanedQuestion}
        ]);
        setStandardError("");
        setStandardLoading(true);
        callApi(
            "POST",
            "/gemini/ai",
            {query: cleanedQuestion},
            null,
            (data) => {
                setStandardLoading(false);
                if (!data?.status || typeof data.response !== "string") {
                    setStandardError(data?.message || "The tutor couldn't answer just now. Please try again.");
                    return;
                }
                setStandardMessages((currentMessages) => [
                    ...currentMessages,
                    {id: `${Date.now()}-answer`, role: "assistant", content: data.response}
                ]);
            },
            csrf,
            (requestError) => {
                setStandardLoading(false);
                setStandardError(requestError.message || "Something went wrong. Please try again.");
            }
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        askTutor(query);
    };

    const startNewChat = () => {
        if (activeTab === "stream") {
            setStreamMessages([]);
            setStreamError("");
        } else {
            setStandardMessages([]);
            setStandardError("");
        }
        setQuery("");
    };

    const handleTabKeyDown = (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const nextTab = activeTab === "standard" ? "stream" : "standard";
        setActiveTab(nextTab);
        document.getElementById(`tutor-tab-${nextTab}`)?.focus();
    };

    return (
        <div className="ai-tutor-page">
            <section className="tutor-intro">
                <div>
                    <p className="tutor-eyebrow"><Sparkles size={14} aria-hidden="true" /> YOUR PERSONAL STUDY PARTNER</p>
                    <h2>Big questions, <span>clear answers.</span></h2>
                    <p className="tutor-intro-copy">
                        Ask anything you’re learning. Get a thoughtful explanation, then keep exploring at your own pace.
                    </p>
                </div>
                <div className="tutor-intro-badge">
                    <span className="tutor-status-dot" />
                    Ready when you are
                </div>
            </section>

            <div className="tutor-workspace">
                <div className="tutor-chat-column">
                    <div className="tutor-mode-tabs" role="tablist" aria-label="Tutor response mode" onKeyDown={handleTabKeyDown}>
                        <button
                            id="tutor-tab-standard"
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "standard"}
                            aria-controls="tutor-chat-panel"
                            tabIndex={activeTab === "standard" ? 0 : -1}
                            className={activeTab === "standard" ? "is-active" : ""}
                            onClick={() => setActiveTab("standard")}
                        >
                            <MessageCircle size={15} aria-hidden="true" />
                            Standard answer
                        </button>
                        <button
                            id="tutor-tab-stream"
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "stream"}
                            aria-controls="tutor-chat-panel"
                            tabIndex={activeTab === "stream" ? 0 : -1}
                            className={activeTab === "stream" ? "is-active" : ""}
                            onClick={() => setActiveTab("stream")}
                        >
                            <Zap size={15} aria-hidden="true" />
                            Streaming answer
                            <span className="tutor-live-indicator" aria-hidden="true" />
                        </button>
                    </div>

                <section className="tutor-chat-card" id="tutor-chat-panel" role="tabpanel" aria-labelledby={`tutor-tab-${activeTab}`} aria-label="AI tutor chat">
                    <header className="tutor-chat-header">
                        <div className="tutor-chat-identity">
                            <span className="tutor-bot-avatar"><Sparkles size={19} aria-hidden="true" /></span>
                            <div>
                                <h3>Your AI Tutor</h3>
                                <p><span className="tutor-online-dot" />{activeTab === "stream" ? "Answers appear as they’re generated" : "Here to help you learn"}</p>
                            </div>
                        </div>
                        <button
                            className="tutor-reset-button"
                            type="button"
                            onClick={startNewChat}
                            disabled={isLoading || messages.length === 0}
                        >
                            <RotateCcw size={15} aria-hidden="true" />
                            <span>New chat</span>
                        </button>
                    </header>

                    <div
                        ref={conversationRef}
                        className={`tutor-conversation${messages.length ? " has-messages" : ""}`}
                        aria-live={activeTab === "stream" ? "off" : "polite"}
                    >
                        {messages.length > 0 && (
                            <div className="tutor-message-list">
                                {messages.map((message) => (
                                    <article className={`tutor-message is-${message.role}`} key={message.id}>
                                        {message.role === "assistant" && (
                                            <span className="tutor-message-avatar"><Sparkles size={14} aria-hidden="true" /></span>
                                        )}
                                        <div className="tutor-message-content">
                                            {message.role === "assistant" && <span className="tutor-message-author">AI Tutor</span>}
                                            {message.role === "assistant" && activeTab === "stream" && isLoading && message === messages[messages.length - 1]
                                                ? <p>{renderTutorResponse(message.content)}<span className="tutor-stream-cursor" aria-hidden="true" /></p>
                                                : <p>{message.role === "assistant" ? renderTutorResponse(message.content) : message.content}</p>}
                                        </div>
                                    </article>
                                ))}
                                {isLoading && (activeTab !== "stream" || !messages[messages.length - 1]?.content) && (
                                    <div className="tutor-thinking" role="status">
                                        <span className="tutor-message-avatar"><Sparkles size={14} aria-hidden="true" /></span>
                                        <span className="tutor-thinking-dots"><i /><i /><i /></span>
                                        <span>Thinking through it...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {error && <p className="tutor-error" role="alert">{error}</p>}

                    <form className="tutor-composer" onSubmit={handleSubmit}>
                        <label className="tutor-visually-hidden" htmlFor="tutor-question">Ask your AI tutor</label>
                        <textarea
                            id="tutor-question"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    handleSubmit(event);
                                }
                            }}
                            placeholder={activeTab === "stream"
                                ? "Ask a question and watch the answer take shape..."
                                : "Ask a question or describe what you’re working on..."}
                            rows={2}
                            maxLength={2000}
                            disabled={isLoading}
                        />
                        <div className="tutor-composer-footer">
                            <span><Lightbulb size={14} aria-hidden="true" /> Tip: be specific for a more helpful answer</span>
                            <div>
                                <span className="tutor-character-count">{query.length}/2000</span>
                                <button className="tutor-send-button" type="submit" disabled={!query.trim() || isLoading}>
                                    {isLoading
                                        ? <LoaderCircle className="tutor-spinner" size={16} aria-hidden="true" />
                                        : <Send size={15} aria-hidden="true" />}
                                    <span>Ask tutor</span>
                                </button>
                            </div>
                        </div>
                    </form>
                    <p className="tutor-privacy-note">
                        {activeTab === "stream" ? "Streaming response · " : ""}
                        AI can make mistakes. Double-check important information.
                    </p>
                </section>
                </div>
            </div>
        </div>
    );
};
=======
import React from 'react';

const AITutor = () => {
    return (
        <div>
            AI Tutor
        </div>
    );
}
>>>>>>> 1e7495493850cf05bf081d6a2b02d57236344291

export default AITutor;
