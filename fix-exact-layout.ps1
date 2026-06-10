$css = Get-Content src\App.css -Raw

$fix = @"

/* FIX EXACT SHBIRO LAYOUT */
.synq-showcase {
  direction: ltr !important;
  grid-template-columns: 42% 58% !important;
}

.showcase-left,
.showcase-right,
.notice-box,
.welcome-box,
.showcase-ticker,
.feature-tile {
  direction: rtl !important;
}

.showcase-left {
  grid-column: 1 !important;
  padding: 4vh 2.8vw 11vh !important;
}

.showcase-right {
  grid-column: 2 !important;
  padding: 3vh 2vw 12vh !important;
}

.showcase-logo {
  align-self: flex-start !important;
  width: 26vw !important;
  max-width: 460px !important;
  margin: 0 !important;
}

.welcome-box {
  margin-top: 2vh !important;
  text-align: center !important;
}

.welcome-box h1 {
  font-size: 4.6vw !important;
}

.welcome-box h2 {
  font-size: 3vw !important;
}

.notice-box {
  width: 96% !important;
  margin-bottom: 0 !important;
}

.building-image {
  top: 0 !important;
  right: 0 !important;
  left: auto !important;
  width: 82% !important;
  height: 74% !important;
  object-fit: cover !important;
  object-position: center !important;
  mask-image: linear-gradient(to left, black 76%, transparent 100%) !important;
  -webkit-mask-image: linear-gradient(to left, black 76%, transparent 100%) !important;
}

.top-info {
  top: 3vh !important;
  right: 3vw !important;
  left: auto !important;
  text-align: center !important;
}

.tiles-row {
  right: 2vw !important;
  left: 2vw !important;
  bottom: 10vh !important;
  grid-template-columns: repeat(6, 1fr) !important;
}

.showcase-ticker {
  left: 3vw !important;
  right: 3vw !important;
  bottom: 2vh !important;
}
"@

Add-Content -Encoding UTF8 src\App.css $fix

Write-Host "Exact layout override added"
