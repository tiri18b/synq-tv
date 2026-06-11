const fs = require("fs");

const adminPath = "src/pages/Admin.jsx";
const cssPath = "src/styles/app.css";

if (!fs.existsSync(adminPath)) {
  throw new Error("src/pages/Admin.jsx not found");
}

let admin = fs.readFileSync(adminPath, "utf8");

// Add separated save functions inside component, before saveSettings
if (!admin.includes("const saveWeatherSettings = async () =>")) {
  admin = admin.replace(
    /  const saveSettings = async \(\) => \{/,
    `  const saveWeatherSettings = async () => {
    await supabase.from("app_settings").upsert(
      [
        { key: "weather_city", value: weatherCity },
        { key: "weather_lat", value: weatherLat },
        { key: "weather_lon", value: weatherLon },
      ],
      { onConflict: "key" }
    );

    alert("הגדרת מזג האוויר נשמרה");
  };

  const saveClockSettings = async () => {
    await supabase.from("app_settings").upsert(
      [
        { key: "clock_position", value: clockPosition },
      ],
      { onConflict: "key" }
    );

    alert("הגדרת מיקום השעה נשמרה");
  };

  const savePinnedSettings = async () => {
    await supabase.from("app_settings").upsert(
      [
        { key: "enabled_pinned_modules", value: JSON.stringify(enabledPinnedModules) },
      ],
      { onConflict: "key" }
    );

    alert("הגדרת הודעות נעוצות נשמרה");
  };

  const saveSettings = async () => {`
  );
}

// Replace weather dropdown area with inline save button
admin = admin.replace(
  /            <label>עיר למזג האוויר<\/label>\s*<select value=\{weatherCity\} onChange=\{\(e\) => updateWeatherCity\(e\.target\.value\)\}>[\s\S]*?<\/select>\s*\n\s*<p className="admin-helper">\s*בחירת העיר מסתנכרנת למסך ה TV דרך Supabase ומעדכנת את מזג האוויר לפי הרשת\.\s*<\/p>/,
  `            <div className="setting-save-row">
              <label>
                עיר למזג האוויר
                <select value={weatherCity} onChange={(e) => updateWeatherCity(e.target.value)}>
                  {israelWeatherCities.map((item) => (
                    <option key={item.city} value={item.city}>
                      {item.city}
                    </option>
                  ))}
                </select>
              </label>

              <button type="button" onClick={saveWeatherSettings}>
                שמור מזג אוויר
              </button>
            </div>

            <p className="admin-helper">
              בחירת העיר מסתנכרנת למסך ה TV דרך Supabase ומעדכנת את מזג האוויר לפי הרשת.
            </p>`
);

// Replace clock select with inline save button
admin = admin.replace(
  /            <label>מיקום שעה ותאריך במסך TV<\/label>\s*<select value=\{clockPosition\} onChange=\{\(e\) => setClockPosition\(e\.target\.value\)\}>[\s\S]*?<\/select>/,
  `            <div className="setting-save-row">
              <label>
                מיקום שעה ותאריך במסך TV
                <select value={clockPosition} onChange={(e) => setClockPosition(e.target.value)}>
                  <option value="left">שמאל למעלה</option>
                  <option value="center">אמצע למעלה</option>
                  <option value="right">ימין למעלה</option>
                  <option value="bottom">למטה במרכז</option>
                </select>
              </label>

              <button type="button" onClick={saveClockSettings}>
                שמור מיקום שעה
              </button>
            </div>`
);

// Insert pinned save button near pinned section title if not already exists
if (!admin.includes("שמור הודעות נעוצות")) {
  admin = admin.replace(
    /              <h3>הודעות נעוצות במסך TV<\/h3>/,
    `              <div className="setting-section-title-row">
                <h3>הודעות נעוצות במסך TV</h3>

                <button type="button" onClick={savePinnedSettings}>
                  שמור הודעות נעוצות
                </button>
              </div>`
  );
}

// Hide old general save button if it remains at bottom of settings
admin = admin.replace(
  /            <button onClick=\{saveSettings\}>שמירת הגדרות כלליות<\/button>/,
  `            <button className="settings-save-all-hidden" onClick={saveSettings}>שמירת הגדרות כלליות</button>`
);

fs.writeFileSync(adminPath, admin, "utf8");

// Add CSS
let css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";

css += `

/* SETTINGS INLINE SAVE BUTTONS */
.setting-save-row {
  display: grid;
  grid-template-columns: 1fr 190px;
  gap: 14px;
  align-items: end;
  margin-bottom: 14px;
}

.setting-save-row label {
  display: grid;
  gap: 8px;
  font-weight: 900;
  color: #4c267f;
}

.setting-save-row select,
.setting-save-row input {
  width: 100%;
}

.setting-save-row button,
.setting-section-title-row button {
  height: 46px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
}

.setting-section-title-row {
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 14px;
  align-items: center;
  margin-bottom: 10px;
}

.setting-section-title-row h3 {
  margin: 0;
}

.settings-save-all-hidden {
  display: none !important;
}

@media (max-width: 900px) {
  .setting-save-row,
  .setting-section-title-row {
    grid-template-columns: 1fr;
  }
}
`;

fs.writeFileSync(cssPath, css, "utf8");

console.log("Inline save buttons added for weather, clock and pinned settings");
