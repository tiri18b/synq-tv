const fs = require("fs");

fs.mkdirSync("src/pages", { recursive: true });

fs.writeFileSync("index.html", `<!doctype html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SYNQ By Shbiro</title>
    <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`, "utf8");

fs.writeFileSync("src/main.jsx", `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`, "utf8");

fs.writeFileSync("src/App.jsx", `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TV from "./pages/TV.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tv" element={<TV />} />
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
                <Link to="/admin">פאנל ניהול</Link>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
`, "utf8");

fs.writeFileSync("src/pages/TV.jsx", `export default function TV() {
  const today = new Date().toLocaleDateString("he-IL");

  return (
    <div className="tv-screen">
      <header className="tv-header">
        <div className="date-box">{today}</div>

        <div className="tv-logo">
          <h1>SYNQ</h1>
          <p>By Shbiro</p>
        </div>
      </header>

      <main className="tv-grid">
        <section className="hero-card">
          <div className="label">הודעה חמה</div>
          <h2>ברוכים הבאים למעון הסטודנטים SYNQ</h2>
          <p>
            כאן יוצגו הודעות חשובות, אירועים, עדכוני תחזוקה וחדשות לדיירים.
          </p>
        </section>

        <section className="side-card">
          <h3>אירועים קרובים</h3>
          <p>ערב סטודנטים בלובי המרכזי — יום רביעי בשעה 20:30</p>
        </section>

        <section className="side-card">
          <h3>עדכונים</h3>
          <p>חדר הכביסה בקומה 2 פעיל כרגיל.</p>
        </section>
      </main>

      <footer className="ticker">
        <span>
          SYNQ By Shbiro • עדכונים חמים • אירועים • תחזוקה • הודעות לדיירים
        </span>
      </footer>
    </div>
  );
}
`, "utf8");

fs.writeFileSync("src/pages/Admin.jsx", `export default function Admin() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>ניהול מסך SYNQ</h1>
          <p>פאנל לניהול הודעות, אירועים, חדשות ותמונות</p>
        </div>

        <div className="admin-brand">
          <strong>SYNQ</strong>
          <span>By Shbiro</span>
        </div>
      </div>

      <form className="admin-form">
        <label>
          כותרת ההודעה
          <input placeholder="לדוגמה: הפסקת מים היום" />
        </label>

        <label>
          תוכן ההודעה
          <textarea placeholder="כתוב כאן את תוכן ההודעה שיופיע במסך..." />
        </label>

        <label>
          סוג הודעה
          <select>
            <option>הודעה רגילה</option>
            <option>הודעה דחופה</option>
            <option>אירוע</option>
            <option>עדכון תחזוקה</option>
            <option>חדשות המעון</option>
          </select>
        </label>

        <div className="form-row">
          <label>
            תאריך התחלה
            <input type="date" />
          </label>

          <label>
            תאריך סיום
            <input type="date" />
          </label>
        </div>

        <label>
          תמונה לעדכון
          <input type="file" accept="image/*" />
        </label>

        <button type="button">שמור הודעה</button>
      </form>
    </div>
  );
}
`, "utf8");

fs.writeFileSync("src/App.css", `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Assistant", Arial, sans-serif;
  direction: rtl;
  background: #120018;
  color: #ffffff;
}

.home {
  min-height: 100vh;
  display: grid;
  place-content: center;
  text-align: center;
  padding: 40px;
  background:
    radial-gradient(circle at top left, rgba(255, 79, 216, 0.45), transparent 35%),
    radial-gradient(circle at bottom right, rgba(123, 44, 255, 0.55), transparent 35%),
    #120018;
}

.brand h1,
.tv-logo h1 {
  font-size: 86px;
  margin: 0;
  letter-spacing: 6px;
}

.brand p,
.tv-logo p {
  margin: 0;
  color: #ff5bd7;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 3px;
}

.home h2 {
  margin-top: 28px;
  font-size: 34px;
}

.home-buttons {
  display: flex;
  gap: 18px;
  justify-content: center;
  margin-top: 35px;
}

.home-buttons a {
  color: white;
  text-decoration: none;
  background: linear-gradient(135deg, #7b2cff, #ff4fd8);
  padding: 16px 34px;
  border-radius: 999px;
  font-size: 20px;
  font-weight: 800;
}

.tv-screen {
  min-height: 100vh;
  padding: 34px 58px 90px;
  background:
    radial-gradient(circle at top left, rgba(255, 79, 216, 0.30), transparent 32%),
    radial-gradient(circle at bottom right, rgba(123, 44, 255, 0.60), transparent 38%),
    #100014;
  overflow: hidden;
}

.tv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.date-box {
  font-size: 34px;
  font-weight: 700;
  background: rgba(255,255,255,0.16);
  padding: 14px 30px;
  border-radius: 22px;
}

.tv-logo {
  text-align: center;
}

.tv-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-top: 50px;
}

.hero-card,
.side-card {
  background: rgba(255,255,255,0.11);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 34px;
  padding: 36px;
  box-shadow: 0 25px 70px rgba(0,0,0,0.35);
  backdrop-filter: blur(16px);
}

.hero-card {
  grid-column: 2;
  grid-row: 1 / span 2;
  min-height: 420px;
  display: grid;
  align-content: center;
  text-align: center;
}

.side-card {
  min-height: 220px;
  text-align: center;
}

.label,
.side-card h3 {
  color: #ff5bd7;
  font-size: 34px;
  font-weight: 800;
  margin-bottom: 22px;
}

.hero-card h2 {
  font-size: 54px;
  line-height: 1.15;
  margin: 0 0 24px;
}

.hero-card p,
.side-card p {
  font-size: 30px;
  line-height: 1.45;
  margin: 0;
  font-weight: 600;
}

.ticker {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  background: linear-gradient(90deg, #7b2cff, #ff4fd8);
  padding: 18px 60px;
  font-size: 30px;
  font-weight: 800;
  white-space: nowrap;
}

.admin-page {
  min-height: 100vh;
  padding: 44px;
  background: #f5f0ff;
  color: #18001f;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.admin-header h1 {
  margin: 0;
  color: #6d20d8;
  font-size: 42px;
}

.admin-header p {
  margin: 8px 0 0;
  font-size: 20px;
}

.admin-brand {
  text-align: center;
  color: #6d20d8;
}

.admin-brand strong {
  display: block;
  font-size: 36px;
  letter-spacing: 3px;
}

.admin-brand span {
  color: #ff4fd8;
  font-weight: 800;
}

.admin-form {
  max-width: 820px;
  display: grid;
  gap: 18px;
  background: white;
  padding: 32px;
  border-radius: 26px;
  box-shadow: 0 15px 45px rgba(0,0,0,0.13);
}

.admin-form label {
  display: grid;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
}

.admin-form input,
.admin-form textarea,
.admin-form select {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 15px;
  font-size: 18px;
  font-family: inherit;
}

.admin-form textarea {
  min-height: 130px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.admin-form button {
  border: none;
  background: linear-gradient(135deg, #7b2cff, #ff4fd8);
  color: white;
  font-size: 22px;
  font-weight: 800;
  padding: 17px;
  border-radius: 17px;
  cursor: pointer;
}
`, "utf8");

console.log("SYNQ project files rebuilt successfully");
