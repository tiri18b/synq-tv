import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import buildingImage from "../assets/building-client.jpeg";
import "./TV.css";

const tickerText =
  "הגעתם הביתה - הגעתם ל- SYNQ * רשת המגורים החדשה לסטודנטים מקבוצת שבירו * SYNQ המקום שבו הכל קורה";

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

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  const urgent = useMemo(() => {
    return posts.find((post) => {
      if (post.type !== "urgent" || !post.urgent_until) return false;
      return new Date(post.urgent_until).getTime() > now.getTime();
    });
  }, [posts, now]);

  const visiblePosts = posts.slice(0, 3);

  if (urgent) {
    return (
      <main className="client-tv client-tv-urgent">
        <img src="/synq-logo.png" className="client-tv-urgent-logo" alt="SYNQ" />

        <section className="client-tv-urgent-card">
          <span>הודעה דחופה</span>
          <h1>{urgent.title}</h1>
          <p>{urgent.content}</p>
        </section>
      </main>
    );
  }

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

        <section className="client-tv-notices">
          <header>
            <span>🔔</span>
            <strong>הודעות חשובות</strong>
          </header>

          {visiblePosts.length > 0 ? (
            visiblePosts.map((post) => (
              <article key={post.id}>
                <span>📌</span>
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </div>
              </article>
            ))
          ) : (
            <>
              <article>
                <span>📅</span>
                <div>
                  <h3>מפגש דיירים</h3>
                  <p>יום שלישי | 18:00 | חדר כנסים</p>
                </div>
              </article>

              <article>
                <span>📦</span>
                <div>
                  <h3>חבילות בדלפק הקבלה</h3>
                  <p>יש לאסוף בימים א׳ עד ה׳ בין 09:00-17:00</p>
                </div>
              </article>

              <article>
                <span>🧹</span>
                <div>
                  <h3>תחזוקה שוטפת</h3>
                  <p>ביום רביעי יבוצעו עבודות תחזוקה בבניין</p>
                </div>
              </article>
            </>
          )}
        </section>
      </section>

      <footer className="client-tv-ticker">
        <marquee>{tickerText}</marquee>
        <b>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</b>
      </footer>
    </main>
  );
}
