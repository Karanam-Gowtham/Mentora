# backend/database.py
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    topic = Column(String)
    duration = Column(Integer)
    score = Column(Integer)
    notes = Column(String)
    date = Column(DateTime)
    xp_earned = Column(Integer)

class QuizResult(Base):
    __tablename__ = "quiz_results"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    topic = Column(String)
    score = Column(Integer)
    total = Column(Integer)
    date = Column(DateTime)

# Create tables
engine = create_engine('postgresql://user:pass@localhost/mentora')
Base.metadata.create_all(engine)