const fs = require("fs");
let file = fs.readFileSync("src/pages/TV.jsx", "utf8");

file = file.replace(
`const res = await fetch(
        \`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current=temperature_2m,weather_code&forecast_days=1\`
      );
      const data = await res.json();
      setWeather(data.current);`,
`const res = await fetch(
        \`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current_weather=true&timezone=Asia%2FJerusalem\`
      );
      const data = await res.json();
      setWeather(data.current_weather);`
);

file = file.replace(
`<strong>{weather ? Math.round(weather.temperature_2m) + "°" : "--"}</strong>`,
`<strong>{weather ? Math.round(weather.temperature) + "°" : "--"}</strong>`
);

fs.writeFileSync("src/pages/TV.jsx", file, "utf8");
console.log("Weather fixed");
