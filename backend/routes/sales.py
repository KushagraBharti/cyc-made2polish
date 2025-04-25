import os
import json
from flask import Blueprint, jsonify
from config import CLEANED_FOLDER

sales_bp = Blueprint('sales_bp', __name__)

@sales_bp.route('/sales', methods=['GET'])
def get_sales():
    def load_json(name):
        path = os.path.join(CLEANED_FOLDER, name)
        return json.load(open(path)) if os.path.exists(path) else []

    metrics = load_json('sales_metrics.json')
    revenue_trend = load_json('revenue_trend.json')
    forecast_30d = load_json('forecast.json')
    platform_split = load_json('platform_split.json')
    recent_transactions = load_json('recent_transactions.json')

    return jsonify({
        "total_revenue": metrics.get("total_revenue"),
        "total_orders": metrics.get("total_orders"),
        "avg_order_value": metrics.get("avg_order_value"),
        "gross_margin": metrics.get("gross_margin"),
        "revenue_trend": revenue_trend,
        "forecast_30d": forecast_30d,
        "platform_split": platform_split,
        "recent_transactions": recent_transactions
    })
