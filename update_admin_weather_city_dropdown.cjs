const fs = require("fs");

const adminPath = "src/pages/Admin.jsx";

if (!fs.existsSync(adminPath)) {
  throw new Error("src/pages/Admin.jsx not found");
}

let admin = fs.readFileSync(adminPath, "utf8");

const citiesBlock = `
const israelWeatherCities = [
  { city: "ירושלים", lat: "31.7683", lon: "35.2137" },
  { city: "תל אביב", lat: "32.0853", lon: "34.7818" },
  { city: "חיפה", lat: "32.7940", lon: "34.9896" },
  { city: "באר שבע", lat: "31.2520", lon: "34.7915" },
  { city: "אילת", lat: "29.5577", lon: "34.9519" },
  { city: "אשדוד", lat: "31.8044", lon: "34.6553" },
  { city: "אשקלון", lat: "31.6688", lon: "34.5743" },
  { city: "ראשון לציון", lat: "31.9730", lon: "34.7925" },
  { city: "פתח תקווה", lat: "32.0840", lon: "34.8878" },
  { city: "רמת גן", lat: "32.0684", lon: "34.8248" },
  { city: "גבעתיים", lat: "32.0723", lon: "34.8125" },
  { city: "בני ברק", lat: "32.0807", lon: "34.8338" },
  { city: "חולון", lat: "32.0158", lon: "34.7874" },
  { city: "בת ים", lat: "32.0132", lon: "34.7480" },
  { city: "הרצליה", lat: "32.1624", lon: "34.8447" },
  { city: "נתניה", lat: "32.3215", lon: "34.8532" },
  { city: "כפר סבא", lat: "32.1782", lon: "34.9076" },
  { city: "רעננה", lat: "32.1848", lon: "34.8713" },
  { city: "הוד השרון", lat: "32.1593", lon: "34.8932" },
  { city: "מודיעין מכבים רעות", lat: "31.8980", lon: "35.0104" },
  { city: "בית שמש", lat: "31.7450", lon: "34.9881" },
  { city: "רחובות", lat: "31.8948", lon: "34.8113" },
  { city: "נס ציונה", lat: "31.9293", lon: "34.7987" },
  { city: "יבנה", lat: "31.8781", lon: "34.7394" },
  { city: "קריית גת", lat: "31.6100", lon: "34.7642" },
  { city: "קריית מלאכי", lat: "31.7309", lon: "34.7466" },
  { city: "עפולה", lat: "32.6091", lon: "35.2892" },
  { city: "נצרת", lat: "32.6996", lon: "35.3035" },
  { city: "נוף הגליל", lat: "32.7089", lon: "35.3247" },
  { city: "מגדל העמק", lat: "32.6750", lon: "35.2394" },
  { city: "טבריה", lat: "32.7922", lon: "35.5312" },
  { city: "צפת", lat: "32.9646", lon: "35.4960" },
  { city: "קריית שמונה", lat: "33.2073", lon: "35.5721" },
  { city: "עכו", lat: "32.9281", lon: "35.0818" },
  { city: "נהריה", lat: "33.0059", lon: "35.0987" },
  { city: "כרמיאל", lat: "32.9199", lon: "35.2901" },
  { city: "קריית אתא", lat: "32.8115", lon: "35.1132" },
  { city: "קריית ביאליק", lat: "32.8331", lon: "35.0887" },
  { city: "קריית מוצקין", lat: "32.8389", lon: "35.0786" },
  { city: "קריית ים", lat: "32.8492", lon: "35.0696" },
  { city: "חדרה", lat: "32.4340", lon: "34.9196" },
  { city: "זכרון יעקב", lat: "32.5732", lon: "34.9520" },
  { city: "בנימינה גבעת עדה", lat: "32.5174", lon: "34.9467" },
  { city: "פרדס חנה כרכור", lat: "32.4742", lon: "34.9773" },
  { city: "אריאל", lat: "32.1065", lon: "35.1845" },
  { city: "מעלה אדומים", lat: "31.7776", lon: "35.2978" },
  { city: "ביתר עילית", lat: "31.6976", lon: "35.1155" },
  { city: "מודיעין עילית", lat: "31.9326", lon: "35.0442" },
  { city: "לוד", lat: "31.9510", lon: "34.8881" },
  { city: "רמלה", lat: "31.9292", lon: "34.8656" },
  { city: "ראש העין", lat: "32.0958", lon: "34.9566" },
  { city: "שוהם", lat: "31.9987", lon: "34.9456" },
  { city: "דימונה", lat: "31.0708", lon: "35.0327" },
  { city: "ערד", lat: "31.2588", lon: "35.2137" },
  { city: "מצפה רמון", lat: "30.6102", lon: "34.8019" },
  { city: "נתיבות", lat: "31.4231", lon: "34.5890" },
  { city: "אופקים", lat: "31.3141", lon: "34.6203" },
  { city: "שדרות", lat: "31.5250", lon: "34.5969" },
  { city: "קריית אונו", lat: "32.0632", lon: "34.8551" },
  { city: "יהוד מונוסון", lat: "32.0314", lon: "34.8878" },
  { city: "אור יהודה", lat: "32.0294", lon: "34.8568" },
  { city: "רמת השרון", lat: "32.1461", lon: "34.8394" },
  { city: "טירת כרמל", lat: "32.7602", lon: "34.9718" },
  { city: "נשר", lat: "32.7668", lon: "35.0442" }
];

function findWeatherCity(cityName) {
  return israelWeatherCities.find((item) => item.city === cityName) || israelWeatherCities.find((item) => item.city === "חיפה") || israelWeatherCities[0];
}
`;

// Insert city list before component if missing
if (!admin.includes("const israelWeatherCities = [")) {
  admin = admin.replace(/function ModuleShowcase\(/, `${citiesBlock}\nfunction ModuleShowcase(`);
}

// Add helper function inside component if missing
if (!admin.includes("const updateWeatherCity = (cityName) =>")) {
  admin = admin.replace(
    /  const saveSettings = async \(\) => \{/,
    `  const updateWeatherCity = (cityName) => {
    const selectedCity = findWeatherCity(cityName);

    setWeatherCity(selectedCity.city);
    setWeatherLat(selectedCity.lat);
    setWeatherLon(selectedCity.lon);
  };

  const saveSettings = async () => {`
  );
}

// Replace city input + lat/lon inputs with dropdown.
// Try broad match between label city and clock label.
const newWeatherUi = `            <label>עיר למזג האוויר</label>
            <select value={weatherCity} onChange={(e) => updateWeatherCity(e.target.value)}>
              {israelWeatherCities.map((item) => (
                <option key={item.city} value={item.city}>
                  {item.city}
                </option>
              ))}
            </select>

            <p className="admin-helper">
              בחירת העיר מסתנכרנת למסך ה TV דרך Supabase ומעדכנת את מזג האוויר לפי הרשת.
            </p>

`;

admin = admin.replace(
  /            <label>עיר להצגה<\/label>[\s\S]*?            <label>מיקום שעה ותאריך במסך TV<\/label>/,
  `${newWeatherUi}            <label>מיקום שעה ותאריך במסך TV</label>`
);

// In case labels changed a bit, do a second fallback replacement.
admin = admin.replace(
  /            <label>עיר למזג האוויר<\/label>[\s\S]*?            <label>מיקום שעה ותאריך במסך TV<\/label>/,
  `${newWeatherUi}            <label>מיקום שעה ותאריך במסך TV</label>`
);

// Remove visible coordinate labels if they survived
admin = admin.replace(/            <label>Latitude<\/label>\s*<input[\s\S]*?\/>\s*/g, "");
admin = admin.replace(/            <label>Longitude<\/label>\s*<input[\s\S]*?\/>\s*/g, "");

fs.writeFileSync(adminPath, admin, "utf8");

console.log("Admin weather city dropdown added and coordinates hidden");
