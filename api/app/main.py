from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import cors_settings

app = FastAPI()

# Add CORS middleware
app.add_middleware(CORSMiddleware, **cors_settings)

app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Hello World"}
