import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const menu = [
  ["dashboard", "דשבורד"],
  ["posts", "הודעות"],
  ["events", "אירועים"],
  ["personal", "איזור אישי"],
  ["service", "קריאות שירות"],
  ["packages", "חבילות"],
  ["maintenance", "תחזוקה"],
  ["reception", "דלפק קבלה"],
  ["settings", "הגדרות"],
];

export default function Admin() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("regular");
  const [weatherCity, setWeatherCity] = useState("חיפה");
  const [weatherLat, setWeatherLat] = useState("32.7940");
  const [weatherLon, setWeatherLon] = useState("34.9896");
  const [clockPosition, setClockPosition] = useState("right");

  const loadPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
        return;
      }

      loadPosts();

      const { data: settings } = await supabase.from("app_settings").select("*");
      const obj = {};
      (settings || []).forEach((row) => (obj[row.key] = row.value));
      setWeatherCity(obj.weather_city || "חיפה");
      setWeatherLat(obj.weather_lat || "32.7940");
      setWeatherLon(obj.weather_lon || "34.9896");
      setClockPosition(obj.clock_position || "right");
    };

    init();
  }, [navigate]);

  const savePost = async () => {
    if (!title.trim()) {
      alert("נא להזין כותרת");
      return;
    }

    const urgentUntil = type === "urgent" ? new Date(Date.now() + 10 * 60 * 1000).toISOString() : null;

    const { error } = await supabase.from("posts").insert({
      title,
      content,
      type,
      active: true,
      urgent_until: urgentUntil,
    });

    if (error) {
      alert("שגיאה בשמירת הודעה");
      return;
    }

    setTitle("");
    setContent("");
    setType("regular");
    loadPosts();
  };

  const togglePost = async (post) => {
    await supabase.from("posts").update({ active: !post.active }).eq("id", post.id);
    loadPosts();
  };

  const deletePost = async (post) => {
    if (!confirm("למחוק הודעה?")) return;
    await supabase.from("posts").delete().eq("id", post.id);
    loadPosts();
  };

  const saveWeather = async () => {
    await supabase.from("app_settings").upsert(
      [
        { key: "weather_city", value: weatherCity },
        { key: "weather_lat", value: weatherLat },
        { key: "weather_lon", value: weatherLon },
        { key: "clock_position", value: clockPosition },
      ],
      { onConflict: "key" }
    );
    alert("נשמר");
  };

  const pageTitle = menu.find((item) => item[0] === active)?.[1] || "דשבורד";

  return (
    <main className="admin-page">
      <aside>
        <img src="/synq-logo.png" />
        {menu.map((item) => (
          <button key={item[0]} className={active === item[0] ? "on" : ""} onClick={() => setActive(item[0])}>
            {item[1]}
          </button>
        ))}
        <a href="/tv" target="_blank">פתיחת מסך TV</a>
        <button onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}>
          יציאה
        </button>
      </aside>

      <section className="admin-content">
        <header>
          <h1>{pageTitle}</h1>
          <p>SYNQ By Shbiro | מערכת ניהול</p>
        </header>

        {active === "dashboard" && (
          <>
            <div className="stats">
              <article><b>{posts.filter((p) => p.active).length}</b><span>הודעות פעילות</span></article>
              <article><b>7</b><span>אירועים</span></article>
              <article><b>23</b><span>קריאות שירות</span></article>
              <article><b>18</b><span>חבילות</span></article>
            </div>

            <div className="admin-card">
              <h2>תצוגה מקדימה</h2>
              <iframe src="/tv" title="tv-preview" />
            </div>
          </>
        )}

        {active === "posts" && (
          <>
            <div className="admin-card">
              <h2>הוספת הודעה</h2>
              <input placeholder="כותרת" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea placeholder="תוכן" value={content} onChange={(e) => setContent(e.target.value)} />
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="regular">רגילה</option>
                <option value="urgent">דחופה ל 10 דקות</option>
              </select>
              <button onClick={savePost}>שמירה</button>
            </div>

            <div className="admin-card">
              <h2>ניהול הודעות</h2>
              {posts.map((post) => (
                <article className="post-admin-row" key={post.id}>
                  <div>
                    <b>{post.title}</b>
                    <span>{post.active ? "פעיל" : "לא פעיל"}</span>
                  </div>
                  <button onClick={() => togglePost(post)}>{post.active ? "כבה" : "הפעל"}</button>
                  <button onClick={() => deletePost(post)}>מחק</button>
                </article>
              ))}
            </div>
          </>
        )}

        {["events", "personal", "service", "packages", "maintenance", "reception"].includes(active) && (
          <div className="admin-card">
            <h2>{pageTitle} | דף דוגמה</h2>
            <p className="demo-intro">
              מודול זה מוצג כרגע כדוגמה. ניתן להפוך אותו לפיתוח מלא לפי דרישת הלקוח,
              כולל ניהול מהדשבורד, הרשאות, התראות, סטטוסים ודוחות.
            </p>

            <div className="demo-grid detailed">
              <article>
                <b>ניהול תוכן</b>
                <span>הוספה, עריכה ומחיקה של פריטים מתוך מסך הניהול.</span>
              </article>
              <article>
                <b>התראות ועדכונים</b>
                <span>אפשרות לשליחת הודעות למסכים, לדיירים או לקומות מסוימות.</span>
              </article>
              <article>
                <b>סטטוס ומעקב</b>
                <span>מעקב אחר טיפול, אישור ביצוע, היסטוריה ודוחות.</span>
              </article>
              <article>
                <b>הרשאות משתמשים</b>
                <span>מנהל ראשי, מנהל קבלה, תחזוקה, הנהלה ודיירים.</span>
              </article>
              <article>
                <b>חיבור עתידי לאפליקציה</b>
                <span>אפשרות להרחבה לאפליקציית דיירים והתראות Push.</span>
              </article>
              <article>
                <b>מודול בתשלום</b>
                <span>כל מודול ניתן לפיתוח מלא לפי אפיון ותמחור נפרד.</span>
              </article>
            </div>
          </div>
        )}

        {active === "settings" && (
          <div className="admin-card">
            <h2>הגדרות מזג אוויר</h2>
            <input value={weatherCity} onChange={(e) => setWeatherCity(e.target.value)} />
            <input value={weatherLat} onChange={(e) => setWeatherLat(e.target.value)} />
            <input value={weatherLon} onChange={(e) => setWeatherLon(e.target.value)} />
            <label className="admin-label">מיקום שעון במסך TV</label>
            <select value={clockPosition} onChange={(e) => setClockPosition(e.target.value)}>
              <option value="right">ימין למעלה</option>
              <option value="center">אמצע למעלה</option>
              <option value="left">שמאל למעלה</option>
              <option value="bottom">למטה במרכז</option>
            </select>
            <button onClick={saveWeather}>שמירת הגדרות</button>
          </div>
        )}
      </section>
    </main>
  );
}
