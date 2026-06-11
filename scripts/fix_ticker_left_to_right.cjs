const fs = require("fs");

const tvPath = "src/pages/TV.jsx";
let tv = fs.readFileSync(tvPath, "utf8");

tv = tv.replace(
  `<marquee>{tickerText}</marquee>`,
  `<marquee direction="right">{tickerText}</marquee>`
);

fs.writeFileSync(tvPath, tv, "utf8");

console.log("Ticker direction changed to left to right");
