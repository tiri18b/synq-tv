const fs = require("fs");
let file = fs.readFileSync("src/pages/TV.jsx", "utf8");

file = file.replace(
`current=temperature_2m,weather_code&forecast_days=1`,
`current=temperature_2m,weather_code&timezone=Asia%2FJerusalem&forecast_days=1`
);

file = file.replace(
`<div className="weather-icon">☀️☁️</div>
          <strong>{weather ? Math.round(weather.temperature_2m) + "°" : "--"}</strong>
          <b>מזג אוויר נוכחי</b>`,
`<div className="weather-icon">
            {weather?.weather_code < 3 ? "☀️" : weather?.weather_code < 50 ? "⛅" : weather?.weather_code < 70 ? "🌧️" : "☁️"}
          </div>
          <strong>{weather ? Math.round(weather.temperature_2m) + "°" : "--"}</strong>
          <b>מזג אוויר נוכחי</b>`
);

fs.writeFileSync("src/pages/TV.jsx", file, "utf8");
console.log("TV weather improved");
