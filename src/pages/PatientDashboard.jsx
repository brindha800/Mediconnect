import React from "react";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">

      {/* Navigation Bar */}
      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          🏥 MediConnect
        </div>

        <button
          className="logout-btn"
          onClick={() => navigate("/")}
        >
          Logout
        </button>

      </nav>

      {/* Main Content */}
      <main className="dashboard-content">

        <div className="welcome-section">
          <h1>Welcome to MediConnect 👋</h1>

          <p>
            Ask your medical question and connect with
            the right specialist.
          </p>
        </div>

        {/* Main Action */}
        <div className="ask-card">

          <div className="ask-icon">
            🩺
          </div>

          <div>
            <h2>Have a medical question?</h2>

            <p>
              Describe your symptoms or medical concern.
              Our system will help identify the appropriate
              medical specialty.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/ask-question")}
            >
              Ask a Question
            </button>
          </div>

        </div>

        {/* Dashboard Cards */}
        <section className="dashboard-cards">

          <div className="dashboard-card">

            <div className="card-icon">
              📋
            </div>

            <h3>My Questions</h3>

            <p>
              View questions you have submitted and
              track doctor responses.
            </p>

            <button
  className="card-btn"
  onClick={() => navigate("/my-questions")}
>
  View Questions
</button>
          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              💬
            </div>

            <h3>Doctor Responses</h3>

            <p>
              Read responses from verified medical
              specialists.
            </p>

            <button
  className="card-btn"
  onClick={() => navigate("/responses")}
>
  View Responses
</button>

          </div>

          <div className="dashboard-card">

            <div className="card-icon">
              📍
            </div>

            <h3>Find Specialists</h3>

            <p>
              Discover highly rated specialists and
              their clinic locations.
            </p>

            <button className="card-btn">
              Find Doctors
            </button>

          </div>

        </section>

        {/* Safety Notice */}
        <div className="safety-notice">

          <strong>⚠️ Important:</strong>

          <p>
            MediConnect is not an emergency service and
            does not replace professional medical care.
            If you have a medical emergency, contact your
            local emergency service immediately.
          </p>

        </div>

      </main>

    </div>
  );
}

export default PatientDashboard;