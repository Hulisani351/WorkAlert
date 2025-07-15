from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import re
from werkzeug.utils import secure_filename

app = FastAPI(title="WorkAlert API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class CVUpload(Base):
    __tablename__ = 'cv_uploads'
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(100), nullable=False)
    skills = Column(Text, nullable=True)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "WorkAlert API is running"}

ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

def is_allowed_file(filename):
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS

@app.post("/api/upload")
async def upload_data(
    cv: Optional[UploadFile] = File(None),
    skills: str = Form(""),
    whatsapp: str = Form(""),
    email: str = Form("")
):
    try:
        # Validate input
        if not cv and not skills:
            raise HTTPException(status_code=400, detail="Please provide a CV or skills")
        
        if not whatsapp and not email:
            raise HTTPException(status_code=400, detail="Please provide either WhatsApp or Email")

        # Save CV if provided
        cv_filename = None
        if cv:
            # Restrict file type
            if not is_allowed_file(cv.filename):
                raise HTTPException(status_code=400, detail="Only PDF, DOC, and DOCX files are allowed.")
            # Limit file size
            content = await cv.read()
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(status_code=400, detail="File too large. Max 5MB allowed.")
            # Sanitize filename
            cv_filename = secure_filename(cv.filename)
            file_path = os.path.join(UPLOAD_DIR, cv_filename)
            with open(file_path, "wb") as buffer:
                buffer.write(content)
        else:
            content = None

        # Save to database
        db = SessionLocal()
        try:
            new_upload = CVUpload(filename=cv_filename or "", skills=skills)
            db.add(new_upload)
            db.commit()
            db.refresh(new_upload)
        finally:
            db.close()

        return JSONResponse(
            status_code=200,
            content={
                "message": "You are now on the list for job alerts.",
                "data": {
                    "skills": skills,
                    "whatsapp": whatsapp,
                    "email": email,
                    "cv": cv_filename
                }
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 