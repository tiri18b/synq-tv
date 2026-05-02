const fs = require("fs");

fs.writeFileSync("src/pages/TV.jsx", `import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TV() {
  const [posts, setPosts] = useState([]);
  const [now, setNow] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("active", true);

    if (!error) setPosts(data || []);
  };

  useEffect(() => {
    loadPosts();

    const channel = supabase
      .channel("posts-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => loadPosts()
      )
      .subscribe();

    const clock = setInterval(() => setNow(new Date()), 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    if (posts.length <= 1) return;

    const rotation = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 8000);

    return () => clearInterval(rotation);
  }, [posts.length]);

  const urgent = useMemo(() => posts.find((p) => p.type === "urgent"), [posts]);
  const events = posts.filter((p) => p.type === "event").slice(0, 3);
  const updates = posts.filter((p) => p.type !== "urgent" && p.type !== "event").slice(0, 3);

  const regularPosts = posts.filter((p) => p.type !== "urgent");
  const mainPost = regularPosts.length > 0
    ? regularPosts[currentIndex % regularPosts.length]
    : null;

  if (urgent) {
    return (
      <div className="urgent-fullscreen">
        <div className="tv-logo urgent-logo">
          <h1>SYNQ</h1>
          <p>By Shbiro</p>
        </div>

        <div className="urgent-box">
          <div className="urgent-label">הודעה דחופה</div>

          {urgent.image_url && (
            <img className="urgent-image" src={urgent.image_url} alt={urgent.title} />
          )}

          <h2>{urgent.title}</h2>
          <p>{urgent.content}</p>
        </div>

        <div className="urgent-time">
          {now.toLocaleDateString("he-IL")} · {now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    );
  }

  return (
    <div className="tv-screen">
      <header className="tv-header">
        <div className="date-box">
          <div>{now.toLocaleDateString("he-IL")}</div>
          <small>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</small>
        </div>

        <div className="tv-logo">
          <h1>SYNQ</h1>
          <p>By Shbiro</p>
        </div>
      </header>

      <main className="tv-grid">
        <section className="hero-card rotate-card">
          <div className="label">הודעה מרכזית</div>

          {mainPost ? (
            <>
              {mainPost.image_url && (
                <img className="main-image" src={mainPost.image_url} alt={mainPost.title} />
              )}
              <h2>{mainPost.title}</h2>
              <p>{mainPost.content}</p>

              <div className="rotation-dots">
                {regularPosts.map((post, index) => (
                  <span
                    key={post.id}
                    className={index === currentIndex % regularPosts.length ? "dot active-dot" : "dot"}
                  ></span>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2>ברוכים הבאים למעון הסטודנטים SYNQ</h2>
              <p>כאן יוצגו הודעות, אירועים ועדכונים לדיירים.</p>
            </>
          )}
        </section>

        <section className="side-card">
          <h3>אירועים קרובים</h3>
          {events.length === 0 ? (
            <p>אין אירועים פעילים כרגע.</p>
          ) : (
            events.map((event) => (
              <div className="mini-post" key={event.id}>
                {event.image_url && <img className="mini-image" src={event.image_url} alt={event.title} />}
                <strong>{event.title}</strong>
                <span>{event.content}</span>
              </div>
            ))
          )}
        </section>

        <section className="side-card">
          <h3>עדכונים</h3>
          {updates.length === 0 ? (
            <p>אין עדכונים פעילים כרגע.</p>
          ) : (
            updates.map((update) => (
              <div className="mini-post" key={update.id}>
                {update.image_url && <img className="mini-image" src={update.image_url} alt={update.title} />}
                <strong>{update.title}</strong>
                <span>{update.content}</span>
              </div>
            ))
          )}
        </section>
      </main>

      <footer className="ticker">
        <span>
          SYNQ By Shbiro • {posts.map((p) => p.title).join(" • ") || "עדכונים חמים • אירועים • תחזוקה • הודעות לדיירים"}
        </span>
      </footer>
    </div>
  );
}
`, "utf8");

console.log("TV rotation updated successfully");
