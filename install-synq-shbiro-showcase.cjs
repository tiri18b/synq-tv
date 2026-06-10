const fs = require("fs");

fs.writeFileSync("src/App.jsx", `import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TV from "./pages/TV.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import FeaturePage from "./pages/FeaturePage.jsx";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tv" replace />} />
        <Route path="/tv" element={<TV />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feature/:type" element={<FeaturePage />} />
      </Routes>
    </BrowserRouter>
  );
}
`, "utf8");

fs.writeFileSync("src/pages/FeaturePage.jsx", `import { Link, useParams } from "react-router-dom";

const data = {
  events: {
    title: "אירועים",
    icon: "📅",
    items: ["מפגש דיירים בלובי", "ערב קהילה", "עדכון פעילות שבועית"]
  },
  personal: {
    title: "איזור אישי",
    icon: "👤",
    items: ["פרטי דייר", "הודעות אישיות", "מסמכים ועדכונים"]
  },
  service: {
    title: "קריאת שירות",
    icon: "🔧",
    items: ["פתיחת תקלה", "מעקב סטטוס", "תיאום מול התחזוקה"]
  },
  packages: {
    title: "חבילות",
    icon: "📦",
    items: ["חבילות שהתקבלו", "שעות איסוף", "הודעות דלפק"]
  },
  maintenance: {
    title: "תחזוקה",
    icon: "🧹",
    items: ["עבודות תחזוקה", "הפסקות מים / חשמל", "ניקיון אזורים משותפים"]
  },
  reception: {
    title: "דלפק קבלה",
    icon: "🛎️",
    items: ["שעות פעילות", "יצירת קשר", "הודעות הנהלה"]
  }
};

export default function FeaturePage() {
  const { type } = useParams();
  const page = data[type] || data.events;

  return (
    <div className="synq-feature-page">
      <img src="/synq-logo.png" className="feature-logo" />

      <div className="feature-card">
        <div className="feature-big-icon">{page.icon}</div>
        <h1>{page.title}</h1>
        <p>עמוד דוגמה לתצוגה עתידית במערכת SYNQ</p>

        <div className="feature-list">
          {page.items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>

        <Link to="/tv" className="back-to-tv">חזרה למסך הראשי</Link>
      </div>
    </div>
  );
}
`, "utf8");

fs.writeFileSync("src/pages/TV.jsx", `import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const tickerText =
  "געתם הביתה - הגעתם ל- SYNQ * רשת המגורים החדשה לסטודנטים מקבוצת שבירו * SYNQ המקום שבו הכל קורה";

export default function TV() {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(new Date());

  const loadPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    setPosts(data || []);
  };

  const loadSettings = async () => {
    const { data } = await supabase.from("app_settings").select("*");
    const obj = {};
    (data || []).forEach((row) => (obj[row.key] = row.value));
    setSettings(obj);
    loadWeather(obj.weather_lat, obj.weather_lon);
  };

  const loadWeather = async (lat, lon) => {
    if (!lat || !lon) return;

    try {
      const url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        encodeURIComponent(lat) +
        "&longitude=" +
        encodeURIComponent(lon) +
        "&current_weather=true&timezone=Asia%2FJerusalem";

      const res = await fetch(url);
      const data = await res.json();

      if (data.current_weather) {
        setWeather({
          temperature: data.current_weather.temperature,
          code: data.current_weather.weathercode,
        });
      }
    } catch {
      setWeather(null);
    }
  };

  useEffect(() => {
    loadPosts();
    loadSettings();

    const channel = supabase
      .channel("synq-tv-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, loadPosts)
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, loadSettings)
      .subscribe();

    const clock = setInterval(() => setNow(new Date()), 1000);

    return () => {
      clearInterval(clock);
      supabase.removeChannel(channel);
    };
  }, []);

  const urgent = useMemo(() => {
    return posts.find((p) => {
      if (p.type !== "urgent" || !p.urgent_until) return false;
      return new Date(p.urgent_until).getTime() > now.getTime();
    });
  }, [posts, now]);

  const importantPosts = posts.slice(0, 3);

  if (urgent) {
    return (
      <div className="synq-showcase urgent-mode">
        <img src="/synq-logo.png" className="showcase-logo" />
        <div className="urgent-demo-card">
          <span>הודעה דחופה</span>
          <h1>{urgent.title}</h1>
          <p>{urgent.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="synq-showcase">
      <section className="showcase-left">
        <img src="/synq-logo.png" className="showcase-logo" />

        <div className="welcome-box">
          <h1>ברוכים הבאים</h1>
          <h2>למעונות סטודנטים</h2>
        </div>

        <div className="notice-box">
          <div className="notice-title">הודעות חשובות <span>🔔</span></div>

          {importantPosts.length ? (
            importantPosts.map((post) => (
              <div className="notice-item" key={post.id}>
                <div className="notice-icon">📌</div>
                <div>
                  <strong>{post.title}</strong>
                  <p>{post.content}</p>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="notice-item">
                <div className="notice-icon">📅</div>
                <div>
                  <strong>מפגש דיירים</strong>
                  <p>יום שלישי | 18:00 | חדר כנסים</p>
                </div>
              </div>
              <div className="notice-item">
                <div className="notice-icon">📦</div>
                <div>
                  <strong>חבילות בדלפק הקבלה</strong>
                  <p>יש לאסוף בימים א׳-ה׳ בין 09:00-17:00</p>
                </div>
              </div>
              <div className="notice-item">
                <div className="notice-icon">🧹</div>
                <div>
                  <strong>תחזוקה שוטפת</strong>
                  <p>ביום רביעי יבוצעו עבודות תחזוקה בבניין</p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="showcase-right">
        <div className="top-info">
          <div>
            <strong>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</strong>
            <span>{now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</span>
          </div>

          <div>
            <strong>{weather ? Math.round(Number(weather.temperature)) + "°" : "--"}</strong>
            <span>{settings.weather_city || "תל אביב"}</span>
          </div>
        </div>

        <img src="/building.jpeg" className="building-image" />

        <div className="tiles-row">
          <Link to="/feature/events" className="feature-tile">📅<span>אירועים</span><small>(אופציונלי)</small></Link>
          <Link to="/feature/personal" className="feature-tile">👤<span>איזור אישי</span><small>(אופציונלי)</small></Link>
          <Link to="/feature/service" className="feature-tile">🔧<span>קריאת שירות</span><small>(אופציונלי)</small></Link>
          <Link to="/feature/packages" className="feature-tile">📦<span>חבילות</span><small>(אופציונלי)</small></Link>
          <Link to="/feature/maintenance" className="feature-tile">🧹<span>תחזוקה</span><small>(אופציונלי)</small></Link>
          <Link to="/feature/reception" className="feature-tile">🛎️<span>דלפק קבלה</span><small>(אופציונלי)</small></Link>
        </div>
      </section>

      <footer className="showcase-ticker">
        <b>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</b>
        <marquee>{tickerText}</marquee>
      </footer>
    </div>
  );
}
`, "utf8");

let css = fs.readFileSync("src/App.css", "utf8");

css += `

/* SYNQ SHBIRO TV SHOWCASE */

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}

.synq-showcase {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  direction: rtl;
  display: grid;
  grid-template-columns: 40% 60%;
  background:
    linear-gradient(110deg, rgba(255,255,255,0.92) 0%, rgba(249,244,255,0.92) 48%, rgba(255,255,255,0.2) 49%),
    #f7f1fb;
  color: #241b35;
  position: relative;
  font-family: Assistant, Arial, sans-serif;
}

.showcase-left {
  padding: 4vh 3vw 10vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
}

.showcase-logo {
  width: 27vw;
  max-width: 470px;
  min-width: 260px;
  object-fit: contain;
  align-self: flex-start;
}

.welcome-box {
  text-align: center;
}

.welcome-box h1 {
  margin: 0;
  color: #6d3caf;
  font-size: 5vw;
  line-height: 1;
  font-weight: 900;
}

.welcome-box h2 {
  margin: 1vh 0 0;
  color: #241b35;
  font-size: 3.2vw;
  line-height: 1;
  font-weight: 900;
}

.notice-box {
  width: 95%;
  background: rgba(255,255,255,0.88);
  border-radius: 22px;
  box-shadow: 0 20px 55px rgba(95, 53, 145, 0.18);
  overflow: hidden;
}

.notice-title {
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  font-size: 2vw;
  font-weight: 900;
  padding: 1.8vh 2vw;
  display: flex;
  justify-content: space-between;
}

.notice-item {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 14px;
  padding: 1.6vh 2vw;
  border-bottom: 1px solid rgba(126, 75, 181, 0.18);
  align-items: center;
}

.notice-icon {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #e6d9f4;
  display: grid;
  place-items: center;
  font-size: 24px;
}

.notice-item strong {
  font-size: 1.55vw;
}

.notice-item p {
  margin: 0.5vh 0 0;
  font-size: 1.2vw;
}

.showcase-right {
  position: relative;
  padding: 3vh 2vw 12vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top-info {
  position: absolute;
  top: 3vh;
  right: 3vw;
  z-index: 3;
  display: grid;
  gap: 1.5vh;
  text-align: center;
}

.top-info strong {
  display: block;
  color: #5b3199;
  font-size: 3.2vw;
  font-weight: 900;
}

.top-info span {
  display: block;
  font-size: 1.25vw;
  font-weight: 800;
}

.building-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 72%;
  height: 74%;
  object-fit: cover;
  object-position: center;
  z-index: 1;
  border-bottom-right-radius: 0;
  mask-image: linear-gradient(to left, black 75%, transparent 100%);
}

.tiles-row {
  position: absolute;
  bottom: 10vh;
  right: 2vw;
  left: 2vw;
  z-index: 4;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1vw;
}

.feature-tile {
  height: 20vh;
  background: rgba(255,255,255,0.92);
  border-radius: 18px;
  text-decoration: none;
  color: #241b35;
  display: grid;
  place-items: center;
  text-align: center;
  box-shadow: 0 18px 40px rgba(95, 53, 145, 0.16);
  font-size: 2.7vw;
}

.feature-tile span {
  display: block;
  font-size: 1.18vw;
  font-weight: 900;
}

.feature-tile small {
  display: block;
  font-size: 0.95vw;
  color: #4b3c5f;
  font-weight: 800;
}

.showcase-ticker {
  position: absolute;
  bottom: 2vh;
  left: 3vw;
  right: 3vw;
  height: 6.5vh;
  z-index: 10;
  background: rgba(235, 222, 249, 0.9);
  border-radius: 18px;
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  overflow: hidden;
  color: #5b3199;
  box-shadow: 0 10px 32px rgba(95, 53, 145, 0.15);
}

.showcase-ticker b {
  height: 100%;
  background: #7e4bb5;
  color: white;
  display: grid;
  place-items: center;
  font-size: 1.8vw;
}

.showcase-ticker marquee {
  font-size: 1.55vw;
  font-weight: 900;
  padding: 0 2vw;
}

.synq-feature-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  direction: rtl;
  background: linear-gradient(135deg, #f8f4fb, #ffffff);
  display: grid;
  place-items: center;
  color: #241b35;
}

.feature-logo {
  position: absolute;
  top: 4vh;
  right: 4vw;
  width: 260px;
}

.feature-card {
  width: 55vw;
  min-height: 58vh;
  background: white;
  border-radius: 32px;
  box-shadow: 0 25px 70px rgba(95,53,145,0.2);
  text-align: center;
  padding: 5vh 4vw;
}

.feature-big-icon {
  font-size: 5vw;
}

.feature-card h1 {
  font-size: 4vw;
  color: #6d3caf;
  margin: 1vh 0;
}

.feature-card p {
  font-size: 1.4vw;
}

.feature-list {
  margin: 4vh auto;
  display: grid;
  gap: 1.5vh;
  max-width: 70%;
}

.feature-list div {
  background: #f1e8fb;
  padding: 1.5vh 2vw;
  border-radius: 14px;
  font-size: 1.3vw;
  font-weight: 800;
}

.back-to-tv {
  display: inline-block;
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  text-decoration: none;
  padding: 16px 38px;
  border-radius: 16px;
  font-size: 1.3vw;
  font-weight: 900;
}

.urgent-mode {
  display: grid;
  place-items: center;
}

.urgent-demo-card {
  background: white;
  border-radius: 32px;
  padding: 6vh 6vw;
  text-align: center;
  box-shadow: 0 30px 80px rgba(95,53,145,0.25);
}

.urgent-demo-card span {
  color: #7e4bb5;
  font-size: 2vw;
  font-weight: 900;
}

.urgent-demo-card h1 {
  font-size: 5vw;
}
`;

fs.writeFileSync("src/App.css", css, "utf8");

console.log("SYNQ Shbiro showcase installed");
