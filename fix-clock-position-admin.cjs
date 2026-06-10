const fs = require("fs");

let tv = fs.readFileSync("src/pages/TV.jsx", "utf8");
let admin = fs.readFileSync("src/pages/Admin.jsx", "utf8");
let css = fs.readFileSync("src/App.css", "utf8");

/* TV: connect live info position to Supabase setting */
tv = tv.replace(
  /<section className="client-tv-live-info">/g,
  `<section className={"client-tv-live-info clock-" + (settings.clock_position || "center")}>`
);

fs.writeFileSync("src/pages/TV.jsx", tv, "utf8");

/* Admin: add clockPosition state if missing */
if (!admin.includes("clockPosition")) {
  admin = admin.replace(
    `const [weatherLon, setWeatherLon] = useState("34.9896");`,
    `const [weatherLon, setWeatherLon] = useState("34.9896");
  const [clockPosition, setClockPosition] = useState("center");`
  );

  admin = admin.replace(
    `setWeatherLon(obj.weather_lon || "34.9896");`,
    `setWeatherLon(obj.weather_lon || "34.9896");
      setClockPosition(obj.clock_position || "center");`
  );

  admin = admin.replace(
    `{ key: "weather_lon", value: weatherLon },`,
    `{ key: "weather_lon", value: weatherLon },
        { key: "clock_position", value: clockPosition },`
  );
}

/* Admin: add select control in settings page */
if (!admin.includes("מיקום שעה ותאריך במסך TV")) {
  admin = admin.replace(
    `<button onClick={saveWeather}>שמירת מזג אוויר</button>`,
    `<label className="admin-field-label">מיקום שעה ותאריך במסך TV</label>
            <select value={clockPosition} onChange={(e) => setClockPosition(e.target.value)}>
              <option value="left">שמאל למעלה</option>
              <option value="center">אמצע למעלה</option>
              <option value="right">ימין למעלה</option>
              <option value="bottom">למטה במרכז</option>
            </select>

            <button onClick={saveWeather}>שמירת הגדרות</button>`
  );

  admin = admin.replace(
    `<button onClick={saveWeather}>שמירת הגדרות</button>`,
    `<button onClick={saveWeather}>שמירת הגדרות</button>`
  );
}

fs.writeFileSync("src/pages/Admin.jsx", admin, "utf8");

/* CSS: force clock positions to work on the whole screen */
css += `

/* CLOCK POSITION FROM ADMIN */
.client-tv-live-info {
  position: fixed !important;
  z-index: 999 !important;
  min-width: 230px !important;
  direction: rtl !important;
  color: #4c267f !important;
}

.client-tv-live-info.clock-left {
  top: 5vh !important;
  left: 3vw !important;
  right: auto !important;
  bottom: auto !important;
  transform: none !important;
  text-align: right !important;
}

.client-tv-live-info.clock-center {
  top: 5vh !important;
  left: 50% !important;
  right: auto !important;
  bottom: auto !important;
  transform: translateX(-50%) !important;
  text-align: center !important;
}

.client-tv-live-info.clock-right {
  top: 5vh !important;
  right: 3vw !important;
  left: auto !important;
  bottom: auto !important;
  transform: none !important;
  text-align: right !important;
}

.client-tv-live-info.clock-bottom {
  top: auto !important;
  bottom: 18vh !important;
  left: 50% !important;
  right: auto !important;
  transform: translateX(-50%) !important;
  text-align: center !important;
}

.admin-field-label {
  font-weight: 900 !important;
  color: #4c267f !important;
}
`;

fs.writeFileSync("src/App.css", css, "utf8");

console.log("Clock position control fixed");
