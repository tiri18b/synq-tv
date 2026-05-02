import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TV from "./pages/TV.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tv" element={<TV />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/"
          element={
            <div className="home">
              <div className="brand">
                <h1>SYNQ</h1>
                <p>By Shbiro</p>
              </div>

              <h2>מערכת הודעות דיגיטלית למעון סטודנטים</h2>

              <div className="home-buttons">
                <Link to="/tv">מסך TV</Link>
                <Link to="/login">כניסת מנהל</Link>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
