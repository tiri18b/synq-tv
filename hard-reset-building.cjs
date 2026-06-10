const fs = require("fs");

let css = fs.readFileSync("src/App.css", "utf8");

css += `

/* HARD RESET BUILDING SIDE */
.tv-page {
  grid-template-columns: 58% 42% !important;
}

.tv-right {
  grid-column: 1 !important;
  position: relative !important;
  overflow: hidden !important;
  min-height: 100vh !important;
  background: transparent !important;
}

.tv-left {
  grid-column: 2 !important;
  position: relative !important;
  z-index: 10 !important;
}

.building-bg {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: absolute !important;
  inset: 0 auto auto 0 !important;
  width: 100% !important;
  height: 78vh !important;
  object-fit: cover !important;
  object-position: center left !important;
  z-index: 1 !important;
  mix-blend-mode: normal !important;
  filter: none !important;
  mask-image: none !important;
  -webkit-mask-image: none !important;
}

.tv-right::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 2 !important;
  pointer-events: none !important;
  background:
    linear-gradient(to left, #fbf7ff 0%, rgba(251,247,255,.88) 16%, rgba(251,247,255,.35) 40%, transparent 70%),
    linear-gradient(to bottom, transparent 0%, transparent 63%, rgba(251,247,255,.86) 80%, #fbf7ff 100%) !important;
}

.tv-right::after {
  display: none !important;
}
`;

fs.writeFileSync("src/App.css", css, "utf8");
console.log("Building image hard reset applied");
