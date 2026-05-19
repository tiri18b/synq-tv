const fs = require("fs");

fs.writeFileSync("src/App.jsx", `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TV from "./pages/TV.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";

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
              <img src="/synq-logo.png" className="home-logo" />
              <h1>מערכת הודעות דיגיטלית למעון סטודנטים</h1>

              <div className="home-actions">
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
`, "utf8");

console.log("App updated");
