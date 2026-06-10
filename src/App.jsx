import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TV from "./pages/TV.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import FeaturePage from "./pages/FeaturePage.jsx";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tv" replace />} />
        <Route path="/tv" element={<TV />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feature/:type" element={<FeaturePage />} />
      </Routes>
    </BrowserRouter>
  );
}
