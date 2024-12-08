
# Baby Nutrition Tracking API Documentation

## API Endpoints

### 1. Measure and Classify Nutritional Status

- **Endpoint**: `/measure-classify`  
- **Method**: POST  
- **Description**: Measures baby length from an image and classifies the nutritional status based on length and weight.  

#### Request Body
```json
{
    "url": "https://example.com/image.jpg",
    "weight": 5.5,
    "age": 6,
    "gender": "male"
}
```

#### Response
```json
{
    "baby_length": 62.5,
    "z_score_bb_tb": -0.8,
    "status_bb_tb": "Normal",
    "imt": 15.6,
    "status_imt": "Gizi Baik (Normal)",
    "z_score_length": -1.5,
    "nutritional_status_length": "Pendek",
    "z_score_weight": -0.2,
    "nutritional_status_weight": "Gizi Baik"
}
```

---

### 2. Predict Nutritional Needs

- **Endpoint**: `/predict_nutrition`  
- **Method**: POST  
- **Description**: Predicts the daily nutritional needs of the child.  

#### Request Body
```json
{
    "usia_bulan": 12,
    "gender": "male",
    "berat_kg": 9.5,
    "tinggi_cm": 75,
    "aktivitas_level": "Sedang",
    "status_asi": "MPASI"
}
```

#### Response
```json
{
    "status": "success",
    "data": {
        "calories_needed": 900.0,
        "proteins_needed": 30.0,
        "fat_needed": 25.0,
        "carbohydrate_needed": 125.0
    }
}
```

---

### 3. Initialize Daily Nutrition Tracking

- **Endpoint**: `/initialize-tracking`  
- **Method**: POST  
- **Description**: Initializes daily tracking for a user.  

#### Request Body
```json
{
    "user_id": "user123",
    "usia_bulan": 12,
    "gender": "male",
    "berat_kg": 9.5,
    "tinggi_cm": 75,
    "aktivitas_level": "Sedang",
    "status_asi": "MPASI"
}
```

#### Response
```json
{
    "status": "success",
    "data": {
        "predicted_needs": {
            "calories_needed": 900.0,
            "proteins_needed": 30.0,
            "fat_needed": 25.0,
            "carbohydrate_needed": 125.0
        },
        "tracking_initialized": true
    }
}
```

---

### 4. Add Food to Daily Tracking

- **Endpoint**: `/add-food`  
- **Method**: POST  
- **Description**: Adds food to the daily tracking and evaluates nutrition.  

#### Request Body
```json
{
    "user_id": "user123",
    "food_name": "Rice",
    "date": "2024-12-01",
    "portion": 50
}
```

#### Response
```json
{
    "status": "success",
    "data": {
        "tracking": {
            "total_nutrients": {
                "calories": 150.0,
                "calcium": 10.0,
                "proteins": 3.0,
                "fat": 0.5,
                "carbohydrate": 35.0
            },
            "foods": [
                {
                    "name": "Rice",
                    "portion": 50,
                    "nutrients": {
                        "calories": 150.0,
                        "calcium": 10.0,
                        "proteins": 3.0,
                        "fat": 0.5,
                        "carbohydrate": 35.0
                    },
                    "notes": "Staple food"
                }
            ]
        },
        "evaluation": {
            "calories": {
                "consumed": 150.0,
                "predicted_needed": 900.0,
                "percentage": 16.7,
                "status": "low"
            },
            "proteins": {
                "consumed": 3.0,
                "predicted_needed": 30.0,
                "percentage": 10.0,
                "status": "low"
            },
            "fat": {
                "consumed": 0.5,
                "predicted_needed": 25.0,
                "percentage": 2.0,
                "status": "low"
            },
            "carbohydrate": {
                "consumed": 35.0,
                "predicted_needed": 125.0,
                "percentage": 28.0,
                "status": "low"
            }
        }
    }
}
```

---

### 5. Get Daily Tracking Data

- **Endpoint**: `/get-daily/<user_id>/<date>`  
- **Method**: GET  
- **Description**: Retrieves daily tracking and nutritional evaluation for a user.  

#### Response
```json
{
    "status": "success",
    "data": {
        "tracking": {
            "total_nutrients": {
                "calories": 150.0,
                "calcium": 10.0,
                "proteins": 3.0,
                "fat": 0.5,
                "carbohydrate": 35.0
            },
            "foods": [
                {
                    "name": "Rice",
                    "portion": 50,
                    "nutrients": {
                        "calories": 150.0,
                        "calcium": 10.0,
                        "proteins": 3.0,
                        "fat": 0.5,
                        "carbohydrate": 35.0
                    },
                    "notes": "Staple food"
                }
            ]
        },
        "evaluation": {
            "calories": {
                "consumed": 150.0,
                "predicted_needed": 900.0,
                "percentage": 16.7,
                "status": "low"
            },
            "proteins": {
                "consumed": 3.0,
                "predicted_needed": 30.0,
                "percentage": 10.0,
                "status": "low"
            },
            "fat": {
                "consumed": 0.5,
                "predicted_needed": 25.0,
                "percentage": 2.0,
                "status": "low"
            },
            "carbohydrate": {
                "consumed": 35.0,
                "predicted_needed": 125.0,
                "percentage": 28.0,
                "status": "low"
            }
        }
    }
}
```
