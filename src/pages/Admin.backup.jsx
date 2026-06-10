import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const demoPages = {
  dashboard: "דשבורד",
  posts: "הודעות",
  events: "אירועים",
  personal: "איזור אישי",
  service: "קריאות שירות",
  packages: "חבילות",
  maintenance: "תחזוקה",
  reception: "דלפק קבלה",
  screens: "מסכים",
  branding: "מיתוג",
  settings: "הגדרות",
};

const sampleData = {
  events: ["מפגש דיירים בלובי", "ערב קהילה", "סדנת פתיחה לסטודנטים"],
  personal: ["פרטי דייר", "הודעות אישיות", "מסמכים ועדכונים"],
  service: ["פתיחת תקלה חדשה", "מעקב סטטוס", "תיאום מול תחזוקה"],
  packages: ["חבילה מ Amazon", "חבילה מ AliExpress", "חבילה מ DHL"],
  maintenance: ["תחזוקת מעליות", "הפסקת מים", "ניקיון אזורים משותפים"],
  reception: ["שעות פעילות", "צור קשר", "הודעות הנהלה"],
  screens: ["מסך לובי", "מסך קומה 1", "מסך קומה 2"],
};

export default function Admin() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("regular");

  const [weatherCity, setWeatherCity] = useState("תל אביב");
  const [weatherLat, setWeatherLat] = useState("32.0853");
  const [weatherLon, setWeatherLon] = useState("34.7818");

  const loadPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
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
    setWeatherCity(obj.weather_city || "תל אביב");
    setWeatherLat(obj.weather_lat || "32.0853");
    setWeatherLon(obj.weather_lon || "34.7818");
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
        return;
      }

      loadPosts();
      loadSettings();
    };

    init();
  }, []);

  const savePost = async () => {
    if (!title.trim()) {
      alert("נא להזין כותרת");
      return;
    }

    const urgentUntil =
      type === "urgent"
        ? new Date(Date.now() + 10 * 60 * 1000).toISOString()
        : null;

    const { error } = await supabase.from("posts").insert({
      title,
      content,
      type,
      active: true,
      urgent_until: urgentUntil,
    });

    if (error) {
      alert("שגיאה בשמירת הודעה");
      console.log(error);
      return;
    }

    setTitle("");
    setContent("");
    setType("regular");
    await loadPosts();
    alert("ההודעה נשמרה בהצלחה");
  };

  const togglePost = async (post) => {
    await supabase
      .from("posts")
      .update({ active: !post.active })
      .eq("id", post.id);

    await loadPosts();
  };

  const deletePost = async (id) => {
    if (!confirm("למחוק את ההודעה?")) return;

    await supabase.from("posts").delete().eq("id", id);
    await loadPosts();
  };

  const saveWeather = async () => {
    const rows = [
      { key: "weather_city", value: weatherCity },
      { key: "weather_lat", value: weatherLat },
      { key: "weather_lon", value: weatherLon },
    ];

    const { error } = await supabase
      .from("app_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      alert("שגיאה בשמירת מזג האוויר");
      console.log(error);
      return;
    }

    alert("הגדרות מזג האוויר נשמרו");
    await loadSettings();
  };

  const stats = {
    activePosts: posts.filter((p) => p.active).length,
    events: 7,
    service: 23,
    packages: 18,
  };

  return (
    <div className="synq-admin-pro">
      <aside className="admin-sidebar">
        <img src="/synq-logo.png" className="admin-logo" />

        <nav>
          {Object.entries(demoPages).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={activePage === key ? "active" : ""}
            >
              {label}
            </button>
          ))}
        </nav>

        <a className="admin-tv-link" href="/tv" target="_blank">
          פתיחת מסך TV
        </a>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>{demoPages[activePage]}</h1>
            <p>מערכת ניהול SYNQ By Shbiro</p>
          </div>

          <div className="admin-date">
            {new Date().toLocaleDateString("he-IL")}
          </div>
        </header>

        {activePage === "dashboard" && (
          <section className="admin-dashboard">
            <div className="stats-grid">
              <div className="stat-card purple">
                <span>📢</span>
                <strong>{stats.activePosts}</strong>
                <p>הודעות פעילות</p>
              </div>

              <div className="stat-card lavender">
                <span>📅</span>
                <strong>{stats.events}</strong>
                <p>אירועים קרובים</p>
              </div>

              <div className="stat-card blue">
                <span>🔧</span>
                <strong>{stats.service}</strong>
                <p>קריאות שירות פתוחות</p>
              </div>

              <div className="stat-card green">
                <span>📦</span>
                <strong>{stats.packages}</strong>
                <p>חבילות ממתינות</p>
              </div>
            </div>

            <div className="admin-two-columns">
              <div className="admin-panel">
                <h2>פעילות שבועית</h2>
                <div className="fake-chart">
                  <span style={{ height: "35%" }}></span>
                  <span style={{ height: "48%" }}></span>
                  <span style={{ height: "62%" }}></span>
                  <span style={{ height: "55%" }}></span>
                  <span style={{ height: "80%" }}></span>
                  <span style={{ height: "45%" }}></span>
                  <span style={{ height: "70%" }}></span>
                </div>
              </div>

              <div className="admin-panel">
                <h2>הודעות אחרונות</h2>
                <div className="mini-list">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id}>
                      <strong>{post.title}</strong>
                      <span>{post.active ? "פעיל" : "לא פעיל"}</span>
                    </div>
                  ))}
                  {!posts.length && <p>אין הודעות עדיין</p>}
                </div>
              </div>
            </div>
          </section>
        )}

        {activePage === "posts" && (
          <section className="admin-posts-page">
            <div className="admin-panel">
              <h2>הוספת הודעה חדשה</h2>

              <div className="form-grid">
                <input
                  placeholder="כותרת"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="regular">הודעה רגילה</option>
                  <option value="urgent">הודעה דחופה ל 10 דקות</option>
                </select>

                <textarea
                  placeholder="תוכן ההודעה"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />

                <button onClick={savePost}>שמירת הודעה</button>
              </div>
            </div>

            <div className="admin-panel">
              <h2>ניהול הודעות</h2>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>כותרת</th>
                    <th>סוג</th>
                    <th>סטטוס</th>
                    <th>פעולות</th>
                  </tr>
                </thead>

                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.title}</td>
                      <td>{post.type === "urgent" ? "דחופה" : "רגילה"}</td>
                      <td>{post.active ? "פעיל" : "לא פעיל"}</td>
                      <td>
                        <button onClick={() => togglePost(post)}>
                          {post.active ? "כבה" : "הפעל"}
                        </button>
                        <button onClick={() => deletePost(post.id)}>
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {["events", "personal", "service", "packages", "maintenance", "reception", "screens"].includes(activePage) && (
          <section className="admin-demo-page">
            <div className="admin-panel">
              <h2>{demoPages[activePage]} | דף דוגמה</h2>
              <p>
                מודול זה מוצג כרגע כדוגמה וניתן להפוך אותו למודול פעיל לפי דרישת הלקוח.
              </p>

              <div className="demo-cards">
                {(sampleData[activePage] || []).map((item, index) => (
                  <div className="demo-card" key={index}>
                    <span>{index + 1}</span>
                    <strong>{item}</strong>
                    <p>דוגמה לתוכן שיוצג במסך זה במערכת.</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activePage === "branding" && (
          <section className="admin-branding-page">
            <div className="admin-panel">
              <h2>מיתוג המערכת</h2>
              <p>כאן ניתן להציג ללקוח איך בעתיד יוכל לשנות לוגו, צבעים ותמונת רקע.</p>

              <div className="branding-preview">
                <img src="/synq-logo.png" />
                <div>
                  <strong>SYNQ By Shbiro</strong>
                  <span>צבע ראשי: סגול</span>
                  <span>רקע: שמנת בהיר</span>
                  <span>תמונת בניין: פעילה</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {activePage === "settings" && (
          <section className="admin-settings-page">
            <div className="admin-panel">
              <h2>מזג אוויר במסך</h2>

              <div className="form-grid">
                <input
                  placeholder="עיר"
                  value={weatherCity}
                  onChange={(e) => setWeatherCity(e.target.value)}
                />

                <input
                  placeholder="Latitude"
                  value={weatherLat}
                  onChange={(e) => setWeatherLat(e.target.value)}
                />

                <input
                  placeholder="Longitude"
                  value={weatherLon}
                  onChange={(e) => setWeatherLon(e.target.value)}
                />

                <button onClick={saveWeather}>שמירת הגדרות</button>
              </div>

              <div className="city-buttons">
                <button onClick={() => { setWeatherCity("תל אביב"); setWeatherLat("32.0853"); setWeatherLon("34.7818"); }}>
                  תל אביב
                </button>

                <button onClick={() => { setWeatherCity("חיפה"); setWeatherLat("32.7940"); setWeatherLon("34.9896"); }}>
                  חיפה
                </button>

                <button onClick={() => { setWeatherCity("באר שבע"); setWeatherLat("31.2518"); setWeatherLon("34.7913"); }}>
                  באר שבע
                </button>

                <button onClick={() => { setWeatherCity("ירושלים"); setWeatherLat("31.7683"); setWeatherLon("35.2137"); }}>
                  ירושלים
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
