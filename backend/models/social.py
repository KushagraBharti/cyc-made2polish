from sqlalchemy import Column, Integer, Float, String, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Social(Base):
    __tablename__ = 'social'
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, nullable=False)
    platform = Column(String, nullable=False)
    followers = Column(Integer, nullable=False)
    reach = Column(Integer, nullable=False)
    engagement = Column(Float, nullable=False)
    post_title = Column(String)
