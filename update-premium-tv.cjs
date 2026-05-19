const fs = require("fs");

fs.writeFileSync("src/pages/TV.jsx", `import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TV() {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadPosts = async () => {
    const { data } = await supabase.from("posts").select("*").eq("active", true).order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const loadSettings = async () => {
    const { data } = await supabase.from("app_settings").select("*");
    const obj = {};
    (data || []).forEach((row) => obj[row.key] = row.value);
    setSettings(obj);
    loadWeather(obj.weather_lat, obj.weather_lon);
  };

  const loadWeather = async (lat, lon) => {
    if (!lat || !lon) return;
    const res = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current=temperature_2m,weather_code&forecast_days=1\`);
    const data = await res.json();
    setWeather(data.current);
  };

  useEffect(() => {
    loadPosts();
    loadSettings();

    const channel = supabase
      .channel("live-data")
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
    const timer = setInterval(() => setCurrentIndex((p) => (p + 1) % regular.length), 8000);
    return () => clearInterval(timer);
  }, [posts.length]);

  const activeUrgent = useMemo(() => {
    return posts.find((p) => p.type === "urgent" && p.urgent_until && new Date(p.urgent_until) > now);
  }, [posts, now]);

  const regularPosts = posts.filter((p) => p.type !== "urgent");
  const mainPost = regularPosts.length ? regularPosts[currentIndex % regularPosts.length] : null;
  const important = posts.filter((p) => p.type === "urgent" && (!p.urgent_until || new Date(p.urgent_until) <= now)).slice(0, 4);

  if (activeUrgent) {
    return (
      <div className="premium-urgent">
        <div className="premium-logo">SYNQ <span>By Shbiro</span></div>
        <div className="premium-urgent-card">
          <div className="premium-pill">הודעה דחופה</div>
          {activeUrgent.image_url && <img src={activeUrgent.image_url} />}
          <h1>{activeUrgent.title}</h1>
          <p>{activeUrgent.content}</p>
          <small>לחץ OK / Enter כדי להעביר לעדכון חשוב</small>
        </div>
        <div className="premium-time">{now.toLocaleTimeString("he-IL", {hour:"2-digit", minute:"2-digit"})} · {now.toLocaleDateString("he-IL")}</div>
      </div>
    );
  }

  return (
    <div className="premium-tv">
      <section className="premium-left">
        <div className="premium-logo big">SYNQ <span>By Shbiro</span></div>
        <div className="building-card"></div>
      </section>

      <main className="premium-center">
        <div className="premium-card main">
          <div className="premium-pill">הודעות דיירים</div>
          {mainPost?.image_url && <img className="premium-main-img" src={mainPost.image_url} />}
          <h1>{mainPost?.title || "ברוכים הבאים למעון הסטודנטים SYNQ"}</h1>
          <p>{mainPost?.content || "כאן יוצגו הודעות, אירועים ועדכונים לדיירים."}</p>
        </div>

        <div className="premium-card alerts">
          <h2>עדכונים חשובים</h2>
          {important.length ? important.map((p) => (
            <div className="premium-alert" key={p.id}>
              <span>⚠️</span>
              <div>
                <strong>{p.title}</strong>
                <p>{p.content}</p>
              </div>
            </div>
          )) : <p>אין עדכונים חשובים כרגע.</p>}
        </div>
      </main>

      <aside className="premium-side">
        <div className="side-box">
          <span>תאריך</span>
          <strong>{now.toLocaleDateString("he-IL")}</strong>
        </div>
        <div className="side-box">
          <span>שעה</span>
          <strong>{now.toLocaleTimeString("he-IL", {hour:"2-digit", minute:"2-digit"})}</strong>
        </div>
        <div className="side-box weather">
          <span>{settings.weather_city || "תל אביב"}</span>
          <strong>{weather ? Math.round(weather.temperature_2m) + "°" : "--"}</strong>
          <small>מזג אוויר נוכחי</small>
        </div>
      </aside>

      <footer className="ticker premium-ticker">
        <span>{posts.map((p) => p.title).join(" • ") || "עדכונים חמים • אירועים • תחזוקה"}</span>
      </footer>
    </div>
  );
}
`, "utf8");

console.log("TV premium updated");
