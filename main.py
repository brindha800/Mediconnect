from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from predictor import predict_risk


# ==========================================
# CREATE FASTAPI APP
# ==========================================

app = FastAPI(
    title="MediConnect AI",
    description="AI Predictive Health Risk Analysis API",
    version="1.0"
)


# ==========================================
# ALLOW REACT FRONTEND
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# PATIENT INPUT
# ==========================================

class PatientSymptoms(BaseModel):

    fever: int = 0
    cough: int = 0
    breathing_difficulty: int = 0
    chest_pain: int = 0
    headache: int = 0
    vomiting: int = 0
    skin_rash: int = 0
    itching: int = 0
    severity: int = 1


# ==========================================
# HOME / SERVER CHECK
# ==========================================

@app.get("/")
def home():

    return {
        "message": "MediConnect AI is running",
        "status": "online"
    }


# ==========================================
# AI PREDICTION
# ==========================================

@app.post("/predict")
def predict(patient: PatientSymptoms):

    risk = predict_risk(
        fever=patient.fever,
        cough=patient.cough,
        breathing_difficulty=patient.breathing_difficulty,
        chest_pain=patient.chest_pain,
        headache=patient.headache,
        vomiting=patient.vomiting,
        skin_rash=patient.skin_rash,
        itching=patient.itching,
        severity=patient.severity
    )

    # --------------------------------------
    # Determine specialty
    # --------------------------------------

    if patient.chest_pain or patient.breathing_difficulty:
        specialty = "Cardiologist"

    elif patient.skin_rash or patient.itching:
        specialty = "Dermatologist"

    elif patient.headache:
        specialty = "Neurologist"

    elif patient.cough:
        specialty = "Pulmonologist"

    else:
        specialty = "General Physician"


    # --------------------------------------
    # Determine urgency
    # --------------------------------------

    if risk == "Emergency":
        urgency = "Immediate"

    elif risk == "High":
        urgency = "Soon"

    elif risk == "Moderate":
        urgency = "Within a few days"

    else:
        urgency = "Routine"


    # --------------------------------------
    # Calculate prototype risk score
    # --------------------------------------

    if risk == "Emergency":
        risk_score = 90

    elif risk == "High":
        risk_score = 75

    elif risk == "Moderate":
        risk_score = 50

    else:
        risk_score = 20


    # --------------------------------------
    # Return AI result
    # --------------------------------------

    return {
        "risk_level": risk,
        "risk_score": risk_score,
        "specialty": specialty,
        "urgency": urgency
    }