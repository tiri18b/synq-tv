const fs = require("fs");

const tvPath = "src/pages/TV.jsx";
let tv = fs.readFileSync(tvPath, "utf8");

tv = tv.replace(
  "}, 5000);",
  "}, 10000);"
);

fs.writeFileSync(tvPath, tv, "utf8");

console.log("TV slides changed to 10 seconds");
