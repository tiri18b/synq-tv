const fs = require("fs");
const path = require("path");

const adminPath = "src/pages/Admin.jsx";

if (!fs.existsSync(adminPath)) {
  throw new Error("src/pages/Admin.jsx not found");
}

const backupDir = "_backup_before_remove_pricing";
fs.mkdirSync(backupDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(adminPath, path.join(backupDir, `Admin_${stamp}.jsx`));

let admin = fs.readFileSync(adminPath, "utf8");

// Remove the visible pricing section from the Admin overview screen.
// Keeps all design, icons, TV, settings and modules untouched.
admin = admin.replace(
  /\s*<section className="overview-pricing-panel">[\s\S]*?<\/section>\s*/g,
  "\n"
);

// Extra safety cleanup in case pricing text was inserted without the wrapper.
admin = admin.replace(
  /\s*<h3>תמחור מומלץ לפרויקט<\/h3>[\s\S]*?<p className="pricing-note">[\s\S]*?<\/p>\s*/g,
  "\n"
);

admin = admin.replace(
  /\s*<div className="pricing-cards">[\s\S]*?<\/div>\s*/g,
  "\n"
);

// Remove any leftover visible pricing sentence if it survived.
admin = admin.replace(
  /\s*<p className="pricing-note">[\s\S]*?<\/p>\s*/g,
  "\n"
);

fs.writeFileSync(adminPath, admin, "utf8");

console.log("Admin pricing section removed successfully.");
console.log("Design was not changed.");
console.log(`Backup saved in ${backupDir}`);
