import NearbyClinics from "./pages/NearbyClinics";
import DoctorProfile from "./pages/DoctorProfile";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
import PatientDashboard from "./pages/PatientDashboard";
import AskQuestion from "./pages/AskQuestion";
import Specialists from "./pages/Specialists";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorRegister from "./pages/DoctorRegister";
import DoctorDashboard from "./pages/DoctorDashboard";
import QuestionDetails from "./pages/QuestionDetails";
import Responses from "./pages/Responses";
import MyQuestions from "./pages/MyQuestions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
<Route path="/nearby-clinics" element={<NearbyClinics />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/patient-login"
          element={<PatientLogin />}
        />

        <Route
          path="/patient-register"
          element={<PatientRegister />}
        />
<Route
  path="/doctor-profile"
  element={<DoctorProfile />}
/>
        <Route
          path="/patient-dashboard"
          element={<PatientDashboard />}
        />

        <Route
          path="/ask-question"
          element={<AskQuestion />}
        />

        <Route
          path="/specialists"
          element={<Specialists />}
        />

        <Route
          path="/doctor-login"
          element={<DoctorLogin />}
        />

        <Route
          path="/doctor-register"
          element={<DoctorRegister />}
        />

        <Route
          path="/doctor-dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="/question-details"
          element={<QuestionDetails />}
        />

        <Route
          path="/responses"
          element={<Responses />}
        />

        <Route
          path="/my-questions"
          element={<MyQuestions />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;