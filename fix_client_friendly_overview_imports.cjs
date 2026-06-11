const fs = require("fs");
const path = require("path");

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function listFiles(dir, ext) {
  const out = [];
  if (!fs.existsSync(dir)) return out;

  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);

    if (item.isDirectory()) {
      out.push(...listFiles(full, ext));
    } else if (item.isFile() && full.endsWith(ext)) {
      out.push(full.replaceAll("\\", "/"));
    }
  }

  return out;
}

function repairSupabaseCode(file) {
  if (!fs.existsSync(file)) return;

  let text = read(file);

  text = text.replace(
    /import\s+\{\s*הענן\s*\}\s+from\s+["']\.\.\/lib\/הענן["'];/g,
    'import { supabase } from "../lib/supabase";'
  );

  text = text.replace(
    /import\s+\{\s*supabase\s*\}\s+from\s+["']\.\.\/lib\/הענן["'];/g,
    'import { supabase } from "../lib/supabase";'
  );

  text = text.replace(
    /import\s+\{\s*הענן\s*\}\s+from\s+["']\.\.\/lib\/supabase["'];/g,
    'import { supabase } from "../lib/supabase";'
  );

  text = text.replace(/\bהענן(?=\.)/g, "supabase");

  // Fix accidental replacements in method names only if they happened.
  text = text.replace(/\bsetהענן\b/g, "setSupabase");
  text = text.replace(/\bloadהענן\b/g, "loadSupabase");

  write(file, text);
}

["src/pages/Admin.jsx", "src/pages/TV.jsx", "src/pages/FeaturePage.jsx"].forEach(repairSupabaseCode);

const adminPath = "src/pages/Admin.jsx";
let admin = read(adminPath);

if (!admin) {
  throw new Error("src/pages/Admin.jsx not found");
}

// Keep client-facing language clean, but only in visible strings already present.
// Do NOT replace code identifiers.
admin = admin.replaceAll("Supabase", "הענן");
admin = admin.replaceAll("SUPABASE", "הענן");
admin = admin.replaceAll("Database", "שרת הנתונים");
admin = admin.replaceAll("database", "שרת הנתונים");
admin = admin.replaceAll("API", "שירות תקשורת");
admin = admin.replaceAll("WebView", "אפליקציית התצוגה");
admin = admin.replaceAll("Vercel", "הענן");
admin = admin.replaceAll("Streamer ID", "זיהוי מסך חכם");

// Re-repair imports and code after visible replacements, because the replacements above may touch code.
admin = admin.replace(
  /import\s+\{\s*הענן\s*\}\s+from\s+["']\.\.\/lib\/הענן["'];/g,
  'import { supabase } from "../lib/supabase";'
);
admin = admin.replace(
  /import\s+\{\s*הענן\s*\}\s+from\s+["']\.\.\/lib\/supabase["'];/g,
  'import { supabase } from "../lib/supabase";'
);
admin = admin.replace(/\bהענן(?=\.)/g, "supabase");

// Add overview menu if missing
if (!admin.includes('["overview", "סקירת מערכת"]')) {
  admin = admin.replace(
    '["dashboard", "דשבורד"],',
    '["dashboard", "דשבורד"],\n  ["overview", "סקירת מערכת"],'
  );
}

// Add overview screen if missing
if (!admin.includes('active === "overview"')) {
  const overviewBlock = `
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

            <section className="overview-pricing-panel">
              <h3>תמחור מומלץ לפרויקט</h3>

              <div className="pricing-cards">
                <article>
                  <span>הקמה חד פעמית</span>
                  <b>₪3,500</b>
                  <p>עיצוב מערכת, מסך TV, דף ניהול, חיבור לענן, הגדרות ראשוניות והכנת סביבת עבודה.</p>
                </article>

                <article>
                  <span>תחזוקה חודשית</span>
                  <b>₪350</b>
                  <p>אחסון, שרת ענן, עדכונים, גיבוי, תמיכה, שיפורים קטנים ושמירה על פעילות שוטפת.</p>
                </article>

                <article>
                  <span>מודולים מתקדמים</span>
                  <b>לפי דרישה</b>
                  <p>חבילות, קריאות שירות, איזור אישי, אירועים, דוחות, הרשאות וניהול דיירים מתקדם.</p>
                </article>
              </div>

              <p className="pricing-note">
                המחיר מאפשר להתחיל מהר עם מערכת יציבה ומרשימה, ובהמשך להוסיף יכולות לפי הצורך של הלקוח והבניין.
              </p>
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

`;

  admin = admin.replace(
    /        \{active === "posts" && \(/,
    overviewBlock + '        {active === "posts" && ('
  );
}

// Upgrade dashboard intro if possible
admin = admin.replace(
  /<h2>מה הלקוח מקבל כאן\?<\/h2>\s*<p>[\s\S]*?<\/p>/,
  `<h2>מה הלקוח מקבל כאן?</h2>
              <p>
                SYNQ היא מערכת מידע חכמה למסכי דיירים, שמחברת בין דף ניהול מרכזי לבין מסכי TV בבניין.
                כל הודעה, עדכון, עיר מזג אוויר או מודול שירות מסתנכרנים דרך שרת ענן ומופיעים לדיירים בצורה נקייה,
                מהירה ומקצועית. המטרה היא להפוך את מסך הכניסה או הלובי לערוץ תקשורת חי שמשרת את הבניין בכל יום.
              </p>`
);

write(adminPath, admin);

// Choose correct CSS file
const cssFiles = listFiles("src", ".css");
let cssPath =
  cssFiles.find((file) => read(file).includes(".admin-page")) ||
  cssFiles.find((file) => read(file).includes(".admin-card")) ||
  cssFiles.find((file) => file.toLowerCase().includes("admin")) ||
  cssFiles[0];

if (!cssPath) {
  cssPath = "src/App.css";
  fs.mkdirSync("src", { recursive: true });
  write(cssPath, "");
}

let css = read(cssPath);

if (!css.includes("system-overview-page")) {
  css += `

/* CLIENT FRIENDLY SYSTEM OVERVIEW */
.system-overview-page {
  display: grid;
  gap: 22px;
}

.overview-hero-panel {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 20px;
  align-items: center;
  padding: 26px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 15% 20%, rgba(164, 118, 207, .22), transparent 30%),
    linear-gradient(135deg, #211633, #6d3caf);
  color: #fff;
}

.overview-kicker {
  display: inline-grid;
  place-items: center;
  margin-bottom: 10px;
  padding: 7px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,.16);
  font-weight: 900;
}

.overview-hero-panel h2 {
  margin: 0 0 12px;
  font-size: clamp(28px, 3vw, 52px);
  line-height: 1.05;
}

.overview-hero-panel p {
  margin: 0;
  max-width: 850px;
  font-size: 18px;
  line-height: 1.75;
  font-weight: 800;
}

.overview-hero-panel strong {
  display: grid;
  place-items: center;
  min-height: 140px;
  border-radius: 22px;
  background: rgba(255,255,255,.14);
  text-align: center;
  font-size: 24px;
  line-height: 1.45;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.overview-grid article,
.pricing-cards article {
  padding: 22px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #eadcf7;
  box-shadow: 0 14px 36px rgba(95, 53, 145, .08);
}

.overview-grid b,
.pricing-cards b {
  display: block;
  margin-bottom: 10px;
  color: #6d3caf;
  font-size: 22px;
  font-weight: 900;
}

.overview-grid p,
.pricing-cards p {
  margin: 0;
  color: #2f2442;
  font-size: 15px;
  line-height: 1.7;
  font-weight: 800;
}

.overview-pricing-panel {
  padding: 24px;
  border-radius: 24px;
  background: #fbf8ff;
  border: 1px solid #eadcf7;
}

.overview-pricing-panel h3 {
  margin: 0 0 18px;
  color: #211633;
  font-size: 28px;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.pricing-cards span {
  display: block;
  color: #6b5f78;
  font-weight: 900;
  margin-bottom: 8px;
}

.pricing-cards b {
  font-size: 34px;
}

.pricing-note {
  margin: 18px 0 0;
  color: #4c267f;
  font-size: 17px;
  font-weight: 900;
}

.overview-navigation-callout {
  padding: 22px 26px;
  border-radius: 22px;
  background: linear-gradient(135deg, #7e4bb5, #a476cf);
  color: #fff;
}

.overview-navigation-callout b {
  display: block;
  margin-bottom: 8px;
  font-size: 24px;
}

.overview-navigation-callout p {
  margin: 0;
  font-size: 17px;
  line-height: 1.7;
  font-weight: 800;
}

@media (max-width: 1100px) {
  .overview-hero-panel,
  .overview-grid,
  .pricing-cards {
    grid-template-columns: 1fr;
  }
}
`;

  write(cssPath, css);
}

console.log("Fixed broken supabase imports and completed client friendly overview");
console.log("CSS updated:", cssPath);
