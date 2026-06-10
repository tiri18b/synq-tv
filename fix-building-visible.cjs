const fs = require("fs");

let css = fs.readFileSync("src/App.css", "utf8");

css += `

/* FIX BUILDING IMAGE VISIBILITY */
.building-bg {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: auto !important;
  width: 100% !important;
  height: 78vh !important;
  object-fit: cover !important;
  object-position: center left !important;
  z-index: 1 !important;
}

.tv-right {
  position: relative !important;
  overflow: hidden !important;
  background-image: url("/building.jpeg") !important;
  background-size: cover !important;
  background-position: center left !important;
  background-repeat: no-repeat !important;
}

.tv-right .building-bg {
  content: url("/building.jpeg") !important;
}
`;

fs.writeFileSync("src/App.css", css, "utf8");
console.log("Building image restored");
