const fs = require("fs");

const featurePath = "src/pages/FeaturePage.jsx";
const cssPath = "src/pages/FeaturePage.css";

const feature = `import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import buildingImage from "../assets/building.jpeg";
import "./FeaturePage.css";

const pages = {
  events: {
    title: "אירועים",
    icon: "📅",
    subtitle: "מרכז אירועים לדיירים",
    description: "כאן ניתן להציג אירועים, מפגשי דיירים, סדנאות, הרצאות ופעילויות קהילה בצורה מסודרת וברורה.",
    actions: ["הוספת אירוע", "ניהול הרשמה", "תזכורת למסך TV", "הצגת מיקום ושעה"],
    examples: [
      ["מפגש דיירים", "יום שלישי | 18:00 | חדר כנסים"],
      ["סדנת פתיחה", "הרשמה לדיירים חדשים והצגת מספר מקומות"],
      ["ערב קהילה", "פרסום פעילות לפי תאריך, שעה ומיקום"]
    ]
  },
  personal: {
    title: "איזור אישי",
    icon: "👤",
    subtitle: "פורטל אישי לדייר",
    description: "מודול עתידי שבו כל דייר יוכל לקבל הודעות אישיות, מסמכים, פרטי חדר ועדכונים שמתאימים אליו.",
    actions: ["פרופיל דייר", "מסמכים", "הודעות אישיות", "שיוך חדר"],
    examples: [
      ["כרטיס דייר", "שם, חדר, קומה, סטטוס ופרטי קשר"],
      ["מסמכים", "תקנון, חוזה, טפסים ואישורים"],
      ["עדכונים אישיים", "הודעות לפי דייר, חדר או קומה"]
    ]
  },
  service: {
    title: "קריאות שירות",
    icon: "🔧",
    subtitle: "ניהול תקלות ושירות",
    description: "מודול שירות שמרכז תקלות, שיוך לאנשי צוות, סטטוסים ועדכונים לדיירים בצורה מקצועית.",
    actions: ["פתיחת קריאה", "שיוך לאיש צוות", "עדכון סטטוס", "סגירת טיפול"],
    examples: [
      ["תקלה במזגן", "פתוח | בטיפול | נסגר"],
      ["בעיה בחשמל", "בחירת מיקום, דחיפות ותיאור התקלה"],
      ["מעקב טיפול", "זמן פתיחה, אחראי וסטטוס נוכחי"]
    ]
  },
  packages: {
    title: "חבילות",
    icon: "📦",
    subtitle: "ניהול חבילות בדלפק",
    description: "מודול חבילות שמאפשר לקבלה לעדכן דיירים על חבילות שממתינות לאיסוף ולהפחית פניות לדלפק.",
    actions: ["הוספת חבילה", "שיוך לדייר", "סימון נאסף", "תזכורת איסוף"],
    examples: [
      ["חבילה חדשה", "החבילה ממתינה בדלפק הקבלה"],
      ["שעות איסוף", "א׳ עד ה׳ | 09:00 עד 17:00"],
      ["היסטוריית חבילות", "מעקב אחר חבילות שנאספו"]
    ]
  },
  maintenance: {
    title: "תחזוקה",
    icon: "🧹",
    subtitle: "עבודות תחזוקה ועדכונים",
    description: "מודול תחזוקה שמציג עבודות יזומות, אזורים מושפעים, שעות פעילות והמלצות לדיירים.",
    actions: ["הוספת עבודה", "בחירת אזור", "המלצות לדיירים", "סימון הסתיים"],
    examples: [
      ["תחזוקת מים", "הפסקה זמנית בקומות 3 עד 5"],
      ["בדיקת מעליות", "מעלית אחת לא תהיה זמינה בין 10:00 ל 12:00"],
      ["ניקיון חניון", "פינוי רכבים מאזור מוגדר עד שעה מסוימת"]
    ]
  },
  reception: {
    title: "דלפק קבלה",
    icon: "🛎️",
    subtitle: "מידע ושירותי קבלה",
    description: "מודול קבלה שמרכז שעות פעילות, נהלים, אנשי קשר, הודעות קבלה ועדכונים חשובים לדיירים.",
    actions: ["שעות פעילות", "הודעת קבלה", "אנשי קשר", "נהלים לדיירים"],
    examples: [
      ["שעות פתיחה", "א׳ עד ה׳ | 09:00 עד 17:00"],
      ["הודעת קבלה", "הדלפק יהיה סגור זמנית עקב ישיבת צוות"],
      ["נהלים", "איסוף חבילות, אורחים ואבדות ומציאות"]
    ]
  }
};

export default function FeaturePage() {
  const { type } = useParams();
  const page = pages[type] || pages.events;
  const [now, setNow] = useState(new Date());
  const [settings, setSettings] = useState({});
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);

    const loadSettings = async () => {
      const { data } = await supabase.from("app_settings").select("*");
      const obj = {};
      (data || []).forEach((row) => {
        obj[row.key] = row.value;
      });

      setSettings(obj);

      const lat = obj.weather_lat || "32.7940";
      const lon = obj.weather_lon || "34.9896";

      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=" +
            encodeURIComponent(lat) +
            "&longitude=" +
            encodeURIComponent(lon) +
            "&current_weather=true&timezone=Asia%2FJerusalem"
        );

        const json = await response.json();
        setWeather(json.current_weather || null);
      } catch {
        setWeather(null);
      }
    };

    loadSettings();

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="feature-tv-page">
      <section className="feature-image-side">
        <img src={buildingImage} className="feature-building" alt="SYNQ building" />
      </section>

      <section className="feature-content-side">
        <section className={"feature-live-info clock-" + (settings.clock_position || "center")}>
          <div className="feature-live-row">
            <span>🕒</span>
            <strong>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</strong>
          </div>

          <div className="feature-live-row">
            <span>📅</span>
            <b>{now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</b>
          </div>

          <div className="feature-live-separator" />

          <div className="feature-live-row">
            <span>🌤️</span>
            <strong>{weather ? Math.round(Number(weather.temperature)) + "°" : "--"}</strong>
          </div>

          <div className="feature-live-city">
            {settings.weather_city || "חיפה"}
          </div>
        </section>

        <img src="/synq-logo.png" className="feature-logo" alt="SYNQ By Shbiro" />

        <section className="feature-hero-card">
          <div className="feature-icon">{page.icon}</div>
          <div>
            <h1>{page.title}</h1>
            <h2>{page.subtitle}</h2>
            <p>{page.description}</p>
          </div>
        </section>

        <section className="feature-actions">
          {page.actions.map((action) => (
            <button type="button" key={action}>{action}</button>
          ))}
        </section>

        <section className="feature-examples">
          {page.examples.map((item) => (
            <article key={item[0]}>
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
            </article>
          ))}
        </section>

        <Link to="/tv" className="feature-back-button">
          חזרה למסך הבית
        </Link>
      </section>

      <footer className="feature-tv-ticker">
        <marquee direction="right">
          SYNQ By Shbiro * מערכת מידע חכמה לדיירים * מודול {page.title} להרחבה עתידית לפי בקשת הלקוח
        </marquee>
        <b>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</b>
      </footer>
    </main>
  );
}
`;

const css = `html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden !important;
}

.feature-tv-page {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  direction: ltr;
  display: grid;
  grid-template-columns: 58% 42%;
  background: #fbf7ff;
  color: #241b35;
  position: relative;
  font-family: Assistant, Arial, sans-serif;
}

.feature-image-side {
  position: relative;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
}

.feature-building {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 80vh;
  object-fit: cover;
  object-position: center left;
  z-index: 1;
}

.feature-image-side::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(to left, #fbf7ff 0%, rgba(251,247,255,.9) 10%, rgba(251,247,255,.48) 28%, rgba(251,247,255,.08) 48%, transparent 70%),
    linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(251,247,255,.78) 76%, #fbf7ff 100%);
}

.feature-content-side {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 6;
  direction: rtl;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4vh 3vw 9vh;
}

.feature-logo {
  width: clamp(185px, 15vw, 300px);
  height: auto;
  object-fit: contain;
  margin-bottom: 2.2vh;
}

.feature-hero-card {
  width: 94%;
  border-radius: 24px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 20px 50px rgba(95,53,145,.15);
  padding: 2vh 1.6vw;
  display: grid;
  grid-template-columns: 82px 1fr;
  gap: 1.2vw;
  align-items: center;
  margin-bottom: 1.4vh;
}

.feature-icon {
  width: 74px;
  height: 74px;
  border-radius: 22px;
  background: #eadcf7;
  color: #5b3199;
  display: grid;
  place-items: center;
  font-size: 42px;
}

.feature-hero-card h1 {
  margin: 0;
  color: #6d3caf;
  font-size: clamp(34px, 3vw, 58px);
  line-height: 1;
  font-weight: 900;
}

.feature-hero-card h2 {
  margin: .5vh 0;
  color: #241b35;
  font-size: clamp(18px, 1.35vw, 27px);
  font-weight: 900;
}

.feature-hero-card p {
  margin: 0;
  color: #241b35;
  font-size: clamp(13px, .88vw, 18px);
  line-height: 1.45;
  font-weight: 800;
}

.feature-actions {
  width: 94%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .75vw;
  margin-bottom: 1.4vh;
}

.feature-actions button {
  border: none;
  border-radius: 16px;
  min-height: 6.8vh;
  padding: .7vh .6vw;
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  font-family: inherit;
  font-size: clamp(12px, .82vw, 16px);
  font-weight: 900;
}

.feature-examples {
  width: 94%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .85vw;
  margin-bottom: 1.4vh;
}

.feature-examples article {
  min-height: 13vh;
  background: rgba(255,255,255,.96);
  border: 1px solid #eadcf7;
  border-radius: 18px;
  padding: 1.3vh 1vw;
  box-shadow: 0 12px 30px rgba(95,53,145,.08);
}

.feature-examples h3 {
  margin: 0 0 .7vh;
  color: #6d3caf;
  font-size: clamp(15px, 1.05vw, 21px);
  font-weight: 900;
}

.feature-examples p {
  margin: 0;
  color: #241b35;
  font-size: clamp(12px, .78vw, 16px);
  line-height: 1.45;
  font-weight: 800;
}

.feature-back-button {
  width: 94%;
  height: 5.6vh;
  min-height: 42px;
  border-radius: 16px;
  background: #211633;
  color: white;
  text-decoration: none;
  display: grid;
  place-items: center;
  font-size: clamp(14px, .95vw, 19px);
  font-weight: 900;
}

.feature-tv-ticker {
  position: absolute;
  left: 3vw;
  right: 3vw;
  bottom: 1.1vh;
  height: 5.2vh;
  min-height: 42px;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(235,222,249,.94);
  box-shadow: 0 10px 32px rgba(95,53,145,.15);
  direction: rtl;
}

.feature-tv-ticker marquee {
  color: #5b3199;
  font-size: clamp(15px, 1.15vw, 22px);
  font-weight: 900;
  padding: 0 2vw;
}

.feature-tv-ticker b {
  height: 100%;
  background: #7e4bb5;
  color: white;
  display: grid;
  place-items: center;
  font-size: clamp(16px, 1.25vw, 24px);
}

.feature-live-info {
  position: fixed !important;
  z-index: 999 !important;
  min-width: 220px !important;
  direction: rtl !important;
  color: #4c267f !important;
  text-align: right;
}

.feature-live-row {
  display: grid;
  grid-template-columns: 38px 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: .8vh;
}

.feature-live-row span {
  font-size: clamp(22px, 1.55vw, 32px);
}

.feature-live-row strong {
  font-size: clamp(26px, 2.2vw, 46px);
  line-height: 1;
  font-weight: 900;
}

.feature-live-row b {
  font-size: clamp(13px, .9vw, 19px);
  color: #241b35;
  font-weight: 900;
}

.feature-live-separator {
  height: 2px;
  background: rgba(126,75,181,.22);
  margin: 1.2vh 0;
}

.feature-live-city {
  padding-right: 46px;
  color: #241b35;
  font-size: clamp(13px, .9vw, 19px);
  font-weight: 900;
}

.feature-live-info.clock-left {
  top: 5vh !important;
  left: 3vw !important;
  right: auto !important;
  bottom: auto !important;
  transform: none !important;
}

.feature-live-info.clock-center {
  top: 5vh !important;
  left: 50% !important;
  right: auto !important;
  bottom: auto !important;
  transform: translateX(-50%) !important;
  text-align: center !important;
}

.feature-live-info.clock-right {
  top: 5vh !important;
  right: 3vw !important;
  left: auto !important;
  bottom: auto !important;
  transform: none !important;
}

.feature-live-info.clock-bottom {
  top: auto !important;
  bottom: 16vh !important;
  left: 50% !important;
  right: auto !important;
  transform: translateX(-50%) !important;
  text-align: center !important;
}

@media (max-height: 800px) {
  .feature-content-side {
    padding-top: 3vh;
  }

  .feature-logo {
    width: clamp(160px, 13vw, 250px);
    margin-bottom: 1.4vh;
  }

  .feature-hero-card {
    padding: 1.5vh 1.4vw;
  }

  .feature-icon {
    width: 62px;
    height: 62px;
    font-size: 34px;
  }

  .feature-actions button {
    min-height: 5.8vh;
  }

  .feature-examples article {
    min-height: 11vh;
  }
}

@media (max-width: 1100px) {
  .feature-tv-page {
    grid-template-columns: 56% 44%;
  }

  .feature-content-side {
    padding-left: 2vw;
    padding-right: 2vw;
  }

  .feature-actions {
    grid-template-columns: repeat(2, 1fr);
  }

  .feature-examples {
    grid-template-columns: 1fr;
  }

  .feature-examples article {
    min-height: 8vh;
  }
}
`;

fs.writeFileSync(featurePath, feature, "utf8");
fs.writeFileSync(cssPath, css, "utf8");

console.log("Feature demo pages were rebuilt to match TV home layout and fit screen bounds");
