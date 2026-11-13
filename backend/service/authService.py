from datetime import datetime, timezone
from service.jwtService import generateToken
async def signup(data, db):
    email = data.email.strip().lower()
    users_collection = db["users"]

    try:
        user = await users_collection.find_one({"email": email})
        if user:
            raise Exception("User with this email already exist")

        userData = {
            "firstname": data.firstname,
            "lastname": data.lastname,
            "email": email,
            "phonenumber": data.phonenumber,
            "password": data.password,
            "isactive": True,
            "createdat": datetime.now(timezone.utc),
            "updatedat": None,
            "role": "USER"
        }

        await users_collection.insert_one(userData) #Insert into DB

        return {
            "status": True,
            "message": "User signed up successfully",
        }
    
    except Exception as e:
        return {
            "status": False,
            "message": str(e)
        }

async def login(data, db):
    email = data.email.strip().lower()
    password = data.password.strip()
    users_collection = db["users"]
    menus_collection = db["menus"]

    try:
        user = await users_collection.find_one({
            "email": email, 
            "password": password, 
            "isactive": True})

        if not user:
            raise Exception("Invalid user or credentials")

        token = generateToken(str(user["_id"]), user["role"])
        userData = {"firstname": user["firstname"], "lastname": user["lastname"]}
        menus = await menus_collection.find(
                                            {"roles": user["role"]},
                                            {"_id": 0, "menu": 1, "path": 1, "icon": 1, "displayorder": 1}
                                            ).to_list(length=None)

        return {
                "status": True, 
                "message": "Login success", 
                "user": userData, 
                "token": token,
                "menus": menus
            }

    except Exception as e:
        return {"status": False, "message": str(e)}