const fs = require("fs");

let tv = fs.readFileSync("src/pages/TV.jsx", "utf8");

tv = tv.replaceAll(
  "געתם הביתה - הגעתם ל- SYNQ",
  "הגעתם הביתה - הגעתם ל- SYNQ"
);

tv = tv.replaceAll(
  "געתם הביתה",
  "הגעתם הביתה"
);

fs.writeFileSync("src/pages/TV.jsx", tv, "utf8");

let css = fs.readFileSync("src/App.css", "utf8");

css += `

/* FINAL SHBIRO BUILDING BLEND */
.building-image {
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  width: 82% !important;
  height: 74% !important;
  object-fit: cover !important;
  object-position: center !important;
  opacity: 0.96 !important;
  filter: saturate(1.02) contrast(1.02) !important;
  mask-image:
    linear-gradient(to left, black 72%, rgba(0,0,0,.75) 84%, transparent 100%),
    linear-gradient(to bottom, black 78%, transparent 100%) !important;
  -webkit-mask-image:
    linear-gradient(to left, black 72%, rgba(0,0,0,.75) 84%, transparent 100%),
    linear-gradient(to bottom, black 78%, transparent 100%) !important;
  z-index: 1 !important;
}

.showcase-right::after {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  background:
    radial-gradient(circle at 70% 40%, transparent 0%, transparent 42%, rgba(248,244,255,.72) 72%),
    linear-gradient(to bottom, transparent 0%, transparent 66%, rgba(248,244,255,.92) 82%, #f8f4fb 100%) !important;
  pointer-events: none !important;
  z-index: 2 !important;
}

.top-info,
.tiles-row {
  z-index: 5 !important;
}
`;

fs.writeFileSync("src/App.css", css, "utf8");

console.log("Fixed ticker text and blended building image");
