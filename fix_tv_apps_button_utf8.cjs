const fs = require("fs");

const tvPath = "src/pages/TV.jsx";

if (!fs.existsSync(tvPath)) {
  console.error("TV.jsx not found. Run this file from C:\\projects\\synq-notice-board");
  process.exit(1);
}

let tv = fs.readFileSync(tvPath, "utf8");

tv = tv.replace(/>\s*מסך הבית\s*</g, ">אפליקציות<");
tv = tv.replace(/>\s*×ž×¡×š ×”×‘×™×ª\s*</g, ">אפליקציות<");
tv = tv.replace(/>\s*××¡× ××××ª\s*</g, ">אפליקציות<");
tv = tv.replace(/>\s*אפליקציות\s*</g, ">אפליקציות<");

const buttonRegex = /(<button[^>]*className="client-tv-home-button"[^>]*>)([\s\S]*?)(<\/button>)/;

if (buttonRegex.test(tv)) {
  tv = tv.replace(buttonRegex, `$1
        אפליקציות
      $3`);
} else {
  console.warn("client-tv-home-button was not found. No button text changed.");
}

fs.writeFileSync(tvPath, tv, "utf8");

console.log("TV button text fixed to: אפליקציות");
