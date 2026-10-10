import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder


# ---------------------------------------
# Load the dataset
# ---------------------------------------

data = pd.read_csv("medical_data.csv")


# ---------------------------------------
# Features used by the AI
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


# ---------------------------------------
# Prepare training data
# ---------------------------------------

X = data[features]
y = data["risk_level"]

label_encoder = LabelEncoder()

y_encoded = label_encoder.fit_transform(y)


# ---------------------------------------
# Train the model
# ---------------------------------------

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y_encoded)


# ---------------------------------------
# Prediction function
# ---------------------------------------

def predict_risk(
    fever,
    cough,
    breathing_difficulty,
    chest_pain,
    headache,
    vomiting,
    skin_rash,
    itching,
    severity
):

    patient = pd.DataFrame(
        [[
            fever,
            cough,
            breathing_difficulty,
            chest_pain,
            headache,
            vomiting,
            skin_rash,
            itching,
            severity
        ]],
        columns=features
    )

    prediction = model.predict(patient)

    risk = label_encoder.inverse_transform(prediction)[0]

    return risk