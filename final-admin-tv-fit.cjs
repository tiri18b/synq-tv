const fs = require("fs");

let tv = fs.readFileSync("src/pages/TV.jsx", "utf8");
let admin = fs.readFileSync("src/pages/Admin.jsx", "utf8");
let css = fs.readFileSync("src/App.css", "utf8");

/* Add clock position setting to TV */
tv = tv.replace(
  `<section className="weather-clock">`,
  `<section className={"weather-clock clock-" + (settings.clock_position || "right")}>`
);

/* Add clock position controls to Admin settings */
admin = admin.replace(
  `const [weatherLon, setWeatherLon] = useState("34.9896");`,
  `const [weatherLon, setWeatherLon] = useState("34.9896");
  const [clockPosition, setClockPosition] = useState("right");`
);

admin = admin.replace(
  `setWeatherLon(obj.weather_lon || "34.9896");`,
  `setWeatherLon(obj.weather_lon || "34.9896");
      setClockPosition(obj.clock_position || "right");`
);

admin = admin.replace(
  `        { key: "weather_lon", value: weatherLon },
      ],`,
  `        { key: "weather_lon", value: weatherLon },
        { key: "clock_position", value: clockPosition },
      ],`
);

admin = admin.replace(
  `<button onClick={saveWeather}>שמירת מזג אוויר</button>`,
  `<label className="admin-label">מיקום שעון במסך TV</label>
            <select value={clockPosition} onChange={(e) => setClockPosition(e.target.value)}>
              <option value="right">ימין למעלה</option>
              <option value="center">אמצע למעלה</option>
              <option value="left">שמאל למעלה</option>
              <option value="bottom">למטה במרכז</option>
            </select>
            <button onClick={saveWeather}>שמירת הגדרות</button>`
);

/* Better demo pages */
admin = admin.replace(
  `<p>מודול אופציונלי להצגה עתידית ללקוח.</p>
            <div className="demo-grid">
              <article>פריט לדוגמה 1</article>
              <article>פריט לדוגמה 2</article>
              <article>פריט לדוגמה 3</article>
            </div>`,
  `<p className="demo-intro">
              מודול זה מוצג כרגע כדוגמה. ניתן להפוך אותו לפיתוח מלא לפי דרישת הלקוח,
              כולל ניהול מהדשבורד, הרשאות, התראות, סטטוסים ודוחות.
            </p>

            <div className="demo-grid detailed">
              <article>
                <b>ניהול תוכן</b>
                <span>הוספה, עריכה ומחיקה של פריטים מתוך מסך הניהול.</span>
              </article>
              <article>
                <b>התראות ועדכונים</b>
                <span>אפשרות לשליחת הודעות למסכים, לדיירים או לקומות מסוימות.</span>
              </article>
              <article>
                <b>סטטוס ומעקב</b>
                <span>מעקב אחר טיפול, אישור ביצוע, היסטוריה ודוחות.</span>
              </article>
              <article>
                <b>הרשאות משתמשים</b>
                <span>מנהל ראשי, מנהל קבלה, תחזוקה, הנהלה ודיירים.</span>
              </article>
              <article>
                <b>חיבור עתידי לאפליקציה</b>
                <span>אפשרות להרחבה לאפליקציית דיירים והתראות Push.</span>
              </article>
              <article>
                <b>מודול בתשלום</b>
                <span>כל מודול ניתן לפיתוח מלא לפי אפיון ותמחור נפרד.</span>
              </article>
            </div>`
);

fs.writeFileSync("src/pages/TV.jsx", tv, "utf8");
fs.writeFileSync("src/pages/Admin.jsx", admin, "utf8");

css += `

/* FINAL FIT ADMIN + TV TO CHROME 100% */

/* Admin fit */
.admin-page {
  grid-template-columns: 210px 1fr !important;
  height: 100vh !important;
  overflow: hidden !important;
}

.admin-page aside {
  padding: 12px 12px !important;
  gap: 5px !important;
  overflow: hidden !important;
}

.admin-page aside img {
  width: 118px !important;
  margin-bottom: 6px !important;
}

.admin-page aside button,
.admin-page aside a {
  padding: 9px 11px !important;
  font-size: 14px !important;
  line-height: 1.1 !important;
}

.logout-btn {
  margin-top: 6px !important;
  padding: 10px 11px !important;
}

.admin-content {
  padding: 18px !important;
  max-height: 100vh !important;
  overflow-y: auto !important;
}

.admin-content header h1 {
  font-size: 28px !important;
}

.admin-content header p {
  margin: 4px 0 0 !important;
}

.stats {
  gap: 12px !important;
  margin: 16px 0 !important;
}

.stats article,
.admin-card {
  padding: 16px !important;
  border-radius: 18px !important;
}

.stats b {
  font-size: 30px !important;
}

.admin-card iframe {
  height: 340px !important;
}

.demo-grid.detailed {
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 14px !important;
}

.demo-grid.detailed article {
  display: grid;
  gap: 8px;
  min-height: 120px;
}

.demo-grid.detailed b {
  color: #6d3caf;
  font-size: 18px;
}

.demo-grid.detailed span {
  font-size: 14px;
  line-height: 1.5;
}

.demo-intro {
  background: #fbf8ff;
  border: 1px solid #eadcf7;
  padding: 14px;
  border-radius: 14px;
  font-weight: 800;
}

.admin-label {
  font-weight: 900;
  color: #4c267f;
}

/* TV exact 100% fit */
.tv-page {
  grid-template-columns: 42% 58% !important;
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
}

.tv-left {
  padding: 2.2vh 2.4vw 9vh !important;
}

.tv-logo {
  width: 20vw !important;
  max-width: 360px !important;
  min-width: 230px !important;
  margin-left: 3.5vw !important;
  align-self: center !important;
}

.welcome h1 {
  font-size: clamp(42px, 4vw, 74px) !important;
}

.welcome h2 {
  font-size: clamp(28px, 2.55vw, 48px) !important;
}

.notice-panel {
  max-height: 36vh !important;
}

.notice-panel header {
  padding: 1.1vh 1.5vw !important;
  font-size: clamp(20px, 1.5vw, 29px) !important;
}

.notice-row {
  padding: .95vh 1.5vw !important;
}

.notice-row h3 {
  font-size: clamp(17px, 1.15vw, 23px) !important;
}

.notice-row p {
  font-size: clamp(13px, .9vw, 18px) !important;
}

.building-bg {
  height: 72vh !important;
  object-position: center right !important;
}

.feature-grid {
  bottom: 9vh !important;
  gap: .85vw !important;
}

.feature-grid a {
  height: 16.5vh !important;
  min-height: 112px !important;
  max-height: 150px !important;
}

.feature-grid b {
  font-size: clamp(14px, .98vw, 20px) !important;
}

.feature-grid small {
  font-size: clamp(11px, .75vw, 15px) !important;
}

.ticker {
  height: 5.7vh !important;
  min-height: 46px !important;
  bottom: 1.6vh !important;
}

/* Clock positions controlled from Admin */
.weather-clock.clock-right {
  top: 3vh !important;
  right: 3vw !important;
  left: auto !important;
  bottom: auto !important;
}

.weather-clock.clock-center {
  top: 3vh !important;
  right: 50% !important;
  transform: translateX(50%) !important;
  left: auto !important;
  bottom: auto !important;
}

.weather-clock.clock-left {
  top: 3vh !important;
  left: 3vw !important;
  right: auto !important;
  bottom: auto !important;
}

.weather-clock.clock-bottom {
  top: auto !important;
  bottom: 18vh !important;
  right: 50% !important;
  transform: translateX(50%) !important;
  left: auto !important;
}

.weather-clock strong {
  font-size: clamp(30px, 2.7vw, 52px) !important;
}

.weather-clock span {
  font-size: clamp(13px, .98vw, 19px) !important;
}

@media (max-height: 800px) {
  .admin-page aside button,
  .admin-page aside a {
    padding: 7px 10px !important;
    font-size: 13px !important;
  }

  .tv-logo {
    width: 18vw !important;
  }

  .notice-panel {
    max-height: 34vh !important;
  }

  .feature-grid a {
    height: 15vh !important;
    min-height: 100px !important;
  }
}
`;

fs.writeFileSync("src/App.css", css, "utf8");

console.log("Admin and TV final fit updated");
