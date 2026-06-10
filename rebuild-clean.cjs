const fs = require("fs");

fs.writeFileSync("vercel.json", `{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
`, "utf8");

fs.writeFileSync("src/App.jsx", `import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TV from "./pages/TV.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import FeaturePage from "./pages/FeaturePage.jsx";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tv" replace />} />
        <Route path="/tv" element={<TV />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feature/:type" element={<FeaturePage />} />
      </Routes>
    </BrowserRouter>
  );
}
`, "utf8");

fs.writeFileSync("src/pages/Login.jsx", `import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin");
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("אימייל או סיסמה שגויים");
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleLogin}>
        <img src="/synq-logo.png" alt="SYNQ" />
        <h1>כניסת מנהל</h1>

        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">כניסה למערכת</button>
      </form>
    </div>
  );
}
`, "utf8");

fs.writeFileSync("src/pages/TV.jsx", `import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

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
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" +
          lat +
          "&longitude=" +
          lon +
          "&current_weather=true&timezone=Asia%2FJerusalem"
      );
      const json = await res.json();
      setWeather(json.current_weather || null);
    } catch {
      setWeather(null);
    }
  };

  useEffect(() => {
    loadPosts();
    loadSettings();

    const channel = supabase
      .channel("synq-tv")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, loadPosts)
      .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, loadSettings)
      .subscribe();

    const timer = setInterval(() => setNow(new Date()), 1000);

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
      <main className="tv-page urgent-screen">
        <img src="/synq-logo.png" className="tv-logo" />
        <section className="urgent-card">
          <span>הודעה דחופה</span>
          <h1>{urgent.title}</h1>
          <p>{urgent.content}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="tv-page">
      <section className="tv-left">
        <img src="/synq-logo.png" className="tv-logo" />

        <section className="welcome">
          <h1>ברוכים הבאים</h1>
          <h2>למעונות סטודנטים</h2>
        </section>

        <section className="notice-panel">
          <header>
            <strong>הודעות חשובות</strong>
            <span>🔔</span>
          </header>

          {visiblePosts.length > 0 ? (
            visiblePosts.map((post) => (
              <article key={post.id} className="notice-row">
                <span>📌</span>
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </div>
              </article>
            ))
          ) : (
            <>
              <article className="notice-row">
                <span>📅</span>
                <div>
                  <h3>מפגש דיירים</h3>
                  <p>יום שלישי | 18:00 | חדר כנסים</p>
                </div>
              </article>
              <article className="notice-row">
                <span>📦</span>
                <div>
                  <h3>חבילות בדלפק הקבלה</h3>
                  <p>יש לאסוף בימים א׳ עד ה׳ בין 09:00-17:00</p>
                </div>
              </article>
              <article className="notice-row">
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

      <section className="tv-right">
        <img src="/building.jpeg" className="building-bg" />

        <section className="weather-clock">
          <strong>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</strong>
          <span>{now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</span>
          <strong>{weather ? Math.round(Number(weather.temperature)) + "°" : "--"}</strong>
          <span>{settings.weather_city || "חיפה"}</span>
        </section>

        <section className="feature-grid">
          <Link to="/feature/events">📅<b>אירועים</b><small>(אופציונלי)</small></Link>
          <Link to="/feature/personal">👤<b>איזור אישי</b><small>(אופציונלי)</small></Link>
          <Link to="/feature/service">🔧<b>קריאת שירות</b><small>(אופציונלי)</small></Link>
          <Link to="/feature/packages">📦<b>חבילות</b><small>(אופציונלי)</small></Link>
          <Link to="/feature/maintenance">🧹<b>תחזוקה</b><small>(אופציונלי)</small></Link>
          <Link to="/feature/reception">🛎️<b>דלפק קבלה</b><small>(אופציונלי)</small></Link>
        </section>
      </section>

      <footer className="ticker">
        <b>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</b>
        <marquee>{tickerText}</marquee>
      </footer>
    </main>
  );
}
`, "utf8");

fs.writeFileSync("src/pages/FeaturePage.jsx", `import { Link, useParams } from "react-router-dom";

const pages = {
  events: ["אירועים", "📅", ["מפגש דיירים", "ערב קהילה", "סדנת פתיחה"]],
  personal: ["איזור אישי", "👤", ["פרטי דייר", "הודעות אישיות", "מסמכים"]],
  service: ["קריאת שירות", "🔧", ["פתיחת תקלה", "מעקב סטטוס", "תיאום טיפול"]],
  packages: ["חבילות", "📦", ["חבילות שהתקבלו", "שעות איסוף", "עדכון דלפק"]],
  maintenance: ["תחזוקה", "🧹", ["תחזוקה שוטפת", "ניקיון", "הפסקות יזומות"]],
  reception: ["דלפק קבלה", "🛎️", ["שעות פעילות", "יצירת קשר", "הודעות הנהלה"]],
};

export default function FeaturePage() {
  const { type } = useParams();
  const page = pages[type] || pages.events;

  return (
    <main className="feature-page">
      <img src="/synq-logo.png" />
      <section>
        <div>{page[1]}</div>
        <h1>{page[0]}</h1>
        <p>דף דוגמה למודול עתידי במערכת SYNQ.</p>

        {page[2].map((item) => (
          <article key={item}>{item}</article>
        ))}

        <Link to="/tv">חזרה למסך הראשי</Link>
      </section>
    </main>
  );
}
`, "utf8");

fs.writeFileSync("src/pages/Admin.jsx", `import { useEffect, useState } from "react";
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
            <p>מודול אופציונלי להצגה עתידית ללקוח.</p>
            <div className="demo-grid">
              <article>פריט לדוגמה 1</article>
              <article>פריט לדוגמה 2</article>
              <article>פריט לדוגמה 3</article>
            </div>
          </div>
        )}

        {active === "settings" && (
          <div className="admin-card">
            <h2>הגדרות מזג אוויר</h2>
            <input value={weatherCity} onChange={(e) => setWeatherCity(e.target.value)} />
            <input value={weatherLat} onChange={(e) => setWeatherLat(e.target.value)} />
            <input value={weatherLon} onChange={(e) => setWeatherLon(e.target.value)} />
            <button onClick={saveWeather}>שמירת מזג אוויר</button>
          </div>
        )}
      </section>
    </main>
  );
}
`, "utf8");

fs.writeFileSync("src/App.css", `html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  font-family: Assistant, Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

.tv-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: 41% 59%;
  direction: ltr;
  background: #fbf7ff;
  color: #241b35;
  position: relative;
}

.tv-left,
.tv-right,
.notice-panel,
.welcome,
.ticker,
.feature-grid a {
  direction: rtl;
}

.tv-left {
  height: 100vh;
  padding: 3vh 2.8vw 10vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 5;
}

.tv-logo {
  width: 24vw;
  max-width: 430px;
  min-width: 250px;
}

.welcome {
  text-align: center;
}

.welcome h1 {
  margin: 0;
  font-size: clamp(48px, 4.4vw, 86px);
  color: #6d3caf;
  line-height: 1;
  font-weight: 900;
}

.welcome h2 {
  margin: 1vh 0 0;
  font-size: clamp(32px, 2.8vw, 56px);
  color: #241b35;
  line-height: 1.1;
  font-weight: 900;
}

.notice-panel {
  width: 96%;
  max-height: 38vh;
  overflow: hidden;
  background: rgba(255,255,255,.94);
  border-radius: 20px;
  box-shadow: 0 18px 45px rgba(95,53,145,.16);
}

.notice-panel header {
  padding: 1.3vh 1.8vw;
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: #fff;
  display: flex;
  justify-content: space-between;
  font-size: clamp(22px, 1.65vw, 32px);
  font-weight: 900;
}

.notice-row {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 12px;
  padding: 1.1vh 1.7vw;
  border-bottom: 1px solid #eadcf7;
  align-items: center;
}

.notice-row > span {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #e6d9f4;
  display: grid;
  place-items: center;
  font-size: 22px;
}

.notice-row h3 {
  margin: 0;
  font-size: clamp(18px, 1.25vw, 25px);
}

.notice-row p {
  margin: .35vh 0 0;
  font-size: clamp(14px, .95vw, 19px);
}

.tv-right {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.building-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 74vh;
  object-fit: cover;
  object-position: center right;
  z-index: 1;
  mask-image:
    linear-gradient(to left, black 70%, rgba(0,0,0,.84) 82%, transparent 100%),
    linear-gradient(to bottom, black 68%, rgba(0,0,0,.55) 82%, transparent 100%);
  -webkit-mask-image:
    linear-gradient(to left, black 70%, rgba(0,0,0,.84) 82%, transparent 100%),
    linear-gradient(to bottom, black 68%, rgba(0,0,0,.55) 82%, transparent 100%);
}

.tv-right::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(to right, #fbf7ff 0%, rgba(251,247,255,.82) 14%, rgba(251,247,255,.18) 36%, transparent 64%),
    linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(251,247,255,.88) 79%, #fbf7ff 100%);
}

.weather-clock {
  position: absolute;
  top: 3vh;
  right: 3vw;
  text-align: center;
  z-index: 6;
  display: grid;
  gap: .6vh;
}

.weather-clock strong {
  font-size: clamp(34px, 3.1vw, 58px);
  color: #5b3199;
}

.weather-clock span {
  font-size: clamp(15px, 1.08vw, 21px);
  font-weight: 800;
}

.feature-grid {
  position: absolute;
  right: 2vw;
  left: 2vw;
  bottom: 10vh;
  z-index: 7;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1vw;
}

.feature-grid a {
  height: 18vh;
  min-height: 125px;
  max-height: 170px;
  border-radius: 18px;
  background: rgba(255,255,255,.94);
  text-decoration: none;
  color: #241b35;
  display: grid;
  place-items: center;
  text-align: center;
  font-size: clamp(30px, 2.5vw, 44px);
  box-shadow: 0 16px 34px rgba(95,53,145,.16);
}

.feature-grid b {
  font-size: clamp(15px, 1.05vw, 22px);
}

.feature-grid small {
  font-size: clamp(12px, .82vw, 16px);
}

.ticker {
  position: absolute;
  left: 3vw;
  right: 3vw;
  bottom: 2vh;
  height: 6.2vh;
  min-height: 52px;
  z-index: 20;
  background: rgba(235,222,249,.94);
  border-radius: 18px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  color: #5b3199;
  box-shadow: 0 10px 32px rgba(95,53,145,.15);
}

.ticker b {
  height: 100%;
  background: #7e4bb5;
  color: white;
  display: grid;
  place-items: center;
  font-size: clamp(18px, 1.5vw, 30px);
}

.ticker marquee {
  font-size: clamp(18px, 1.35vw, 27px);
  font-weight: 900;
}

.urgent-screen {
  display: grid;
  place-items: center;
}

.urgent-card {
  background: white;
  border-radius: 32px;
  padding: 6vh 6vw;
  text-align: center;
  box-shadow: 0 30px 80px rgba(95,53,145,.25);
  direction: rtl;
}

.urgent-card h1 {
  font-size: 5vw;
  color: #6d3caf;
}

.login-page {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  background: #fbf7ff;
}

.login-box {
  width: 420px;
  background: white;
  border-radius: 28px;
  padding: 36px;
  display: grid;
  gap: 18px;
  text-align: center;
  box-shadow: 0 25px 70px rgba(95,53,145,.2);
  direction: rtl;
}

.login-box img {
  width: 260px;
  margin: auto;
}

.login-box input,
.login-box button,
.admin-card input,
.admin-card textarea,
.admin-card select,
.admin-card button {
  width: 100%;
  border: 1px solid #eadcf7;
  border-radius: 14px;
  padding: 14px;
  font-size: 16px;
  font-family: inherit;
}

.login-box button,
.admin-card button {
  border: none;
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  font-weight: 900;
  cursor: pointer;
}

.admin-page {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 250px 1fr;
  direction: rtl;
  background: #f7f3fb;
  color: #241b35;
  overflow: hidden;
}

.admin-page aside {
  background: linear-gradient(180deg, #141124, #221538);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-page aside img {
  width: 160px;
  background: white;
  border-radius: 14px;
  padding: 8px;
  margin: 0 auto 14px;
}

.admin-page aside button,
.admin-page aside a {
  border: none;
  background: transparent;
  color: white;
  text-align: right;
  padding: 13px;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
}

.admin-page aside .on,
.admin-page aside button:hover,
.admin-page aside a:hover {
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
}

.admin-content {
  padding: 28px;
  overflow-y: auto;
}

.admin-content header h1 {
  margin: 0;
  color: #4c267f;
  font-size: 36px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin: 24px 0;
}

.stats article,
.admin-card {
  background: white;
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 18px 45px rgba(95,53,145,.1);
}

.stats b {
  display: block;
  font-size: 38px;
  color: #6d3caf;
}

.admin-card {
  margin-bottom: 22px;
  display: grid;
  gap: 14px;
}

.admin-card iframe {
  width: 100%;
  height: 430px;
  border: none;
  border-radius: 18px;
}

.post-admin-row {
  display: grid;
  grid-template-columns: 1fr 100px 100px;
  gap: 12px;
  align-items: center;
  background: #fbf8ff;
  padding: 14px;
  border-radius: 14px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.demo-grid article {
  background: #fbf8ff;
  border-radius: 18px;
  padding: 24px;
  font-weight: 900;
}

.feature-page {
  width: 100vw;
  height: 100vh;
  background: #fbf7ff;
  display: grid;
  place-items: center;
  direction: rtl;
  color: #241b35;
}

.feature-page > img {
  position: absolute;
  top: 4vh;
  right: 4vw;
  width: 260px;
}

.feature-page section {
  width: 55vw;
  background: white;
  border-radius: 32px;
  padding: 5vh 4vw;
  text-align: center;
  box-shadow: 0 25px 70px rgba(95,53,145,.2);
}

.feature-page section div {
  font-size: 70px;
}

.feature-page h1 {
  font-size: 58px;
  color: #6d3caf;
}

.feature-page article {
  background: #f1e8fb;
  padding: 16px;
  border-radius: 14px;
  margin: 12px 0;
  font-weight: 900;
}

.feature-page a {
  display: inline-block;
  margin-top: 20px;
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  text-decoration: none;
  padding: 16px 38px;
  border-radius: 16px;
  font-weight: 900;
}
`, "utf8");

console.log("Clean rebuild completed");
