const fs = require("fs");
const path = require("path");

const adminPath = "src/pages/Admin.jsx";

if (!fs.existsSync(adminPath)) {
  throw new Error("src/pages/Admin.jsx not found");
}

const backupDir = "_backup_before_admin_text_updates";
fs.mkdirSync(backupDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(adminPath, path.join(backupDir, `Admin_${stamp}.jsx`));

let admin = fs.readFileSync(adminPath, "utf8");

// Change the visible client-facing sentence only.
// Keeps design, icons, TV screen, settings and layout untouched.
admin = admin.replaceAll("איך אפשר להרחיב את זה ללקוח?", "אפשרויות הרחבה:");

fs.writeFileSync(adminPath, admin, "utf8");

console.log("Admin text updated successfully.");
console.log('Changed: "איך אפשר להרחיב את זה ללקוח?" -> "אפשרויות הרחבה:"');
console.log("Design was not changed.");
console.log(`Backup saved in ${backupDir}`);
