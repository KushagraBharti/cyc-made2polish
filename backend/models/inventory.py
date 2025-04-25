from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Inventory(Base):
    __tablename__ = 'inventory'
    sku = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    last_updated = Column(Date, nullable=False)
    threshold = Column(Integer, nullable=False)
