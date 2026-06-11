const fs = require("fs");

const tvPath = "src/pages/TV.jsx";
const tvCssPath = "src/pages/TV.css";
const featurePath = "src/pages/FeaturePage.jsx";
const featureCssPath = "src/pages/FeaturePage.css";

function replaceInFile(path, replacements) {
  if (!fs.existsSync(path)) return;

  let content = fs.readFileSync(path, "utf8");

  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to);
  }

  fs.writeFileSync(path, content, "utf8");
}

replaceInFile(tvPath, [
  ["למעונות סטונדטים", "למעונות הסטודנטים"],
  ["למעונות סטודנטים", "למעונות הסטודנטים"],
]);

replaceInFile(featurePath, [
  ["למעונות סטונדטים", "למעונות הסטודנטים"],
  ["למעונות סטודנטים", "למעונות הסטודנטים"],
]);

let tvCss = fs.existsSync(tvCssPath) ? fs.readFileSync(tvCssPath, "utf8") : "";

tvCss += `

/* FIX TV MESSAGES PANEL CUTTING AT BOTTOM */
.client-tv-content-side {
  padding-top: 4vh !important;
  padding-bottom: 8.5vh !important;
  gap: 0 !important;
}

.client-tv-logo {
  margin-bottom: 2.2vh !important;
}

.client-tv-welcome {
  margin-bottom: 2.3vh !important;
}

.client-tv-message-stack {
  width: 94% !important;
  min-height: 30vh !important;
  max-height: 33.5vh !important;
  overflow: hidden !important;
}

.client-tv-message-stack header {
  padding: .85vh 1.5vw !important;
}

.client-tv-message-list {
  min-height: 21vh !important;
  padding: .75vh .9vw !important;
  gap: .45vh !important;
}

.client-tv-message-list article {
  min-height: 6.35vh !important;
  padding: .55vh .75vw !important;
}

.message-icon {
  width: 38px !important;
  height: 38px !important;
  font-size: 20px !important;
}

.message-content h3 {
  font-size: clamp(16px, 1.08vw, 23px) !important;
  margin-bottom: .25vh !important;
}

.message-content p {
  font-size: clamp(12px, .78vw, 16px) !important;
  line-height: 1.25 !important;
}

.client-tv-message-list button {
  padding: 8px 8px !important;
  font-size: 13px !important;
}

.client-tv-message-stack footer {
  height: 2.8vh !important;
  min-height: 24px !important;
}

.client-tv-message-stack footer span {
  width: 8px !important;
  height: 8px !important;
}

.client-tv-message-stack footer span.active {
  width: 24px !important;
}

@media (max-height: 800px) {
  .client-tv-content-side {
    padding-top: 3vh !important;
    padding-bottom: 8vh !important;
  }

  .client-tv-logo {
    width: clamp(155px, 13vw, 245px) !important;
    margin-bottom: 1.6vh !important;
  }

  .client-tv-welcome {
    margin-bottom: 1.6vh !important;
  }

  .client-tv-message-stack {
    min-height: 28.5vh !important;
    max-height: 31.5vh !important;
  }

  .client-tv-message-list {
    min-height: 19.5vh !important;
  }

  .client-tv-message-list article {
    min-height: 5.9vh !important;
  }
}
`;

fs.writeFileSync(tvCssPath, tvCss, "utf8");

let featureCss = fs.existsSync(featureCssPath) ? fs.readFileSync(featureCssPath, "utf8") : "";

featureCss += `

/* KEEP FEATURE PAGES INSIDE SCREEN */
.feature-content-side {
  padding-top: 3.4vh !important;
  padding-bottom: 8.5vh !important;
}

.feature-logo {
  margin-bottom: 1.6vh !important;
}

.feature-hero-card {
  margin-bottom: 1vh !important;
}

.feature-actions {
  margin-bottom: 1vh !important;
}

.feature-examples {
  margin-bottom: 1vh !important;
}

.feature-back-button {
  height: 5vh !important;
  min-height: 38px !important;
}
`;

fs.writeFileSync(featureCssPath, featureCss, "utf8");

console.log("Fixed messages panel height and changed wording to: למעונות הסטודנטים");
