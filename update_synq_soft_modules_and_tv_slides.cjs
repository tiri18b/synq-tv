const fs = require("fs");

const adminPath = "src/pages/Admin.jsx";
const tvPath = "src/pages/TV.jsx";
const cssPath = "src/pages/TV.css";

let admin = fs.readFileSync(adminPath, "utf8");

admin = admin.replace(
  "בהמשך אפשר להפוך כל דף למודול מלא בתשלום נפרד.",
  "בהמשך אפשר להפוך כל דף למודול מתקדם לפי בקשת הלקוח ובהתאם לאופי הפעילות בבניין."
);

admin = admin.replace(
  "כל מודול ניתן לפיתוח מלא לפי אפיון ותמחור נפרד.",
  "כל מודול ניתן להרחבה עתידית לפי בקשת הלקוח ואופי הפעילות בבניין."
);

fs.writeFileSync(adminPath, admin, "utf8");

const tv = `import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import buildingImage from "../assets/building.jpeg";
import "./TV.css";

const tickerText =
  "הגעתם הביתה - הגעתם ל- SYNQ * רשת המגורים החדשה לסטודנטים מקבוצת שבירו * SYNQ המקום שבו הכל קורה";

const demoPosts = [
  {
    id: "demo-event",
    title: "מפגש דיירים",
    content: "יום שלישי | 18:00 | חדר כנסים",
    type: "regular",
    created_at: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "demo-packages",
    title: "חבילות בדלפק הקבלה",
    content: "יש לאסוף בימים א׳ עד ה׳ בין 09:00-17:00",
    type: "regular",
    created_at: "2026-01-01T09:00:00.000Z",
  },
  {
    id: "demo-maintenance",
    title: "תחזוקה שוטפת",
    content: "ביום רביעי יבוצעו עבודות תחזוקה בבניין",
    type: "regular",
    created_at: "2026-01-01T08:00:00.000Z",
  },
];

export default function TV() {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(new Date());
  const [slideIndex, setSlideIndex] = useState(0);

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

  useEffect(() => {
    loadPosts();
    loadSettings();

    const channel = supabase
      .channel("synq-tv-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, loadPosts)
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, loadSettings)
      .subscribe();

    const clockTimer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(clockTimer);
      supabase.removeChannel(channel);
    };
  }, []);

  const slides = useMemo(() => {
    const source = posts.length > 0 ? posts : demoPosts;
    const currentTime = now.getTime();

    return source
      .map((post) => {
        const urgentUntil = post.urgent_until ? new Date(post.urgent_until).getTime() : 0;
        const isUrgent = post.type === "urgent" && urgentUntil > currentTime;

        return {
          ...post,
          isUrgent,
        };
      })
      .filter((post) => {
        if (post.type !== "urgent") return true;
        return post.isUrgent;
      })
      .sort((a, b) => {
        if (a.isUrgent && !b.isUrgent) return -1;
        if (!a.isUrgent && b.isUrgent) return 1;

        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [posts, now]);

  useEffect(() => {
    if (slides.length === 0) return;

    const slideTimer = setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [slides.length]);

  useEffect(() => {
    setSlideIndex(0);
  }, [slides.length]);

  const currentSlide = slides.length > 0 ? slides[slideIndex % slides.length] : demoPosts[0];

  return (
    <main className="client-tv">
      <section className="client-tv-image-side">
        <img src={buildingImage} className="client-tv-building" alt="בניין SYNQ" />

        <section className="client-tv-feature-grid">
          <Link to="/feature/events">📅<b>אירועים</b><small>(אופציונלי)</small></Link>
          <Link to="/feature/personal">👤<b>איזור אישי</b><small>(אופציונלי)</small></Link>
          <Link to="/feature/service">🔧<b>קריאת שירות</b><small>(אופציונלי)</small></Link>
          <Link to="/feature/packages">📦<b>חבילות</b><small>(אופציונלי)</small></Link>
          <Link to="/feature/maintenance">🧹<b>תחזוקה</b><small>(אופציונלי)</small></Link>
          <Link to="/feature/reception">🛎️<b>דלפק קבלה</b><small>(אופציונלי)</small></Link>
        </section>
      </section>

      <section className="client-tv-content-side">
        <section className={"client-tv-live-info clock-" + (settings.clock_position || "center")}>
          <div className="client-tv-live-row">
            <span>🕒</span>
            <strong>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</strong>
          </div>

          <div className="client-tv-live-row">
            <span>📅</span>
            <b>{now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</b>
          </div>

          <div className="client-tv-live-separator" />

          <div className="client-tv-live-row">
            <span>🌤️</span>
            <strong>{weather ? Math.round(Number(weather.temperature)) + "°" : "--"}</strong>
          </div>

          <div className="client-tv-live-city">
            {settings.weather_city || "חיפה"}
          </div>
        </section>

        <img src="/synq-logo.png" className="client-tv-logo" alt="SYNQ By Shbiro" />

        <section className="client-tv-welcome">
          <h1>ברוכים הבאים</h1>
          <h2>למעונות סטודנטים</h2>
        </section>

        <section className={"client-tv-notice-slide" + (currentSlide?.isUrgent ? " urgent-slide" : "")}>
          <header>
            <span>{currentSlide?.isUrgent ? "🚨" : "🔔"}</span>
            <strong>{currentSlide?.isUrgent ? "הודעה דחופה" : "הודעות ועדכונים"}</strong>
          </header>

          <article key={currentSlide?.id || slideIndex}>
            <h3>{currentSlide?.title}</h3>
            <p>{currentSlide?.content}</p>
          </article>

          <footer>
            {slides.map((slide, index) => (
              <span
                key={slide.id || index}
                className={index === slideIndex % slides.length ? "active" : ""}
              />
            ))}
          </footer>
        </section>
      </section>

      <footer className="client-tv-ticker">
        <marquee>{tickerText}</marquee>
        <b>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</b>
      </footer>
    </main>
  );
}
`;

fs.writeFileSync(tvPath, tv, "utf8");

let css = fs.readFileSync(cssPath, "utf8");

css += `

/* TV NOTICE SLIDES */
.client-tv-notices {
  display: none !important;
}

.client-tv-notice-slide {
  width: 92%;
  min-height: 29vh;
  max-height: 36vh;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 20px 50px rgba(95,53,145,.15);
  direction: rtl;
}

.client-tv-notice-slide header {
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  padding: 1.3vh 1.8vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: clamp(20px, 1.45vw, 30px);
  font-weight: 900;
}

.client-tv-notice-slide article {
  min-height: 18vh;
  padding: 2.4vh 2vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: synqSlideIn .42s ease both;
}

.client-tv-notice-slide h3 {
  margin: 0 0 1.1vh;
  color: #5b3199;
  font-size: clamp(30px, 2.45vw, 52px);
  line-height: 1.1;
  font-weight: 900;
}

.client-tv-notice-slide p {
  margin: 0;
  color: #241b35;
  font-size: clamp(20px, 1.45vw, 30px);
  line-height: 1.55;
  font-weight: 800;
}

.client-tv-notice-slide footer {
  height: 4.2vh;
  min-height: 34px;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #eadcf7;
}

.client-tv-notice-slide footer span {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #d9c3f3;
  opacity: .65;
}

.client-tv-notice-slide footer span.active {
  width: 34px;
  opacity: 1;
  background: #7e4bb5;
}

.client-tv-notice-slide.urgent-slide {
  box-shadow: 0 24px 70px rgba(190,18,60,.22);
}

.client-tv-notice-slide.urgent-slide header {
  background: linear-gradient(135deg, #be123c, #fb7185);
}

.client-tv-notice-slide.urgent-slide h3 {
  color: #be123c;
}

@keyframes synqSlideIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

fs.writeFileSync(cssPath, css, "utf8");

console.log("Updated admin wording and TV notice slides successfully");
