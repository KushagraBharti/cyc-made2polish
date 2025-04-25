# backend setup
cd backend
python -m venv .venv
.venv\Scripts\activate
python.exe -m pip install --upgrade pip
pip install -r requirements.txt
python app.py

backend/
├── .venv/                  # your virtualenv
├── app.py                  # Flask app + blueprint registration
├── config.py               # Load .env, define UPLOAD_DIR, CLEAN_DIR
├── requirements.txt
│
├── routes/
│   ├── upload.py           # /api/upload & /api/reprocess
│   ├── sales.py            # /api/sales
│   └── social.py           # /api/social
│
├── utils/
│   ├── etl.py              # detect_source, process_file, TikTok & Etsy normalizers
│   └── sku_mapper.py       # JSON load of SKU mappings
│
├── data/
│   ├── raw/                # incoming CSV/XLSX
│   └── cleaned/            # output JSON slices
│
└── logs/                   # app.log for requests & ETL

# frontend setup
cd frontend
yarn install

frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── FileUploadModal.tsx
│   │   ├── DashboardCard.tsx
│   │   ├── SalesTrendChart.tsx
│   │   ├── ForecastChart.tsx
│   │   └── DataTable.tsx
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Sales.tsx
│   │   ├── Social.tsx
│   │   └── Inventory.tsx
│   │
│   ├── firebase.ts         # Firebase init & helpers
│   ├── App.tsx             # Router & layout
│   └── main.tsx
│
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
