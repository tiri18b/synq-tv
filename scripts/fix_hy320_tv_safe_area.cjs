const fs = require("fs");

const cssPath = "src/pages/TV.css";
let css = fs.readFileSync(cssPath, "utf8");

css += `

/* TV PROJECTOR SAFE AREA FOR HY320 AND OLDER STREAMERS */
.client-tv {
  padding: 1.2vh 1.2vw 2.4vh 1.2vw !important;
  box-sizing: border-box !important;
}

.client-tv-image-side,
.client-tv-content-side {
  border-radius: 0 !important;
}

.client-tv-content-side {
  padding-top: 3.2vh !important;
  padding-bottom: 11vh !important;
}

.client-tv-logo {
  width: clamp(165px, 13.5vw, 270px) !important;
  margin-bottom: 1.5vh !important;
}

.client-tv-welcome {
  margin-bottom: 1.5vh !important;
}

.client-tv-welcome h1 {
  font-size: clamp(34px, 3.4vw, 64px) !important;
}

.client-tv-welcome h2 {
  font-size: clamp(23px, 2vw, 38px) !important;
}

.client-tv-message-stack {
  min-height: 27vh !important;
  max-height: 30.5vh !important;
}

.client-tv-message-list {
  min-height: 18.5vh !important;
}

.client-tv-message-list article {
  min-height: 5.65vh !important;
}

.client-tv-feature-grid {
  bottom: 13.8vh !important;
}

.client-tv-feature-grid a {
  height: 13.8vh !important;
  min-height: 88px !important;
  max-height: 130px !important;
}

.client-tv-ticker {
  left: 4vw !important;
  right: 4vw !important;
  bottom: 2.7vh !important;
  height: 4.8vh !important;
  min-height: 38px !important;
}

.client-tv-ticker marquee {
  font-size: clamp(13px, 1vw, 19px) !important;
}

.client-tv-ticker b {
  font-size: clamp(14px, 1.1vw, 21px) !important;
}

.client-tv-home-button {
  right: 2.4vw !important;
  top: 2.4vh !important;
}
`;

fs.writeFileSync(cssPath, css, "utf8");

console.log("HY320 TV safe area applied");
