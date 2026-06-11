const fs = require("fs");

const adminPath = "src/pages/Admin.jsx";
const cssPaths = [
  "src/styles/app.css",
  "src/pages/TV.css",
];

if (!fs.existsSync(adminPath)) {
  throw new Error("src/pages/Admin.jsx not found");
}

let admin = fs.readFileSync(adminPath, "utf8");

/*
  Remove calibration UI from Admin:
  1. Hide/remove the calibration section JSX.
  2. Clean visible text that mentions calibration / Streamer ID.
  3. Keep all other settings untouched.
*/

// Remove full calibration section if it exists
admin = admin.replace(
  /\s*<section className="screen-calibration-card">[\s\S]*?<\/section>\s*(?=<section className="pinned-settings">)/g,
  "\n\n            "
);

// Clean settings helper text
admin = admin.replaceAll(
  "כאן מנהלים את מיקום השעה, התאריך ומזג האוויר, את ההודעות הנעוצות, ואת כיול התצוגה המתקדם לפי מספר חדר. בעתיד הכיול יעבור לזיהוי לפי Streamer ID ב Database.",
  "כאן מנהלים את מיקום השעה, התאריך ומזג האוויר ואת ההודעות הנעוצות במסך TV."
);

admin = admin.replaceAll(
  "כאן מנהלים את מיקום השעה, התאריך ומזג האוויר, את ההודעות הנעוצות, ואת כיול התצוגה לפי מספר חדר.",
  "כאן מנהלים את מיקום השעה, התאריך ומזג האוויר ואת ההודעות הנעוצות במסך TV."
);

// Clean dashboard calibration text if exists
admin = admin.replace(
  /\s*<article>\s*<b>כיול לפי חדר<\/b>[\s\S]*?<\/article>/g,
  ""
);

// Optional: remove state/functions related to calibration to avoid dead code warnings
admin = admin.replace(/\s*const defaultCalibration = \{[\s\S]*?\};/g, "");

admin = admin.replace(/\s*const \[calibrations, setCalibrations\] = useState\(\{\}\);/g, "");
admin = admin.replace(/\s*const \[calibrationRoom, setCalibrationRoom\] = useState\(""\);/g, "");
admin = admin.replace(/\s*const \[calibrationScale, setCalibrationScale\] = useState\("1"\);/g, "");
admin = admin.replace(/\s*const \[calibrationX, setCalibrationX\] = useState\("0"\);/g, "");
admin = admin.replace(/\s*const \[calibrationY, setCalibrationY\] = useState\("0"\);/g, "");
admin = admin.replace(/\s*const \[calibrationBottom, setCalibrationBottom\] = useState\("0"\);/g, "");

admin = admin.replace(/\s*const loadedCalibrations = parseJson\(obj\.tv_room_calibrations, \{\}\);/g, "");
admin = admin.replace(/\s*setCalibrations\(loadedCalibrations\);/g, "");

admin = admin.replace(
  /\s*\{ key: "tv_room_calibrations", value: JSON\.stringify\(calibrations\) \},/g,
  ""
);

admin = admin.replace(
  /\s*const loadRoomCalibration = \(\) => \{[\s\S]*?\n  \};\n\n  const saveRoomCalibration = async \(\) => \{[\s\S]*?\n  \};\n\n  const resetRoomCalibration = async \(\) => \{[\s\S]*?\n  \};/g,
  ""
);

admin = admin.replace(
  /\{Object\.keys\(calibrations\)\.length\}/g,
  "0"
);

admin = admin.replace(
  /<span>חדרים מכוילים<\/span>/g,
  "<span>הגדרות פעילות</span>"
);

fs.writeFileSync(adminPath, admin, "utf8");

// Hide any leftover calibration CSS just in case
for (const cssPath of cssPaths) {
  if (!fs.existsSync(cssPath)) continue;

  let css = fs.readFileSync(cssPath, "utf8");

  css += `

/* REMOVE ADMIN CALIBRATION UI */
.screen-calibration-card,
.calibration-room-row,
.calibration-grid,
.calibration-actions {
  display: none !important;
}
`;

  fs.writeFileSync(cssPath, css, "utf8");
}

console.log("Admin calibration UI removed");
