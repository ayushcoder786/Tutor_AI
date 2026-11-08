from pydantic import BaseModel
class SignupModel(BaseModel):
    firstname: str
    lastname: str
    email: str
    password: str
    phonenumber: str

class LoginModel(BaseModel):
    email: str
    password: str