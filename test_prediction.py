from predictor import predict_risk


# Test patient
result = predict_risk(
    fever=0,
    cough=0,
    breathing_difficulty=1,
    chest_pain=1,
    headache=0,
    vomiting=0,
    skin_rash=0,
    itching=0,
    severity=5
)


print("--------------------------------")
print("MediConnect AI")
print("--------------------------------")

print("Predicted Risk:", result)