const fs = require("fs");

const tvPath = "src/pages/TV.jsx";
const cssPath = "src/pages/TV.css";

let tv = fs.readFileSync(tvPath, "utf8");

// Return carousel to 3 messages per page
tv = tv.replace(/for \(let i = 0; i < messages\.length; i \+= 2\)/g, "for (let i = 0; i < messages.length; i += 3)");
tv = tv.replace(/messages\.slice\(i, i \+ 2\)/g, "messages.slice(i, i + 3)");

// Remove calibration button if exists
tv = tv.replace(/\s*<button type="button" className="client-tv-calibration-button"[\s\S]*?<\/button>/g, "");

// Remove calibration wrapper if exists
tv = tv.replace(
  /return \(\s*<main className="client-tv-shell" style=\{stageStyle\}>\s*<section className="client-tv-stage">\s*<main className="client-tv">/g,
  'return (\\n    <main className="client-tv">'
);

tv = tv.replace(
  /\s*<\/main>\s*<\/section>\s*<\/main>\s*\);\s*}\s*$/g,
  "\\n    </main>\\n  );\\n}\\n"
);

fs.writeFileSync(tvPath, tv, "utf8");

let css = fs.readFileSync(cssPath, "utf8");

css += `

/* RESTORE CLEAN TV MESSAGES, 3 PER SLIDE */
.client-tv-calibration-button,
.client-tv-room-badge {
  display: none !important;
}

.client-tv {
  padding: 0 !important;
}

.client-tv-message-stack {
  min-height: 30vh !important;
  max-height: 33.5vh !important;
  overflow: hidden !important;
}

.client-tv-message-list {
  min-height: 21vh !important;
  padding: .75vh .9vw !important;
  gap: .45vh !important;
}

.client-tv-message-list article {
  min-height: 6.35vh !important;
  max-height: 7.1vh !important;
  padding: .55vh .75vw !important;
}

.message-content p {
  display: -webkit-box !important;
  -webkit-line-clamp: 1 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}

.client-tv-feature-grid {
  bottom: 12vh !important;
}

.client-tv-ticker {
  bottom: 1.1vh !important;
}
`;

fs.writeFileSync(cssPath, css, "utf8");

console.log("TV restored to 3 messages per slide and calibration removed");
