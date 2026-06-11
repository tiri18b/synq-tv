import { useEffect, useState } from "react";
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
      const { data } = await הענן.from("app_settings").select("*");
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
