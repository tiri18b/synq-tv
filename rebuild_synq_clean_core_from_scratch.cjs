const fs = require("fs");
const path = require("path");

function write(file, content) {
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function exists(file) {
  return fs.existsSync(file);
}

function backup(file) {
  if (!exists(file)) return;

  const backupDir = "_backup_before_clean_rebuild";
  fs.mkdirSync(backupDir, { recursive: true });

  const safeName = file.replace(/[\\/:]/g, "_");
  fs.copyFileSync(file, path.join(backupDir, safeName));
}

const tvPath = "src/pages/TV.jsx";
const adminPath = "src/pages/Admin.jsx";
const featurePath = "src/pages/FeaturePage.jsx";
const tvCssPath = "src/pages/TV.css";
const featureCssPath = "src/pages/FeaturePage.css";
const adminCssPath = "src/styles/generated-admin-clean.css";

[tvPath, adminPath, featurePath, tvCssPath, featureCssPath, adminCssPath].forEach(backup);

const adminJsx = `import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/generated-admin-clean.css";

const menu = [
  ["dashboard", "דשבורד"],
  ["overview", "סקירת מערכת"],
  ["posts", "הודעות"],
  ["events", "אירועים"],
  ["personal", "איזור אישי"],
  ["service", "קריאות שירות"],
  ["packages", "חבילות"],
  ["maintenance", "תחזוקה"],
  ["reception", "דלפק קבלה"],
  ["settings", "הגדרות"],
];

const pinnedModules = [
  ["events", "אירועים", "📅"],
  ["personal", "איזור אישי", "👤"],
  ["service", "קריאות שירות", "🔧"],
  ["packages", "חבילות", "📦"],
  ["maintenance", "תחזוקה", "🧹"],
  ["reception", "דלפק קבלה", "🛎️"],
];

const defaultPinnedModules = {
  events: true,
  personal: true,
  service: true,
  packages: true,
  maintenance: true,
  reception: true,
};

const israelWeatherCities = [
  { city: "ירושלים", lat: "31.7683", lon: "35.2137" },
  { city: "תל אביב", lat: "32.0853", lon: "34.7818" },
  { city: "חיפה", lat: "32.7940", lon: "34.9896" },
  { city: "באר שבע", lat: "31.2520", lon: "34.7915" },
  { city: "אילת", lat: "29.5577", lon: "34.9519" },
  { city: "אשדוד", lat: "31.8044", lon: "34.6553" },
  { city: "אשקלון", lat: "31.6688", lon: "34.5743" },
  { city: "ראשון לציון", lat: "31.9730", lon: "34.7925" },
  { city: "פתח תקווה", lat: "32.0840", lon: "34.8878" },
  { city: "רמת גן", lat: "32.0684", lon: "34.8248" },
  { city: "חולון", lat: "32.0158", lon: "34.7874" },
  { city: "בת ים", lat: "32.0132", lon: "34.7480" },
  { city: "הרצליה", lat: "32.1624", lon: "34.8447" },
  { city: "נתניה", lat: "32.3215", lon: "34.8532" },
  { city: "כפר סבא", lat: "32.1782", lon: "34.9076" },
  { city: "רעננה", lat: "32.1848", lon: "34.8713" },
  { city: "הוד השרון", lat: "32.1593", lon: "34.8932" },
  { city: "מודיעין מכבים רעות", lat: "31.8980", lon: "35.0104" },
  { city: "בית שמש", lat: "31.7450", lon: "34.9881" },
  { city: "רחובות", lat: "31.8948", lon: "34.8113" },
  { city: "נס ציונה", lat: "31.9293", lon: "34.7987" },
  { city: "יבנה", lat: "31.8781", lon: "34.7394" },
  { city: "עפולה", lat: "32.6091", lon: "35.2892" },
  { city: "נצרת", lat: "32.6996", lon: "35.3035" },
  { city: "נוף הגליל", lat: "32.7089", lon: "35.3247" },
  { city: "מגדל העמק", lat: "32.6750", lon: "35.2394" },
  { city: "טבריה", lat: "32.7922", lon: "35.5312" },
  { city: "צפת", lat: "32.9646", lon: "35.4960" },
  { city: "קריית שמונה", lat: "33.2073", lon: "35.5721" },
  { city: "עכו", lat: "32.9281", lon: "35.0818" },
  { city: "נהריה", lat: "33.0059", lon: "35.0987" },
  { city: "כרמיאל", lat: "32.9199", lon: "35.2901" },
  { city: "חדרה", lat: "32.4340", lon: "34.9196" },
  { city: "זכרון יעקב", lat: "32.5732", lon: "34.9520" },
  { city: "ראש העין", lat: "32.0958", lon: "34.9566" },
  { city: "לוד", lat: "31.9510", lon: "34.8881" },
  { city: "רמלה", lat: "31.9292", lon: "34.8656" },
  { city: "דימונה", lat: "31.0708", lon: "35.0327" },
  { city: "ערד", lat: "31.2588", lon: "35.2137" },
  { city: "מצפה רמון", lat: "30.6102", lon: "34.8019" },
  { city: "נתיבות", lat: "31.4231", lon: "34.5890" },
  { city: "אופקים", lat: "31.3141", lon: "34.6203" },
  { city: "שדרות", lat: "31.5250", lon: "34.5969" },
];

const moduleContent = {
  events: ["אירועים", "ניהול אירועים, מפגשי דיירים, הרצאות וסדנאות עם הצגה במסכי TV."],
  personal: ["איזור אישי", "פורטל עתידי לדיירים עם הודעות אישיות, מסמכים ועדכונים לפי חדר."],
  service: ["קריאות שירות", "פתיחת תקלות, שיוך לטיפול ומעקב סטטוס בצורה מסודרת וברורה."],
  packages: ["חבילות", "ניהול חבילות שממתינות לאיסוף והצגת תזכורות לדיירים."],
  maintenance: ["תחזוקה", "עדכוני עבודות תחזוקה, מעליות, מים, חשמל וניקיון אזורי."],
  reception: ["דלפק קבלה", "שעות פעילות, נהלים, הודעות קבלה ואנשי קשר לדיירים."],
};

function parseJson(value, fallback) {
  try {
    return { ...fallback, ...JSON.parse(value || "{}") };
  } catch {
    return fallback;
  }
}

function findWeatherCity(cityName) {
  return israelWeatherCities.find((item) => item.city === cityName) || israelWeatherCities[2];
}

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
  const [enabledPinnedModules, setEnabledPinnedModules] = useState(defaultPinnedModules);

  const loadPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const loadSettings = async () => {
    const { data } = await supabase.from("app_settings").select("*");
    const obj = {};

    (data || []).forEach((row) => {
      obj[row.key] = row.value;
    });

    setWeatherCity(obj.weather_city || "חיפה");
    setWeatherLat(obj.weather_lat || "32.7940");
    setWeatherLon(obj.weather_lon || "34.9896");
    setClockPosition(obj.clock_position || "center");
    setEnabledPinnedModules(parseJson(obj.enabled_pinned_modules, defaultPinnedModules));
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/login");
        return;
      }

      await loadPosts();
      await loadSettings();
    };

    init();
  }, [navigate]);

  const updateWeatherCity = (cityName) => {
    const selectedCity = findWeatherCity(cityName);
    setWeatherCity(selectedCity.city);
    setWeatherLat(selectedCity.lat);
    setWeatherLon(selectedCity.lon);
  };

  const saveWeatherSettings = async () => {
    await supabase.from("app_settings").upsert(
      [
        { key: "weather_city", value: weatherCity },
        { key: "weather_lat", value: weatherLat },
        { key: "weather_lon", value: weatherLon },
      ],
      { onConflict: "key" }
    );

    alert("הגדרת מזג האוויר נשמרה");
  };

  const saveClockSettings = async () => {
    await supabase.from("app_settings").upsert(
      [{ key: "clock_position", value: clockPosition }],
      { onConflict: "key" }
    );

    alert("הגדרת מיקום השעה נשמרה");
  };

  const savePinnedSettings = async () => {
    await supabase.from("app_settings").upsert(
      [{ key: "enabled_pinned_modules", value: JSON.stringify(enabledPinnedModules) }],
      { onConflict: "key" }
    );

    alert("הגדרת הודעות נעוצות נשמרה");
  };

  const savePost = async () => {
    if (!title.trim()) {
      alert("נא להזין כותרת");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      title,
      content,
      type,
      active: true,
      urgent_until: null,
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

  const togglePinnedModule = (key) => {
    setEnabledPinnedModules((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const pageTitle = menu.find((item) => item[0] === active)?.[1] || "דשבורד";
  const currentModule = moduleContent[active];

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

        <button className="logout-btn" onClick={logout}>
          יציאה
        </button>
      </aside>

      <section className="admin-content">
        <header>
          <h1>{pageTitle}</h1>
          <p>SYNQ By Shbiro | מערכת ניהול ותצוגה חכמה למסכי דיירים</p>
        </header>

        {active === "dashboard" && (
          <>
            <div className="stats">
              <article><b>{posts.filter((p) => p.active).length}</b><span>הודעות פעילות</span></article>
              <article><b>{Object.values(enabledPinnedModules).filter(Boolean).length}</b><span>נעוצות פעילות</span></article>
              <article><b>ענן</b><span>שרת מסונכרן</span></article>
              <article><b>TV</b><span>תצוגת דיירים</span></article>
            </div>

            <div className="admin-card dashboard-intro">
              <h2>מה הלקוח מקבל כאן?</h2>
              <p>
                SYNQ היא מערכת מידע חכמה למסכי דיירים, שמחברת בין דף ניהול מרכזי לבין מסכי TV בבניין.
                כל הודעה, עדכון, עיר מזג אוויר או מודול שירות מסתנכרנים דרך שרת ענן ומופיעים לדיירים בצורה נקייה,
                מהירה ומקצועית.
              </p>

              <div className="dashboard-pitches">
                <article>
                  <b>שרת הודעות מסונכרן</b>
                  <span>הודעות רגילות, דחופות ונעוצות נשלחות מהניהול למסכי TV דרך הענן.</span>
                </article>
                <article>
                  <b>תצוגת TV מקצועית</b>
                  <span>שעה, תאריך, מזג אוויר, הודעות ודפי שירות מוכנים להרחבה.</span>
                </article>
                <article>
                  <b>ניהול מרחוק</b>
                  <span>אפשר לעדכן תוכן ולהפעיל מודולים מכל מקום עם חיבור לרשת.</span>
                </article>
              </div>
            </div>

            <div className="admin-card">
              <h2>תצוגה מקדימה</h2>
              <iframe src="/tv" title="tv-preview" />
            </div>
          </>
        )}

        {active === "overview" && (
          <div className="admin-card system-overview-page">
            <section className="overview-hero-panel">
              <div>
                <span className="overview-kicker">SYNQ By Shbiro</span>
                <h2>מערכת מידע חכמה למסכי דיירים</h2>
                <p>
                  SYNQ מחברת בין הנהלת הבניין, הדיירים והמסכים בשטח דרך שרת ענן מרכזי,
                  עם הודעות דחיפה מסונכרנות, עדכונים בזמן אמת וחוויית תצוגה נקייה שמתאימה למסכי TV.
                </p>
              </div>
              <strong>ניהול אחד | תצוגות רבות | סנכרון מלא</strong>
            </section>

            <section className="overview-grid">
              <article><b>שרת ענן מרכזי</b><p>כל ההודעות וההגדרות נשמרים בשרת מאובטח ומסתנכרנים למסכים המחוברים.</p></article>
              <article><b>הודעות דחיפה מסונכרנות</b><p>הודעות רגילות, דחופות ונעוצות מופיעות במסך TV בצורה מסודרת וברורה.</p></article>
              <article><b>מסך TV חכם</b><p>ברוכים הבאים, שעה, תאריך, מזג אוויר, הודעות ודפי שירות עתידיים.</p></article>
              <article><b>מודולים עתידיים</b><p>חבילות, קריאות שירות, איזור אישי, אירועים, תחזוקה ודלפק קבלה.</p></article>
              <article><b>שליטה מרחוק</b><p>מנהל הבניין יכול לעדכן תוכן מכל מקום שבו יש חיבור לרשת.</p></article>
              <article><b>חוויה למסכי TV</b><p>טקסטים גדולים, כרטיסים ברורים וניווט פשוט עם השלט.</p></article>
            </section>

            <section className="overview-pricing-panel">
              <h3>תמחור מומלץ לפרויקט</h3>
              <div className="pricing-cards">
                <article><span>הקמה חד פעמית</span><b>₪3,500</b><p>עיצוב מערכת, מסך TV, דף ניהול, חיבור לענן והכנה להפעלה.</p></article>
                <article><span>תחזוקה חודשית</span><b>₪350</b><p>שרת ענן, עדכונים, גיבוי, תמיכה ושמירה על פעילות שוטפת.</p></article>
                <article><span>מודולים מתקדמים</span><b>לפי דרישה</b><p>דיירים, הרשאות, חבילות, קריאות שירות, דוחות וניהול מתקדם.</p></article>
              </div>
            </section>

            <section className="overview-navigation-callout">
              <b>לחוויה המושלמת</b>
              <p>מומלץ להשתמש במקשי הניווט של השלט כדי לעבור בין אזורי המערכת, לפתוח דפי דוגמה ולראות כיצד SYNQ מרגישה על מסך TV אמיתי.</p>
            </section>
          </div>
        )}

        {active === "posts" && (
          <>
            <div className="admin-card">
              <h2>הוספת הודעה למסך</h2>
              <p className="admin-helper">
                הודעה רגילה תצטרף לתור ההודעות אחרי ההודעות הנעוצות. הודעה דחופה תעלה תמיד ראשונה ותציג כפתור קראתי.
              </p>

              <input placeholder="כותרת" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea placeholder="תוכן ההודעה" value={content} onChange={(e) => setContent(e.target.value)} />

              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="regular">הודעה רגילה</option>
                <option value="urgent">הודעה דחופה עד סימון קראתי</option>
              </select>

              <button onClick={savePost}>שמירת הודעה</button>
            </div>

            <div className="admin-card">
              <h2>ניהול הודעות קיימות</h2>
              {posts.length === 0 && <p>עדיין אין הודעות.</p>}

              {posts.map((post) => (
                <article className="post-admin-row" key={post.id}>
                  <div>
                    <b>{post.title}</b>
                    <span>{post.active ? "פעיל במסך" : "כבוי"} | {post.type === "urgent" ? "דחופה" : "רגילה"}</span>
                  </div>
                  <button onClick={() => togglePost(post)}>{post.active ? "כבה" : "הפעל"}</button>
                  <button onClick={() => deletePost(post)}>מחק</button>
                </article>
              ))}
            </div>
          </>
        )}

        {currentModule && (
          <div className="admin-card module-showcase">
            <section className="module-hero">
              <div>
                <h2>{currentModule[0]}</h2>
                <p>{currentModule[1]}</p>
                <strong>מודול אופציונלי לפיתוח מתקדם לפי הצורך של הלקוח.</strong>
              </div>
              <span>מוכן להרחבה</span>
            </section>

            <section className="module-actions">
              <button type="button">ניהול</button>
              <button type="button">הצגה במסך TV</button>
              <button type="button">התראה לדיירים</button>
              <button type="button">דוח פעילות</button>
            </section>
          </div>
        )}

        {active === "settings" && (
          <div className="admin-card settings-card">
            <h2>הגדרות מסך TV</h2>
            <p className="admin-helper">
              כאן מנהלים את מיקום השעה, התאריך, מזג האוויר והודעות נעוצות שמסתנכרנות למסכי TV דרך שרת הענן.
            </p>

            <div className="setting-save-row">
              <label>
                עיר למזג האוויר
                <select value={weatherCity} onChange={(e) => updateWeatherCity(e.target.value)}>
                  {israelWeatherCities.map((item) => (
                    <option key={item.city} value={item.city}>{item.city}</option>
                  ))}
                </select>
              </label>

              <button type="button" onClick={saveWeatherSettings}>שמור מזג אוויר</button>
            </div>

            <div className="setting-save-row">
              <label>
                מיקום שעה ותאריך במסך TV
                <select value={clockPosition} onChange={(e) => setClockPosition(e.target.value)}>
                  <option value="left">שמאל למעלה</option>
                  <option value="center">אמצע למעלה</option>
                  <option value="right">ימין למעלה</option>
                  <option value="bottom">למטה במרכז</option>
                </select>
              </label>

              <button type="button" onClick={saveClockSettings}>שמור מיקום שעה</button>
            </div>

            <section className="pinned-settings">
              <div className="setting-section-title-row">
                <h3>הודעות נעוצות במסך TV</h3>
                <button type="button" onClick={savePinnedSettings}>שמור הודעות נעוצות</button>
              </div>

              <p>
                הודעות אלו מגיעות מהמודולים בדשבורד ונשארות במסך לפי הפעלה.
                הודעות רגילות שהמנהל שולח יופיעו אחריהן, והודעות דחופות יופיעו מעל כולן.
              </p>

              <div className="pinned-toggle-grid">
                {pinnedModules.map(([key, label, icon]) => (
                  <label key={key} className={enabledPinnedModules[key] ? "enabled" : ""}>
                    <input type="checkbox" checked={!!enabledPinnedModules[key]} onChange={() => togglePinnedModule(key)} />
                    <span>{icon}</span>
                    <b>{label}</b>
                  </label>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
`;

const tvJsx = `import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import buildingImage from "../assets/building.jpeg";
import "./TV.css";

const tickerText = "הגעתם הביתה - הגעתם ל- SYNQ * רשת המגורים החדשה לסטודנטים מקבוצת שבירו * SYNQ המקום שבו הכל קורה";

const pinnedMessages = {
  events: { id: "pinned-events", title: "אירועים בבניין", content: "עדכונים על מפגשי דיירים, סדנאות ופעילויות קהילה יופיעו כאן.", type: "pinned", icon: "📅", order: 10 },
  personal: { id: "pinned-personal", title: "איזור אישי לדייר", content: "בהמשך ניתן להציג הודעות אישיות, מסמכים ועדכונים לפי דייר או חדר.", type: "pinned", icon: "👤", order: 20 },
  service: { id: "pinned-service", title: "קריאות שירות", content: "פתיחת תקלות, עדכון סטטוס ומעקב אחר טיפול בדירה או בשטחים הציבוריים.", type: "pinned", icon: "🔧", order: 30 },
  packages: { id: "pinned-packages", title: "חבילות בדלפק הקבלה", content: "כאן יוצגו חבילות שממתינות לאיסוף ושעות איסוף מעודכנות.", type: "pinned", icon: "📦", order: 40 },
  maintenance: { id: "pinned-maintenance", title: "תחזוקה שוטפת", content: "עדכונים על עבודות תחזוקה, ניקיון, מעליות, מים וחשמל יוצגו כאן.", type: "pinned", icon: "🧹", order: 50 },
  reception: { id: "pinned-reception", title: "דלפק קבלה", content: "שעות פעילות, נהלים, הודעות קבלה ויצירת קשר עם הנהלת הבניין.", type: "pinned", icon: "🛎️", order: 60 },
};

const defaultPinnedModules = {
  events: true,
  personal: true,
  service: true,
  packages: true,
  maintenance: true,
  reception: true,
};

function getReadPostIds() {
  try {
    return JSON.parse(localStorage.getItem("synq_read_posts") || "[]");
  } catch {
    return [];
  }
}

function saveReadPostIds(ids) {
  localStorage.setItem("synq_read_posts", JSON.stringify(ids));
}

function parseJson(value, fallback) {
  try {
    return { ...fallback, ...JSON.parse(value || "{}") };
  } catch {
    return fallback;
  }
}

export default function TV() {
  const openOldHomeFromTv = () => {
    if (window.SynqAndroid && typeof window.SynqAndroid.openOldHome === "function") {
      window.SynqAndroid.openOldHome();
      return;
    }

    alert("כפתור זה פעיל רק באפליקציית הסטרימר");
  };

  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(new Date());
  const [pageIndex, setPageIndex] = useState(0);
  const [readPostIds, setReadPostIds] = useState(getReadPostIds);

  const loadPosts = async () => {
    const { data } = await supabase.from("posts").select("*").eq("active", true).order("created_at", { ascending: false });
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

    const clockTimer = setInterval(() => setNow(new Date()), 1000);
    const postsRefreshTimer = setInterval(loadPosts, 5000);
    const settingsRefreshTimer = setInterval(loadSettings, 30000);

    const reloadWhenVisible = () => {
      if (!document.hidden) {
        loadPosts();
        loadSettings();
      }
    };

    window.addEventListener("focus", reloadWhenVisible);
    document.addEventListener("visibilitychange", reloadWhenVisible);

    return () => {
      clearInterval(clockTimer);
      clearInterval(postsRefreshTimer);
      clearInterval(settingsRefreshTimer);
      window.removeEventListener("focus", reloadWhenVisible);
      document.removeEventListener("visibilitychange", reloadWhenVisible);
      supabase.removeChannel(channel);
    };
  }, []);

  const messages = useMemo(() => {
    const readSet = new Set(readPostIds.map(String));
    const enabledPinnedModules = parseJson(settings.enabled_pinned_modules, defaultPinnedModules);

    const urgentAdminMessages = posts
      .filter((post) => post.type === "urgent")
      .filter((post) => !readSet.has(String(post.id)))
      .map((post) => ({ ...post, icon: "🚨", messageKind: "urgent" }));

    const activePinnedMessages = Object.entries(pinnedMessages)
      .filter(([key]) => enabledPinnedModules[key])
      .map(([, message]) => ({ ...message, created_at: "2026-01-01T00:00:00.000Z", messageKind: "pinned" }))
      .sort((a, b) => a.order - b.order);

    const regularAdminMessages = posts
      .filter((post) => post.type !== "urgent")
      .map((post) => ({ ...post, icon: "📌", messageKind: "regular" }));

    return [...urgentAdminMessages, ...activePinnedMessages, ...regularAdminMessages];
  }, [posts, readPostIds, settings.enabled_pinned_modules]);

  const messagePages = useMemo(() => {
    const pages = [];

    for (let i = 0; i < messages.length; i += 3) {
      pages.push(messages.slice(i, i + 3));
    }

    return pages.length > 0 ? pages : [[]];
  }, [messages]);

  useEffect(() => {
    if (messagePages.length <= 1) return;

    const slideTimer = setInterval(() => {
      setPageIndex((current) => (current + 1) % messagePages.length);
    }, 10000);

    return () => clearInterval(slideTimer);
  }, [messagePages.length]);

  useEffect(() => {
    setPageIndex(0);
  }, [messagePages.length]);

  const markAsRead = (postId) => {
    const nextReadIds = Array.from(new Set([...readPostIds.map(String), String(postId)]));
    setReadPostIds(nextReadIds);
    saveReadPostIds(nextReadIds);
  };

  const visibleMessages = messagePages[pageIndex % messagePages.length] || [];

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
          <div className="client-tv-live-row"><span>🕒</span><strong>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</strong></div>
          <div className="client-tv-live-row"><span>📅</span><b>{now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</b></div>
          <div className="client-tv-live-separator" />
          <div className="client-tv-live-row"><span>🌤️</span><strong>{weather ? Math.round(Number(weather.temperature)) + "°" : "--"}</strong></div>
          <div className="client-tv-live-city">{settings.weather_city || "חיפה"}</div>
        </section>

        <img src="/synq-logo.png" className="client-tv-logo" alt="SYNQ By Shbiro" />

        <section className="client-tv-welcome">
          <h1>ברוכים הבאים</h1>
          <h2>למעונות הסטודנטים</h2>
        </section>

        <section className="client-tv-message-stack">
          <header><span>🔔</span><strong>הודעות ועדכונים</strong></header>

          <div className="client-tv-message-list">
            {visibleMessages.map((message, index) => (
              <article
                key={message.id}
                className={[
                  message.messageKind === "urgent" ? "urgent-message" : "",
                  message.messageKind === "pinned" ? "pinned-message" : "",
                  message.messageKind === "regular" ? "regular-message" : "",
                  index === 0 ? "first-message" : "",
                ].join(" ")}
              >
                <div className="message-icon">{message.icon || "📌"}</div>
                <div className="message-content">
                  <h3>{message.title}</h3>
                  <p>{message.content}</p>
                </div>
                {message.messageKind === "urgent" && <button type="button" onClick={() => markAsRead(message.id)}>קראתי</button>}
              </article>
            ))}
          </div>

          <footer>
            {messagePages.map((page, index) => (
              <span key={index} className={index === pageIndex % messagePages.length ? "active" : ""} />
            ))}
          </footer>
        </section>
      </section>

      <button type="button" className="client-tv-home-button" onClick={openOldHomeFromTv}>אפליקציות</button>

      <footer className="client-tv-ticker">
        <marquee direction="right">{tickerText}</marquee>
        <b>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</b>
      </footer>
    </main>
  );
}
`;

const featureJsx = `import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import buildingImage from "../assets/building.jpeg";
import "./FeaturePage.css";

const pages = {
  events: ["אירועים", "📅", "מרכז אירועים לדיירים", "כאן ניתן להציג אירועים, מפגשי דיירים, סדנאות, הרצאות ופעילויות קהילה."],
  personal: ["איזור אישי", "👤", "פורטל אישי לדייר", "מודול עתידי שבו כל דייר יוכל לקבל הודעות אישיות, מסמכים ועדכונים."],
  service: ["קריאות שירות", "🔧", "ניהול תקלות ושירות", "מודול שירות שמרכז תקלות, שיוך לאנשי צוות, סטטוסים ועדכונים לדיירים."],
  packages: ["חבילות", "📦", "ניהול חבילות בדלפק", "מודול חבילות שמאפשר לעדכן דיירים על חבילות שממתינות לאיסוף."],
  maintenance: ["תחזוקה", "🧹", "עבודות תחזוקה ועדכונים", "מודול תחזוקה שמציג עבודות יזומות, אזורים מושפעים ושעות פעילות."],
  reception: ["דלפק קבלה", "🛎️", "מידע ושירותי קבלה", "מודול קבלה שמרכז שעות פעילות, נהלים, אנשי קשר ועדכונים חשובים."],
};

export default function FeaturePage() {
  const { type } = useParams();
  const page = pages[type] || pages.events;
  const [now, setNow] = useState(new Date());
  const [settings, setSettings] = useState({});
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);

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
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + encodeURIComponent(lat) + "&longitude=" + encodeURIComponent(lon) + "&current_weather=true&timezone=Asia%2FJerusalem");
        const json = await response.json();
        setWeather(json.current_weather || null);
      } catch {
        setWeather(null);
      }
    };

    loadSettings();
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="feature-tv-page">
      <section className="feature-image-side">
        <img src={buildingImage} className="feature-building" alt="SYNQ building" />
      </section>

      <section className="feature-content-side">
        <section className={"feature-live-info clock-" + (settings.clock_position || "center")}>
          <div className="feature-live-row"><span>🕒</span><strong>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</strong></div>
          <div className="feature-live-row"><span>📅</span><b>{now.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</b></div>
          <div className="feature-live-separator" />
          <div className="feature-live-row"><span>🌤️</span><strong>{weather ? Math.round(Number(weather.temperature)) + "°" : "--"}</strong></div>
          <div className="feature-live-city">{settings.weather_city || "חיפה"}</div>
        </section>

        <img src="/synq-logo.png" className="feature-logo" alt="SYNQ By Shbiro" />

        <section className="feature-hero-card">
          <div className="feature-icon">{page[1]}</div>
          <div>
            <h1>{page[0]}</h1>
            <h2>{page[2]}</h2>
            <p>{page[3]}</p>
          </div>
        </section>

        <section className="feature-actions">
          <button type="button">ניהול</button>
          <button type="button">הצגה במסך TV</button>
          <button type="button">התראה לדיירים</button>
          <button type="button">דוח פעילות</button>
        </section>

        <section className="feature-examples">
          <article><h3>דוגמה ראשונה</h3><p>תוכן לדוגמה שממחיש איך המודול יכול להיראות ללקוח.</p></article>
          <article><h3>עדכון לדיירים</h3><p>הודעה מסודרת וברורה שמופיעה במסכי TV בבניין.</p></article>
          <article><h3>הרחבה עתידית</h3><p>ניתן להפוך את הדף למודול מלא לפי צרכי הלקוח.</p></article>
        </section>

        <Link to="/tv" className="feature-back-button">חזרה למסך הבית</Link>
      </section>

      <footer className="feature-tv-ticker">
        <marquee direction="right">SYNQ By Shbiro * מערכת מידע חכמה לדיירים * מודול {page[0]} להרחבה עתידית לפי בקשת הלקוח</marquee>
        <b>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</b>
      </footer>
    </main>
  );
}
`;

const tvCss = `html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden !important;
}

.client-tv {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  direction: ltr;
  display: grid;
  grid-template-columns: 58% 42%;
  background: #fbf7ff;
  color: #241b35;
  position: relative;
  font-family: Assistant, Arial, sans-serif;
}

.client-tv-image-side {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.client-tv-building {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 80vh;
  object-fit: cover;
  object-position: center left;
}

.client-tv-image-side::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(to left, #fbf7ff 0%, rgba(251,247,255,.9) 10%, rgba(251,247,255,.48) 28%, rgba(251,247,255,.08) 48%, transparent 70%),
    linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(251,247,255,.78) 76%, #fbf7ff 100%);
}

.client-tv-content-side {
  height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 6;
  direction: rtl;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4vh 3vw 8.5vh;
}

.client-tv-logo {
  width: clamp(185px, 15vw, 300px);
  height: auto;
  object-fit: contain;
  margin-bottom: 2.2vh;
}

.client-tv-welcome {
  text-align: center;
  margin-bottom: 2.3vh;
}

.client-tv-welcome h1 {
  margin: 0;
  color: #6d3caf;
  font-size: clamp(44px, 4vw, 78px);
  line-height: 1;
  font-weight: 900;
}

.client-tv-welcome h2 {
  margin: .8vh 0 0;
  color: #241b35;
  font-size: clamp(28px, 2.35vw, 46px);
  line-height: 1;
  font-weight: 900;
}

.client-tv-message-stack {
  width: 94%;
  min-height: 30vh;
  max-height: 33.5vh;
  overflow: hidden;
  border-radius: 24px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 20px 50px rgba(95,53,145,.15);
}

.client-tv-message-stack header {
  height: 5.6vh;
  min-height: 44px;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: .85vh 1.5vw;
  color: #6d3caf;
  font-size: clamp(18px, 1.25vw, 26px);
  font-weight: 900;
}

.client-tv-message-list {
  min-height: 21vh;
  padding: .75vh .9vw;
  display: grid;
  gap: .45vh;
}

.client-tv-message-list article {
  min-height: 6.35vh;
  max-height: 7.1vh;
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: .8vw;
  padding: .55vh .75vw;
  border-radius: 18px;
  background: #f8f4ff;
  border: 1px solid #eadcf7;
}

.client-tv-message-list article.urgent-message {
  background: #fff0f0;
  border-color: #ffbbbb;
}

.message-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: #eadcf7;
  display: grid;
  place-items: center;
  font-size: 20px;
}

.message-content h3 {
  margin: 0 0 .25vh;
  color: #241b35;
  font-size: clamp(16px, 1.08vw, 23px);
  line-height: 1.05;
  font-weight: 900;
}

.message-content p {
  margin: 0;
  color: #3e314f;
  font-size: clamp(12px, .78vw, 16px);
  line-height: 1.25;
  font-weight: 800;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.client-tv-message-list button {
  border: none;
  border-radius: 999px;
  background: #7e4bb5;
  color: white;
  padding: 8px 12px;
  font-weight: 900;
}

.client-tv-message-stack footer {
  height: 2.8vh;
  min-height: 24px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.client-tv-message-stack footer span {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #d6c4ea;
}

.client-tv-message-stack footer span.active {
  width: 24px;
  background: #7e4bb5;
}

.client-tv-feature-grid {
  position: absolute;
  z-index: 5;
  left: 4vw;
  right: 4vw;
  bottom: 12vh;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .9vw;
}

.client-tv-feature-grid a {
  height: 15.5vh;
  min-height: 108px;
  max-height: 150px;
  border-radius: 22px;
  background: rgba(255,255,255,.9);
  color: #241b35;
  text-decoration: none;
  display: grid;
  place-items: center;
  text-align: center;
  box-shadow: 0 14px 32px rgba(95,53,145,.12);
  font-weight: 900;
}

.client-tv-feature-grid a b {
  display: block;
  font-size: clamp(16px, 1.05vw, 22px);
}

.client-tv-feature-grid a small {
  color: #6d3caf;
  font-weight: 900;
}

.client-tv-live-info {
  position: fixed;
  z-index: 999;
  min-width: 220px;
  direction: rtl;
  color: #4c267f;
}

.client-tv-live-row {
  display: grid;
  grid-template-columns: 38px 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: .8vh;
}

.client-tv-live-row span {
  font-size: clamp(22px, 1.55vw, 32px);
}

.client-tv-live-row strong {
  font-size: clamp(26px, 2.2vw, 46px);
  line-height: 1;
  font-weight: 900;
}

.client-tv-live-row b,
.client-tv-live-city {
  color: #241b35;
  font-size: clamp(13px, .9vw, 19px);
  font-weight: 900;
}

.client-tv-live-separator {
  height: 2px;
  background: rgba(126,75,181,.22);
  margin: 1.2vh 0;
}

.client-tv-live-info.clock-left {
  top: 5vh;
  left: 3vw;
}

.client-tv-live-info.clock-center {
  top: 5vh;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.client-tv-live-info.clock-right {
  top: 5vh;
  right: 3vw;
}

.client-tv-live-info.clock-bottom {
  bottom: 16vh;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.client-tv-home-button {
  position: fixed;
  right: 1.3vw;
  top: 1.5vh;
  z-index: 9999;
  border: none;
  border-radius: 999px;
  background: rgba(33, 22, 51, .78);
  color: white;
  padding: 8px 14px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
}

.client-tv-ticker {
  position: absolute;
  left: 3vw;
  right: 3vw;
  bottom: 1.1vh;
  height: 5.2vh;
  min-height: 42px;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(235,222,249,.94);
  box-shadow: 0 10px 32px rgba(95,53,145,.15);
  direction: rtl;
}

.client-tv-ticker marquee {
  color: #5b3199;
  font-size: clamp(15px, 1.15vw, 22px);
  font-weight: 900;
  padding: 0 2vw;
}

.client-tv-ticker b {
  height: 100%;
  background: #7e4bb5;
  color: white;
  display: grid;
  place-items: center;
  font-size: clamp(16px, 1.25vw, 24px);
}
`;

const featureCss = `html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden !important;
}

.feature-tv-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  direction: ltr;
  display: grid;
  grid-template-columns: 58% 42%;
  background: #fbf7ff;
  color: #241b35;
  position: relative;
  font-family: Assistant, Arial, sans-serif;
}

.feature-image-side {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.feature-building {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 80vh;
  object-fit: cover;
}

.feature-image-side::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(to left, #fbf7ff 0%, rgba(251,247,255,.9) 10%, rgba(251,247,255,.48) 28%, rgba(251,247,255,.08) 48%, transparent 70%),
    linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(251,247,255,.78) 76%, #fbf7ff 100%);
}

.feature-content-side {
  height: 100vh;
  overflow: hidden;
  position: relative;
  z-index: 6;
  direction: rtl;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.4vh 3vw 8.5vh;
}

.feature-logo {
  width: clamp(185px, 15vw, 300px);
  margin-bottom: 1.6vh;
}

.feature-hero-card {
  width: 94%;
  border-radius: 24px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 20px 50px rgba(95,53,145,.15);
  padding: 2vh 1.6vw;
  display: grid;
  grid-template-columns: 82px 1fr;
  gap: 1.2vw;
  align-items: center;
  margin-bottom: 1vh;
}

.feature-icon {
  width: 74px;
  height: 74px;
  border-radius: 22px;
  background: #eadcf7;
  color: #5b3199;
  display: grid;
  place-items: center;
  font-size: 42px;
}

.feature-hero-card h1 {
  margin: 0;
  color: #6d3caf;
  font-size: clamp(34px, 3vw, 58px);
  font-weight: 900;
}

.feature-hero-card h2 {
  margin: .5vh 0;
  color: #241b35;
  font-size: clamp(18px, 1.35vw, 27px);
  font-weight: 900;
}

.feature-hero-card p {
  margin: 0;
  color: #241b35;
  font-size: clamp(13px, .88vw, 18px);
  line-height: 1.45;
  font-weight: 800;
}

.feature-actions {
  width: 94%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .75vw;
  margin-bottom: 1vh;
}

.feature-actions button {
  border: none;
  border-radius: 16px;
  min-height: 6.4vh;
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  font-family: inherit;
  font-weight: 900;
}

.feature-examples {
  width: 94%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .85vw;
  margin-bottom: 1vh;
}

.feature-examples article {
  min-height: 12vh;
  background: rgba(255,255,255,.96);
  border: 1px solid #eadcf7;
  border-radius: 18px;
  padding: 1.3vh 1vw;
}

.feature-examples h3 {
  margin: 0 0 .7vh;
  color: #6d3caf;
  font-size: clamp(15px, 1.05vw, 21px);
  font-weight: 900;
}

.feature-examples p {
  margin: 0;
  color: #241b35;
  font-size: clamp(12px, .78vw, 16px);
  line-height: 1.45;
  font-weight: 800;
}

.feature-back-button {
  width: 94%;
  height: 5vh;
  min-height: 38px;
  border-radius: 16px;
  background: #211633;
  color: white;
  text-decoration: none;
  display: grid;
  place-items: center;
  font-weight: 900;
}

.feature-live-info {
  position: fixed;
  z-index: 999;
  min-width: 220px;
  direction: rtl;
  color: #4c267f;
}

.feature-live-row {
  display: grid;
  grid-template-columns: 38px 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: .8vh;
}

.feature-live-row span {
  font-size: clamp(22px, 1.55vw, 32px);
}

.feature-live-row strong {
  font-size: clamp(26px, 2.2vw, 46px);
  line-height: 1;
  font-weight: 900;
}

.feature-live-row b,
.feature-live-city {
  color: #241b35;
  font-size: clamp(13px, .9vw, 19px);
  font-weight: 900;
}

.feature-live-separator {
  height: 2px;
  background: rgba(126,75,181,.22);
  margin: 1.2vh 0;
}

.feature-live-info.clock-left {
  top: 5vh;
  left: 3vw;
}

.feature-live-info.clock-center {
  top: 5vh;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.feature-live-info.clock-right {
  top: 5vh;
  right: 3vw;
}

.feature-live-info.clock-bottom {
  bottom: 16vh;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.feature-tv-ticker {
  position: absolute;
  left: 3vw;
  right: 3vw;
  bottom: 1.1vh;
  height: 5.2vh;
  min-height: 42px;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(235,222,249,.94);
  direction: rtl;
}

.feature-tv-ticker marquee {
  color: #5b3199;
  font-weight: 900;
}

.feature-tv-ticker b {
  height: 100%;
  background: #7e4bb5;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 900;
}
`;

const adminCss = `.admin-page {
  min-height: 100vh;
  direction: rtl;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: #f7f1ff;
  color: #241b35;
  font-family: Assistant, Arial, sans-serif;
}

.admin-page aside {
  background: #211633;
  color: white;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-page aside img {
  width: 180px;
  margin: 0 auto 20px;
}

.admin-page aside button,
.admin-page aside a {
  border: none;
  border-radius: 14px;
  background: rgba(255,255,255,.08);
  color: white;
  padding: 12px 14px;
  text-align: right;
  text-decoration: none;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
}

.admin-page aside button.on {
  background: #7e4bb5;
}

.logout-btn {
  margin-top: auto;
}

.admin-content {
  padding: 28px;
  overflow: auto;
}

.admin-content > header {
  margin-bottom: 22px;
}

.admin-content h1 {
  margin: 0;
  color: #6d3caf;
  font-size: 42px;
}

.admin-content header p {
  margin: 6px 0 0;
  font-weight: 800;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 18px;
}

.stats article,
.admin-card {
  background: white;
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 14px 36px rgba(95,53,145,.08);
  border: 1px solid #eadcf7;
}

.stats b {
  display: block;
  color: #6d3caf;
  font-size: 34px;
}

.stats span {
  font-weight: 900;
}

.admin-card {
  margin-bottom: 18px;
}

.admin-card h2 {
  margin: 0 0 14px;
  color: #6d3caf;
  font-size: 28px;
}

.admin-card p,
.admin-helper {
  line-height: 1.7;
  font-weight: 800;
}

.admin-card input,
.admin-card textarea,
.admin-card select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d9c6ec;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 12px;
  font-family: inherit;
  font-size: 16px;
}

.admin-card textarea {
  min-height: 110px;
}

.admin-card button {
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  padding: 12px 16px;
  font-family: inherit;
  font-weight: 900;
  cursor: pointer;
}

.admin-card iframe {
  width: 100%;
  height: 560px;
  border: none;
  border-radius: 20px;
  background: #fbf7ff;
}

.dashboard-pitches,
.overview-grid,
.pricing-cards,
.module-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.dashboard-pitches article,
.overview-grid article,
.pricing-cards article {
  border-radius: 18px;
  background: #fbf8ff;
  border: 1px solid #eadcf7;
  padding: 18px;
}

.dashboard-pitches b,
.overview-grid b,
.pricing-cards b {
  display: block;
  color: #6d3caf;
  font-size: 20px;
  margin-bottom: 8px;
}

.post-admin-row {
  display: grid;
  grid-template-columns: 1fr 110px 110px;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eadcf7;
}

.post-admin-row span {
  display: block;
  color: #6b5f78;
  font-weight: 800;
}

.setting-save-row {
  display: grid;
  grid-template-columns: 1fr 190px;
  gap: 14px;
  align-items: end;
  margin-bottom: 14px;
}

.setting-save-row label {
  display: grid;
  gap: 8px;
  font-weight: 900;
  color: #4c267f;
}

.setting-section-title-row {
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 14px;
  align-items: center;
  margin-bottom: 10px;
}

.pinned-toggle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.pinned-toggle-grid label {
  border-radius: 18px;
  background: #fbf8ff;
  border: 1px solid #eadcf7;
  padding: 16px;
  display: grid;
  grid-template-columns: 24px 44px 1fr;
  align-items: center;
  gap: 8px;
  font-weight: 900;
}

.pinned-toggle-grid label.enabled {
  background: #f0e5ff;
  border-color: #a476cf;
}

.overview-hero-panel {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 20px;
  align-items: center;
  padding: 26px;
  border-radius: 24px;
  background: linear-gradient(135deg, #211633, #6d3caf);
  color: #fff;
}

.overview-hero-panel h2 {
  margin: 0 0 12px;
  font-size: clamp(28px, 3vw, 52px);
}

.overview-hero-panel p {
  margin: 0;
  font-size: 18px;
  line-height: 1.75;
  font-weight: 800;
}

.overview-hero-panel strong,
.overview-navigation-callout {
  display: grid;
  place-items: center;
  min-height: 120px;
  border-radius: 22px;
  background: rgba(255,255,255,.14);
  text-align: center;
  font-size: 24px;
  font-weight: 900;
}

.overview-pricing-panel,
.overview-navigation-callout {
  margin-top: 18px;
  padding: 24px;
  border-radius: 24px;
  background: #fbf8ff;
  border: 1px solid #eadcf7;
}

.overview-navigation-callout {
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
}

.module-hero {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 18px;
  align-items: center;
}

.module-hero span {
  border-radius: 18px;
  background: #f0e5ff;
  padding: 22px;
  text-align: center;
  font-weight: 900;
  color: #6d3caf;
}

@media (max-width: 1100px) {
  .admin-page {
    grid-template-columns: 1fr;
  }

  .admin-page aside {
    position: static;
  }

  .stats,
  .dashboard-pitches,
  .overview-grid,
  .pricing-cards,
  .pinned-toggle-grid,
  .module-actions,
  .overview-hero-panel,
  .module-hero {
    grid-template-columns: 1fr;
  }

  .setting-save-row,
  .setting-section-title-row {
    grid-template-columns: 1fr;
  }
}
`;

write(adminPath, adminJsx);
write(tvPath, tvJsx);
write(featurePath, featureJsx);
write(tvCssPath, tvCss);
write(featureCssPath, featureCss);
write(adminCssPath, adminCss);

console.log("Clean rebuild completed");
console.log("Files rewritten:");
console.log("- src/pages/Admin.jsx");
console.log("- src/pages/TV.jsx");
console.log("- src/pages/FeaturePage.jsx");
console.log("- src/pages/TV.css");
console.log("- src/pages/FeaturePage.css");
console.log("- src/styles/generated-admin-clean.css");
console.log("Backup folder: _backup_before_clean_rebuild");
