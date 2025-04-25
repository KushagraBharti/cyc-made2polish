import pandas as pd
from datetime import timedelta
from sklearn.linear_model import LinearRegression
from flask import current_app
from models.sales import Sale

def forecast_sales():
    """
    Simple linear-regression forecast over daily total revenue.
    Returns a list of dicts: [{date: YYYY-MM-DD, revenue: float}, ...]
    """
    session = current_app.session()

    # Fetch sales data
    rows = session.query(Sale.date, (Sale.price * Sale.quantity).label('rev')).all()
    session.close()

    if not rows:
        return []

    df = pd.DataFrame(rows, columns=['date','rev'])
    daily = df.groupby('date').sum().reset_index()

    # Prepare model
    daily['ordinal'] = daily['date'].map(pd.Timestamp.toordinal)
    X = daily[['ordinal']]
    y = daily['rev']

    model = LinearRegression()
    model.fit(X, y)

    # Forecast next 30 days
    last_date = daily['date'].max()
    future = []
    for i in range(1, 31):
        dt = last_date + timedelta(days=i)
        pred = model.predict([[dt.toordinal()]])[0]
        future.append({'date': dt.isoformat(), 'forecast_revenue': float(pred)})

    return future
