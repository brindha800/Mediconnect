import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

// --------------------------------------
// FIX LEAFLET MARKER ICON
// --------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// --------------------------------------
// SAMPLE CLINICS
// --------------------------------------
// These are prototype/demo locations.
// Later we can replace them with real
// verified clinic/hospital data.

const clinics = [
  {
    id: 1,
    name: "City Care Hospital",
    type: "Multi-Specialty Hospital",
    specialty: "Emergency & General Care",
    lat: 11.0168,
    lng: 76.9558,
  },

  {
    id: 2,
    name: "MediCare Clinic",
    type: "Medical Clinic",
    specialty: "General Physician",
    lat: 11.025,
    lng: 76.97,
  },

  {
    id: 3,
    name: "Apollo Clinic",
    type: "Multi-Specialty Clinic",
    specialty: "Multi-Specialty Care",
    lat: 11.01,
    lng: 76.96,
  },
];

// --------------------------------------
// MOVE MAP WHEN USER LOCATION CHANGES
// --------------------------------------

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return null;
}

// --------------------------------------
// MAIN COMPONENT
// --------------------------------------

function NearbyClinics() {
  const navigate = useNavigate();

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(true);

  // Coimbatore fallback location
  const defaultLocation = [11.0168, 76.9558];

  // --------------------------------------
  // GET USER LOCATION
  // --------------------------------------

  const getLocation = () => {
    setLocationError("");
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationError(
        "Location is not supported by this browser. Showing demo clinic locations."
      );

      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);

        setLocationLoading(false);
      },

      () => {
        setLocationError(
          "Location permission was not given. Showing nearby clinics in Coimbatore."
        );

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // --------------------------------------
  // GET LOCATION WHEN PAGE OPENS
  // --------------------------------------

  useEffect(() => {
    getLocation();
  }, []);

  // --------------------------------------
  // MAP POSITION
  // --------------------------------------

  const mapPosition = userLocation || defaultLocation;

  // --------------------------------------
  // GOOGLE MAPS DIRECTIONS
  // --------------------------------------

  const getDirections = (clinic) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`;

    window.open(url, "_blank");
  };

  // --------------------------------------
  // UI
  // --------------------------------------

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}
      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          🏥 MediConnect
        </div>

        <button
          className="logout-btn"
          onClick={() => navigate("/patient-dashboard")}
        >
          ← Dashboard
        </button>

      </nav>

      {/* MAIN CONTENT */}
      <main className="specialist-page">

        {/* HEADER */}
        <div className="specialist-header">

          <h1>
            Nearby Clinics & Hospitals 🏥
          </h1>

          <p>
            Find nearby clinics and hospitals when you need
            prompt in-person medical care.
          </p>

          {/* URGENT NOTICE */}
          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "10px",
            }}
          >
            <strong
              style={{
                color: "#9a3412",
                fontSize: "17px",
              }}
            >
              ⚠️ Prompt Medical Attention
            </strong>

            <p
              style={{
                marginTop: "8px",
                color: "#7c2d12",
              }}
            >
              Based on the information you provided, consider
              seeking prompt in-person medical attention at a
              nearby clinic or hospital.
            </p>

            <p
              style={{
                marginTop: "8px",
                color: "#7c2d12",
                fontSize: "14px",
              }}
            >
              If you are experiencing a life-threatening emergency,
              contact your local emergency service immediately.
            </p>
          </div>

        </div>

        {/* LOCATION STATUS */}
        {locationLoading && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "10px",
              color: "#1e40af",
            }}
          >
            📍 Getting your location...
          </div>
        )}

        {/* LOCATION ERROR */}
        {locationError && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "10px",
              color: "#9a3412",
            }}
          >
            {locationError}
          </div>
        )}

        {/* LOCATION BUTTON */}
        <button
          className="secondary-btn"
          onClick={getLocation}
          style={{
            marginTop: "20px",
          }}
        >
          📍 Use My Current Location
        </button>

        {/* MAP */}
        <div
          style={{
            marginTop: "25px",
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >

          <MapContainer
            center={mapPosition}
            zoom={13}
            style={{
              height: "500px",
              width: "100%",
            }}
          >

            {/* OPENSTREETMAP */}
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* MOVE MAP TO USER */}
            <MapCenter position={userLocation} />

            {/* USER LOCATION */}
            {userLocation && (
              <Marker position={userLocation}>

                <Popup>
                  <strong>
                    📍 Your Location
                  </strong>

                  <br />

                  Your current location
                </Popup>

              </Marker>
            )}

            {/* CLINIC MARKERS */}
            {clinics.map((clinic) => (
              <Marker
                key={clinic.id}
                position={[
                  clinic.lat,
                  clinic.lng,
                ]}
              >

                <Popup>

                  <strong>
                    🏥 {clinic.name}
                  </strong>

                  <br />

                  {clinic.type}

                  <br />

                  <strong>
                    Specialty:
                  </strong>{" "}
                  {clinic.specialty}

                  <br />
                  <br />

                  <button
                    onClick={() => getDirections(clinic)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#2563eb",
                      cursor: "pointer",
                      padding: "0",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    📍 Get Directions →
                  </button>

                </Popup>

              </Marker>
            ))}

          </MapContainer>

        </div>

        {/* CLINIC LIST */}
        <h2
          style={{
            marginTop: "30px",
            marginBottom: "18px",
          }}
        >
          Nearby Clinics & Hospitals
        </h2>

        <div className="doctor-list">

          {clinics.map((clinic) => (
            <div
              className="doctor-card"
              key={clinic.id}
            >

              <h2>
                🏥 {clinic.name}
              </h2>

              <p>
                <strong>
                  Type:
                </strong>{" "}
                {clinic.type}
              </p>

              <p>
                <strong>
                  Specialty:
                </strong>{" "}
                {clinic.specialty}
              </p>

              <button
                className="view-doctor-btn"
                onClick={() => getDirections(clinic)}
              >
                📍 Get Directions
              </button>

            </div>
          ))}

        </div>

        {/* SAFETY NOTICE */}
        <div
          className="safety-notice"
          style={{
            marginTop: "30px",
          }}
        >

          <strong>
            ⚠️ Important:
          </strong>

          <p>
            MediConnect is not an emergency service and does not
            replace professional medical care. The clinic locations
            shown in this prototype are sample locations and should
            be replaced with verified real-world healthcare facilities
            before deployment.
          </p>

        </div>

        {/* BACK BUTTON */}
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

export default NearbyClinics;