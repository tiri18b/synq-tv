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

const demoContent = {
  events: {
    title: "אירועים",
    intro: "מודול אירועים יכול להפוך את המסך למרכז קהילתי חי, עם פרסום פעילויות, הרשמות ועדכונים בזמן אמת.",
    items: [
      ["לוח אירועים חודשי", "הצגת אירועים קרובים לפי תאריך ושעה."],
      ["הרשמה לאירועים", "דיירים יוכלו להירשם דרך אפליקציה או קישור."],
      ["תזכורות למסך TV", "אירוע חשוב יקפוץ אוטומטית למסך הראשי."],
      ["פילוח לפי קומה", "אפשר להציג אירועים רק לדיירים מסוימים."],
      ["ניהול מהדשבורד", "הוספה ועריכה ישירה מתוך מסך המנהל."],
      ["מודול בתשלום", "ניתן לפיתוח מלא לפי אפיון ותמחור נפרד."],
    ],
  },
  personal: {
    title: "איזור אישי",
    intro: "מודול איזור אישי יכול להפוך את SYNQ מפלטפורמת תצוגה למערכת דיירים מלאה.",
    items: [
      ["פרופיל דייר", "פרטים אישיים, מספר חדר והרשאות."],
      ["הודעות אישיות", "הודעות פרטיות לדייר או לקבוצה."],
      ["מסמכים", "חוזים, נהלים וטפסים במקום אחד."],
      ["חיבור לאפליקציה", "בסיס עתידי לאפליקציית דיירים."],
      ["הרשאות", "ניהול לפי דייר, הנהלה וקבלה."],
      ["מודול בתשלום", "ניתן לפיתוח מלא לפי אפיון ותמחור נפרד."],
    ],
  },
  service: {
    title: "קריאות שירות",
    intro: "מודול קריאות שירות יכול להפוך כל תקלה לתהליך מסודר עם סטטוס, אחריות ודוחות.",
    items: [
      ["פתיחת תקלה", "דייר פותח תקלה לפי קטגוריה."],
      ["סטטוס טיפול", "פתוח, בטיפול, ממתין, נסגר."],
      ["שיוך לטכנאי", "חלוקה לפי צוות תחזוקה."],
      ["צירוף תמונה", "אפשרות לצרף צילום של התקלה."],
      ["דוחות הנהלה", "כמה תקלות נפתחו ונסגרו בכל חודש."],
      ["מודול בתשלום", "ניתן לפיתוח מלא לפי אפיון ותמחור נפרד."],
    ],
  },
  packages: {
    title: "חבילות",
    intro: "מודול חבילות יכול לחסוך עומס בדלפק הקבלה ולעדכן דיירים בזמן אמת.",
    items: [
      ["חבילות שהתקבלו", "רשימת חבילות לפי דייר וחדר."],
      ["התראת איסוף", "הודעה לדייר שהחבילה ממתינה."],
      ["סטטוס איסוף", "ממתין, נאסף, הוחזר."],
      ["סריקה עתידית", "אפשרות עתידית לברקוד או QR."],
      ["דוח עומסים", "כמה חבילות מתקבלות בכל יום."],
      ["מודול בתשלום", "ניתן לפיתוח מלא לפי אפיון ותמחור נפרד."],
    ],
  },
  maintenance: {
    title: "תחזוקה",
    intro: "מודול תחזוקה מאפשר להציג עבודות יזומות ולמנוע בלבול אצל הדיירים.",
    items: [
      ["עבודות מתוכננות", "הודעה מראש על ניקיון, תיקונים או הפסקות."],
      ["תחזוקה לפי אזור", "קומה, חדר כביסה, לובי או חניון."],
      ["התראות דחופות", "הקפצה למסך TV בעת צורך."],
      ["היסטוריית עבודות", "מעקב אחר עבודות שבוצעו."],
      ["תיאום מול ספקים", "ניהול תאריכים ושעות פעילות."],
      ["מודול בתשלום", "ניתן לפיתוח מלא לפי אפיון ותמחור נפרד."],
    ],
  },
  reception: {
    title: "דלפק קבלה",
    intro: "מודול דלפק קבלה מאפשר להעביר לדיירים מידע חשוב בצורה ברורה ומיידית.",
    items: [
      ["שעות פעילות", "הצגת שעות קבלה ושינויים מיוחדים."],
      ["הודעות הנהלה", "עדכונים כלליים לכל הדיירים."],
      ["יצירת קשר", "טלפון, וואטסאפ או מייל."],
      ["נהלים", "כללי בניין, אורחים, חניה ושירותים."],
      ["תצוגה במסכים", "אפשר להציג הודעות לפי מסך או אזור."],
      ["מודול בתשלום", "ניתן לפיתוח מלא לפי אפיון ותמחור נפרד."],
    ],
  },
};

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
  const [clockPosition, setClockPosition] = useState("center");

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
      setClockPosition(obj.clock_position || "center");
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

  const saveSettings = async () => {
    await supabase.from("app_settings").upsert(
      [
        { key: "weather_city", value: weatherCity },
        { key: "weather_lat", value: weatherLat },
        { key: "weather_lon", value: weatherLon },
        { key: "clock_position", value: clockPosition },
      ],
      { onConflict: "key" }
    );
    alert("ההגדרות נשמרו");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const pageTitle = menu.find((item) => item[0] === active)?.[1] || "דשבורד";
  const demo = demoContent[active];

  return (
    <main className="admin-page">
      <aside>
        <img src="/synq-logo.png" alt="SYNQ" />
        {menu.map((item) => (
          <button key={item[0]} className={active === item[0] ? "on" : ""} onClick={() => setActive(item[0])}>
            {item[1]}
          </button>
        ))}
        <a href="/tv" target="_blank" rel="noreferrer">פתיחת מסך TV</a>
        <button className="logout-btn" onClick={logout}>יציאה</button>
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

        {demo && (
          <div className="admin-card">
            <h2>{demo.title} | דף דוגמה</h2>
            <p className="demo-intro">{demo.intro}</p>
            <div className="demo-grid detailed">
              {demo.items.map(([head, text]) => (
                <article key={head}>
                  <b>{head}</b>
                  <span>{text}</span>
                </article>
              ))}
            </div>
          </div>
        )}

        {active === "settings" && (
          <div className="admin-card">
            <h2>הגדרות מסך TV</h2>
            <label className="admin-field-label">שם עיר למזג אוויר</label>
            <input value={weatherCity} onChange={(e) => setWeatherCity(e.target.value)} />

            <label className="admin-field-label">קו רוחב</label>
            <input value={weatherLat} onChange={(e) => setWeatherLat(e.target.value)} />

            <label className="admin-field-label">קו אורך</label>
            <input value={weatherLon} onChange={(e) => setWeatherLon(e.target.value)} />

            <label className="admin-field-label">מיקום שעה ותאריך במסך TV</label>
            <select value={clockPosition} onChange={(e) => setClockPosition(e.target.value)}>
              <option value="left">שמאל למעלה</option>
              <option value="center">אמצע למעלה</option>
              <option value="right">ימין למעלה</option>
              <option value="bottom">למטה במרכז</option>
            </select>

            <button onClick={saveSettings}>שמירת הגדרות</button>
          </div>
        )}
      </section>
    </main>
  );
}
