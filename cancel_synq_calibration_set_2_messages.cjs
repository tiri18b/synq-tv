const fs = require("fs");

const tvPath = "src/pages/TV.jsx";
const tvCssPath = "src/pages/TV.css";
const adminCssPath = "src/styles/app.css";
const adminPath = "src/pages/Admin.jsx";

if (!fs.existsSync(tvPath)) {
  throw new Error("TV.jsx not found");
}

let tv = fs.readFileSync(tvPath, "utf8");

/*
  1. Cancel TV calibration UI and calibration wrapper.
  2. Return TV render to the normal .client-tv screen.
  3. Change messages carousel from 3 messages per slide to 2 messages per slide.
*/

// 2 messages per slide instead of 3
tv = tv.replace(/for \(let i = 0; i < messages\.length; i \+= 3\)/g, "for (let i = 0; i < messages.length; i += 2)");
tv = tv.replace(/messages\.slice\(i, i \+ 3\)/g, "messages.slice(i, i + 2)");

// Remove calibration button from TV
tv = tv.replace(
  /\s*<button type="button" className="client-tv-calibration-button" onClick=\{openCalibrationPrompt\}>[\s\S]*?<\/button>/g,
  ""
);

// Remove room badge from TV
tv = tv.replace(
  /\s*<div className="client-tv-room-badge">[\s\S]*?<\/div>/g,
  ""
);

// Remove calibration shell wrapper if it exists
tv = tv.replace(
  /return \(\s*<main className="client-tv-shell" style=\{stageStyle\}>\s*<section className="client-tv-stage">\s*<main className="client-tv">/g,
  'return (\n    <main className="client-tv">'
);

tv = tv.replace(
  /\s*<\/main>\s*<\/section>\s*<\/main>\s*\);\s*}\s*$/g,
  "\n    </main>\n  );\n}\n"
);

// Remove unused auto calibration prompt function if present
tv = tv.replace(
  /\s*const autoCalibrateTv = \(\) => \{[\s\S]*?alert\("כיול אוטומטי בוצע למסך זה"\);\s*};/g,
  ""
);

tv = tv.replace(
  /\s*const openCalibrationPrompt = \(\) => \{[\s\S]*?autoCalibrateTv\(\);\s*};/g,
  ""
);

// Keep room/calibration state harmless if still present, but stop visible calibration from affecting layout
tv = tv.replace(
  /const stageStyle = \{[\s\S]*?\};/g,
  "const stageStyle = {};"
);

fs.writeFileSync(tvPath, tv, "utf8");

// CSS cleanup and message block sizing for 2 messages
let tvCss = fs.existsSync(tvCssPath) ? fs.readFileSync(tvCssPath, "utf8") : "";

tvCss += `

/* CANCEL TV CALIBRATION AND SET MESSAGE CAROUSEL TO 2 ITEMS */
.client-tv-shell,
.client-tv-stage {
  width: 100vw !important;
  height: 100vh !important;
  transform: none !important;
  overflow: hidden !important;
}

.client-tv-calibration-button,
.client-tv-room-badge {
  display: none !important;
}

.client-tv-message-stack {
  min-height: 28vh !important;
  max-height: 31vh !important;
  overflow: hidden !important;
}

.client-tv-message-list {
  min-height: 18vh !important;
  padding: .8vh .9vw !important;
  gap: .75vh !important;
}

.client-tv-message-list article {
  min-height: 7.4vh !important;
  max-height: 8.6vh !important;
  padding: .7vh .8vw !important;
}

.message-icon {
  width: 40px !important;
  height: 40px !important;
  font-size: 21px !important;
}

.message-content h3 {
  margin: 0 0 .25vh !important;
  font-size: clamp(17px, 1.15vw, 24px) !important;
  line-height: 1.05 !important;
}

.message-content p {
  margin: 0 !important;
  font-size: clamp(12px, .82vw, 17px) !important;
  line-height: 1.22 !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}

.client-tv-message-stack footer {
  height: 2.6vh !important;
  min-height: 22px !important;
}

.client-tv-feature-grid {
  bottom: 12vh !important;
}

.client-tv-ticker {
  bottom: 1.1vh !important;
}
`;

fs.writeFileSync(tvCssPath, tvCss, "utf8");

// Hide Admin calibration block and remove future calibration wording from visible admin text
if (fs.existsSync(adminPath)) {
  let admin = fs.readFileSync(adminPath, "utf8");

  admin = admin.replaceAll(
    "כאן מנהלים את מיקום השעה, התאריך ומזג האוויר, את ההודעות הנעוצות, ואת כיול התצוגה המתקדם לפי מספר חדר. בעתיד הכיול יעבור לזיהוי לפי Streamer ID ב Database.",
    "כאן מנהלים את מיקום השעה, התאריך ומזג האוויר ואת ההודעות הנעוצות במסך TV."
  );

  admin = admin.replaceAll(
    "כאן מנהלים את מיקום השעה, התאריך ומזג האוויר, את ההודעות הנעוצות, ואת כיול התצוגה לפי מספר חדר.",
    "כאן מנהלים את מיקום השעה, התאריך ומזג האוויר ואת ההודעות הנעוצות במסך TV."
  );

  fs.writeFileSync(adminPath, admin, "utf8");
}

if (fs.existsSync(adminCssPath)) {
  let adminCss = fs.readFileSync(adminCssPath, "utf8");

  adminCss += `

/* CANCEL ADMIN TV CALIBRATION UI */
.screen-calibration-card,
.calibration-room-row,
.calibration-grid,
.calibration-actions {
  display: none !important;
}
`;

  fs.writeFileSync(adminCssPath, adminCss, "utf8");
}

console.log("Calibration disabled and TV messages carousel changed to 2 messages per slide");
