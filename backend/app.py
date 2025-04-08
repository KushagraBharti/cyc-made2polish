from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow calls from the frontend

# Sample made-up data for each section

# 1. Sales Overview Data
sales_data = {
    "totalRevenue": {
        "Etsy": 15000,
        "TikTok": 12000,
        "PopUp": 5000
    },
    "unitsSold": {
        "ProductA": 200,
        "ProductB": 150,
        "ProductC": 100
    },
    "averageOrderValue": 75,
    "salesByPeriod": [
        {"period": "Week 1", "sales": 6000},
        {"period": "Week 2", "sales": 7000},
        {"period": "Week 3", "sales": 9000}
    ]
}

# 2. Profit & COGS Data
profit_data = {
    "cogsPerSKU": {
        "ProductA": 20,
        "ProductB": 15,
        "ProductC": 10
    },
    "netProfit": 12000,
    "grossMarginPercent": 40
}

# 3. Inventory Tracker Data
inventory_data = {
    "unitsAvailable": {
        "ProductA": 50,
        "ProductB": 20,
        "ProductC": 80
    },
    "productionBatches": [
        {"batch": "Batch 1", "product": "ProductA", "quantity": 90},
        {"batch": "Batch 2", "product": "ProductC", "quantity": 60}
    ],
    "lowStockAlert": {
        "ProductB": True
    }
}

@app.route("/api/sales", methods=["GET"])
def get_sales():
    return jsonify(sales_data)

@app.route("/api/profit", methods=["GET"])
def get_profit():
    return jsonify(profit_data)

@app.route("/api/inventory", methods=["GET"])
def get_inventory():
    return jsonify(inventory_data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
