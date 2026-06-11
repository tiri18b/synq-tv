const fs = require("fs");

const cssPath = "src/pages/TV.css";

let css = fs.readFileSync(cssPath, "utf8");

css += `

/* MOVE APPS BUTTON TO FAR RIGHT */
.client-tv-home-button {
  left: auto !important;
  right: 1.3vw !important;
  top: 1.5vh !important;
}
`;

fs.writeFileSync(cssPath, css, "utf8");

console.log("Apps button moved to far right");
