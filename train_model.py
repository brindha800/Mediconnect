import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score


# ---------------------------------------
# 1. Load the medical dataset
# ---------------------------------------

data = pd.read_csv("medical_data.csv")

print("Dataset loaded successfully!")
print(data.head())


# ---------------------------------------
# 2. Select input features
# ---------------------------------------

features = [
    "fever",
    "cough",
    "breathing_difficulty",
    "chest_pain",
    "headache",
    "vomiting",
    "skin_rash",
    "itching",
    "severity"
]

X = data[features]


# ---------------------------------------
# 3. Select target
# ---------------------------------------

y = data["risk_level"]


# ---------------------------------------
# 4. Convert risk labels to numbers
# ---------------------------------------

label_encoder = LabelEncoder()

y_encoded = label_encoder.fit_transform(y)


# ---------------------------------------
# 5. Split dataset
# ---------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42
)


# ---------------------------------------
# 6. Create Random Forest model
# ---------------------------------------

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# ---------------------------------------
# 7. Train the model
# ---------------------------------------

model.fit(X_train, y_train)

print("\nAI model trained successfully!")


# ---------------------------------------
# 8. Test the model
# ---------------------------------------

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print(f"\nPrototype Model Accuracy: {accuracy * 100:.2f}%")


# ---------------------------------------
# 9. Test a new patient
# ---------------------------------------

new_patient = pd.DataFrame(
    [[0, 0, 1, 1, 0, 0, 0, 0, 5]],
    columns=features
)


prediction = model.predict(new_patient)

predicted_risk = label_encoder.inverse_transform(prediction)


# ---------------------------------------
# 10. Display prediction
# ---------------------------------------

print("\n--------------------------------")
print("MediConnect AI Prediction")
print("--------------------------------")

print("Patient symptoms:")
print("• Breathing difficulty")
print("• Chest pain")

print("\nPredicted Risk Level:")
print(predicted_risk[0])