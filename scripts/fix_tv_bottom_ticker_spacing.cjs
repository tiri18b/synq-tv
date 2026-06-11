const fs = require("fs");

const cssPath = "src/pages/TV.css";
let css = fs.readFileSync(cssPath, "utf8");

css += `

/* FIX BOTTOM TICKER TOUCHING MENU */
.client-tv-feature-grid {
  bottom: 12vh !important;
}

.client-tv-ticker {
  bottom: 1.1vh !important;
  height: 5.2vh !important;
  min-height: 42px !important;
}

.client-tv-ticker marquee {
  font-size: clamp(15px, 1.15vw, 22px) !important;
}

.client-tv-ticker b {
  font-size: clamp(16px, 1.25vw, 24px) !important;
}
`;

fs.writeFileSync(cssPath, css, "utf8");

console.log("TV bottom ticker spacing fixed");
