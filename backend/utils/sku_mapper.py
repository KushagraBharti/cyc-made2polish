import json
import os

def load_sku_map(path=None):
    if path is None:
        path = os.path.join('data', 'sku_map.json')
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return {}
