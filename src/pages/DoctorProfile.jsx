import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { get, ref } from "firebase/database";
import { database } from "./firebase";

function DoctorProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const doctorId = searchParams.get("id");

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      if (!doctorId) {
        setError("Doctor information is missing.");
        setLoading(false);
        return;
      }

      try {
        const doctorRef = ref(
          database,
          `doctors/${doctorId}`
        );

        const snapshot = await get(doctorRef);

        if (!snapshot.exists()) {
          setError("Doctor profile not found.");
          setLoading(false);
          return;
        }

        const doctorData = snapshot.val();

        // Only verified doctors should have public profiles
        if (doctorData.verified !== true) {
          setError(
            "This doctor has not been verified."
          );
          setLoading(false);
          return;
        }

        setDoctor(doctorData);
        setLoading(false);
      } catch (error) {
        console.error(
          "DOCTOR PROFILE ERROR:",
          error
        );

        setError(
          "Unable to load doctor profile."
        );

        setLoading(false);
      }
    };

    loadDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="specialist-page">
          <div className="doctor-card">
            <h2>Loading doctor profile...</h2>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">

        <nav className="dashboard-navbar">
          <div className="dashboard-logo">
            🏥 MediConnect
          </div>

          <button
            className="logout-btn"
            onClick={() =>
              navigate("/specialists")
            }
          >
            ← Specialists
          </button>
        </nav>

        <main className="specialist-page">

          <div className="doctor-card">

            <h2>
              Unable to load profile
            </h2>

            <p>
              {error}
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/specialists")
              }
            >
              Back to Specialists
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
            navigate("/specialists")
          }
        >
          ← Specialists
        </button>

      </nav>

      <main className="specialist-page">

        <div className="doctor-profile-card">

          {/* Doctor icon */}
          <div
            style={{
              fontSize: "80px",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            👨‍⚕️
          </div>

          {/* Name */}
          <h1>
            {doctor.fullName}
          </h1>

          {/* Verification */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "25px",
            }}
          >
            <span className="status answered">
              ✅ Verified MediConnect Doctor
            </span>
          </div>

          {/* Main information */}
          <div className="doctor-profile-info">

            <div className="profile-info-item">
              <strong>
                🩺 Medical Specialty
              </strong>

              <p>
                {doctor.specialty}
              </p>
            </div>

            <div className="profile-info-item">
              <strong>
                🎓 Professional Experience
              </strong>

              <p>
                {doctor.experience || 0} years
              </p>
            </div>

            <div className="profile-info-item">
              <strong>
                🌍 Country
              </strong>

              <p>
                {doctor.country}
              </p>
            </div>

            <div className="profile-info-item">
              <strong>
                🔐 Verification Status
              </strong>

              <p>
                Verified
              </p>
            </div>

          </div>

          {/* About */}
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "25px",
            }}
          >

            <h2>
              About This Doctor
            </h2>

            <p>
              This medical professional has been
              verified by MediConnect and is listed
              as a {doctor.specialty}.
            </p>

            <p>
              Patients may submit questions that
              are matched to appropriate verified
              specialists through the MediConnect
              platform.
            </p>

          </div>

          {/* Action */}
          <div
            style={{
              textAlign: "center",
              marginTop: "25px",
            }}
          >

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/patient-login")
              }
            >
              Ask a Medical Question
            </button>

          </div>

        </div>

        {/* Safety */}
        <div className="safety-notice">

          <strong>
            ⚠️ Important:
          </strong>

          <p>
            A verified profile confirms that the
            doctor's professional credentials have
            been reviewed by MediConnect. It does
            not replace independent medical
            evaluation or guarantee a particular
            medical outcome.
          </p>

        </div>

      </main>

    </div>
  );
}

export default DoctorProfile;