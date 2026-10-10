import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, ref } from "firebase/database";
import { database } from "./firebase";

function Specialists() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsRef = ref(
          database,
          "doctors"
        );

        const snapshot = await get(doctorsRef);

        if (!snapshot.exists()) {
          setDoctors([]);
          setLoading(false);
          return;
        }

        const data = snapshot.val();

        const verifiedDoctors = Object.entries(data)
          .map(([doctorId, doctor]) => ({
            doctorId,
            ...doctor,
          }))
          .filter(
            (doctor) =>
              doctor.verified === true
          );

        console.log(
          "VERIFIED DOCTORS:",
          verifiedDoctors
        );

        setDoctors(verifiedDoctors);
        setLoading(false);
      } catch (error) {
        console.error(
          "SPECIALISTS ERROR:",
          error
        );

        setError(
          "Unable to load specialist information."
        );

        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        doctor.fullName
          ?.toLowerCase()
          .includes(searchText) ||
        doctor.specialty
          ?.toLowerCase()
          .includes(searchText) ||
        doctor.country
          ?.toLowerCase()
          .includes(searchText);

      const matchesSpecialty =
        !selectedSpecialty ||
        doctor.specialty ===
          selectedSpecialty;

      return (
        matchesSearch &&
        matchesSpecialty
      );
    }
  );

  return (
    <div className="dashboard-page">

      {/* Navbar */}
      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          🏥 MediConnect
        </div>

        <button
          className="logout-btn"
          onClick={() => navigate("/")}
        >
          ← Home
        </button>

      </nav>

      <main className="specialist-page">

        {/* Header */}
        <div className="specialist-header">

          <h1>
            Find a Specialist
          </h1>

          <p>
            Discover verified medical specialists
            available through MediConnect.
          </p>

        </div>

        {/* Search */}
        <div className="specialist-search">

          <input
            type="text"
            placeholder="Search by doctor name, specialty or country..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={selectedSpecialty}
            onChange={(e) =>
              setSelectedSpecialty(
                e.target.value
              )
            }
          >
            <option value="">
              All Specialties
            </option>

            <option>
              General Physician
            </option>

            <option>
              Cardiologist
            </option>

            <option>
              Dermatologist
            </option>

            <option>
              Neurologist
            </option>

            <option>
              Psychiatrist
            </option>

            <option>
              Orthopedic Specialist
            </option>

            <option>
              Gynecologist
            </option>

            <option>
              Pediatrician
            </option>

            <option>
              ENT Specialist
            </option>

            <option>
              Ophthalmologist
            </option>

          </select>

        </div>

        {/* Loading */}
        {loading && (
          <div className="doctor-card">

            <h3>
              Loading verified specialists...
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

        {/* No doctors */}
        {!loading &&
          !error &&
          filteredDoctors.length === 0 && (
            <div className="doctor-card">

              <div
                style={{
                  fontSize: "45px",
                  marginBottom: "10px",
                }}
              >
                🔍
              </div>

              <h2>
                No verified specialists found
              </h2>

              <p>
                Try another search or specialty.
              </p>

            </div>
          )}

        {/* Doctors */}
        {!loading &&
          !error &&
          filteredDoctors.length > 0 && (

            <div className="doctor-list">

              {filteredDoctors.map(
                (doctor) => (

                  <div
                    className="doctor-card"
                    key={doctor.doctorId}
                  >

                    <div className="doctor-photo">
                      👨‍⚕️
                    </div>

                    <div className="doctor-info">

                      <h2>
                        {doctor.fullName}
                      </h2>

                      <p className="doctor-specialty">
                        {doctor.specialty}
                      </p>

                      <p>
                        🎓{" "}
                        {doctor.experience || 0}{" "}
                        years experience
                      </p>

                      <p>
                        🌍{" "}
                        {doctor.country}
                      </p>

                      <p>
                        ✅ Verified MediConnect
                        Doctor
                      </p>

                     <button
  className="view-doctor-btn"
  onClick={() =>
    navigate(
      `/doctor-profile?id=${doctor.doctorId}`
    )
  }
>
  View Doctor
</button>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        {/* Safety */}
        <div className="safety-notice">

          <strong>
            ⚠️ Important:
          </strong>

          <p>
            Only doctors whose professional
            credentials have been verified by
            MediConnect are displayed here.
            MediConnect does not replace an
            in-person medical consultation.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Specialists;