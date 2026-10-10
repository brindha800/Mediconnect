import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, ref } from "firebase/database";
import { auth, database } from "./firebase";

function Responses() {
  const navigate = useNavigate();

  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResponses = async () => {
      // Make sure patient is logged in
      if (!auth.currentUser) {
        setError("Please login to view your responses.");
        setLoading(false);
        return;
      }

      try {
        const questionsRef = ref(
          database,
          "questions"
        );

        const snapshot = await get(questionsRef);

        if (!snapshot.exists()) {
          setResponses([]);
          setLoading(false);
          return;
        }

        const data = snapshot.val();

        // Convert Firebase object into an array
        const responseList = Object.entries(data)
          .map(([id, question]) => ({
            id,
            ...question,
          }))

          // Only this patient's questions
          .filter(
            (question) =>
              question.patientId ===
              auth.currentUser.uid
          )

          // Only questions that have been answered
          .filter(
            (question) =>
              question.status === "answered" &&
              question.response
          )

          .reverse();

        console.log(
          "PATIENT RESPONSES:",
          responseList
        );

        setResponses(responseList);
        setLoading(false);
      } catch (error) {
        console.error(
          "RESPONSES ERROR:",
          error
        );

        setError(
          "Unable to load doctor responses."
        );

        setLoading(false);
      }
    };

    loadResponses();
  }, []);

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
            navigate("/patient-dashboard")
          }
        >
          ← Dashboard
        </button>

      </nav>

      <main className="responses-page">

        {/* Header */}
        <div className="responses-header">

          <h1>
            Doctor Responses
          </h1>

          <p>
            View responses from verified medical
            specialists regarding your questions.
          </p>

        </div>

        {/* Loading */}
        {loading && (
          <div className="response-card">

            <h3>
              Loading doctor responses...
            </h3>

          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* No responses */}
        {!loading &&
          !error &&
          responses.length === 0 && (
            <div className="response-card">

              <div
                style={{
                  fontSize: "45px",
                  marginBottom: "10px",
                }}
              >
                💬
              </div>

              <h2>
                No doctor responses yet
              </h2>

              <p>
                Your questions are waiting for a
                verified specialist to respond.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate("/my-questions")
                }
              >
                View My Questions
              </button>

            </div>
          )}

        {/* Real responses */}
        {!loading &&
          !error &&
          responses.length > 0 && (

            <div className="response-list">

              {responses.map((item) => (

                <div
                  className="response-card"
                  key={item.id}
                >

                  {/* Question heading */}
                  <div className="response-top">

                    <div>

                      <h2>
                        Your Medical Question
                      </h2>

                      <p className="response-specialty">
                        {item.specialty}
                      </p>

                    </div>

                    <span className="response-time">
                      ✅ Answered
                    </span>

                  </div>

                  {/* Patient question */}
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "15px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  >

                    <h3>
                      Your Question
                    </h3>

                    <p>
                      {item.question}
                    </p>

                  </div>

                  {/* Doctor */}
                  <div className="doctor-response-info">

                    <strong>
                      👨‍⚕️{" "}
                      {item.doctorName ||
                        item.assignedDoctorName}
                    </strong>

                    <span>
                      ✅ Verified Specialist
                    </span>

                  </div>

                  {/* Specialty */}
                  {item.doctorSpecialty && (
                    <p
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      Specialty:{" "}
                      <strong>
                        {item.doctorSpecialty}
                      </strong>
                    </p>
                  )}

                  {/* Response */}
                  <div className="response-message">

                    <h3>
                      Doctor's Response
                    </h3>

                    <p>
                      {item.response}
                    </p>

                  </div>

                </div>

              ))}

            </div>
          )}

        {/* Safety notice */}
        <div className="safety-notice">

          <strong>
            ⚠️ Important:
          </strong>

          <p>
            Information provided through MediConnect
            does not replace an in-person medical
            evaluation. If you experience a medical
            emergency, contact your local emergency
            service immediately.
          </p>

        </div>

        <button
          className="back-btn"
          onClick={() =>
            navigate("/patient-dashboard")
          }
        >
          ← Back to Dashboard
        </button>

      </main>

    </div>
  );
}

export default Responses;