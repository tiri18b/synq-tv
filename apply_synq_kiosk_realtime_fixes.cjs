const fs = require("fs");

const tvPath = "src/pages/TV.jsx";
const appCssPath = "src/App.css";
const tvCssPath = "src/pages/TV.css";

let tv = fs.readFileSync(tvPath, "utf8");

if (!tv.includes("postsRefreshTimer")) {
  tv = tv.replace(
    `    const clockTimer = setInterval(() => {
      setNow(new Date());
    }, 1000);`,
    `    const clockTimer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    const postsRefreshTimer = setInterval(() => {
      loadPosts();
    }, 5000);

    const settingsRefreshTimer = setInterval(() => {
      loadSettings();
    }, 30000);

    const reloadWhenVisible = () => {
      if (!document.hidden) {
        loadPosts();
        loadSettings();
      }
    };

    window.addEventListener("focus", reloadWhenVisible);
    document.addEventListener("visibilitychange", reloadWhenVisible);`
  );

  tv = tv.replace(
    `      clearInterval(clockTimer);
      supabase.removeChannel(channel);`,
    `      clearInterval(clockTimer);
      clearInterval(postsRefreshTimer);
      clearInterval(settingsRefreshTimer);
      window.removeEventListener("focus", reloadWhenVisible);
      document.removeEventListener("visibilitychange", reloadWhenVisible);
      supabase.removeChannel(channel);`
  );
}

fs.writeFileSync(tvPath, tv, "utf8");

let appCss = fs.existsSync(appCssPath) ? fs.readFileSync(appCssPath, "utf8") : "";
let tvCss = fs.existsSync(tvCssPath) ? fs.readFileSync(tvCssPath, "utf8") : "";

const appPatch = `

/* APK AND KIOSK FIT */
html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden !important;
  overscroll-behavior: none;
}

body {
  touch-action: manipulation;
}

.admin-page {
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
}

.admin-content {
  height: 100vh !important;
  max-height: 100vh !important;
  overflow-y: auto !important;
  padding-bottom: 40px !important;
}

.admin-page aside {
  height: 100vh !important;
  max-height: 100vh !important;
  overflow-y: auto !important;
}

.admin-page aside::-webkit-scrollbar,
.admin-content::-webkit-scrollbar {
  width: 6px;
}
`;

const tvPatch = `

/* TV APK NO SCROLL SAFE AREA */
.client-tv {
  width: 100vw !important;
  height: 100vh !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  overflow: hidden !important;
}

.client-tv-image-side,
.client-tv-content-side {
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
}

.client-tv-message-stack {
  max-height: 39vh !important;
}

.client-tv-feature-grid {
  bottom: 9.2vh !important;
}

.client-tv-ticker {
  bottom: 1.5vh !important;
}

@media (max-width: 1100px) {
  .client-tv {
    grid-template-columns: 56% 44% !important;
  }

  .client-tv-content-side {
    padding-left: 2vw !important;
    padding-right: 2vw !important;
  }

  .client-tv-logo {
    width: clamp(170px, 15vw, 280px) !important;
  }

  .client-tv-welcome h1 {
    font-size: clamp(34px, 3.4vw, 62px) !important;
  }

  .client-tv-welcome h2 {
    font-size: clamp(24px, 2.1vw, 40px) !important;
  }

  .client-tv-message-list article {
    grid-template-columns: 42px 1fr 80px !important;
    gap: 8px !important;
  }
}
`;

if (!appCss.includes("APK AND KIOSK FIT")) {
  appCss += appPatch;
}

if (!tvCss.includes("TV APK NO SCROLL SAFE AREA")) {
  tvCss += tvPatch;
}

fs.writeFileSync(appCssPath, appCss, "utf8");
fs.writeFileSync(tvCssPath, tvCss, "utf8");

console.log("Applied kiosk fit and realtime fallback polling");
