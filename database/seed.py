import os
import uuid
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from database.models import Base, engine, SessionLocal, User, Document, Chunk, Conversation, Message

def seed_database():
    session = SessionLocal()
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)

        # Seed Users
        user1 = User(
            id=str(uuid.uuid4()),
            email="alice@example.com",
            password_hash="hashed_password_1",
            role="admin",
            created_at=datetime.utcnow()
        )
        user2 = User(
            id=str(uuid.uuid4()),
            email="bob@example.com",
            password_hash="hashed_password_2",
            role="member",
            created_at=datetime.utcnow()
        )

        session.add_all([user1, user2])

        # Seed Documents
        document1 = Document(
            id=str(uuid.uuid4()),
            user_id=user1.id,
            filename="example.pdf",
            status="processed",
            chunk_count=10,
            created_at=datetime.utcnow()
        )
        document2 = Document(
            id=str(uuid.uuid4()),
            user_id=user2.id,
            filename="example.docx",
            status="pending",
            chunk_count=0,
            created_at=datetime.utcnow()
        )

        session.add_all([document1, document2])

        # Seed Conversations
        conversation1 = Conversation(
            id=str(uuid.uuid4()),
            user_id=user1.id,
            title="Project Discussion",
            created_at=datetime.utcnow()
        )
        conversation2 = Conversation(
            id=str(uuid.uuid4()),
            user_id=user2.id,
            title="Team Meeting",
            created_at=datetime.utcnow()
        )

        session.add_all([conversation1, conversation2])

        # Seed Messages
        message1 = Message(
            id=str(uuid.uuid4()),
            conversation_id=conversation1.id,
            role="user",
            content="What is the status of the project?",
            sources=None,
            created_at=datetime.utcnow()
        )
        message2 = Message(
            id=str(uuid.uuid4()),
            conversation_id=conversation1.id,
            role="assistant",
            content="The project is on track.",
            sources=None,
            created_at=datetime.utcnow()
        )

        session.add_all([message1, message2])

        session.commit()
    except SQLAlchemyError as e:
        session.rollback()
        print(f"Error seeding database: {e}")
    finally:
        session.close()