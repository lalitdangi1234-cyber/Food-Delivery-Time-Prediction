
from pathlib import Path
from typing import Literal

import joblib
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# 1. Load the trained ML model
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "food_delivery_tuned_model.pkl"

model = joblib.load(MODEL_PATH)


# 2. Create FastAPI application
app = FastAPI(
    title="Food Delivery Time Prediction API",
    description="Predict food delivery time using Machine Learning",
    version="1.0"
)


# 3. Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 4. Define input data structure
class DeliveryInput(BaseModel):

    delivery_person_age: int = Field(ge=18, le=70)
    delivery_person_rating: float = Field(ge=1, le=5)
    distance_km: float = Field(gt=0)
    restaurant_preparation_time_min: float = Field(ge=0)

    traffic_level: Literal["Low", "Medium", "High", "Jam"]
    weather: Literal["Clear", "Cloudy", "Foggy", "Rainy"]
    vehicle_type: Literal["Bicycle", "Motorcycle", "Scooter"]

    order_hour: int = Field(ge=0, le=23)
    is_weekend: int = Field(ge=0, le=1)
    is_festival: int = Field(ge=0, le=1)
    multiple_deliveries: int = Field(ge=0, le=1)


# 5. Home route
@app.get("/")
def home():
    return {
        "message": "Food Delivery Prediction API is running!"
    }


# 6. Prediction route
@app.post("/predict")
def predict_delivery(data: DeliveryInput):

    input_data = pd.DataFrame([data.dict()])

    prediction = model.predict(input_data)[0]

    return {
        "predicted_delivery_time_min": round(float(prediction), 1),
        "unit": "minutes"
    }


