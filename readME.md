# backend setup
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# frontend setup
cd frontend
yarn install

project-root/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── ReprocessButton.tsx
│   │   │   ├── DashboardCards.tsx
│   │   │   ├── Charts/
│   │   │   │   ├── SalesTrend.tsx
│   │   │   │   ├── Forecast.tsx
│   │   │   ├── Tables/
│   │   │   │   ├── InventoryTable.tsx
│   │   │   │   ├── SalesLog.tsx
│   │   ├── firebase.ts         # Firebase config
│   │   ├── App.tsx
│   │   ├── main.tsx
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/
│   ├── app.py                  # Flask app entry point
│   ├── requirements.txt
│   ├── routes/
│   │   ├── upload.py
│   │   ├── dashboard.py
│   │   ├── reprocess.py
│   ├── utils/
│   │   ├── etl.py              # Core data cleaning logic
│   │   ├── forecasting.py
│   │   ├── sku_mapper.py
│   ├── data/
│   │   ├── raw/                # Raw uploaded files
│   │   ├── cleaned/            # Cleaned/normalized datasets
│   ├── db/
│   │   └── database.db         # SQLite database
│   ├── models/
│   │   ├── sales.py
│   │   ├── inventory.py
│   │   ├── social.py
│   └── config.py
│
├── README.md
└── .env