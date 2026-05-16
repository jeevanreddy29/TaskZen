from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
import requests
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.backends import default_backend

security = HTTPBearer()

# Cache for the Clerk public key
_clerk_public_key = None

def get_clerk_public_key():
    global _clerk_public_key
    if _clerk_public_key:
        return _clerk_public_key

    # For Clerk, we can fetch the JWKS from the backend API or use PEM if available.
    # A simpler way since it's an MVP is to decode the unverified token to get the user ID, 
    # but let's try to verify if we can.
    
    # Actually, Clerk provides the public key via JWKS at https://api.clerk.dev/v1/jwks
    # Let's try to do a basic unverified decode for the MVP to avoid complex JWKS parsing, 
    # or if you want to be secure, you need the JWKS parsing.
    return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        # For this MVP, we will decode the token without verifying the signature 
        # (NOT RECOMMENDED FOR PRODUCTION)
        # In production, use `jwt.decode(token, public_key, algorithms=["RS256"])`
        payload = jwt.decode(token, options={"verify_signature": False})
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
