import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TV() {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (!lat || !lon) {
      setWeather(null);
      return;
    }

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
      } else {
        setWeather(null);
      }
    } catch (err) {
      console.log("Weather error:", err);
      setWeather(null);
    }
  };

  useEffect(() => {
    loadPosts();
    loadSettings();

    const channel = supabase
      .channel("synq-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, loadPosts)
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, loadSettings)
      .subscribe();

    const clock = setInterval(() => setNow(new Date()), 1000);
    const weatherTimer = setInterval(loadSettings, 10 * 60 * 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(clock);
      clearInterval(weatherTimer);
    };
  }, []);

  useEffect(() => {
    const regular = posts.filter((p) => p.type !== "urgent");
    if (regular.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % regular.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [posts.length]);

  const urgent = useMemo(() => {
    return posts.find((p) => {
      if (p.type !== "urgent" || !p.urgent_until) return false;
      return new Date(p.urgent_until).getTime() > now.getTime();
    });
  }, [posts, now]);

  const regularPosts = posts.filter((p) => p.type !== "urgent");
  const importantPosts = posts
    .filter((p) => p.type === "urgent" && (!p.urgent_until || new Date(p.urgent_until).getTime() <= now.getTime()))
    .slice(0, 3);

  const mainPost = regularPosts.length
    ? regularPosts[currentIndex % regularPosts.length]
    : null;

  if (urgent) {
    return (
      <div className="synq-urgent-screen">
        <img src="/synq-logo.png" className="synq-tv-logo top" />

        <div className="synq-urgent-card">
          <div className="synq-pill">הודעה דחופה</div>
          {urgent.image_url && <img src={urgent.image_url} className="urgent-img" />}
          <h1>{urgent.title}</h1>
          <p>{urgent.content}</p>
          <small>לחץ OK / Enter כדי להעביר לעדכון חשוב</small>
        </div>

        <div className="synq-time-box">
          {now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })} · {now.toLocaleDateString("he-IL")}
        </div>
      </div>
    );
  }

  return (
    <div className="synq-tv-screen">
      <aside className="synq-tv-left">
        <img src="/synq-logo.png" className="synq-tv-logo" />

        <div className="synq-building"></div>
      </aside>

      <main className="synq-tv-main">
        <section className="synq-board">
          <div className="board-title">
            <span className="circle-icon">📣</span>
            <h1>הודעות דיירים</h1>
          </div>

          {mainPost ? (
            <div className="notice-content">
              {mainPost.image_url && <img src={mainPost.image_url} className="notice-img" />}
              <h2>{mainPost.title}</h2>
              <p>{mainPost.content}</p>
            </div>
          ) : (
            <div className="notice-content">
              <h2>ברוכים הבאים למעון הסטודנטים SYNQ</h2>
              <p>כאן יוצגו הודעות, אירועים ועדכונים לדיירים.</p>
            </div>
          )}
        </section>

        <section className="synq-board small-board">
          <h2>עדכונים חשובים</h2>

          {importantPosts.length ? (
            importantPosts.map((post) => (
              <div className="important-row" key={post.id}>
                <span>⚠️</span>
                <div>
                  <strong>{post.title}</strong>
                  <p>{post.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>אין עדכונים חשובים כרגע.</p>
          )}
        </section>
      </main>

      <aside className="synq-tv-side">
        <div className="info-card">
          <span>יום</span>
          <strong>{now.toLocaleDateString("he-IL", { weekday: "long" })}</strong>
          <b>{now.toLocaleDateString("he-IL")}</b>
        </div>

        <div className="info-card">
          <span>שעה</span>
          <strong>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</strong>
        </div>

        <div className="info-card weather-card">
          <span>{settings.weather_city || "תל אביב"}</span>
          <div className="weather-icon">
            {weather?.code < 3 ? "☀️" : weather?.code < 50 ? "⛅" : weather?.code < 70 ? "🌧️" : "☁️"}
          </div>
          <strong>{weather ? Number.isFinite(Number(weather.temperature)) ? Math.round(Number(weather.temperature)) + "°" : "--" : "--"}</strong>
          <b>מזג אוויר נוכחי</b>
        </div>
      </aside>

      <footer className="synq-ticker">
        <span>{posts.map((p) => p.title).join(" • ") || "עדכונים חמים • אירועים • תחזוקה"}</span>
      </footer>
    </div>
  );
}
