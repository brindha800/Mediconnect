import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  get,
  ref,
  update,
  serverTimestamp,
} from "firebase/database";
import { auth, database } from "./firebase";

function QuestionDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const questionId = searchParams.get("id");

  const [question, setQuestion] = useState(null);
  const [response, setResponse] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadQuestion = async () => {
      if (!questionId) {
        setError("Question ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const questionRef = ref(
          database,
          `questions/${questionId}`
        );

        const snapshot = await get(questionRef);

        if (!snapshot.exists()) {
          setError("Question not found.");
          setLoading(false);
          return;
        }

        const questionData = snapshot.val();

        // Check that this doctor is the assigned doctor
        const savedDoctor = localStorage.getItem(
          "mediconnectDoctor"
        );

        if (!savedDoctor) {
          navigate("/doctor-login");
          return;
        }

        const doctor = JSON.parse(savedDoctor);

        if (
          questionData.assignedDoctorId !==
          doctor.doctorId
        ) {
          setError(
            "This question is not assigned to your doctor account."
          );
          setLoading(false);
          return;
        }

        setQuestion(questionData);

        // If already answered, show existing response
        if (questionData.status === "answered") {
          setResponse(questionData.response || "");
          setSubmitted(true);
        }

        setLoading(false);
      } catch (error) {
        console.error(
          "QUESTION DETAILS ERROR:",
          error
        );

        setError(
          "Unable to load this patient question."
        );

        setLoading(false);
      }
    };

    loadQuestion();
  }, [questionId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!response.trim()) {
      setError(
        "Please enter a response before submitting."
      );
      return;
    }

    if (!questionId) {
      setError("Question ID is missing.");
      return;
    }

    const savedDoctor = localStorage.getItem(
      "mediconnectDoctor"
    );

    if (!savedDoctor) {
      setError("Doctor login session not found.");
      return;
    }

    const doctor = JSON.parse(savedDoctor);

    try {
      setSubmitting(true);
      setError("");

      const questionRef = ref(
        database,
        `questions/${questionId}`
      );

      // Save doctor's response
      await update(questionRef, {
        response: response.trim(),

        doctorId: doctor.doctorId,
        doctorName: doctor.fullName,
        doctorSpecialty: doctor.specialty,

        status: "answered",

        respondedAt: serverTimestamp(),
      });

      setSubmitted(true);

      alert(
        "Doctor response submitted successfully."
      );
    } catch (error) {
      console.error(
        "RESPONSE SUBMISSION ERROR:",
        error
      );

      setError(
        `Unable to submit response: ${
          error.code || error.message
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="question-details-page">
          <div className="question-details-card">
            <h2>Loading patient question...</h2>
          </div>
        </main>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="dashboard-page">

        <nav className="dashboard-navbar">
          <div className="dashboard-logo">
            🏥 MediConnect
          </div>

          <button
            className="logout-btn"
            onClick={() =>
              navigate("/doctor-dashboard")
            }
          >
            ← Dashboard
          </button>
        </nav>

        <main className="question-details-page">
          <div className="question-details-card">

            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              {error}
            </div>

            <button
              className="back-btn"
              onClick={() =>
                navigate("/doctor-dashboard")
              }
            >
              ← Back to Doctor Dashboard
            </button>

          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Navbar */}
      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          🏥 MediConnect
        </div>

        <button
          className="logout-btn"
          onClick={() =>
            navigate("/doctor-dashboard")
          }
        >
          ← Dashboard
        </button>

      </nav>

      <main className="question-details-page">

        <div className="question-details-card">

          {/* Header */}
          <div className="question-details-header">

            <div className="question-icon">
              🩺
            </div>

            <div>

              <h1>
                Patient Question
              </h1>

              <p>
                Review the patient's question and
                provide a professional response.
              </p>

            </div>

          </div>

          {/* Question */}
          <div className="patient-question-box">

            <div className="question-meta">

              <span className="specialty-badge">
                {question.specialty}
              </span>

              <span className="question-time">
                🕐 Patient Question
              </span>

            </div>

            <h2>
              Medical Concern
            </h2>

            <p className="patient-question">
              {question.question}
            </p>

          </div>

          {/* Assigned Doctor */}
          <div
            style={{
              background: "#eff6ff",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <strong>
              👨‍⚕️ Assigned Doctor
            </strong>

            <p style={{ marginBottom: 0 }}>
              {question.assignedDoctorName}
            </p>

            <p style={{ marginBottom: 0 }}>
              Specialty: {question.specialty}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {!submitted ? (

            <form
              className="doctor-response-form"
              onSubmit={handleSubmit}
            >

              <label htmlFor="doctor-response">
                Your Professional Response
              </label>

              <textarea
                id="doctor-response"
                value={response}
                onChange={(e) =>
                  setResponse(e.target.value)
                }
                placeholder="Write your professional response to the patient..."
                rows="8"
                required
              />

              <p className="doctor-response-note">
                🔐 Only verified doctors should provide
                medical responses. Use professional
                judgment and recommend in-person care
                when appropriate.
              </p>

              <button
                type="submit"
                className="login-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting Response..."
                  : "Submit Response"}
              </button>

            </form>

          ) : (

            <div className="response-success">

              <div className="success-icon">
                ✅
              </div>

              <h2>
                Response Submitted
              </h2>

              <p>
                Your response has been saved and the
                patient can now view it.
              </p>

              <div className="submitted-response">

                <strong>
                  Your Response:
                </strong>

                <p>
                  {response}
                </p>

              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate("/doctor-dashboard")
                }
              >
                Back to Doctor Dashboard
              </button>

            </div>

          )}

          {/* Safety */}
          <div className="doctor-safety-notice">

            <strong>
              ⚠️ Medical Safety
            </strong>

            <p>
              MediConnect is a communication platform
              and does not replace an in-person medical
              evaluation. Doctors should use their
              professional judgment when responding.
              Emergency situations should be directed
              to appropriate local emergency services.
            </p>

          </div>

          <button
            className="back-btn"
            onClick={() =>
              navigate("/doctor-dashboard")
            }
          >
            ← Back to Doctor Dashboard
          </button>

        </div>

      </main>

    </div>
  );
}

export default QuestionDetails;