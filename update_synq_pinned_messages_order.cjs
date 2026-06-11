const fs = require("fs");

const adminPath = "src/pages/Admin.jsx";
const tvPath = "src/pages/TV.jsx";
const cssPath = "src/pages/TV.css";

const admin = `import { useEffect, useState } from "react";
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

const moduleContent = {
  events: {
    title: "אירועים",
    subtitle: "מודול אירועים שיכול להפוך את המסכים בבניין לכלי קהילתי אמיתי.",
    highlight: "הלקוח יכול לנהל אירועים, מפגשי דיירים, סדנאות, הרצאות, מסיבות פתיחה ועדכוני קהילה מתוך הדשבורד.",
    buttons: ["הוספת אירוע", "ניהול הרשמה", "הצגת אירוע במסך TV", "שליחת תזכורת לדיירים"],
    examples: [
      ["מפגש דיירים", "יום שלישי בשעה 18:00, חדר כנסים, כולל תזכורת אוטומטית במסך הראשי."],
      ["סדנת פתיחה", "אירוע פתיחת שנה לסטודנטים חדשים, עם אפשרות הרשמה ומספר מקומות פנויים."],
      ["ערב קהילה", "פרסום אירוע קהילתי לפי תאריך, שעה, מיקום וקהל יעד."],
    ],
    upsell: "פיתוח מלא יכול לכלול הרשמה לאירועים, מגבלת משתתפים, QR Check In, תזכורות, גלריית תמונות ודוח השתתפות."
  },
  personal: {
    title: "איזור אישי",
    subtitle: "מודול אישי לדיירים שיכול להפוך את SYNQ לפורטל שירות מלא.",
    highlight: "כל דייר יכול לראות הודעות אישיות, מסמכים, פרטי חדר, תשלומים, בקשות פתוחות וחבילות שממתינות לו.",
    buttons: ["פתיחת פרופיל דייר", "שיוך חדר", "העלאת מסמך", "שליחת הודעה אישית"],
    examples: [
      ["כרטיס דייר", "שם, חדר, קומה, סטטוס מגורים, תאריך כניסה ופרטי קשר."],
      ["מסמכים", "תקנון בניין, חוזה, אישורים, טפסים והודעות הנהלה."],
      ["הודעות אישיות", "הודעה לדייר מסוים או לקבוצת דיירים לפי קומה או בניין."],
    ],
    upsell: "פיתוח מלא יכול לכלול כניסת דיירים, הרשאות, מסמכים חתומים, תשלומים, פתיחת בקשות ועדכונים אישיים."
  },
  service: {
    title: "קריאות שירות",
    subtitle: "מודול שירות שמוריד עומס מהקבלה ומהתחזוקה ומייצר סדר ברור.",
    highlight: "דייר פותח תקלה, המנהל משייך אותה לאיש תחזוקה, והמסך מציג עדכונים כלליים בלי לחשוף מידע אישי.",
    buttons: ["פתיחת קריאה", "שיוך לאיש צוות", "עדכון סטטוס", "סגירת קריאה"],
    examples: [
      ["תקלה במזגן", "סטטוס פתוח, ממתין לטכנאי, בטיפול, נסגר."],
      ["בעיה בחשמל", "אפשרות לצרף תמונה, לבחור מיקום ולתעדף דחיפות."],
      ["מעקב SLA", "כמה זמן הקריאה פתוחה, מי מטפל ומה הסטטוס הנוכחי."],
    ],
    upsell: "פיתוח מלא יכול לכלול אפליקציית דיירים, העלאת תמונות, התראות Push, סטטוסים, דוחות SLA וניהול צוותים."
  },
  packages: {
    title: "חבילות",
    subtitle: "מודול חבילות שמציג לדיירים מידע ברור ומקטין פניות לדלפק.",
    highlight: "הקבלה יכולה לסמן חבילה שהגיעה, לשייך אותה לדייר, ולהציג התראה מסודרת עד לאיסוף.",
    buttons: ["הוספת חבילה", "שיוך לדייר", "סימון נאסף", "שליחת תזכורת"],
    examples: [
      ["חבילה חדשה", "החבילה הגיעה לדלפק הקבלה וממתינה לאיסוף."],
      ["תזכורת איסוף", "אם החבילה לא נאספה תוך 48 שעות, נשלחת תזכורת."],
      ["היסטוריית חבילות", "מעקב אחר חבילות שנאספו וחבילות שעדיין ממתינות."],
    ],
    upsell: "פיתוח מלא יכול לכלול סריקת ברקוד, צילום חבילה, חתימה דיגיטלית, התראות לדייר ודוח עומסים לקבלה."
  },
  maintenance: {
    title: "תחזוקה",
    subtitle: "מודול תחזוקה שמאפשר ללקוח לנהל עבודות יזומות בצורה מקצועית ושקופה.",
    highlight: "אפשר לפרסם עבודות תחזוקה, להגדיר אזור מושפע, זמן התחלה וסיום, ולהציג המלצות לדיירים.",
    buttons: ["הוספת עבודת תחזוקה", "בחירת אזור מושפע", "הצגת המלצות לדיירים", "סימון הסתיים"],
    examples: [
      ["תחזוקת מים", "הפסקת מים זמנית בקומות 3 עד 5, עם שעות פעילות והמלצה להכין מים מראש."],
      ["בדיקת מעליות", "מעלית אחת לא תהיה זמינה בין 10:00 ל 12:00, מומלץ להשתמש במעלית השנייה."],
      ["ניקיון חניון", "יש לפנות רכבים מאזור מסוים עד שעה מוגדרת."],
    ],
    upsell: "פיתוח מלא יכול לכלול לוח תחזוקה חודשי, התראות לפי קומה, שיוך לקבלנים, אישור ביצוע, תמונות לפני ואחרי ודוח עבודות."
  },
  reception: {
    title: "דלפק קבלה",
    subtitle: "מודול קבלה שמרכז מידע חשוב לדיירים ומחזק את חוויית השירות.",
    highlight: "שעות פעילות, אנשי קשר, הודעות קבלה, נהלים, חבילות, אורחים ועדכונים שוטפים במקום אחד.",
    buttons: ["עדכון שעות פעילות", "פרסום הודעת קבלה", "ניהול אנשי קשר", "הצגת נוהל לדיירים"],
    examples: [
      ["שעות פתיחה", "א׳ עד ה׳ 09:00 עד 17:00, שישי בתיאום מראש."],
      ["הודעת קבלה", "הדלפק יהיה סגור מחר בין 13:00 ל 14:00 עקב ישיבת צוות."],
      ["נהלים", "איסוף חבילות, כניסת אורחים, אבדות ומציאות ויצירת קשר עם הנהלה."],
    ],
    upsell: "פיתוח מלא יכול לכלול ניהול פניות קבלה, תורים, אישורי אורחים, הודעות לדיירים וחיבור למערכת CRM."
  },
};

function ModuleShowcase({ module }) {
  return (
    <div className="admin-card module-showcase">
      <section className="module-hero">
        <div>
          <h2>{module.title}</h2>
          <p>{module.subtitle}</p>
          <strong>{module.highlight}</strong>
        </div>
        <span>מודול אופציונלי לפיתוח מתקדם</span>
      </section>

      <section className="module-actions">
        {module.buttons.map((button) => (
          <button type="button" key={button}>{button}</button>
        ))}
      </section>

      <section className="module-examples">
        {module.examples.map((item) => (
          <article key={item[0]}>
            <h3>{item[0]}</h3>
            <p>{item[1]}</p>
          </article>
        ))}
      </section>

      <section className="module-upsell">
        <b>איך אפשר להרחיב את זה ללקוח?</b>
        <p>{module.upsell}</p>
      </section>
    </div>
  );
}

function parsePinnedModules(value) {
  try {
    return { ...defaultPinnedModules, ...JSON.parse(value || "{}") };
  } catch {
    return defaultPinnedModules;
  }
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
      (settings || []).forEach((row) => {
        obj[row.key] = row.value;
      });

      setWeatherCity(obj.weather_city || "חיפה");
      setWeatherLat(obj.weather_lat || "32.7940");
      setWeatherLon(obj.weather_lon || "34.9896");
      setClockPosition(obj.clock_position || "center");
      setEnabledPinnedModules(parsePinnedModules(obj.enabled_pinned_modules));
    };

    init();
  }, [navigate]);

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

  const saveSettings = async () => {
    await supabase.from("app_settings").upsert(
      [
        { key: "weather_city", value: weatherCity },
        { key: "weather_lat", value: weatherLat },
        { key: "weather_lon", value: weatherLon },
        { key: "clock_position", value: clockPosition },
        { key: "enabled_pinned_modules", value: JSON.stringify(enabledPinnedModules) },
      ],
      { onConflict: "key" }
    );

    alert("ההגדרות נשמרו");
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
              <article><b>24/7</b><span>מסך מידע פעיל</span></article>
              <article><b>TV</b><span>תצוגת דיירים</span></article>
            </div>

            <div className="admin-card dashboard-intro">
              <h2>מה הלקוח מקבל כאן?</h2>
              <p>
                מערכת SYNQ מאפשרת לנהל מסכי מידע בבניין בצורה פשוטה, יפה ומקצועית.
                היום אפשר להציג הודעות, מזג אוויר, שעה, תאריך ודפי דוגמה.
                בהמשך אפשר להפוך כל דף למודול מתקדם לפי בקשת הלקוח ובהתאם לאופי הפעילות בבניין.
              </p>

              <div className="dashboard-pitches">
                <article>
                  <b>הודעות נעוצות</b>
                  <span>המודולים הפעילים כמו חבילות, קבלה ותחזוקה נשארים במסך ולא נדרסים על ידי הודעות רגילות.</span>
                </article>
                <article>
                  <b>הודעות רגילות</b>
                  <span>הודעות שהמנהל שולח מצטרפות לתור אחרי הנעוצות וממשיכות לרוץ בשקפים.</span>
                </article>
                <article>
                  <b>הודעות דחופות</b>
                  <span>הודעה דחופה עולה תמיד מעל הכול ומוצגת ראשונה עד סימון קראתי או כיבוי על ידי מנהל.</span>
                </article>
              </div>
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
              <h2>הוספת הודעה למסך</h2>
              <p className="admin-helper">
                הודעה רגילה תצטרף לתור ההודעות אחרי ההודעות הנעוצות של המודולים הפעילים.
                הודעה דחופה תעלה תמיד לשורה הראשונה ותציג כפתור קראתי.
              </p>

              <input placeholder="כותרת" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea placeholder="תוכן ההודעה" value={content} onChange={(e) => setContent(e.target.value)} />

              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="regular">הודעה רגילה</option>
                <option value="urgent">הודעה דחופה עד סימון קראתי</option>
              </select>

              <p className="admin-helper">
                כפתור קראתי יופיע רק בהודעות דחופות. הודעות רגילות יוצגו ללא כפתור וימשיכו לרוץ במסך לפי הסדר.
                המנהל יכול בכל רגע לכבות או למחוק הודעה ממסך ניהול ההודעות.
              </p>

              <button onClick={savePost}>שמירת הודעה</button>
            </div>

            <div className="admin-card">
              <h2>ניהול הודעות קיימות</h2>

              {posts.length === 0 && <p>עדיין אין הודעות. אפשר להוסיף הודעה ראשונה מהטופס למעלה.</p>}

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

        {currentModule && <ModuleShowcase module={currentModule} />}

        {active === "settings" && (
          <div className="admin-card settings-card">
            <h2>הגדרות מסך TV</h2>
            <p className="admin-helper">
              כאן מנהלים את מיקום השעה, התאריך ומזג האוויר, וגם אילו הודעות נעוצות של מודולים יופיעו במסך TV.
            </p>

            <label>עיר להצגה</label>
            <input value={weatherCity} onChange={(e) => setWeatherCity(e.target.value)} />

            <label>Latitude</label>
            <input value={weatherLat} onChange={(e) => setWeatherLat(e.target.value)} />

            <label>Longitude</label>
            <input value={weatherLon} onChange={(e) => setWeatherLon(e.target.value)} />

            <label>מיקום שעה ותאריך במסך TV</label>
            <select value={clockPosition} onChange={(e) => setClockPosition(e.target.value)}>
              <option value="left">שמאל למעלה</option>
              <option value="center">אמצע למעלה</option>
              <option value="right">ימין למעלה</option>
              <option value="bottom">למטה במרכז</option>
            </select>

            <section className="pinned-settings">
              <h3>הודעות נעוצות במסך TV</h3>
              <p>
                הודעות אלו מגיעות מהמודולים בדשבורד ונשארות במסך לפי הפעלה.
                הודעות רגילות שהמנהל שולח יופיעו אחריהן, והודעות דחופות יופיעו מעל כולן.
              </p>

              <div className="pinned-toggle-grid">
                {pinnedModules.map(([key, label, icon]) => (
                  <label key={key} className={enabledPinnedModules[key] ? "enabled" : ""}>
                    <input
                      type="checkbox"
                      checked={!!enabledPinnedModules[key]}
                      onChange={() => togglePinnedModule(key)}
                    />
                    <span>{icon}</span>
                    <b>{label}</b>
                  </label>
                ))}
              </div>
            </section>

            <button onClick={saveSettings}>שמירת הגדרות</button>
          </div>
        )}
      </section>
    </main>
  );
}
`;

const tv = `import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import buildingImage from "../assets/building.jpeg";
import "./TV.css";

const tickerText =
  "הגעתם הביתה - הגעתם ל- SYNQ * רשת המגורים החדשה לסטודנטים מקבוצת שבירו * SYNQ המקום שבו הכל קורה";

const pinnedMessages = {
  events: {
    id: "pinned-events",
    title: "אירועים בבניין",
    content: "עדכונים על מפגשי דיירים, סדנאות ופעילויות קהילה יופיעו כאן.",
    type: "pinned",
    icon: "📅",
    order: 10,
  },
  personal: {
    id: "pinned-personal",
    title: "איזור אישי לדייר",
    content: "בהמשך ניתן להציג הודעות אישיות, מסמכים ועדכונים לפי דייר או חדר.",
    type: "pinned",
    icon: "👤",
    order: 20,
  },
  service: {
    id: "pinned-service",
    title: "קריאות שירות",
    content: "פתיחת תקלות, עדכון סטטוס ומעקב אחר טיפול בדירה או בשטחים הציבוריים.",
    type: "pinned",
    icon: "🔧",
    order: 30,
  },
  packages: {
    id: "pinned-packages",
    title: "חבילות בדלפק הקבלה",
    content: "כאן יוצגו חבילות שממתינות לאיסוף ושעות איסוף מעודכנות.",
    type: "pinned",
    icon: "📦",
    order: 40,
  },
  maintenance: {
    id: "pinned-maintenance",
    title: "תחזוקה שוטפת",
    content: "עדכונים על עבודות תחזוקה, ניקיון, מעליות, מים וחשמל יוצגו כאן.",
    type: "pinned",
    icon: "🧹",
    order: 50,
  },
  reception: {
    id: "pinned-reception",
    title: "דלפק קבלה",
    content: "שעות פעילות, נהלים, הודעות קבלה ויצירת קשר עם הנהלת הבניין.",
    type: "pinned",
    icon: "🛎️",
    order: 60,
  },
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

function parsePinnedModules(value) {
  try {
    return { ...defaultPinnedModules, ...JSON.parse(value || "{}") };
  } catch {
    return defaultPinnedModules;
  }
}

export default function TV() {
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  const [weather, setWeather] = useState(null);
  const [now, setNow] = useState(new Date());
  const [pageIndex, setPageIndex] = useState(0);
  const [readPostIds, setReadPostIds] = useState(getReadPostIds);

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

    const clockTimer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(clockTimer);
      supabase.removeChannel(channel);
    };
  }, []);

  const messages = useMemo(() => {
    const readSet = new Set(readPostIds.map(String));
    const enabledPinnedModules = parsePinnedModules(settings.enabled_pinned_modules);

    const urgentAdminMessages = posts
      .filter((post) => post.type === "urgent")
      .filter((post) => !readSet.has(String(post.id)))
      .map((post) => ({
        ...post,
        icon: "🚨",
        messageKind: "urgent",
      }));

    const activePinnedMessages = Object.entries(pinnedMessages)
      .filter(([key]) => enabledPinnedModules[key])
      .map(([, message]) => ({
        ...message,
        created_at: "2026-01-01T00:00:00.000Z",
        messageKind: "pinned",
      }))
      .sort((a, b) => a.order - b.order);

    const regularAdminMessages = posts
      .filter((post) => post.type !== "urgent")
      .map((post) => ({
        ...post,
        icon: "📌",
        messageKind: "regular",
      }));

    return [
      ...urgentAdminMessages,
      ...activePinnedMessages,
      ...regularAdminMessages,
    ];
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
    }, 5000);

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

        <section className="client-tv-message-stack">
          <header>
            <span>🔔</span>
            <strong>הודעות ועדכונים</strong>
          </header>

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

                {message.messageKind === "urgent" && (
                  <button type="button" onClick={() => markAsRead(message.id)}>
                    קראתי
                  </button>
                )}
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

      <footer className="client-tv-ticker">
        <marquee>{tickerText}</marquee>
        <b>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</b>
      </footer>
    </main>
  );
}
`;

fs.writeFileSync(adminPath, admin, "utf8");
fs.writeFileSync(tvPath, tv, "utf8");

let css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";

css += `

/* PINNED MODULE MESSAGES AND ADMIN TOGGLES */
.pinned-settings {
  display: grid;
  gap: 12px;
  background: #fbf8ff;
  border: 1px solid #eadcf7;
  border-radius: 18px;
  padding: 16px;
}

.pinned-settings h3 {
  margin: 0;
  color: #5b3199;
}

.pinned-settings p {
  margin: 0;
  line-height: 1.6;
  font-weight: 800;
}

.pinned-toggle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 11px;
}

.pinned-toggle-grid label {
  display: grid;
  grid-template-columns: 22px 34px 1fr;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #eadcf7;
  border-radius: 14px;
  padding: 12px;
  cursor: pointer;
  font-weight: 900;
}

.pinned-toggle-grid label.enabled {
  background: #f3eafd;
  border-color: #c9a9ed;
}

.client-tv-message-list article.pinned-message {
  background: #f7f0ff;
  border-color: rgba(126,75,181,.26);
}

.client-tv-message-list article.regular-message {
  background: #fbf8ff;
  border-color: #eadcf7;
}

.client-tv-message-list article.urgent-message {
  background: #fff1f2;
  border-color: rgba(190,18,60,.32);
  box-shadow: 0 12px 34px rgba(190,18,60,.12);
}

.pinned-message .message-icon {
  background: #eadcf7;
}

.regular-message .message-icon {
  background: #eef2ff;
}

.client-tv-message-list article:not(.urgent-message) {
  grid-template-columns: 48px 1fr 0 !important;
}

.client-tv-message-list article:not(.urgent-message) button {
  display: none !important;
}

@media (max-width: 1200px) {
  .pinned-toggle-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

fs.writeFileSync(cssPath, css, "utf8");

console.log("Updated pinned module messages, admin toggles, and message order");
