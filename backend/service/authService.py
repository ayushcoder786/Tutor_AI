def signup(data):
    return{
        "status": "True",
        "message": "User Signed up successfully",
        "data": data.model_dump()
    }

def login(data):
    return{
        "status": "True",
        "message": "User Logged in successfully",
        "data": data.model_dump()
    }
