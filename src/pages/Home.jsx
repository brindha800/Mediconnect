import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* Navigation Bar */}
      <nav className="navbar">

        <div className="logo">
          🏥 MediConnect
        </div>

        <div className="nav-buttons">

          <button
            onClick={() => navigate("/patient-login")}
          >
            Patient Login
          </button>

          <button
            onClick={() => navigate("/doctor-login")}
          >
            Doctor Login
          </button>

        </div>

      </nav>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <h1>
            Connect with the
            <span> Right Doctor</span>
          </h1>

          <p>
            Ask your medical questions and get connected
            with qualified specialists from around the world.
          </p>

          <div className="hero-buttons">

            {/* Ask a Question → Patient Login */}
            <button
              className="primary-btn"
              onClick={() => navigate("/patient-login")}
            >
              Ask a Question
            </button>

            {/* Find a Specialist → Specialist Search */}
            <button
              className="secondary-btn"
              onClick={() => navigate("/specialists")}
            >
              Find a Specialist
            </button>

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="features">

        <h2>How MediConnect Works</h2>

        <div className="feature-container">

          <div className="feature-card">

            <div className="icon">📝</div>

            <h3>Ask Your Question</h3>

            <p>
              Patients can describe their symptoms,
              conditions or medical questions.
            </p>

          </div>

          <div className="feature-card">

            <div className="icon">🤖</div>

            <h3>AI Specialist Matching</h3>

            <p>
              Our system identifies the appropriate
              medical specialty for your question.
            </p>

          </div>

          <div className="feature-card">

            <div className="icon">👨‍⚕️</div>

            <h3>Doctor Response</h3>

            <p>
              Qualified doctors can review questions
              and provide professional responses.
            </p>

          </div>

          <div className="feature-card">

            <div className="icon">📍</div>

            <h3>Find the Clinic</h3>

            <p>
              Highly rated doctors can be displayed
              on a map for patients to discover.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;