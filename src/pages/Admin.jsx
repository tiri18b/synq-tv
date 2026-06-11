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
      (settings || []).forEach((row) => {
        obj[row.key] = row.value;
      });

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

    const urgentUntil = null;

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
              <article><b>6</b><span>מודולים זמינים</span></article>
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
                  <b>מסך TV חי</b>
                  <span>תצוגה יפה בלובי או במסדרונות עם מידע שמתעדכן בזמן אמת.</span>
                </article>
                <article>
                  <b>ניהול מהיר</b>
                  <span>הוספת הודעות, הודעות דחופות והגדרות בלי לגעת בקוד.</span>
                </article>
                <article>
                  <b>הרחבה עתידית</b>
                  <span>כל מודול יכול להפוך לפיתוח מלא לפי צורך הלקוח.</span>
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
                הודעה רגילה תופיע באזור ההודעות. הודעה דחופה תעלה תמיד לשורה הראשונה במסך ה TV ותישאר מוצגת עד שהלקוח יסמן קראתי או עד שהמנהל יכבה אותה מהמערכת.
              </p>

              <input placeholder="כותרת" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea placeholder="תוכן ההודעה" value={content} onChange={(e) => setContent(e.target.value)} />

              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="regular">הודעה רגילה</option>
                <option value="urgent">הודעה דחופה עד סימון קראתי</option>
              </select>

              <p className="admin-helper">
                הודעה דחופה תופיע ללקוח עד סימון קראתי. אם הלקוח לא סימן קראתי, ההודעה תמשיך להופיע. המנהל יכול בכל רגע לכבות אותה ממסך ניהול ההודעות.
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
                    <span>{post.active ? "פעיל במסך" : "כבוי"}</span>
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
              כאן מנהלים את מיקום השעה, התאריך ומזג האוויר, ואת העיר שממנה נשלף מזג האוויר מהאינטרנט.
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

            <button onClick={saveSettings}>שמירת הגדרות</button>
          </div>
        )}
      </section>
    </main>
  );
}
