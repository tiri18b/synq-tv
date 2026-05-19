const fs = require("fs");
let file = fs.readFileSync("src/pages/Admin.jsx", "utf8");

file = file.replace(
/const saveWeatherSettings = async \(\) => \{[\s\S]*?\n  \};/,
`const saveWeatherSettings = async () => {
    const rows = [
      { key: "weather_city", value: weatherCity },
      { key: "weather_lat", value: weatherLat },
      { key: "weather_lon", value: weatherLon },
    ];

    const { error } = await supabase
      .from("app_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      console.log("Settings save error:", error);
      alert("שגיאה בשמירת מיקום מזג האוויר");
      return;
    }

    alert("מיקום מזג האוויר נשמר בהצלחה");
    await loadSettings();
  };`
);

fs.writeFileSync("src/pages/Admin.jsx", file, "utf8");
console.log("Weather save replaced with upsert");
