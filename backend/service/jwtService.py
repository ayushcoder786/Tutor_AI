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