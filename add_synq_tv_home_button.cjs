const fs = require("fs");

const tvPath = "src/pages/TV.jsx";
const tvCssPath = "src/pages/TV.css";

let tv = fs.readFileSync(tvPath, "utf8");

if (!tv.includes("openOldHomeFromTv")) {
  tv = tv.replace(
    `export default function TV() {`,
    `export default function TV() {
  const openOldHomeFromTv = () => {
    if (window.SynqAndroid && typeof window.SynqAndroid.openOldHome === "function") {
      window.SynqAndroid.openOldHome();
      return;
    }

    alert("כפתור זה פעיל רק באפליקציית הסטרימר");
  };`
  );
}

if (!tv.includes("client-tv-home-button")) {
  tv = tv.replace(
    `      <footer className="client-tv-ticker">`,
    `      <button type="button" className="client-tv-home-button" onClick={openOldHomeFromTv}>
        מסך הבית
      </button>

      <footer className="client-tv-ticker">`
  );
}

fs.writeFileSync(tvPath, tv, "utf8");

let css = fs.existsSync(tvCssPath) ? fs.readFileSync(tvCssPath, "utf8") : "";

if (!css.includes("TV OLD HOME BUTTON")) {
  css += `

/* TV OLD HOME BUTTON */
.client-tv-home-button {
  position: fixed;
  left: 1.3vw;
  top: 1.5vh;
  z-index: 9999;
  border: none;
  border-radius: 999px;
  background: rgba(33, 22, 51, .72);
  color: white;
  padding: 10px 18px;
  font-family: Assistant, Arial, sans-serif;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  opacity: .78;
}

.client-tv-home-button:hover,
.client-tv-home-button:focus {
  opacity: 1;
  outline: 3px solid rgba(126, 75, 181, .35);
}

@media (max-width: 1100px) {
  .client-tv-home-button {
    font-size: 13px;
    padding: 9px 14px;
  }
}
`;
}

fs.writeFileSync(tvCssPath, css, "utf8");

console.log("Added TV old home button for Android WebView");
