import { Link, useParams } from "react-router-dom";

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
