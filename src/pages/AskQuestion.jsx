import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, push, ref, serverTimestamp } from "firebase/database";
import { auth, database } from "./firebase";

// ======================================================
// SPECIALTY DETECTION
// ======================================================

function detectSpecialty(question) {
  const text = question.toLowerCase();

  if (
    text.includes("chest pain") ||
    text.includes("heart pain") ||
    text.includes("heart problem") ||
    text.includes("heart") ||
    text.includes("heartbeat") ||
    text.includes("palpitation") ||
    text.includes("blood pressure")
  ) {
    return "Cardiologist";
  }

  if (
    text.includes("nose bleed") ||
    text.includes("nosebleed") ||
    text.includes("nose bleeding") ||
    text.includes("bleeding from nose") ||
    text.includes("ear pain") ||
    text.includes("ear problem") ||
    text.includes("hearing") ||
    text.includes("sinus") ||
    text.includes("throat") ||
    text.includes("tonsil")
  ) {
    return "ENT Specialist";
  }

  if (
    text.includes("skin") ||
    text.includes("acne") ||
    text.includes("rash") ||
    text.includes("itching") ||
    text.includes("pimple") ||
    text.includes("hair loss") ||
    text.includes("eczema")
  ) {
    return "Dermatologist";
  }

  if (
    text.includes("headache") ||
    text.includes("migraine") ||
    text.includes("seizure") ||
    text.includes("nerve") ||
    text.includes("memory loss") ||
    text.includes("dizziness")
  ) {
    return "Neurologist";
  }

  if (
    text.includes("bone") ||
    text.includes("joint") ||
    text.includes("fracture") ||
    text.includes("back pain") ||
    text.includes("knee pain") ||
    text.includes("shoulder pain")
  ) {
    return "Orthopedic Specialist";
  }

  if (
    text.includes("eye") ||
    text.includes("vision") ||
    text.includes("blurred vision") ||
    text.includes("red eye") ||
    text.includes("eye pain")
  ) {
    return "Ophthalmologist";
  }

  if (
    text.includes("period") ||
    text.includes("pregnancy") ||
    text.includes("pregnant") ||
    text.includes("ovary") ||
    text.includes("ovarian") ||
    text.includes("menstrual")
  ) {
    return "Gynecologist";
  }

  if (
    text.includes("child") ||
    text.includes("baby") ||
    text.includes("infant") ||
    text.includes("kid")
  ) {
    return "Pediatrician";
  }

  if (
    text.includes("vomiting") ||
    text.includes("vomit") ||
    text.includes("nausea") ||
    text.includes("stomach pain") ||
    text.includes("abdominal pain")
  ) {
    return "General Physician";
  }

  return "General Physician";
}

// ======================================================
// URGENT / RED FLAG DETECTION
// ======================================================

function detectUrgentConcern(question) {
  const text = question.toLowerCase();

  const urgentKeywords = [
    "severe chest pain",
    "chest pain",
    "severe heart pain",
    "heart pain",
    "crushing chest pain",
    "pressure in chest",
    "tightness in chest",

    "difficulty breathing",
    "can't breathe",
    "cannot breathe",
    "unable to breathe",
    "shortness of breath",
    "severe breathing problem",
    "breathing difficulty",

    "severe bleeding",
    "heavy bleeding",
    "uncontrolled bleeding",
    "bleeding heavily",
    "bleeding badly",

    "severe nose bleed",
    "severe nosebleed",
    "heavy nose bleed",
    "heavy nosebleed",
    "severe nose bleeding",
    "nose bleeding badly",
    "nose is bleeding badly",
    "bleeding from nose",

    "vomiting blood",
    "vomit blood",
    "blood vomiting",
    "blood in vomit",
    "throwing up blood",
    "throw up blood",
    "vomiting a lot of blood",
    "vomiting large amounts of blood",

    "severe vomiting",
    "continuous vomiting",
    "constant vomiting",
    "nonstop vomiting",
    "non stop vomiting",
    "vomiting continuously",
    "vomiting repeatedly",
    "can't stop vomiting",
    "cannot stop vomiting",

    "unconscious",
    "unresponsive",
    "fainted",
    "fainting",
    "passed out",
    "seizure",
    "fits",
    "face drooping",
    "slurred speech",
    "sudden weakness",
    "sudden paralysis",

    "severe allergic reaction",
    "anaphylaxis",
    "throat swelling",
    "swelling of throat",
    "difficulty swallowing",

    "severe abdominal pain",
    "severe stomach pain",
    "severe pain",
    "unbearable pain",
    "extreme pain",

    "collapsed",
    "collapse",
  ];

  return urgentKeywords.some((keyword) =>
    text.includes(keyword)
  );
}

// ======================================================
// EXTRACT SYMPTOMS FOR AI
// ======================================================

function extractSymptoms(question) {
  const text = question.toLowerCase();

  const symptoms = {
    fever: 0,
    cough: 0,
    breathing_difficulty: 0,
    chest_pain: 0,
    headache: 0,
    vomiting: 0,
    skin_rash: 0,
    itching: 0,
    severity: 1,
  };

  if (
    text.includes("fever") ||
    text.includes("temperature") ||
    text.includes("high temperature")
  ) {
    symptoms.fever = 1;
  }

  if (
    text.includes("cough") ||
    text.includes("coughing")
  ) {
    symptoms.cough = 1;
  }

  if (
    text.includes("difficulty breathing") ||
    text.includes("breathing difficulty") ||
    text.includes("shortness of breath") ||
    text.includes("can't breathe") ||
    text.includes("cannot breathe") ||
    text.includes("breathless")
  ) {
    symptoms.breathing_difficulty = 1;
  }

  if (
    text.includes("chest pain") ||
    text.includes("heart pain") ||
    text.includes("chest pressure") ||
    text.includes("tightness in chest")
  ) {
    symptoms.chest_pain = 1;
  }

  if (
    text.includes("headache") ||
    text.includes("migraine") ||
    text.includes("head pain")
  ) {
    symptoms.headache = 1;
  }

  if (
    text.includes("vomiting") ||
    text.includes("vomit") ||
    text.includes("nausea")
  ) {
    symptoms.vomiting = 1;
  }

  if (
    text.includes("skin rash") ||
    text.includes("rash") ||
    text.includes("acne") ||
    text.includes("eczema")
  ) {
    symptoms.skin_rash = 1;
  }

  if (
    text.includes("itching") ||
    text.includes("itchy")
  ) {
    symptoms.itching = 1;
  }

  // Estimate symptom severity for the prototype model.
  if (
    text.includes("mild") ||
    text.includes("slight") ||
    text.includes("little pain")
  ) {
    symptoms.severity = 1;
  } else if (
    text.includes("moderate") ||
    text.includes("medium")
  ) {
    symptoms.severity = 3;
  } else if (
    text.includes("severe") ||
    text.includes("very painful") ||
    text.includes("extreme") ||
    text.includes("unbearable") ||
    text.includes("unable to")
  ) {
    symptoms.severity = 5;
  } else if (
    text.includes("pain") ||
    text.includes("problem") ||
    text.includes("difficulty")
  ) {
    symptoms.severity = 3;
  }

  return symptoms;
}

// ======================================================
// AI PREDICTION
// ======================================================

async function getAIPrediction(question) {
  const symptoms = extractSymptoms(question);

  const response = await fetch(
    "http://127.0.0.1:8000/predict",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(symptoms),
    }
  );

  if (!response.ok) {
    throw new Error("AI server returned an error.");
  }

  const data = await response.json();

  return {
    ...data,
    symptoms,
  };
}

// ======================================================
// MAIN COMPONENT
// ======================================================

function AskQuestion() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [specialty, setSpecialty] = useState("");
  const [assignedDoctor, setAssignedDoctor] = useState(null);
  const [urgent, setUrgent] = useState(false);

  // AI states
  const [aiResult, setAiResult] = useState(null);

  // ====================================================
  // SUBMIT QUESTION
  // ====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitted(false);
    setAssignedDoctor(null);
    setSpecialty("");
    setUrgent(false);
    setAiResult(null);

    if (!question.trim()) {
      setError("Please enter your medical question.");
      return;
    }

    if (!auth.currentUser) {
      setError("Please login before submitting a question.");
      return;
    }

    try {
      setLoading(true);

      // ------------------------------------------------
      // STEP 1: EXISTING SPECIALTY DETECTION
      // ------------------------------------------------

      const suggestedSpecialty =
        detectSpecialty(question);

      // ------------------------------------------------
      // STEP 2: EXISTING URGENT DETECTION
      // ------------------------------------------------

      const urgentConcern =
        detectUrgentConcern(question);

      // ------------------------------------------------
      // STEP 3: AI PREDICTION
      // ------------------------------------------------

      let prediction = null;

      try {
        prediction = await getAIPrediction(question);

        console.log(
          "MEDICONNECT AI RESULT:",
          prediction
        );

      } catch (aiError) {
        console.error(
          "AI PREDICTION ERROR:",
          aiError
        );

        // AI failure should NOT prevent
        // the normal MediConnect flow.
        prediction = null;
      }

      // ------------------------------------------------
      // STEP 4: GET DOCTORS FROM FIREBASE
      // ------------------------------------------------

      const doctorsRef =
        ref(database, "doctors");

      const doctorsSnapshot =
        await get(doctorsRef);

      let selectedDoctor = null;

      if (doctorsSnapshot.exists()) {
        const doctorsData =
          doctorsSnapshot.val();

        const verifiedDoctors =
          Object.entries(doctorsData)
            .map(([id, doctor]) => ({
              doctorId: id,
              ...doctor,
            }))
            .filter(
              (doctor) =>
                doctor.verified === true &&
                doctor.specialty ===
                  suggestedSpecialty
            );

        if (verifiedDoctors.length > 0) {
          selectedDoctor =
            verifiedDoctors[0];
        }
      }

      // ------------------------------------------------
      // STEP 5: SAVE QUESTION + AI RESULT
      // ------------------------------------------------

      const questionsRef =
        ref(database, "questions");

      const newQuestion = {
        patientId:
          auth.currentUser.uid,

        patientEmail:
          auth.currentUser.email,

        question:
          question.trim(),

        specialty:
          suggestedSpecialty,

        assignedDoctorId:
          selectedDoctor
            ? selectedDoctor.doctorId
            : "",

        assignedDoctorName:
          selectedDoctor
            ? selectedDoctor.fullName
            : "",

        status: "waiting",

        urgent: urgentConcern,

        // -----------------------------
        // AI ANALYSIS
        // -----------------------------

        aiRiskLevel:
          prediction
            ? prediction.risk_level
            : "Unavailable",

        aiRiskScore:
          prediction
            ? prediction.risk_score
            : null,

        aiUrgency:
          prediction
            ? prediction.urgency
            : "Unavailable",

        aiSpecialty:
          prediction
            ? prediction.specialty
            : "",

        aiSymptoms:
          prediction
            ? prediction.symptoms
            : null,

        aiAnalyzed:
          prediction !== null,

        createdAt:
          serverTimestamp(),
      };

      await push(
        questionsRef,
        newQuestion
      );

      // ------------------------------------------------
      // STEP 6: SHOW RESULTS
      // ------------------------------------------------

      setSpecialty(
        suggestedSpecialty
      );

      setAssignedDoctor(
        selectedDoctor
      );

      setUrgent(
        urgentConcern
      );

      setAiResult(
        prediction
      );

      setSubmitted(true);

      setQuestion("");

    } catch (error) {
      console.error(
        "ASK QUESTION ERROR:",
        error
      );

      setError(
        "Unable to submit your question. Please check your connection and try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}

      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          🏥 MediConnect
        </div>

        <button
          className="logout-btn"
          onClick={() =>
            navigate("/patient-dashboard")
          }
        >
          ← Dashboard
        </button>

      </nav>

      {/* MAIN */}

      <main className="responses-page">

        {/* HEADER */}

        <div className="responses-header">

          <h1>
            Ask a Medical Question 🩺
          </h1>

          <p>
            Describe your symptoms or medical concern.
            MediConnect will analyze the information
            and suggest an appropriate medical specialty.
          </p>

        </div>

        {/* QUESTION FORM */}

        <div className="response-card">

          <form onSubmit={handleSubmit}>

            <label
              htmlFor="question"
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              Describe your concern
            </label>

            <textarea
              id="question"
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Example: I have severe chest pain and difficulty breathing..."
              rows="7"
              style={{
                width: "100%",
                padding: "14px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "16px",
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              required
            />

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
              style={{
                marginTop: "20px",
              }}
            >
              {loading
                ? "🤖 AI Analyzing..."
                : "Submit Question"}
            </button>

          </form>

        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* RESULT */}

        {submitted && (

          <div
            className="response-card"
            style={{
              marginTop: "25px",
            }}
          >

            <h2>
              ✅ Question Submitted
            </h2>

            <p
              style={{
                marginTop: "10px",
              }}
            >
              Your question has been successfully
              submitted to MediConnect.
            </p>

            {/* ======================================== */}
            {/* AI ANALYSIS */}
            {/* ======================================== */}

            {aiResult ? (

              <div
                style={{
                  marginTop: "20px",
                  padding: "18px",
                  background: "#f0fdf4",
                  borderRadius: "12px",
                  border: "1px solid #bbf7d0",
                }}
              >

                <h3>
                  🤖 AI Predictive Analysis
                </h3>

                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                  }}
                >
                  Prototype AI analysis based on
                  the symptoms provided.
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                    marginTop: "15px",
                  }}
                >

                  <div>
                    <strong>
                      Risk Level:
                    </strong>{" "}
                    {aiResult.risk_level}
                  </div>

                  <div>
                    <strong>
                      Risk Score:
                    </strong>{" "}
                    {aiResult.risk_score}/100
                  </div>

                  <div>
                    <strong>
                      AI Specialty:
                    </strong>{" "}
                    {aiResult.specialty}
                  </div>

                  <div>
                    <strong>
                      Urgency:
                    </strong>{" "}
                    {aiResult.urgency}
                  </div>

                </div>

              </div>

            ) : (

              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#fff7ed",
                  borderRadius: "10px",
                  color: "#9a3412",
                }}
              >
                <strong>
                  ⚠️ AI analysis unavailable
                </strong>

                <p
                  style={{
                    marginTop: "6px",
                  }}
                >
                  The question was still saved
                  successfully. Please make sure
                  the MediConnect AI server is running.
                </p>

              </div>

            )}

            {/* ======================================== */}
            {/* SPECIALTY */}
            {/* ======================================== */}

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#f8fafc",
                borderRadius: "10px",
              }}
            >

              <strong>
                🩺 Suggested Specialty
              </strong>

              <p
                style={{
                  marginTop: "6px",
                }}
              >
                {specialty}
              </p>

            </div>

            {/* ======================================== */}
            {/* DOCTOR */}
            {/* ======================================== */}

            {assignedDoctor ? (

              <div
                style={{
                  marginTop: "15px",
                  padding: "15px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                }}
              >

                <strong>
                  👨‍⚕️ Assigned Doctor
                </strong>

                <p
                  style={{
                    marginTop: "6px",
                  }}
                >
                  {assignedDoctor.fullName}
                </p>

                <p>
                  {assignedDoctor.specialty}
                </p>

                <span className="status answered">
                  ✅ Verified Doctor
                </span>

              </div>

            ) : (

              <div
                style={{
                  marginTop: "15px",
                  padding: "15px",
                  background: "#fff7ed",
                  borderRadius: "10px",
                  color: "#9a3412",
                }}
              >

                <strong>
                  ⏳ No matching doctor currently
                  available
                </strong>

                <p
                  style={{
                    marginTop: "6px",
                  }}
                >
                  Your question has still been saved.
                  A suitable doctor can be assigned
                  when available.
                </p>

              </div>

            )}

            {/* ======================================== */}
            {/* URGENT */}
            {/* ======================================== */}

            {urgent && (

              <div
                className="safety-notice"
                style={{
                  marginTop: "20px",
                  border:
                    "1px solid #fecaca",
                }}
              >

                <strong>
                  ⚠️ Prompt Medical Attention
                </strong>

                <p>
                  Your concern contains information
                  that may require prompt in-person
                  medical attention.
                </p>

                <p>
                  Consider visiting a nearby clinic
                  or hospital.
                </p>

                <button
                  className="primary-btn"
                  onClick={() =>
                    navigate(
                      "/nearby-clinics"
                    )
                  }
                >
                  📍 Find Nearby Clinics
                </button>

                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "14px",
                  }}
                >
                  If you are experiencing a
                  life-threatening emergency,
                  contact your local emergency
                  service immediately.
                </p>

              </div>

            )}

            {/* NORMAL */}

            {!urgent && (

              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#eff6ff",
                  borderRadius: "10px",
                  color: "#1e40af",
                }}
              >

                <strong>
                  💬 Next Step
                </strong>

                <p
                  style={{
                    marginTop: "6px",
                  }}
                >
                  Your question is now available
                  to the assigned doctor. You can
                  check your questions and responses
                  from your dashboard.
                </p>

              </div>

            )}

            {/* ACTIONS */}

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "25px",
              }}
            >

              <button
                className="secondary-btn"
                onClick={() =>
                  navigate("/my-questions")
                }
              >
                📋 My Questions
              </button>

              <button
                className="back-btn"
                onClick={() =>
                  navigate(
                    "/patient-dashboard"
                  )
                }
              >
                ← Dashboard
              </button>

            </div>

          </div>

        )}

        {/* SAFETY */}

        <div className="safety-notice">

          <strong>
            ⚠️ Important:
          </strong>

          <p>
            MediConnect is not an emergency service
            and does not provide a medical diagnosis.
            The AI analysis is a prototype predictive
            feature and should not replace professional
            medical evaluation.
          </p>

        </div>

      </main>

    </div>
  );
}

export default AskQuestion;