from sqlalchemy import Column, Integer, Float, String, Date, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Sale(Base):
    __tablename__ = 'sales'
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, nullable=False)
    sku = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    cogs = Column(Float, nullable=False)
    customer = Column(JSON)
