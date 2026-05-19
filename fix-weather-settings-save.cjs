const fs = require("fs");
let file = fs.readFileSync("src/pages/Admin.jsx", "utf8");

file = file.replace(
/const saveWeatherSettings = async \(\) => \{[\s\S]*?\n  \};/,
`const saveWeatherSettings = async () => {
    const updates = [
      { key: "weather_city", value: weatherCity },
      { key: "weather_lat", value: weatherLat },
      { key: "weather_lon", value: weatherLon },
    ];

    for (const item of updates) {
      const { error } = await supabase
        .from("app_settings")
        .update({ value: item.value })
        .eq("key", item.key);

      if (error) {
        console.log("Settings update error:", error);
        alert("שגיאה בשמירת מזג אוויר");
        return;
      }
    }

    alert("הגדרות מזג האוויר עודכנו");
    loadSettings();
  };`
);

fs.writeFileSync("src/pages/Admin.jsx", file, "utf8");
console.log("Weather settings save fixed");
