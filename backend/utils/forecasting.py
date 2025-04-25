import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def forecast_sales(receipts_df, days=30):
    # receipts_df: DataFrame with 'date' (datetime) and 'total' columns
    if receipts_df.empty:
        return []

    daily = receipts_df.groupby(receipts_df['date'].dt.date)['total'].sum().reset_index()
    daily['date'] = pd.to_datetime(daily['date'])
    daily['ordinal'] = daily['date'].map(pd.Timestamp.toordinal).values.reshape(-1,1)

    X = daily['ordinal']
    y = daily['total'].values

    if len(daily) < 2:
        last = float(y[-1])
        last_date = daily['date'].max()
        return [{"date": (last_date + pd.Timedelta(days=i)).isoformat(), "forecast": last} for i in range(1, days+1)]

    model = LinearRegression()
    model.fit(X, y)

    last_date = daily['date'].max()
    future_dates = [last_date + pd.Timedelta(days=i) for i in range(1, days+1)]
    future_ordinals = np.array([d.toordinal() for d in future_dates]).reshape(-1,1)
    preds = model.predict(future_ordinals)

    return [{"date": d.isoformat(), "forecast": float(p)} for d, p in zip(future_dates, preds)]
