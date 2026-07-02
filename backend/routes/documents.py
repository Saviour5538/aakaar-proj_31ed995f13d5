from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database.models import Document
from database.config import get_db
from backend.services.auth_service import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/documents")

class DocumentResponse(BaseModel):
    id: UUID
    user_id: UUID
    filename: str
    status: str
    chunk_count: int
    created_at: str

    class Config:
        orm_mode = True

@router.post("/upload", operation_id="upload_document", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        # Validate file type
        if not file.content_type.startswith("application/pdf") and not file.content_type.startswith("application/vnd.openxmlformats-officedocument.wordprocessingml.document"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")

        # Save document metadata to the database
        new_document = Document(
            user_id=current_user["id"],
            filename=file.filename,
            status="uploaded",
            chunk_count=0,
            created_at=datetime.utcnow()
        )
        db.add(new_document)
        db.commit()
        db.refresh(new_document)

        # Process the file (e.g., extract text, chunking, embedding) asynchronously
        # This would typically involve a background task or worker queue
        # For now, we simulate this step as a placeholder
        # TODO: Implement actual processing logic

        return {"message": "Document uploaded successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/", operation_id="list_documents", response_model=List[DocumentResponse])
async def list_documents(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        documents = db.query(Document).filter(Document.user_id == current_user["id"]).all()
        return documents
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/{id}", operation_id="delete_document", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        document = db.query(Document).filter(Document.id == id, Document.user_id == current_user["id"]).first()
        if not document:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

        db.delete(document)
        db.commit()
        return {"message": "Document deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))