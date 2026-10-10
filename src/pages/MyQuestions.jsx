import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { auth, database } from "./firebase";

function MyQuestions() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.currentUser) {
      setError("Please login to view your questions.");
      setLoading(false);
      return;
    }

    const questionsRef = ref(database, "questions");

    const unsubscribe = onValue(
      questionsRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          setQuestions([]);
          setLoading(false);
          return;
        }

        const questionList = Object.entries(data)
          .map(([id, question]) => ({
            id,
            ...question,
          }))
          .filter(
            (question) =>
              question.patientId === auth.currentUser.uid
          )
          .reverse();

        setQuestions(questionList);
        setLoading(false);
      },
      (firebaseError) => {
        console.error(
          "MY QUESTIONS ERROR:",
          firebaseError
        );

        setError(
          "Unable to load your questions."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard-page">

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

        <div className="responses-header">
          <h1>My Questions</h1>

          <p>
            View the medical questions you have submitted
            through MediConnect.
          </p>
        </div>

        {loading && (
          <div className="response-card">
            <h3>Loading your questions...</h3>
          </div>
        )}

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

        {!loading &&
          !error &&
          questions.length === 0 && (
            <div className="response-card">
              <h2>No questions yet</h2>

              <p>
                You haven't submitted any medical
                questions yet.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate("/ask-question")
                }
              >
                Ask a Question
              </button>
            </div>
          )}

        {!loading &&
          questions.length > 0 && (
            <div className="response-list">

              {questions.map((question) => (

                <div
                  className="response-card"
                  key={question.id}
                >

                  <div className="response-top">

                    <div>

                      <h2>
                        {question.question}
                      </h2>

                      <p className="response-specialty">
                        Suggested Specialty:{" "}
                        {question.specialty}
                      </p>

                    </div>

                    <span className="response-time">
                      {question.status === "waiting"
                        ? "⏳ Waiting"
                        : "✅ Answered"}
                    </span>

                  </div>

                  <div className="question-status-row">

                    <span
                      className={
                        question.status === "waiting"
                          ? "status waiting"
                          : "status answered"
                      }
                    >
                      {question.status === "waiting"
                        ? "Waiting for doctor response"
                        : "Answered"}
                    </span>

                  </div>

                  {question.status === "waiting" && (
                    <p>
                      Your question has been submitted
                      successfully and is waiting for a
                      suitable doctor.
                    </p>
                  )}

                  {question.status === "answered" && (
                    <button
                      className="view-doctor-btn"
                      onClick={() =>
                        navigate("/responses")
                      }
                    >
                      View Doctor Response
                    </button>
                  )}

                </div>

              ))}

            </div>
          )}

        <div className="safety-notice">

          <strong>⚠️ Important:</strong>

          <p>
            MediConnect is not an emergency service and
            does not replace professional medical care.
            If you have a medical emergency, contact your
            local emergency service immediately.
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

export default MyQuestions;