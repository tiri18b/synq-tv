const fs = require("fs");
let file = fs.readFileSync("src/pages/TV.jsx", "utf8");

file = file.replace(
/const loadWeather = async \(lat, lon\) => \{[\s\S]*?\n  \};/,
`const loadWeather = async (lat, lon) => {
    if (!lat || !lon) {
      setWeather(null);
      return;
    }

    try {
      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        encodeURIComponent(lat) +
        "&longitude=" +
        encodeURIComponent(lon) +
        "&current_weather=true&timezone=Asia%2FJerusalem";

      const res = await fetch(url);
      const data = await res.json();

      if (data.current_weather) {
        setWeather({
          temperature: data.current_weather.temperature,
          code: data.current_weather.weathercode,
        });
      } else {
        setWeather(null);
      }
    } catch (err) {
      console.log("Weather error:", err);
      setWeather(null);
    }
  };`
);

file = file.replaceAll(
`Math.round(weather.temperature_2m) + "°"`,
`Math.round(weather.temperature) + "°"`
);

file = file.replaceAll(
`weather?.weather_code`,
`weather?.code`
);

fs.writeFileSync("src/pages/TV.jsx", file, "utf8");
console.log("Weather code fixed");
