from datetime import datetime, timedelta, timezone
import jwt
from core.config import settings

def generateToken(userid, role):
    payload = {
        "userid": userid,
        "role": role,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=1440)  
    }

    return jwt.encode(payload, settings.jwt_secretkey, algorithm="HS256")

def validateToken(token):
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secretkey,
            algorithms=["HS256"]
        )
        return payload

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None