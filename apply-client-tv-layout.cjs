const fs = require("fs");

let tv = fs.readFileSync("src/pages/TV.jsx", "utf8");

tv = tv.replace(
`<section className="weather-clock">
          <strong>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</strong>
          <span>{now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</span>
          <strong>{weather ? Math.round(Number(weather.temperature)) + "°" : "--"}</strong>
          <span>{settings.weather_city || "חיפה"}</span>
        </section>`,
`<section className="center-info">
          <div className="center-time">
            {now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="center-date">
            {now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <div className="center-weather">
            {weather ? Math.round(Number(weather.temperature)) + "°" : "--"}
          </div>
          <div className="center-city">
            {settings.weather_city || "חיפה"}
          </div>
        </section>`
);

fs.writeFileSync("src/pages/TV.jsx", tv, "utf8");

let css = fs.readFileSync("src/App.css", "utf8");

css += `

/* EXACT SYNQ CLIENT LAYOUT LIKE MOCKUP */

.tv-page {
  grid-template-columns: 58% 42% !important;
  background: #fbf7ff !important;
}

.tv-left {
  grid-column: 2 !important;
  padding: 5vh 4vw 10vh 2vw !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 4vh !important;
}

.tv-right {
  grid-column: 1 !important;
}

.tv-logo {
  width: 20vw !important;
  max-width: 360px !important;
  min-width: 260px !important;
  margin: 0 auto !important;
  align-self: center !important;
}

.welcome {
  margin-top: 1vh !important;
}

.welcome h1 {
  font-size: clamp(46px, 4vw, 76px) !important;
}

.welcome h2 {
  font-size: clamp(30px, 2.4vw, 46px) !important;
}

.notice-panel {
  width: 88% !important;
  max-height: 34vh !important;
  margin-top: 1vh !important;
}

.building-bg {
  width: 100% !important;
  height: 78vh !important;
  right: auto !important;
  left: 0 !important;
  object-position: center left !important;
}

.tv-right::before {
  background:
    linear-gradient(to left, #fbf7ff 0%, rgba(251,247,255,.86) 10%, rgba(251,247,255,.24) 34%, transparent 62%),
    linear-gradient(to bottom, transparent 0%, transparent 62%, rgba(251,247,255,.88) 80%, #fbf7ff 100%) !important;
}

.tv-right::after {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 3 !important;
  background:
    radial-gradient(circle at 95% 45%, rgba(251,247,255,.95), transparent 26%),
    radial-gradient(circle at 78% 76%, rgba(251,247,255,.9), transparent 24%) !important;
  pointer-events: none !important;
}

.center-info {
  position: absolute !important;
  top: 5vh !important;
  right: 50% !important;
  transform: translateX(50%) !important;
  z-index: 10 !important;
  text-align: center !important;
  direction: rtl !important;
  color: #4c267f !important;
}

.center-time {
  font-size: clamp(34px, 3.2vw, 60px) !important;
  font-weight: 900 !important;
  line-height: 1 !important;
}

.center-date {
  margin-top: 1vh !important;
  font-size: clamp(16px, 1.15vw, 22px) !important;
  font-weight: 900 !important;
  color: #241b35 !important;
}

.center-weather {
  margin-top: 2vh !important;
  font-size: clamp(34px, 3.2vw, 60px) !important;
  font-weight: 900 !important;
  line-height: 1 !important;
}

.center-city {
  margin-top: .8vh !important;
  font-size: clamp(16px, 1.15vw, 22px) !important;
  font-weight: 900 !important;
  color: #241b35 !important;
}

.feature-grid {
  grid-column: 1 !important;
  right: auto !important;
  left: 3vw !important;
  width: 50vw !important;
  bottom: 10vh !important;
  grid-template-columns: repeat(6, 1fr) !important;
  z-index: 12 !important;
}

.feature-grid a {
  height: 15.5vh !important;
  min-height: 108px !important;
}

.ticker {
  left: 3vw !important;
  right: 3vw !important;
  bottom: 2vh !important;
  grid-template-columns: 1fr 120px !important;
}

.ticker b {
  grid-column: 2 !important;
}

.ticker marquee {
  grid-column: 1 !important;
  grid-row: 1 !important;
}
`;

fs.writeFileSync("src/App.css", css, "utf8");

console.log("TV layout changed to match client mockup");
