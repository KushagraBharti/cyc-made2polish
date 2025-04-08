from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sample made-up data for each section

# Sales Overview Data
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

# Profit & COGS Data
profit_data = {
    "cogsPerSKU": {
        "ProductA": 20,
        "ProductB": 15,
        "ProductC": 10
    },
    "netProfit": 12000,
    "grossMarginPercent": 40
}

# Inventory Tracker Data
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


# Endpoint to add new inventory (simulate a manual update)
@app.route("/api/inventory/add", methods=["POST"])
def add_inventory():
    req = request.get_json()
    product = req.get("product")
    quantity = req.get("quantity", 0)
    if product in inventory_data["unitsAvailable"]:
        inventory_data["unitsAvailable"][product] += quantity
    else:
        inventory_data["unitsAvailable"][product] = quantity
    return jsonify({"status": "success", "inventory": inventory_data["unitsAvailable"]})


# Endpoint to subtract inventory based on sales data
@app.route("/api/inventory/subtract", methods=["POST"])
def subtract_inventory():
    req = request.get_json()
    product = req.get("product")
    quantity = req.get("quantity", 0)
    if product in inventory_data["unitsAvailable"]:
        inventory_data["unitsAvailable"][product] = max(0, inventory_data["unitsAvailable"][product] - quantity)
    return jsonify({"status": "success", "inventory": inventory_data["unitsAvailable"]})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
