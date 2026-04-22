import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Applications from "./pages/applications/Applications.jsx";
import ApplicationForm from "./pages/applications/ApplicationForm.jsx";
import Analytics from "./pages/analytics/Analytics.jsx";
import InterviewCoach from "./pages/interview/InterviewCoach.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/add"        element={<ApplicationForm />} />
                <Route path="/applications/edit/:id"   element={<ApplicationForm />} />
                <Route path="/analytics"              element={<Analytics />} />
                <Route path="/applications/coach/:id" element={<InterviewCoach />} />
            </Routes>
        </BrowserRouter>
    )
}