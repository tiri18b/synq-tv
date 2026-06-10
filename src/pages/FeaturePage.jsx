import { Link, useParams } from "react-router-dom";

const data = {
  events: {
    title: "אירועים",
    icon: "📅",
    items: ["מפגש דיירים בלובי", "ערב קהילה", "עדכון פעילות שבועית"]
  },
  personal: {
    title: "איזור אישי",
    icon: "👤",
    items: ["פרטי דייר", "הודעות אישיות", "מסמכים ועדכונים"]
  },
  service: {
    title: "קריאת שירות",
    icon: "🔧",
    items: ["פתיחת תקלה", "מעקב סטטוס", "תיאום מול התחזוקה"]
  },
  packages: {
    title: "חבילות",
    icon: "📦",
    items: ["חבילות שהתקבלו", "שעות איסוף", "הודעות דלפק"]
  },
  maintenance: {
    title: "תחזוקה",
    icon: "🧹",
    items: ["עבודות תחזוקה", "הפסקות מים / חשמל", "ניקיון אזורים משותפים"]
  },
  reception: {
    title: "דלפק קבלה",
    icon: "🛎️",
    items: ["שעות פעילות", "יצירת קשר", "הודעות הנהלה"]
  }
};

export default function FeaturePage() {
  const { type } = useParams();
  const page = data[type] || data.events;

  return (
    <div className="synq-feature-page">
      <img src="/synq-logo.png" className="feature-logo" />

      <div className="feature-card">
        <div className="feature-big-icon">{page.icon}</div>
        <h1>{page.title}</h1>
        <p>עמוד דוגמה לתצוגה עתידית במערכת SYNQ</p>

        <div className="feature-list">
          {page.items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>

        <Link to="/tv" className="back-to-tv">חזרה למסך הראשי</Link>
      </div>
    </div>
  );
}
