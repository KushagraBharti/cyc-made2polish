import json
import os

_mapping = None

def _load_mapping():
    global _mapping
    if _mapping is None:
        # Adjust path if you move your mapping file
        path = os.path.join(os.path.dirname(__file__), 'sku_map.json')
        if os.path.exists(path):
            with open(path, 'r') as f:
                _mapping = json.load(f)
        else:
            _mapping = {}
    return _mapping

def map_sku(raw_sku: str) -> str:
    """
    Normalize raw SKU strings to unified codes.
    """
    m = _load_mapping()
    key = raw_sku.strip().upper()
    return m.get(key, key)
