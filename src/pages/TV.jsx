import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export default function TV() {
  const [posts, setPosts] = useState([]);
  const [now, setNow] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [dismissedUrgents, setDismissedUrgents] = useState([]);

  const loadPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    setPosts(data || []);
  };

  useEffect(() => {
    loadPosts();

    const channel = supabase
      .channel("posts-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, loadPosts)
      .subscribe();

    const clock = setInterval(() => setNow(new Date()), 1000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    const regular = posts.filter((p) => p.type !== "urgent");
    if (regular.length <= 1) return;

    const rotation = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % regular.length);
    }, 8000);

    return () => clearInterval(rotation);
  }, [posts.length]);

  const activeFullscreenUrgent = useMemo(() => {
    return posts.find((p) => {
      if (p.type !== "urgent" || !p.urgent_until) return false;
      if (dismissedUrgents.includes(p.id)) return false;
      return new Date(p.urgent_until).getTime() > now.getTime();
    });
  }, [posts, now, dismissedUrgents]);

  const importantUpdates = posts.filter((p) => {
    if (p.type !== "urgent") return false;
    if (dismissedUrgents.includes(p.id)) return true;
    if (!p.urgent_until) return true;
    return new Date(p.urgent_until).getTime() <= now.getTime();
  });

  const regularPosts = posts.filter((p) => p.type !== "urgent");
  const events = posts.filter((p) => p.type === "event").slice(0, 3);
  const updates = posts.filter((p) => p.type !== "urgent" && p.type !== "event").slice(0, 3);

  const mainPost =
    regularPosts.length > 0
      ? regularPosts[currentIndex % regularPosts.length]
      : null;

  const dismissUrgent = () => {
    if (!activeFullscreenUrgent) return;
    setDismissedUrgents((prev) =>
      prev.includes(activeFullscreenUrgent.id)
        ? prev
        : [...prev, activeFullscreenUrgent.id]
    );
  };

  const openAlert = (alert) => setSelectedAlert(alert);
  const closeAlert = () => setSelectedAlert(null);

  if (activeFullscreenUrgent) {
    return (
      <div
        className="urgent-fullscreen"
        tabIndex="0"
        autoFocus
        onClick={dismissUrgent}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "OK") dismissUrgent();
        }}
      >
        <div className="tv-logo urgent-logo">
          <h1>SYNQ</h1>
          <p>By Shbiro</p>
        </div>

        <div className="urgent-box">
          <div className="urgent-label">הודעה דחופה</div>

          {activeFullscreenUrgent.image_url && (
            <img className="urgent-image" src={activeFullscreenUrgent.image_url} alt={activeFullscreenUrgent.title} />
          )}

          <h2>{activeFullscreenUrgent.title}</h2>
          <p>{activeFullscreenUrgent.content}</p>
          <small>לחץ OK / Enter כדי להעביר את ההודעה לצד כעדכון חשוב</small>
        </div>

        <div className="urgent-time">
          {now.toLocaleDateString("he-IL")} · {now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    );
  }

  return (
    <div className="tv-screen">
      {selectedAlert && (
        <div
          className="alert-modal"
          tabIndex="0"
          autoFocus
          onClick={closeAlert}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "OK") closeAlert();
          }}
        >
          <div className="alert-modal-box">
            <div className="urgent-label">⚠️ עדכון חשוב</div>

            {selectedAlert.image_url && (
              <img className="urgent-image" src={selectedAlert.image_url} alt={selectedAlert.title} />
            )}

            <h2>{selectedAlert.title}</h2>
            <p>{selectedAlert.content}</p>
            <small>לחץ OK / Enter לסגירה</small>
          </div>
        </div>
      )}

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
              {mainPost.image_url && <img className="main-image" src={mainPost.image_url} alt={mainPost.title} />}
              <h2>{mainPost.title}</h2>
              <p>{mainPost.content}</p>
            </>
          ) : (
            <>
              <h2>ברוכים הבאים למעון הסטודנטים SYNQ</h2>
              <p>כאן יוצגו הודעות, אירועים ועדכונים לדיירים.</p>
            </>
          )}
        </section>

        <section className="side-card">
          <h3>⚠️ עדכונים חשובים</h3>

          {importantUpdates.length === 0 ? (
            <p>אין עדכונים חשובים כרגע.</p>
          ) : (
            importantUpdates.slice(0, 3).map((alert) => (
              <button
                key={alert.id}
                className="tv-alert-button"
                type="button"
                onClick={() => openAlert(alert)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "OK") openAlert(alert);
                }}
              >
                <span>⚠️</span>
                <strong>{alert.title}</strong>
                <small>לחץ OK לפתיחה</small>
              </button>
            ))
          )}
        </section>

        <section className="side-card">
          <h3>אירועים ועדכונים</h3>

          {[...events, ...updates].slice(0, 3).map((item) => (
            <div className="mini-post" key={item.id}>
              {item.image_url && <img className="mini-image" src={item.image_url} alt={item.title} />}
              <strong>{item.title}</strong>
              <span>{item.content}</span>
            </div>
          ))}
        </section>
      </main>

      <footer className="ticker">
        <span>
          SYNQ By Shbiro • {posts.map((p) => p.type === "urgent" ? "⚠️ " + p.title : p.title).join(" • ") || "עדכונים חמים • אירועים • תחזוקה"}
        </span>
      </footer>
    </div>
  );
}
