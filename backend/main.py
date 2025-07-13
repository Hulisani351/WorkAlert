from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from typing import Optional

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

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "WorkAlert API is running"}

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
            cv_filename = cv.filename
            file_path = os.path.join(UPLOAD_DIR, cv_filename)
            with open(file_path, "wb") as buffer:
                content = await cv.read()
                buffer.write(content)

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