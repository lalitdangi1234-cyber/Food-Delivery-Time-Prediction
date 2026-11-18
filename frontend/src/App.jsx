
import { useState } from "react";
import "./App.css";

function App() {
  // Form ki default values
  const [formData, setFormData] = useState({
    delivery_person_age: 28,
    delivery_person_rating: 4.7,
    distance_km: 7.5,
    restaurant_preparation_time_min: 18,
    traffic_level: "High",
    weather: "Clear",
    vehicle_type: "Motorcycle",
    order_hour: 19,
    is_weekend: 1,
    is_festival: 0,
    multiple_deliveries: 0,
  });

  // Prediction aur loading states
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Input change hone par form update karna
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    const numericFields = [
      "delivery_person_age",
      "delivery_person_rating",
      "distance_km",
      "restaurant_preparation_time_min",
      "order_hour",
      "is_weekend",
      "is_festival",
      "multiple_deliveries",
    ];

    setFormData((previousData) => ({
      ...previousData,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));

    setPrediction(null);
    setError("");
  };

  // Backend API ko request bhejna
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setPrediction(null);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Prediction request failed. Please check your input.");
      }

      const result = await response.json();

      setPrediction(result.predicted_delivery_time_min);
    } catch (err) {
      setError(err.message || "Backend se connection nahi ho pa raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-card">

        <header className="header">
          <h1>Food Delivery Time Prediction</h1>
          <p>Enter delivery details to predict delivery time using Machine Learning.</p>
        </header>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Delivery Person Age</label>
              <input
                type="number"
                name="delivery_person_age"
                min="18"
                max="70"
                value={formData.delivery_person_age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Delivery Person Rating</label>
              <input
                type="number"
                name="delivery_person_rating"
                min="1"
                max="5"
                step="0.1"
                value={formData.delivery_person_rating}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Distance (KM)</label>
              <input
                type="number"
                name="distance_km"
                min="0.1"
                step="0.1"
                value={formData.distance_km}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Restaurant Preparation Time (Min)</label>
              <input
                type="number"
                name="restaurant_preparation_time_min"
                min="0"
                step="1"
                value={formData.restaurant_preparation_time_min}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Traffic Level</label>
              <select name="traffic_level" value={formData.traffic_level} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Jam">Jam</option>
              </select>
            </div>

            <div className="form-group">
              <label>Weather</label>
              <select name="weather" value={formData.weather} onChange={handleChange}>
                <option value="Clear">Clear</option>
                <option value="Cloudy">Cloudy</option>
                <option value="Foggy">Foggy</option>
                <option value="Rainy">Rainy</option>
              </select>
            </div>

            <div className="form-group">
              <label>Vehicle Type</label>
              <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange}>
                <option value="Bicycle">Bicycle</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Scooter">Scooter</option>
              </select>
            </div>

            <div className="form-group">
              <label>Order Hour (0–23)</label>
              <input
                type="number"
                name="order_hour"
                min="0"
                max="23"
                value={formData.order_hour}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Weekend?</label>
              <select name="is_weekend" value={formData.is_weekend} onChange={handleChange}>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Festival?</label>
              <select name="is_festival" value={formData.is_festival} onChange={handleChange}>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Multiple Deliveries?</label>
              <select name="multiple_deliveries" value={formData.multiple_deliveries} onChange={handleChange}>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict Delivery Time"}
          </button>

        </form>

        {prediction !== null && (
          <div className="result">
            <h2>Predicted Delivery Time</h2>
            <p>{prediction} Minutes</p>
          </div>
        )}

        {error && <div className="error">{error}</div>}

      </div>
    </div>
  );
}

export default App;
