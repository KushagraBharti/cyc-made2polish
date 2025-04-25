import os
import glob
import json
import pandas as pd
from config import UPLOAD_FOLDER, CLEANED_FOLDER, ALLOWED_EXTENSIONS
from utils.sku_mapper import load_sku_map
from utils.forecasting import forecast_sales

def detect_source(path: str) -> str:
    df0 = pd.read_csv(path, nrows=0)
    cols = set(df0.columns)
    if 'results.listing_id' in cols:
        return 'etsy_listings'
    if 'results.receipt_id' in cols:
        return 'etsy_receipts'
    if 'results.transaction_id' in cols:
        return 'etsy_transactions'
    if 'Video title' in cols:
        return 'tiktok_videos'
    if 'Total followers' in cols:
        return 'tiktok_audience'
    if 'Profile views' in cols:
        return 'tiktok_overview'
    return 'unknown'

def normalize_etsy_receipts(df: pd.DataFrame) -> pd.DataFrame:
    df_norm = df.rename(columns={
        'results.receipt_id': 'receipt_id',
        'results.create_timestamp': 'create_ts',
        'results.buyer_user_id': 'buyer_id',
        'results.grandtotal.amount': 'grand_amt',
        'results.grandtotal.divisor': 'grand_div',
        'results.grandtotal.currency_code': 'currency',
        'results.is_paid': 'is_paid',
        'results.is_shipped': 'is_shipped'
    })
    df_norm['date'] = pd.to_datetime(df_norm['create_ts'], unit='s')
    df_norm['total'] = df_norm['grand_amt'] / df_norm['grand_div']
    return df_norm[['receipt_id','date','buyer_id','total','currency','is_paid','is_shipped']]

def normalize_etsy_transactions(df: pd.DataFrame) -> pd.DataFrame:
    df_norm = df.rename(columns={
        'results.transaction_id': 'transaction_id',
        'results.listing_id': 'listing_id',
        'results.receipt_id': 'receipt_id',
        'results.paid_timestamp': 'paid_ts',
        'results.quantity': 'quantity',
        'results.price.amount': 'price_amt',
        'results.price.divisor': 'price_div',
        'results.price.currency_code': 'currency',
        'results.sku': 'raw_sku'
    })
    df_norm['date'] = pd.to_datetime(df_norm['paid_ts'], unit='s')
    df_norm['price'] = df_norm['price_amt'] / df_norm['price_div']
    sku_map = load_sku_map()
    df_norm['sku'] = df_norm['raw_sku'].map(sku_map).fillna(df_norm['raw_sku'])
    df_norm['platform'] = 'etsy'
    return df_norm[['transaction_id','listing_id','receipt_id','date','quantity','price','currency','sku','platform']]

def normalize_tiktok_overview(df: pd.DataFrame) -> pd.DataFrame:
    df_clean = df.replace('#NUM!', 0)
    for col in df_clean.columns:
        if col != 'Date':
            df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce').fillna(0).astype(int)
    df_norm = df_clean.rename(columns={
        'Date': 'date',
        'Video views': 'video_views',
        'Reached audience': 'reached',
        'Profile views': 'profile_views',
        'Likes': 'likes',
        'Shares': 'shares',
        'Comments': 'comments',
        'Phone number clicks ': 'phone_clicks',
        'Leads submission': 'leads',
        'Net growth': 'net_growth',
        'New followers': 'new_followers',
        'Lost followers': 'lost_followers'
    })
    df_norm['date'] = pd.to_datetime(df_norm['date'])
    return df_norm

def normalize_tiktok_audience(df: pd.DataFrame) -> pd.DataFrame:
    df_clean = df.replace('#NUM!', 0)
    for col in df_clean.columns:
        if col != 'Date':
            df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce').fillna(0).astype(int)
    df_norm = df_clean.rename(columns={
        'Date': 'date',
        'New followers': 'new_followers',
        'Total followers': 'total_followers',
        'Reached audience': 'reached',
        'Engaged audience': 'engaged'
    })
    df_norm['date'] = pd.to_datetime(df_norm['date'])
    return df_norm

def normalize_tiktok_videos(df: pd.DataFrame) -> pd.DataFrame:
    df_norm = df.rename(columns={
        'Video title': 'title',
        'Video link': 'link',
        'Post time': 'post_time',
        'Video views': 'video_views',
        'Likes': 'likes',
        'Comments': 'comments',
        'Shares': 'shares',
        'Add to Favorites': 'favorites'
    })
    df_norm['post_time'] = pd.to_datetime(df_norm['post_time'])
    for col in ['video_views','likes','comments','shares','favorites']:
        df_norm[col] = pd.to_numeric(df_norm[col], errors='coerce').fillna(0).astype(int)
    df_norm['platform'] = 'tiktok'
    return df_norm

def process_all():
    processed = []
    receipts_list, trans_list = [], []
    tik_over_list, tik_aud_list, tik_vid_list = [], [], []

    raw_files = glob.glob(os.path.join(UPLOAD_FOLDER, '*'))
    for path in raw_files:
        src = detect_source(path)
        df = pd.read_csv(path)
        if src == 'etsy_receipts':
            dfn = normalize_etsy_receipts(df); receipts_list.append(dfn); out='etsy_receipts.json'
        elif src == 'etsy_transactions':
            dfn = normalize_etsy_transactions(df); trans_list.append(dfn); out='etsy_transactions.json'
        elif src == 'tiktok_overview':
            dfn = normalize_tiktok_overview(df); tik_over_list.append(dfn); out='tiktok_overview.json'
        elif src == 'tiktok_audience':
            dfn = normalize_tiktok_audience(df); tik_aud_list.append(dfn); out='tiktok_audience.json'
        elif src == 'tiktok_videos':
            dfn = normalize_tiktok_videos(df); tik_vid_list.append(dfn); out='tiktok_videos.json'
        else:
            continue
        dfn.to_json(os.path.join(CLEANED_FOLDER, out), orient='records', date_format='iso')
        processed.append(out)

    # Aggregate receipts & transactions
    receipts_df = pd.concat(receipts_list, ignore_index=True) if receipts_list else pd.DataFrame(columns=['date','total'])
    trans_df = pd.concat(trans_list, ignore_index=True) if trans_list else pd.DataFrame(columns=['date','price','quantity','platform'])

    # Sales metrics
    total_revenue = float(receipts_df['total'].sum())
    total_orders = int(len(receipts_df))
    avg_order_value = float(total_revenue / total_orders) if total_orders else 0.0
    gross_margin = total_revenue  # placeholder

    # Revenue trend
    rev_trend = receipts_df.groupby(receipts_df['date'].dt.date)['total'].sum().reset_index()
    rev_trend.columns = ['date','revenue']
    rev_trend['date'] = rev_trend['date'].astype(str)

    # Forecast
    forecast = forecast_sales(receipts_df)

    # Platform split
    platform_split = trans_df.groupby('platform')\
                    .apply(lambda d: float((d['price']*d['quantity']).sum()))\
                    .to_dict()

    # Recent transactions
    recent_transactions = trans_df.sort_values('date', ascending=False)\
                            .head(10).to_dict(orient='records')

    # Write out JSONs
    with open(os.path.join(CLEANED_FOLDER,'sales_metrics.json'),'w') as f:
        json.dump({
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "avg_order_value": avg_order_value,
            "gross_margin": gross_margin
        }, f)
    rev_trend.to_json(os.path.join(CLEANED_FOLDER,'revenue_trend.json'), orient='records')
    with open(os.path.join(CLEANED_FOLDER,'forecast.json'),'w') as f:
        json.dump(forecast, f)
    with open(os.path.join(CLEANED_FOLDER,'platform_split.json'),'w') as f:
        json.dump(platform_split, f)
    with open(os.path.join(CLEANED_FOLDER,'recent_transactions.json'),'w') as f:
        json.dump(recent_transactions, f)

    return processed
