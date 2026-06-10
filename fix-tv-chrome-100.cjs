const fs = require("fs");

let tv = fs.readFileSync("src/pages/TV.jsx", "utf8");

tv = tv.replaceAll("געתם הביתה", "הגעתם הביתה");

fs.writeFileSync("src/pages/TV.jsx", tv, "utf8");

let css = fs.readFileSync("src/App.css", "utf8");

css += `

/* FINAL CHROME 100 PERCENT TV FIT */

html,
body,
#root {
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

body {
  overscroll-behavior: none !important;
}

.synq-showcase {
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  overflow: hidden !important;
  display: grid !important;
  grid-template-columns: 41% 59% !important;
  direction: ltr !important;
  background: #fbf7ff !important;
}

.showcase-left,
.showcase-right,
.notice-box,
.welcome-box,
.showcase-ticker,
.feature-tile {
  direction: rtl !important;
}

.showcase-left {
  grid-column: 1 !important;
  height: 100vh !important;
  padding: 3.2vh 2.8vw 10vh !important;
  box-sizing: border-box !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  z-index: 4 !important;
}

.showcase-right {
  grid-column: 2 !important;
  height: 100vh !important;
  padding: 2.5vh 2vw 10vh !important;
  box-sizing: border-box !important;
  position: relative !important;
  overflow: hidden !important;
}

.showcase-logo {
  width: 24vw !important;
  max-width: 430px !important;
  min-width: 250px !important;
  height: auto !important;
  object-fit: contain !important;
  align-self: flex-start !important;
  margin: 0 !important;
  z-index: 6 !important;
}

.welcome-box {
  margin-top: 0 !important;
  text-align: center !important;
}

.welcome-box h1 {
  font-size: clamp(46px, 4.4vw, 82px) !important;
  line-height: 1 !important;
  margin: 0 !important;
  color: #6d3caf !important;
  font-weight: 900 !important;
}

.welcome-box h2 {
  font-size: clamp(30px, 2.8vw, 54px) !important;
  line-height: 1.1 !important;
  margin: 1vh 0 0 !important;
  color: #241b35 !important;
  font-weight: 900 !important;
}

.notice-box {
  width: 96% !important;
  max-height: 38vh !important;
  overflow: hidden !important;
  background: rgba(255,255,255,0.92) !important;
  border-radius: 20px !important;
  box-shadow: 0 18px 45px rgba(95,53,145,0.16) !important;
}

.notice-title {
  font-size: clamp(22px, 1.65vw, 32px) !important;
  padding: 1.35vh 1.8vw !important;
}

.notice-item {
  grid-template-columns: 58px 1fr !important;
  padding: 1.15vh 1.7vw !important;
  gap: 12px !important;
}

.notice-icon {
  width: 46px !important;
  height: 46px !important;
  font-size: 22px !important;
}

.notice-item strong {
  font-size: clamp(18px, 1.25vw, 25px) !important;
}

.notice-item p {
  font-size: clamp(14px, 0.95vw, 19px) !important;
  line-height: 1.25 !important;
}

.building-image {
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  left: auto !important;
  width: 100% !important;
  height: 74vh !important;
  object-fit: cover !important;
  object-position: center right !important;
  opacity: 1 !important;
  z-index: 1 !important;
  filter: saturate(1.03) contrast(1.02) brightness(1.02) !important;
  mask-image:
    linear-gradient(to left, black 70%, rgba(0,0,0,.84) 82%, transparent 100%),
    linear-gradient(to bottom, black 68%, rgba(0,0,0,.55) 82%, transparent 100%) !important;
  -webkit-mask-image:
    linear-gradient(to left, black 70%, rgba(0,0,0,.84) 82%, transparent 100%),
    linear-gradient(to bottom, black 68%, rgba(0,0,0,.55) 82%, transparent 100%) !important;
}

.showcase-right::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 2 !important;
  background:
    linear-gradient(to right, #fbf7ff 0%, rgba(251,247,255,.82) 14%, rgba(251,247,255,.18) 36%, transparent 64%),
    linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(251,247,255,.88) 79%, #fbf7ff 100%) !important;
  pointer-events: none !important;
}

.showcase-right::after {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 3 !important;
  background:
    radial-gradient(circle at 22% 42%, rgba(251,247,255,.78), transparent 30%),
    radial-gradient(circle at 12% 75%, rgba(251,247,255,.95), transparent 22%) !important;
  pointer-events: none !important;
}

.top-info {
  top: 3vh !important;
  right: 3vw !important;
  left: auto !important;
  z-index: 6 !important;
  text-align: center !important;
}

.top-info strong {
  font-size: clamp(34px, 3.1vw, 58px) !important;
}

.top-info span {
  font-size: clamp(15px, 1.08vw, 21px) !important;
}

.tiles-row {
  position: absolute !important;
  right: 2vw !important;
  left: 2vw !important;
  bottom: 10vh !important;
  z-index: 7 !important;
  display: grid !important;
  grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
  gap: 1vw !important;
}

.feature-tile {
  height: 18vh !important;
  min-height: 125px !important;
  max-height: 170px !important;
  border-radius: 18px !important;
  background: rgba(255,255,255,.92) !important;
  box-shadow: 0 16px 34px rgba(95,53,145,.16) !important;
  font-size: clamp(30px, 2.5vw, 44px) !important;
}

.feature-tile span {
  font-size: clamp(15px, 1.05vw, 22px) !important;
}

.feature-tile small {
  font-size: clamp(12px, .82vw, 16px) !important;
}

.showcase-ticker {
  left: 3vw !important;
  right: 3vw !important;
  bottom: 2vh !important;
  height: 6.2vh !important;
  min-height: 52px !important;
  z-index: 20 !important;
}

.showcase-ticker b {
  font-size: clamp(18px, 1.5vw, 30px) !important;
}

.showcase-ticker marquee {
  font-size: clamp(18px, 1.35vw, 27px) !important;
  font-weight: 900 !important;
}

@media (max-width: 1400px) {
  .synq-showcase {
    grid-template-columns: 42% 58% !important;
  }

  .notice-box {
    max-height: 36vh !important;
  }

  .feature-tile {
    height: 16vh !important;
  }
}
`;

fs.writeFileSync("src/App.css", css, "utf8");

console.log("Chrome 100 percent layout fixed");
