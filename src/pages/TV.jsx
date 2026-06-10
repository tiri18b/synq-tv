import { useEffect, useMemo, useState } from "react";
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
