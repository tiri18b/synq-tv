const fs = require("fs");
const path = require("path");

const publicDir = path.join(process.cwd(), "public");
const assetsDir = path.join(process.cwd(), "src", "assets");

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const files = fs.readdirSync(publicDir);

let buildingFile =
  files.find((file) => file.toLowerCase() === "building.jpeg") ||
  files.find((file) => file.toLowerCase() === "building.jpg") ||
  files.find((file) => file.includes("בניין") && /\.(jpg|jpeg|png|webp)$/i.test(file)) ||
  files.find((file) =>
    /\.(jpg|jpeg|png|webp)$/i.test(file) &&
    !file.toLowerCase().includes("logo") &&
    !file.toLowerCase().includes("synq")
  );

if (!buildingFile) {
  console.log("לא נמצאה תמונת בניין בתיקיית public");
  console.log(files);
  process.exit(1);
}

const sourceImage = path.join(publicDir, buildingFile);
const targetImage = path.join(assetsDir, "building-client.jpeg");

fs.copyFileSync(sourceImage, targetImage);

console.log("Building image copied from:", buildingFile);
console.log("Building image copied to: src/assets/building-client.jpeg");

fs.writeFileSync("src/pages/TV.jsx", `import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import buildingImage from "../assets/building-client.jpeg";
import "./TV.css";

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

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

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
      <main className="client-tv client-tv-urgent">
        <img src="/synq-logo.png" className="client-tv-urgent-logo" alt="SYNQ" />

        <section className="client-tv-urgent-card">
          <span>הודעה דחופה</span>
          <h1>{urgent.title}</h1>
          <p>{urgent.content}</p>
        </section>
      </main>
    );
  }

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
        <section className="client-tv-live-info">
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

        <section className="client-tv-notices">
          <header>
            <span>🔔</span>
            <strong>הודעות חשובות</strong>
          </header>

          {visiblePosts.length > 0 ? (
            visiblePosts.map((post) => (
              <article key={post.id}>
                <span>📌</span>
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </div>
              </article>
            ))
          ) : (
            <>
              <article>
                <span>📅</span>
                <div>
                  <h3>מפגש דיירים</h3>
                  <p>יום שלישי | 18:00 | חדר כנסים</p>
                </div>
              </article>

              <article>
                <span>📦</span>
                <div>
                  <h3>חבילות בדלפק הקבלה</h3>
                  <p>יש לאסוף בימים א׳ עד ה׳ בין 09:00-17:00</p>
                </div>
              </article>

              <article>
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

      <footer className="client-tv-ticker">
        <marquee>{tickerText}</marquee>
        <b>{now.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}</b>
      </footer>
    </main>
  );
}
`, "utf8");

fs.writeFileSync("src/pages/TV.css", `html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
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
  z-index: 1;
}

.client-tv-building {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 80vh;
  object-fit: cover;
  object-position: center left;
  z-index: 1;
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
  position: relative;
  z-index: 6;
  direction: rtl;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5vh 3.4vw 10vh;
}

.client-tv-logo {
  width: clamp(210px, 17vw, 340px);
  height: auto;
  object-fit: contain;
  margin-bottom: 4vh;
}

.client-tv-welcome {
  text-align: center;
  margin-bottom: 4vh;
}

.client-tv-welcome h1 {
  margin: 0;
  color: #6d3caf;
  font-size: clamp(44px, 4vw, 78px);
  line-height: 1;
  font-weight: 900;
}

.client-tv-welcome h2 {
  margin: 1vh 0 0;
  color: #241b35;
  font-size: clamp(28px, 2.35vw, 46px);
  line-height: 1.1;
  font-weight: 900;
}

.client-tv-notices {
  width: 92%;
  max-height: 36vh;
  overflow: hidden;
  border-radius: 22px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 20px 50px rgba(95,53,145,.15);
}

.client-tv-notices header {
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: white;
  padding: 1.2vh 1.8vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: clamp(20px, 1.45vw, 30px);
  font-weight: 900;
}

.client-tv-notices article {
  display: grid;
  grid-template-columns: 54px 1fr;
  align-items: center;
  gap: 12px;
  padding: 1.05vh 1.7vw;
  border-bottom: 1px solid #eadcf7;
}

.client-tv-notices article > span {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #eadcf7;
  font-size: 22px;
}

.client-tv-notices h3 {
  margin: 0;
  font-size: clamp(17px, 1.12vw, 23px);
  font-weight: 900;
}

.client-tv-notices p {
  margin: .35vh 0 0;
  font-size: clamp(13px, .86vw, 18px);
  font-weight: 700;
}

.client-tv-live-info {
  position: absolute;
  top: 5vh;
  left: -5.2vw;
  z-index: 30;
  min-width: 220px;
  direction: rtl;
  text-align: right;
  color: #4c267f;
}

.client-tv-live-row {
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  gap: 10px;
  margin-bottom: 1vh;
}

.client-tv-live-row span {
  font-size: clamp(24px, 1.9vw, 36px);
}

.client-tv-live-row strong {
  font-size: clamp(32px, 3vw, 56px);
  line-height: 1;
  font-weight: 900;
}

.client-tv-live-row b {
  font-size: clamp(15px, 1.05vw, 22px);
  color: #241b35;
  font-weight: 900;
}

.client-tv-live-separator {
  height: 2px;
  background: rgba(126,75,181,.22);
  margin: 2vh 0;
}

.client-tv-live-city {
  padding-right: 52px;
  color: #241b35;
  font-size: clamp(15px, 1.05vw, 22px);
  font-weight: 900;
}

.client-tv-feature-grid {
  position: absolute;
  left: 3vw;
  right: 5vw;
  bottom: 10vh;
  z-index: 10;
  direction: rtl;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1vw;
}

.client-tv-feature-grid a {
  height: 15.5vh;
  min-height: 108px;
  max-height: 150px;
  border-radius: 20px;
  background: rgba(255,255,255,.94);
  display: grid;
  place-items: center;
  text-align: center;
  text-decoration: none;
  color: #241b35;
  box-shadow: 0 16px 34px rgba(95,53,145,.16);
  font-size: clamp(28px, 2.3vw, 42px);
}

.client-tv-feature-grid b {
  display: block;
  font-size: clamp(14px, .98vw, 20px);
  font-weight: 900;
}

.client-tv-feature-grid small {
  display: block;
  font-size: clamp(11px, .75vw, 15px);
  font-weight: 800;
}

.client-tv-ticker {
  position: absolute;
  left: 3vw;
  right: 3vw;
  bottom: 2vh;
  height: 6vh;
  min-height: 48px;
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
  font-size: clamp(17px, 1.32vw, 26px);
  font-weight: 900;
  padding: 0 2vw;
}

.client-tv-ticker b {
  height: 100%;
  background: #7e4bb5;
  color: white;
  display: grid;
  place-items: center;
  font-size: clamp(18px, 1.5vw, 30px);
}

.client-tv-urgent {
  display: grid;
  place-items: center;
  background: #fbf7ff;
  direction: rtl;
}

.client-tv-urgent-logo {
  position: absolute;
  top: 5vh;
  right: 5vw;
  width: 260px;
}

.client-tv-urgent-card {
  width: min(900px, 70vw);
  background: white;
  border-radius: 32px;
  padding: 6vh 6vw;
  text-align: center;
  box-shadow: 0 30px 80px rgba(95,53,145,.25);
}

.client-tv-urgent-card span {
  color: #7e4bb5;
  font-size: 28px;
  font-weight: 900;
}

.client-tv-urgent-card h1 {
  font-size: clamp(52px, 5vw, 90px);
  color: #6d3caf;
}

.client-tv-urgent-card p {
  font-size: 28px;
}

@media (max-height: 800px) {
  .client-tv-content-side {
    padding-top: 4vh;
  }

  .client-tv-logo {
    width: clamp(190px, 15vw, 300px);
    margin-bottom: 3vh;
  }

  .client-tv-welcome {
    margin-bottom: 3vh;
  }

  .client-tv-notices {
    max-height: 34vh;
  }

  .client-tv-feature-grid a {
    height: 14.5vh;
    min-height: 98px;
  }
}
`, "utf8");

console.log("TV page rebuilt with imported building image and exact layout");
