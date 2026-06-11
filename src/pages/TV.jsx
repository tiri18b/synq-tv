import { useEffect, useMemo, useState } from "react";
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
      .filter((post) => {
        if (post.type !== "urgent") return true;
        return !readSet.has(String(post.id));
      })
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

                {message.type === "urgent" && (
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
