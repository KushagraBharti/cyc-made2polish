import os
import pandas as pd
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from flask import current_app
from models.sales import Sale
from models.inventory import Inventory
from models.social import Social
from utils.sku_mapper import map_sku

def detect_source(filename: str):
    """
    Determine data type by filename keywords.
    """
    lower = filename.lower()
    if 'etsy' in lower:
        return 'etsy'
    if 'tiktok' in lower:
        return 'tiktok'
    if 'inventory' in lower:
        return 'inventory'
    if 'social' in lower or 'instagram' in lower:
        return 'social'
    return None

def normalize_sales(df: pd.DataFrame, source: str):
    df = df.rename(columns={
        'Date': 'date', 'SKU': 'sku', 'Quantity': 'quantity',
        'Price': 'price', 'COGS': 'cogs',
        'CustomerName': 'customer_name', 'CustomerRegion': 'customer_region'
    })
    df['date'] = pd.to_datetime(df['date']).dt.date
    df['platform'] = source
    df['sku'] = df['sku'].apply(map_sku)
    df['customer'] = df.apply(lambda r: {
        'name': r.get('customer_name'),
        'region': r.get('customer_region')
    }, axis=1)
    return df[['date','sku','platform','quantity','price','cogs','customer']]

def normalize_inventory(df: pd.DataFrame):
    df = df.rename(columns={
        'SKU': 'sku', 'Name': 'name',
        'Quantity': 'quantity', 'Threshold': 'threshold',
        'LastUpdated': 'last_updated'
    })
    df['last_updated'] = pd.to_datetime(df['last_updated']).dt.date
    df['sku'] = df['sku'].apply(map_sku)
    return df[['sku','name','quantity','threshold','last_updated']]

def normalize_social(df: pd.DataFrame, source: str):
    df = df.rename(columns={
        'Date': 'date', 'Followers': 'followers',
        'Reach': 'reach', 'Engagement': 'engagement',
        'PostTitle': 'post_title'
    })
    df['date'] = pd.to_datetime(df['date']).dt.date
    df['platform'] = source
    return df[['date','platform','followers','reach','engagement','post_title']]

def run_etl():
    app = current_app._get_current_object()
    session = app.session()
    raw_dir = app.config['UPLOAD_FOLDER']

    for fname in os.listdir(raw_dir):
        path = os.path.join(raw_dir, fname)
        if not fname.lower().endswith(('.csv','.xls','.xlsx')):
            continue

        # Load into DataFrame
        if fname.lower().endswith('.csv'):
            df = pd.read_csv(path)
        else:
            df = pd.read_excel(path)

        source = detect_source(fname)
        if not source:
            print(f"[ETL] Unknown source for {fname}, skipping.")
            continue

        # Normalize & write
        if source in ('etsy','tiktok'):
            records = normalize_sales(df, source).to_dict('records')
            for rec in records:
                session.add(Sale(**rec))

        elif source == 'inventory':
            records = normalize_inventory(df).to_dict('records')
            for rec in records:
                session.merge(Inventory(**rec))

        elif source == 'social':
            records = normalize_social(df, source).to_dict('records')
            for rec in records:
                session.add(Social(**rec))

        # Move processed file to cleaned/
        cleaned_dir = os.path.join(os.path.dirname(raw_dir), 'cleaned')
        os.makedirs(cleaned_dir, exist_ok=True)
        os.replace(path, os.path.join(cleaned_dir, fname))
        print(f"[ETL] Processed and moved {fname}")

    try:
        session.commit()
    except IntegrityError as e:
        session.rollback()
        raise
    finally:
        session.close()
