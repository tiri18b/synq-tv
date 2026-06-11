import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import buildingImage from "../assets/building.jpeg";
import "./TV.css";

const tickerText =
  "הגעתם הביתה - הגעתם ל- SYNQ * רשת המגורים החדשה לסטודנטים מקבוצת שבירו * SYNQ המקום שבו הכל קורה";

const pinnedMessages = {
  events: {
    id: "pinned-events",
    title: "אירועים בבניין",
    content: "עדכונים על מפגשי דיירים, סדנאות ופעילויות קהילה יופיעו כאן.",
    type: "pinned",
    icon: "📅",
    order: 10,
  },
  personal: {
    id: "pinned-personal",
    title: "איזור אישי לדייר",
    content: "בהמשך ניתן להציג הודעות אישיות, מסמכים ועדכונים לפי דייר או חדר.",
    type: "pinned",
    icon: "👤",
    order: 20,
  },
  service: {
    id: "pinned-service",
    title: "קריאות שירות",
    content: "פתיחת תקלות, עדכון סטטוס ומעקב אחר טיפול בדירה או בשטחים הציבוריים.",
    type: "pinned",
    icon: "🔧",
    order: 30,
  },
  packages: {
    id: "pinned-packages",
    title: "חבילות בדלפק הקבלה",
    content: "כאן יוצגו חבילות שממתינות לאיסוף ושעות איסוף מעודכנות.",
    type: "pinned",
    icon: "📦",
    order: 40,
  },
  maintenance: {
    id: "pinned-maintenance",
    title: "תחזוקה שוטפת",
    content: "עדכונים על עבודות תחזוקה, ניקיון, מעליות, מים וחשמל יוצגו כאן.",
    type: "pinned",
    icon: "🧹",
    order: 50,
  },
  reception: {
    id: "pinned-reception",
    title: "דלפק קבלה",
    content: "שעות פעילות, נהלים, הודעות קבלה ויצירת קשר עם הנהלת הבניין.",
    type: "pinned",
    icon: "🛎️",
    order: 60,
  },
};

const defaultPinnedModules = {
  events: true,
  personal: true,
  service: true,
  packages: true,
  maintenance: true,
  reception: true,
};

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

function parsePinnedModules(value) {
  try {
    return { ...defaultPinnedModules, ...JSON.parse(value || "{}") };
  } catch {
    return defaultPinnedModules;
  }
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
    const readSet = new Set(readPostIds.map(String));
    const enabledPinnedModules = parsePinnedModules(settings.enabled_pinned_modules);

    const urgentAdminMessages = posts
      .filter((post) => post.type === "urgent")
      .filter((post) => !readSet.has(String(post.id)))
      .map((post) => ({
        ...post,
        icon: "🚨",
        messageKind: "urgent",
      }));

    const activePinnedMessages = Object.entries(pinnedMessages)
      .filter(([key]) => enabledPinnedModules[key])
      .map(([, message]) => ({
        ...message,
        created_at: "2026-01-01T00:00:00.000Z",
        messageKind: "pinned",
      }))
      .sort((a, b) => a.order - b.order);

    const regularAdminMessages = posts
      .filter((post) => post.type !== "urgent")
      .map((post) => ({
        ...post,
        icon: "📌",
        messageKind: "regular",
      }));

    return [
      ...urgentAdminMessages,
      ...activePinnedMessages,
      ...regularAdminMessages,
    ];
  }, [posts, readPostIds, settings.enabled_pinned_modules]);

  const messagePages = useMemo(() => {
    const pages = [];

    for (let i = 0; i < messages.length; i += 3) {
      pages.push(messages.slice(i, i + 3));
    }

    return pages.length > 0 ? pages : [[]];
  }, [messages]);

  useEffect(() => {
    if (messagePages.length <= 1) return;

    const slideTimer = setInterval(() => {
      setPageIndex((current) => (current + 1) % messagePages.length);
    }, 10000);

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
                className={[
                  message.messageKind === "urgent" ? "urgent-message" : "",
                  message.messageKind === "pinned" ? "pinned-message" : "",
                  message.messageKind === "regular" ? "regular-message" : "",
                  index === 0 ? "first-message" : "",
                ].join(" ")}
              >
                <div className="message-icon">{message.icon || "📌"}</div>

                <div className="message-content">
                  <h3>{message.title}</h3>
                  <p>{message.content}</p>
                </div>

                {message.messageKind === "urgent" && (
                  <button type="button" onClick={() => markAsRead(message.id)}>
                    קראתי
                  </button>
                )}
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
