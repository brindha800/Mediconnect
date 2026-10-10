import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { database } from "./firebase";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get the logged-in doctor's information
    const savedDoctor = localStorage.getItem(
      "mediconnectDoctor"
    );

    if (!savedDoctor) {
      navigate("/doctor-login");
      return;
    }

    const doctorData = JSON.parse(savedDoctor);

    setDoctor(doctorData);

    // Listen to patient questions
    const questionsRef = ref(
      database,
      "questions"
    );

    const unsubscribe = onValue(
      questionsRef,
      (snapshot) => {
        const data = snapshot.val();

        if (!data) {
          setQuestions([]);
          setLoading(false);
          return;
        }

        // Convert Firebase object into array
        const questionList = Object.entries(data)
          .map(([id, question]) => ({
            id,
            ...question,
          }))

          // IMPORTANT:
          // Only show questions assigned to THIS doctor
          .filter(
            (question) =>
              question.assignedDoctorId ===
              doctorData.doctorId
          )

          .reverse();

        console.log(
          "QUESTIONS ASSIGNED TO THIS DOCTOR:",
          questionList
        );

        setQuestions(questionList);
        setLoading(false);
      },
      (firebaseError) => {
        console.error(
          "DOCTOR QUESTIONS ERROR:",
          firebaseError
        );

        setError(
          "Unable to load assigned patient questions."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem(
      "mediconnectDoctor"
    );

    navigate("/doctor-login");
  };

  if (!doctor) {
    return (
      <div className="dashboard-page">
        <h2>Loading doctor profile...</h2>
      </div>
    );
  }

  const waitingQuestions = questions.filter(
    (question) =>
      question.status === "waiting"
  );

  const answeredQuestions = questions.filter(
    (question) =>
      question.status === "answered"
  );

  return (
    <div className="dashboard-page">

      {/* Navbar */}
      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          🏥 MediConnect
        </div>

        <div className="doctor-nav">

          <span className="doctor-name">
            👨‍⚕️ {doctor.fullName}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      <main className="doctor-dashboard-content">

        {/* Welcome */}
        <section className="doctor-welcome">

          <h1>
            Welcome, {doctor.fullName} 👋
          </h1>

          <p>
            Your MediConnect dashboard for{" "}
            <strong>
              {doctor.specialty}
            </strong>
          </p>

          <div style={{ marginTop: "12px" }}>
            <span className="status answered">
              ✅ Verified Doctor
            </span>
          </div>

        </section>

        {/* Statistics */}
        <section className="doctor-stats">

          <div className="stat-card">
            <div className="stat-icon">
              📋
            </div>

            <h2>
              {questions.length}
            </h2>

            <p>
              Assigned Questions
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ⏳
            </div>

            <h2>
              {waitingQuestions.length}
            </h2>

            <p>
              Waiting for Response
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ✅
            </div>

            <h2>
              {answeredQuestions.length}
            </h2>

            <p>
              Answered
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              🩺
            </div>

            <h2>
              {doctor.specialty}
            </h2>

            <p>
              Your Specialty
            </p>
          </div>

        </section>

        {/* Questions */}
        <section className="questions-section">

          <div className="section-heading">

            <div>

              <h2>
                Your Assigned Patient Questions
              </h2>

              <p>
                These questions have been specifically
                assigned to you.
              </p>

            </div>

          </div>

          {/* Loading */}
          {loading && (
            <div className="doctor-question-card">

              <h3>
                Loading your questions...
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

          {/* No questions */}
          {!loading &&
            !error &&
            questions.length === 0 && (
              <div className="doctor-question-card">

                <div
                  style={{
                    fontSize: "40px",
                    marginBottom: "10px",
                  }}
                >
                  📭
                </div>

                <h3>
                  No questions assigned to you
                </h3>

                <p>
                  When MediConnect assigns a patient
                  question to you, it will appear here.
                </p>

              </div>
            )}

          {/* Questions */}
          {!loading &&
            !error &&
            questions.length > 0 && (
              <div className="question-list">

                {questions.map((question) => (

                  <div
                    className="doctor-question-card"
                    key={question.id}
                  >

                    <div className="question-card-content">

                      <h3>
                        {question.question}
                      </h3>

                      <p>
                        Specialty:{" "}
                        <strong>
                          {question.specialty}
                        </strong>
                      </p>

                      <p>
                        Assigned to:{" "}
                        <strong>
                          {question.assignedDoctorName}
                        </strong>
                      </p>

                      <span
                        className={
                          question.status ===
                          "answered"
                            ? "status answered"
                            : "status waiting"
                        }
                      >
                        {question.status ===
                        "answered"
                          ? "Answered"
                          : "Waiting for Response"}
                      </span>

                    </div>

                    <button
                      className="review-btn"
                      onClick={() =>
                        navigate(
                          `/question-details?id=${question.id}`
                        )
                      }
                    >
                      Review Question
                    </button>

                  </div>

                ))}

              </div>
            )}

        </section>

        {/* Verification notice */}
        <div className="doctor-notice">

          <strong>
            🔐 Verified Doctor Account
          </strong>

          <p>
            You are viewing questions specifically
            assigned to your verified MediConnect
            doctor account.
          </p>

        </div>

      </main>

    </div>
  );
}

export default DoctorDashboard;