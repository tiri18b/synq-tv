const fs = require("fs");
let file = fs.readFileSync("src/pages/Admin.jsx", "utf8");

file = file.replace(
`<label>
            שם עיר להצגה
            <input value={weatherCity} onChange={(e) => setWeatherCity(e.target.value)} />
          </label>

          <label>
            Latitude
            <input value={weatherLat} onChange={(e) => setWeatherLat(e.target.value)} />
          </label>

          <label>
            Longitude
            <input value={weatherLon} onChange={(e) => setWeatherLon(e.target.value)} />
          </label>`,
`<label>
            בחירת עיר למזג אוויר
            <select
              value={weatherCity}
              onChange={(e) => {
                const value = e.target.value;
                setWeatherCity(value);

                const cities = {
                  "תל אביב": ["32.0853", "34.7818"],
                  "ירושלים": ["31.7683", "35.2137"],
                  "חיפה": ["32.7940", "34.9896"],
                  "באר שבע": ["31.2529", "34.7915"],
                  "אילת": ["29.5581", "34.9482"],
                  "נתניה": ["32.3215", "34.8532"],
                  "אשדוד": ["31.8044", "34.6553"],
                  "ראשון לציון": ["31.9730", "34.7925"],
                  "רמת גן": ["32.0684", "34.8248"],
                  "פתח תקווה": ["32.0840", "34.8878"]
                };

                setWeatherLat(cities[value][0]);
                setWeatherLon(cities[value][1]);
              }}
            >
              <option value="תל אביב">תל אביב</option>
              <option value="ירושלים">ירושלים</option>
              <option value="חיפה">חיפה</option>
              <option value="באר שבע">באר שבע</option>
              <option value="אילת">אילת</option>
              <option value="נתניה">נתניה</option>
              <option value="אשדוד">אשדוד</option>
              <option value="ראשון לציון">ראשון לציון</option>
              <option value="רמת גן">רמת גן</option>
              <option value="פתח תקווה">פתח תקווה</option>
            </select>
          </label>

          <input type="hidden" value={weatherLat} readOnly />
          <input type="hidden" value={weatherLon} readOnly />`
);

file = file.replace(
`<p className="admin-note">
            לדוגמה תל אביב: 32.0853 / 34.7818
          </p>`,
`<p className="admin-note">
            בחירת העיר תעדכן אוטומטית את מיקום מזג האוויר במסך.
          </p>`
);

fs.writeFileSync("src/pages/Admin.jsx", file, "utf8");
console.log("Weather city dropdown updated");
