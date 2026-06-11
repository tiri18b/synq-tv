const fs = require("fs");

const cssPath = "src/pages/TV.css";
let css = fs.readFileSync(cssPath, "utf8");

css += `

/* RESTORE TV LAYOUT AFTER HY320 SAFE AREA TEST */
.client-tv {
  padding: 0 !important;
  box-sizing: border-box !important;
}

.client-tv-content-side {
  padding-top: 4vh !important;
  padding-bottom: 8.5vh !important;
}

.client-tv-logo {
  width: clamp(185px, 15vw, 300px) !important;
  margin-bottom: 2.2vh !important;
}

.client-tv-welcome {
  margin-bottom: 2.3vh !important;
}

.client-tv-welcome h1 {
  font-size: clamp(44px, 4vw, 78px) !important;
}

.client-tv-welcome h2 {
  font-size: clamp(28px, 2.35vw, 46px) !important;
}

.client-tv-message-stack {
  min-height: 30vh !important;
  max-height: 33.5vh !important;
}

.client-tv-message-list {
  min-height: 21vh !important;
}

.client-tv-message-list article {
  min-height: 6.35vh !important;
}

.client-tv-feature-grid {
  bottom: 12vh !important;
}

.client-tv-feature-grid a {
  height: 15.5vh !important;
  min-height: 108px !important;
  max-height: 150px !important;
}

.client-tv-ticker {
  left: 3vw !important;
  right: 3vw !important;
  bottom: 1.1vh !important;
  height: 5.2vh !important;
  min-height: 42px !important;
}

.client-tv-home-button {
  right: 1.3vw !important;
  top: 1.5vh !important;
}
`;

fs.writeFileSync(cssPath, css, "utf8");

console.log("TV layout restored");
