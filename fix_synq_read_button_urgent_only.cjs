const fs = require("fs");

const tvPath = "src/pages/TV.jsx";
const adminPath = "src/pages/Admin.jsx";

let tv = fs.readFileSync(tvPath, "utf8");

tv = tv.replace(
  `.filter((post) => !readSet.has(String(post.id)))`,
  `.filter((post) => {
        if (post.type !== "urgent") return true;
        return !readSet.has(String(post.id));
      })`
);

tv = tv.replace(
  `<button type="button" onClick={() => markAsRead(message.id)}>
                  קראתי
                </button>`,
  `{message.type === "urgent" && (
                  <button type="button" onClick={() => markAsRead(message.id)}>
                    קראתי
                  </button>
                )}`
);

fs.writeFileSync(tvPath, tv, "utf8");

let admin = fs.readFileSync(adminPath, "utf8");

admin = admin.replace(
  "הודעה דחופה תופיע ללקוח עד סימון קראתי. אם הלקוח לא סימן קראתי, ההודעה תמשיך להופיע. המנהל יכול בכל רגע לכבות אותה ממסך ניהול ההודעות.",
  "הודעה דחופה תופיע ללקוח עד סימון קראתי. כפתור קראתי יופיע רק בהודעות דחופות. הודעות רגילות יוצגו ללא כפתור וימשיכו לרוץ במסך לפי הסדר. המנהל יכול בכל רגע לכבות או למחוק הודעה ממסך ניהול ההודעות."
);

fs.writeFileSync(adminPath, admin, "utf8");

console.log("Updated read button to urgent messages only");
