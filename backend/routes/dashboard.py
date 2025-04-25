from flask import Blueprint, jsonify, current_app
from sqlalchemy import func
from models.sales import Sale
from models.inventory import Inventory
from models.social import Social
from utils.forecasting import forecast_sales

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('', methods=['GET'])
def get_metrics():
    """
    Returns key dashboard metrics:
      - total_revenue
      - total_orders
      - avg_order_value
      - forecast_30d
    """
    session = current_app.session()

    # Aggregate sales
    total_revenue = session.query(func.sum(Sale.price * Sale.quantity)).scalar() or 0
    total_orders  = session.query(func.count(Sale.id)).scalar() or 0
    avg_order_value = (total_revenue / total_orders) if total_orders > 0 else 0

    # Forecast
    forecast_30d = forecast_sales()  # Expected to return a single number or dict

    session.close()

    return jsonify({
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'avg_order_value': avg_order_value,
        'forecast_30d': forecast_30d
    })
