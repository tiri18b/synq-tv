const fs = require("fs");

const adminPath = "src/pages/Admin.jsx";
const tvPath = "src/pages/TV.jsx";
const cssPath = "src/pages/TV.css";

let admin = fs.readFileSync(adminPath, "utf8");

admin = admin.replaceAll("הודעה דחופה ל 10 דקות", "הודעה דחופה עד סימון קראתי");
admin = admin.replaceAll("הודעה דחופה משתלטת על המסך למשך 10 דקות ומתאימה למצבי חירום או עדכון חשוב.", "הודעה דחופה תעלה תמיד לשורה הראשונה במסך ה TV ותישאר מוצגת עד שהלקוח יסמן קראתי או עד שהמנהל יכבה אותה מהמערכת.");
admin = admin.replaceAll("הודעה דחופה ל 10 דקות", "הודעה דחופה עד סימון קראתי");
admin = admin.replaceAll("הודעה דחופה", "הודעה דחופה");

admin = admin.replace(
  `const urgentUntil = type === "urgent" ? new Date(Date.now() + 10 * 60 * 1000).toISOString() : null;`,
  `const urgentUntil = null;`
);

admin = admin.replace(
  `<option value="urgent">הודעה דחופה ל 10 דקות</option>`,
  `<option value="urgent">הודעה דחופה עד סימון קראתי</option>`
);

if (!admin.includes("הודעה דחופה תופיע ללקוח עד סימון קראתי")) {
  admin = admin.replace(
    `<select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="regular">הודעה רגילה</option>
                <option value="urgent">הודעה דחופה עד סימון קראתי</option>
              </select>`,
    `<select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="regular">הודעה רגילה</option>
                <option value="urgent">הודעה דחופה עד סימון קראתי</option>
              </select>

              <p className="admin-helper">
                הודעה דחופה תופיע ללקוח עד סימון קראתי. אם הלקוח לא סימן קראתי, ההודעה תמשיך להופיע. המנהל יכול בכל רגע לכבות אותה ממסך ניהול ההודעות.
              </p>`
  );
}

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

function getReadPostIds() {
  try {
    return JSON.parse(localStorage.getItem("synq_read_posts") || "[]");
  } catch {
    return [];
  }
}

function saveReadPostIds(ids) {
  localStorage.setItem("synq_read_posts", JSON.stringify(ids));
}

export default function TV() {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(new Date());
  const [pageIndex, setPageIndex] = useState(0);
  const [readPostIds, setReadPostIds] = useState(getReadPostIds);

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

  const messages = useMemo(() => {
    const source = posts.length > 0 ? posts : demoPosts;
    const readSet = new Set(readPostIds.map(String));

    return source
      .filter((post) => !readSet.has(String(post.id)))
      .sort((a, b) => {
        const aUrgent = a.type === "urgent";
        const bUrgent = b.type === "urgent";

        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;

        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [posts, readPostIds]);

  const messagePages = useMemo(() => {
    const pages = [];

    for (let i = 0; i < messages.length; i += 3) {
      pages.push(messages.slice(i, i + 3));
    }

    return pages.length > 0 ? pages : [demoPosts.slice(0, 3)];
  }, [messages]);

  useEffect(() => {
    if (messagePages.length <= 1) return;

    const slideTimer = setInterval(() => {
      setPageIndex((current) => (current + 1) % messagePages.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [messagePages.length]);

  useEffect(() => {
    setPageIndex(0);
  }, [messagePages.length]);

  const markAsRead = (postId) => {
    const nextReadIds = Array.from(new Set([...readPostIds.map(String), String(postId)]));
    setReadPostIds(nextReadIds);
    saveReadPostIds(nextReadIds);
  };

  const visibleMessages = messagePages[pageIndex % messagePages.length] || [];

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

        <section className="client-tv-message-stack">
          <header>
            <span>🔔</span>
            <strong>הודעות ועדכונים</strong>
          </header>

          <div className="client-tv-message-list">
            {visibleMessages.map((message, index) => (
              <article
                key={message.id}
                className={(message.type === "urgent" ? "urgent-message" : "") + (index === 0 ? " first-message" : "")}
              >
                <div className="message-icon">{message.type === "urgent" ? "🚨" : "📌"}</div>

                <div className="message-content">
                  <h3>{message.title}</h3>
                  <p>{message.content}</p>
                </div>

                <button type="button" onClick={() => markAsRead(message.id)}>
                  קראתי
                </button>
              </article>
            ))}
          </div>

          <footer>
            {messagePages.map((page, index) => (
              <span key={index} className={index === pageIndex % messagePages.length ? "active" : ""} />
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

/* TV THREE MESSAGES STACK WITH READ BUTTON */
.client-tv-notices,
.client-tv-notice-slide {
  display: none !important;
}

.client-tv-message-stack {
  width: 94%;
  min-height: 36vh;
  max-height: 40vh;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 20px 50px rgba(95,53,145,.15);
  direction: rtl;
}

.client-tv-message-stack header {
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  padding: 1.1vh 1.7vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: clamp(19px, 1.32vw, 28px);
  font-weight: 900;
}

.client-tv-message-list {
  display: grid;
  gap: .7vh;
  padding: 1.1vh 1.1vw;
  min-height: 26vh;
}

.client-tv-message-list article {
  display: grid;
  grid-template-columns: 48px 1fr 88px;
  gap: 12px;
  align-items: center;
  min-height: 7.7vh;
  padding: .85vh .85vw;
  border-radius: 18px;
  background: #fbf8ff;
  border: 1px solid #eadcf7;
  animation: synqSlideIn .42s ease both;
}

.client-tv-message-list article.urgent-message {
  background: #fff1f2;
  border-color: rgba(190,18,60,.32);
  box-shadow: 0 12px 34px rgba(190,18,60,.12);
}

.client-tv-message-list article.first-message {
  order: -1;
}

.message-icon {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #eadcf7;
  font-size: 22px;
}

.urgent-message .message-icon {
  background: #fecdd3;
}

.message-content h3 {
  margin: 0 0 .35vh;
  color: #5b3199;
  font-size: clamp(18px, 1.25vw, 26px);
  line-height: 1.1;
  font-weight: 900;
}

.urgent-message .message-content h3 {
  color: #be123c;
}

.message-content p {
  margin: 0;
  color: #241b35;
  font-size: clamp(13px, .9vw, 18px);
  line-height: 1.35;
  font-weight: 800;
}

.client-tv-message-list button {
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  padding: 11px 10px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
}

.urgent-message button {
  background: linear-gradient(135deg, #be123c, #fb7185);
}

.client-tv-message-stack footer {
  height: 3.7vh;
  min-height: 30px;
  display: flex;
  gap: 9px;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #eadcf7;
}

.client-tv-message-stack footer span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #d9c3f3;
  opacity: .65;
}

.client-tv-message-stack footer span.active {
  width: 30px;
  opacity: 1;
  background: #7e4bb5;
}

@media (max-height: 800px) {
  .client-tv-message-stack {
    min-height: 34vh;
    max-height: 38vh;
  }

  .client-tv-message-list article {
    min-height: 7.1vh;
  }

  .message-content h3 {
    font-size: clamp(16px, 1.12vw, 23px);
  }

  .message-content p {
    font-size: clamp(12px, .82vw, 16px);
  }
}
`;

fs.writeFileSync(cssPath, css, "utf8");

console.log("Updated TV to show 3 messages, urgent first, with read button");
