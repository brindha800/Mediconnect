import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, database } from "./firebase";

function DoctorLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Login using Firebase Authentication
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const doctorId = result.user.uid;

      // Get this doctor's profile
      const doctorRef = ref(database, `doctors/${doctorId}`);
      const snapshot = await get(doctorRef);

      if (!snapshot.exists()) {
        await signOut(auth);
        setError("Doctor profile not found.");
        return;
      }

      const doctor = snapshot.val();

      // Check verification
      if (doctor.verified !== true) {
        await signOut(auth);

        setError(
          "Your doctor account is still waiting for verification."
        );

        return;
      }

      // Store doctor information temporarily
      localStorage.setItem(
        "mediconnectDoctor",
        JSON.stringify({
          doctorId: doctorId,
          fullName: doctor.fullName,
          email: doctor.email,
          specialty: doctor.specialty,
          verified: doctor.verified,
        })
      );

      // Go to doctor dashboard
      navigate("/doctor-dashboard");
    } catch (error) {
      console.error("DOCTOR LOGIN ERROR:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Incorrect email or password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(`Login failed: ${error.code || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">👨‍⚕️</div>

        <h1>Doctor Login</h1>

        <p className="login-subtitle">
          Access your verified specialist dashboard
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

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Professional Email</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your professional email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Checking..." : "Login as Doctor"}
          </button>
        </form>

        <p className="register-text">
          Not registered yet?{" "}
          <span onClick={() => navigate("/doctor-register")}>
            Apply as a Doctor
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

export default DoctorLogin;