from datetime import datetime, timezone
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
            "updatedat": None
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