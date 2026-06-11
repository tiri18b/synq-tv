const fs = require("fs");

const filesToClean = [
  "src/pages/Admin.jsx",
  "src/pages/TV.jsx",
  "src/pages/FeaturePage.jsx",
  "src/styles/app.css",
  "src/pages/TV.css",
  "src/pages/FeaturePage.css",
];

function cleanClientFacingText(text) {
  const replacements = [
    ["Supabase", "הענן"],
    ["SUPABASE", "הענן"],
    ["supabase", "הענן"],
    ["Database", "שרת הנתונים"],
    ["database", "שרת הנתונים"],
    ["DB", "שרת הנתונים"],
    ["Streamer ID", "זיהוי מסך חכם"],
    ["Vercel", "הענן"],
    ["API", "שירות תקשורת"],
    ["WebView", "אפליקציית התצוגה"],
    ["Realtime", "סנכרון חי"],
    ["real-time", "סנכרון חי"],
    ["Real time", "סנכרון חי"],
    ["Real Time", "סנכרון חי"],
  ];

  let output = text;

  for (const [from, to] of replacements) {
    output = output.replaceAll(from, to);
  }

  output = output.replaceAll(
    "בחירת העיר מסתנכרנת למסך ה TV דרך הענן ומעדכנת את מזג האוויר לפי הרשת.",
    "בחירת העיר מסתנכרנת למסך ה TV דרך הענן ומעדכנת את מזג האוויר מהרשת."
  );

  output = output.replaceAll(
    "כאן מנהלים את מיקום השעה, התאריך ומזג האוויר ואת ההודעות הנעוצות במסך TV.",
    "כאן מנהלים את מיקום השעה, התאריך, מזג האוויר וההודעות הנעוצות שמסתנכרנות למסכי TV דרך שרת הענן."
  );

  return output;
}

for (const file of filesToClean) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  fs.writeFileSync(file, cleanClientFacingText(text), "utf8");
}

const adminPath = "src/pages/Admin.jsx";
if (!fs.existsSync(adminPath)) {
  throw new Error("src/pages/Admin.jsx not found");
}

let admin = fs.readFileSync(adminPath, "utf8");

// Add overview page to the menu
if (!admin.includes('["overview", "סקירת מערכת"]')) {
  admin = admin.replace(
    '["dashboard", "דשבורד"],',
    '["dashboard", "דשבורד"],\n  ["overview", "סקירת מערכת"],'
  );
}

// Add rich overview screen
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
                  כל ההודעות, ההגדרות והעדכונים נשמרים בשרת מאובטח ומסונכרנים למסכים המחוברים.
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

// Upgrade dashboard intro text
admin = admin.replace(
  /<h2>מה הלקוח מקבל כאן\?<\/h2>\s*<p>[\s\S]*?<\/p>\s*<div className="dashboard-pitches">/,
  `<h2>מה הלקוח מקבל כאן?</h2>
              <p>
                SYNQ היא מערכת מידע חכמה למסכי דיירים, שמחברת בין דף ניהול מרכזי לבין מסכי TV בבניין.
                כל הודעה, עדכון, עיר מזג אוויר או מודול שירות מסתנכרנים דרך שרת ענן ומופיעים לדיירים בצורה נקייה,
                מהירה ומקצועית. המטרה היא להפוך את מסך הכניסה או הלובי לערוץ תקשורת חי שמשרת את הבניין בכל יום.
              </p>

              <div className="dashboard-pitches">`
);

// Add more premium dashboard cards if the old pitch cards exist and new text not already there
if (!admin.includes("שרת הודעות מסונכרן")) {
  admin = admin.replace(
    /<div className="dashboard-pitches">([\s\S]*?)<\/div>\s*<\/div>\s*<div className="admin-card">\s*<h2>תצוגה מקדימה<\/h2>/,
    `<div className="dashboard-pitches">
                <article>
                  <b>שרת הודעות מסונכרן</b>
                  <span>הודעות רגילות, דחופות ונעוצות נשלחות מהניהול למסכי TV דרך הענן.</span>
                </article>
                <article>
                  <b>תצוגת TV מקצועית</b>
                  <span>מסך רחב עם שעה, תאריך, מזג אוויר, הודעות ודפי שירות מוכנים להרחבה.</span>
                </article>
                <article>
                  <b>ניהול מרחוק</b>
                  <span>אפשר לעדכן תוכן, להחליף עיר מזג אוויר ולהפעיל מודולים מכל מקום עם חיבור לרשת.</span>
                </article>
                <article>
                  <b>מוכן לצמיחה</b>
                  <span>בהמשך ניתן להוסיף איזור אישי, חבילות, קריאות שירות, אירועים ודוחות ניהול.</span>
                </article>
              </div>
            </div>

            <div className="admin-card">
              <h2>תצוגה מקדימה</h2>`
  );
}

// Add CSS for overview to src/styles/app.css
const cssPath = "src/styles/app.css";
let css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf8") : "";

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
  fs.writeFileSync(cssPath, css, "utf8");
}

// Final client-facing cleanup after injection
admin = cleanClientFacingText(admin);
fs.writeFileSync(adminPath, admin, "utf8");

console.log("Client friendly language applied and system overview screen added");
