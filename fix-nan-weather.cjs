const fs = require("fs");
let file = fs.readFileSync("src/pages/TV.jsx", "utf8");

file = file.replaceAll(
`Math.round(weather.temperature) + "°"`,
`Number.isFinite(Number(weather.temperature)) ? Math.round(Number(weather.temperature)) + "°" : "--"`
);

file = file.replaceAll(
`Math.round(weather.temperature_2m) + "°"`,
`Number.isFinite(Number(weather.temperature)) ? Math.round(Number(weather.temperature)) + "°" : "--"`
);

fs.writeFileSync("src/pages/TV.jsx", file, "utf8");
console.log("fixed NaN weather display");
