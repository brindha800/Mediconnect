import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "./firebase";

function DoctorRegister() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Create Firebase Authentication account
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const doctorId = result.user.uid;

      // Save doctor profile in Realtime Database
      const doctorData = {
        doctorId: doctorId,
        fullName: fullName.trim(),
        email: email.trim(),
        country: country.trim(),
        specialty: specialty,
        registrationNumber: registrationNumber.trim(),
        experience: Number(experience),
        verified: false,
        status: "pending",
        createdAt: Date.now(),
      };

      await set(ref(database, `doctors/${doctorId}`), doctorData);

      console.log("DOCTOR REGISTERED:", doctorData);

      setSubmitted(true);
    } catch (error) {
      console.error("DOCTOR REGISTRATION ERROR:", error);

      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else {
        setError(`Registration failed: ${error.code || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">👨‍⚕️</div>

        <h1>Doctor Registration</h1>

        <p className="login-subtitle">
          Apply to become a MediConnect doctor
        </p>

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
          <form onSubmit={handleRegister}>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <label htmlFor="email">Professional Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your professional email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              placeholder="Enter your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />

            <label htmlFor="specialty">Medical Specialty</label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              required
            >
              <option value="">Select your specialty</option>
              <option>General Physician</option>
              <option>Cardiologist</option>
              <option>Dermatologist</option>
              <option>Neurologist</option>
              <option>Psychiatrist</option>
              <option>Orthopedic Specialist</option>
              <option>Gynecologist</option>
              <option>Pediatrician</option>
              <option>ENT Specialist</option>
              <option>Ophthalmologist</option>
            </select>

            <label htmlFor="registrationNumber">
              Medical Registration Number
            </label>
            <input
              id="registrationNumber"
              type="text"
              placeholder="Enter registration number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
            />

            <label htmlFor="experience">Years of Experience</label>
            <input
              id="experience"
              type="number"
              min="0"
              placeholder="Enter years of experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Doctor Application"}
            </button>
          </form>
        ) : (
          <div className="routing-result">
            <div style={{ fontSize: "45px" }}>✅</div>

            <h2>Application Submitted</h2>

            <p>
              Your doctor account has been created successfully.
            </p>

            <p>
              <strong>Specialty:</strong> {specialty}
            </p>

            <p>
              <strong>Status:</strong> Pending Verification
            </p>

            <p>
              A MediConnect administrator must verify your professional
              credentials before you can answer patient questions.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/doctor-login")}
            >
              Go to Doctor Login
            </button>
          </div>
        )}

        <p className="register-text">
          Already registered?{" "}
          <span onClick={() => navigate("/doctor-login")}>
            Doctor Login
          </span>
        </p>

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default DoctorRegister;