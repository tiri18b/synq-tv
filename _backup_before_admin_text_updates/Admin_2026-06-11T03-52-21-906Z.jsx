import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const הענן = supabase;

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
      ["מסמכים", "תקנון בניין, חוזה, טפסים והודעות הנהלה."],
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
  { city: "גבעתיים", lat: "32.0723", lon: "34.8125" },
  { city: "בני ברק", lat: "32.0807", lon: "34.8338" },
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
  { city: "קריית גת", lat: "31.6100", lon: "34.7642" },
  { city: "קריית מלאכי", lat: "31.7309", lon: "34.7466" },
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
  { city: "קריית אתא", lat: "32.8115", lon: "35.1132" },
  { city: "קריית ביאליק", lat: "32.8331", lon: "35.0887" },
  { city: "קריית מוצקין", lat: "32.8389", lon: "35.0786" },
  { city: "קריית ים", lat: "32.8492", lon: "35.0696" },
  { city: "חדרה", lat: "32.4340", lon: "34.9196" },
  { city: "זכרון יעקב", lat: "32.5732", lon: "34.9520" },
  { city: "בנימינה גבעת עדה", lat: "32.5174", lon: "34.9467" },
  { city: "פרדס חנה כרכור", lat: "32.4742", lon: "34.9773" },
  { city: "אריאל", lat: "32.1065", lon: "35.1845" },
  { city: "מעלה אדומים", lat: "31.7776", lon: "35.2978" },
  { city: "ביתר עילית", lat: "31.6976", lon: "35.1155" },
  { city: "מודיעין עילית", lat: "31.9326", lon: "35.0442" },
  { city: "לוד", lat: "31.9510", lon: "34.8881" },
  { city: "רמלה", lat: "31.9292", lon: "34.8656" },
  { city: "ראש העין", lat: "32.0958", lon: "34.9566" },
  { city: "שוהם", lat: "31.9987", lon: "34.9456" },
  { city: "דימונה", lat: "31.0708", lon: "35.0327" },
  { city: "ערד", lat: "31.2588", lon: "35.2137" },
  { city: "מצפה רמון", lat: "30.6102", lon: "34.8019" },
  { city: "נתיבות", lat: "31.4231", lon: "34.5890" },
  { city: "אופקים", lat: "31.3141", lon: "34.6203" },
  { city: "שדרות", lat: "31.5250", lon: "34.5969" },
  { city: "קריית אונו", lat: "32.0632", lon: "34.8551" },
  { city: "יהוד מונוסון", lat: "32.0314", lon: "34.8878" },
  { city: "אור יהודה", lat: "32.0294", lon: "34.8568" },
  { city: "רמת השרון", lat: "32.1461", lon: "34.8394" },
  { city: "טירת כרמל", lat: "32.7602", lon: "34.9718" },
  { city: "נשר", lat: "32.7668", lon: "35.0442" }
];

function findWeatherCity(cityName) {
  return israelWeatherCities.find((item) => item.city === cityName) || israelWeatherCities.find((item) => item.city === "חיפה") || israelWeatherCities[0];
}

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

function parseJson(value, fallback) {
  try {
    return { ...fallback, ...JSON.parse(value || "{}") };
  } catch {
    return fallback;
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
    const { data } = await הענן.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await הענן.auth.getSession();

      if (!data.session) {
        navigate("/login");
        return;
      }

      loadPosts();

      const { data: settings } = await הענן.from("app_settings").select("*");
      const obj = {};
      (settings || []).forEach((row) => {
        obj[row.key] = row.value;
      });

      setWeatherCity(obj.weather_city || "חיפה");
      setWeatherLat(obj.weather_lat || "32.7940");
      setWeatherLon(obj.weather_lon || "34.9896");
      setClockPosition(obj.clock_position || "center");
      setEnabledPinnedModules(parseJson(obj.enabled_pinned_modules, defaultPinnedModules));
    };

    init();
  }, [navigate]);

  const savePost = async () => {
    if (!title.trim()) {
      alert("נא להזין כותרת");
      return;
    }

    const { error } = await הענן.from("posts").insert({
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
    await הענן.from("posts").update({ active: !post.active }).eq("id", post.id);
    loadPosts();
  };

  const deletePost = async (post) => {
    if (!confirm("למחוק הודעה?")) return;
    await הענן.from("posts").delete().eq("id", post.id);
    loadPosts();
  };

  const updateWeatherCity = (cityName) => {
    const selectedCity = findWeatherCity(cityName);

    setWeatherCity(selectedCity.city);
    setWeatherLat(selectedCity.lat);
    setWeatherLon(selectedCity.lon);
  };

  const saveWeatherSettings = async () => {
    await הענן.from("app_settings").upsert(
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
    await הענן.from("app_settings").upsert(
      [
        { key: "clock_position", value: clockPosition },
      ],
      { onConflict: "key" }
    );

    alert("הגדרת מיקום השעה נשמרה");
  };

  const savePinnedSettings = async () => {
    await הענן.from("app_settings").upsert(
      [
        { key: "enabled_pinned_modules", value: JSON.stringify(enabledPinnedModules) },
      ],
      { onConflict: "key" }
    );

    alert("הגדרת הודעות נעוצות נשמרה");
  };

  const saveSettings = async () => {
    await הענן.from("app_settings").upsert(
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
    await הענן.auth.signOut();
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
              <article><b>0</b><span>הגדרות פעילות</span></article>
              <article><b>TV</b><span>תצוגת דיירים</span></article>
            </div>

            <div className="admin-card dashboard-intro">
              <h2>מה הלקוח מקבל כאן?</h2>
              <p>
                SYNQ היא מערכת מידע חכמה למסכי דיירים, שמחברת בין דף ניהול מרכזי לבין מסכי TV בבניין.
                כל הודעה, עדכון, עיר מזג אוויר או מודול שירות מסתנכרנים דרך שרת ענן ומופיעים לדיירים בצורה נקייה,
                מהירה ומקצועית. המטרה היא להפוך את מסך הכניסה או הלובי לערוץ תקשורת חי שמשרת את הבניין בכל יום.
              </p>

              <div className="dashboard-pitches">
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
              <article>
                <b>שרת ענן מרכזי</b>
                <p>
                  כל ההודעות, ההגדרות והעדכונים נשמרים בשרת מאובטח ומסתנכרנים למסכים המחוברים.
                  אין צורך לעבור בין מסכים ידנית ואין צורך להתקין כל שינוי מחדש.
                </p>
              </article>

              <article>
                <b>הודעות דחיפה מסונכרנות</b>
                <p>
                  הודעות רגילות, הודעות דחופות והודעות נעוצות נשלחות ממסך הניהול ומופיעות במסך TV
                  בצורה מסודרת, מהירה וברורה לדיירים.
                </p>
              </article>

              <article>
                <b>מסך TV חכם לדיירים</b>
                <p>
                  המסך מציג ברוכים הבאים, שעה, תאריך, מזג אוויר, הודעות ועדכונים,
                  ודפי שירות עתידיים כמו חבילות, תחזוקה, קריאות שירות ואירועים.
                </p>
              </article>

              <article>
                <b>ניהול מודולים עתידי</b>
                <p>
                  המערכת בנויה כך שאפשר להרחיב אותה בהמשך למודולים מתקדמים:
                  איזור אישי, פתיחת קריאות שירות, חבילות, אירועים, דלפק קבלה ותחזוקה.
                </p>
              </article>

              <article>
                <b>שליטה מרחוק</b>
                <p>
                  מנהל הבניין יכול לעדכן הודעה, לשנות מזג אוויר, להפעיל הודעות נעוצות
                  ולנהל את התצוגה מכל מקום שבו יש חיבור לרשת.
                </p>
              </article>

              <article>
                <b>חוויה מותאמת למסכי TV</b>
                <p>
                  התצוגה נבנתה למסכים רחבים, סטרימרים ושלטים, עם ניווט פשוט,
                  טקסטים גדולים, כרטיסים ברורים וזרימת מידע נעימה לעין.
                </p>
              </article>
            </section>
<section className="overview-navigation-callout">
              <b>לחוויה המושלמת</b>
              <p>
                מומלץ להשתמש במקשי הניווט של השלט כדי לעבור בין אזורי המערכת, לפתוח דפי דוגמה,
                לבדוק הודעות ולראות כיצד SYNQ מרגישה על מסך TV אמיתי.
              </p>
            </section>
          </div>
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
              כאן מנהלים את מיקום השעה, התאריך, מזג האוויר וההודעות הנעוצות שמסתנכרנות למסכי TV דרך שרת הענן.
            </p>

            <div className="setting-save-row">
              <label>
                עיר למזג האוויר
                <select value={weatherCity} onChange={(e) => updateWeatherCity(e.target.value)}>
                  {israelWeatherCities.map((item) => (
                    <option key={item.city} value={item.city}>
                      {item.city}
                    </option>
                  ))}
                </select>
              </label>

              <button type="button" onClick={saveWeatherSettings}>
                שמור מזג אוויר
              </button>
            </div>

            <p className="admin-helper">
              בחירת העיר מסתנכרנת למסך ה TV דרך הענן ומעדכנת את מזג האוויר מהרשת.
            </p>

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

              <button type="button" onClick={saveClockSettings}>
                שמור מיקום שעה
              </button>
            </div>

            <section className="pinned-settings">
              <div className="setting-section-title-row">
                <h3>הודעות נעוצות במסך TV</h3>

                <button type="button" onClick={savePinnedSettings}>
                  שמור הודעות נעוצות
                </button>
              </div>
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

            <button className="settings-save-all-hidden" onClick={saveSettings}>שמירת הגדרות כלליות</button>
          </div>
        )}
      </section>
    </main>
  );
}
