const fs = require("fs");

fs.writeFileSync("src/App.jsx", `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TV from "./pages/TV.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tv" element={<TV />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <div className="synq-home">
              <div className="synq-home-content">
                <img src="/synq-logo.png" alt="SYNQ" className="synq-home-logo" />

                <h1>מערכת הודעות דיגיטלית למעון סטודנטים</h1>

                <div className="synq-home-buttons">
                  <Link to="/tv">מסך TV</Link>
                  <Link to="/login">כניסת מנהל</Link>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
`, "utf8");

console.log("App home fixed");
