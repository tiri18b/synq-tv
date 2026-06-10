import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import buildingImage from "../assets/building.jpeg";
import "./TV.css";

const tickerText =
  "×”×’×¢×ª× ×”×‘×™×ª×” - ×”×’×¢×ª× ×œ- SYNQ * ×¨×©×ª ×”×ž×’×•×¨×™× ×”×—×“×©×” ×œ×¡×˜×•×“× ×˜×™× ×ž×§×‘×•×¦×ª ×©×‘×™×¨×• * SYNQ ×”×ž×§×•× ×©×‘×• ×”×›×œ ×§×•×¨×”";

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
          <span>×”×•×“×¢×” ×“×—×•×¤×”</span>
          <h1>{urgent.title}</h1>
          <p>{urgent.content}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="client-tv">
      <section className="client-tv-image-side">
        <img src={buildingImage} className="client-tv-building" alt="×‘× ×™×™×Ÿ SYNQ" />

        <section className="client-tv-feature-grid">
          <Link to="/feature/events">ðŸ“…<b>××™×¨×•×¢×™×</b><small>(××•×¤×¦×™×•× ×œ×™)</small></Link>
          <Link to="/feature/personal">ðŸ‘¤<b>××™×–×•×¨ ××™×©×™</b><small>(××•×¤×¦×™×•× ×œ×™)</small></Link>
          <Link to="/feature/service">ðŸ”§<b>×§×¨×™××ª ×©×™×¨×•×ª</b><small>(××•×¤×¦×™×•× ×œ×™)</small></Link>
          <Link to="/feature/packages">ðŸ“¦<b>×—×‘×™×œ×•×ª</b><small>(××•×¤×¦×™×•× ×œ×™)</small></Link>
          <Link to="/feature/maintenance">ðŸ§¹<b>×ª×—×–×•×§×”</b><small>(××•×¤×¦×™×•× ×œ×™)</small></Link>
          <Link to="/feature/reception">ðŸ›Žï¸<b>×“×œ×¤×§ ×§×‘×œ×”</b><small>(××•×¤×¦×™×•× ×œ×™)</small></Link>
        </section>
      </section>

      <section className="client-tv-content-side">
        <section className={"client-tv-live-info clock-" + (settings.clock_position || "center")}>
          <div className="client-tv-live-row">
            <span>ðŸ•’</span>
            <strong>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</strong>
          </div>

          <div className="client-tv-live-row">
            <span>ðŸ“…</span>
            <b>{now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</b>
          </div>

          <div className="client-tv-live-separator" />

          <div className="client-tv-live-row">
            <span>ðŸŒ¤ï¸</span>
            <strong>{weather ? Math.round(Number(weather.temperature)) + "Â°" : "--"}</strong>
          </div>

          <div className="client-tv-live-city">
            {settings.weather_city || "×—×™×¤×”"}
          </div>
        </section>

        <img src="/synq-logo.png" className="client-tv-logo" alt="SYNQ By Shbiro" />

        <section className="client-tv-welcome">
          <h1>×‘×¨×•×›×™× ×”×‘××™×</h1>
          <h2>×œ×ž×¢×•× ×•×ª ×¡×˜×•×“× ×˜×™×</h2>
        </section>

        <section className="client-tv-notices">
          <header>
            <span>ðŸ””</span>
            <strong>×”×•×“×¢×•×ª ×—×©×•×‘×•×ª</strong>
          </header>

          {visiblePosts.length > 0 ? (
            visiblePosts.map((post) => (
              <article key={post.id}>
                <span>ðŸ“Œ</span>
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </div>
              </article>
            ))
          ) : (
            <>
              <article>
                <span>ðŸ“…</span>
                <div>
                  <h3>×ž×¤×’×© ×“×™×™×¨×™×</h3>
                  <p>×™×•× ×©×œ×™×©×™ | 18:00 | ×—×“×¨ ×›× ×¡×™×</p>
                </div>
              </article>

              <article>
                <span>ðŸ“¦</span>
                <div>
                  <h3>×—×‘×™×œ×•×ª ×‘×“×œ×¤×§ ×”×§×‘×œ×”</h3>
                  <p>×™×© ×œ××¡×•×£ ×‘×™×ž×™× ××³ ×¢×“ ×”×³ ×‘×™×Ÿ 09:00-17:00</p>
                </div>
              </article>

              <article>
                <span>ðŸ§¹</span>
                <div>
                  <h3>×ª×—×–×•×§×” ×©×•×˜×¤×ª</h3>
                  <p>×‘×™×•× ×¨×‘×™×¢×™ ×™×‘×•×¦×¢×• ×¢×‘×•×“×•×ª ×ª×—×–×•×§×” ×‘×‘× ×™×™×Ÿ</p>
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

