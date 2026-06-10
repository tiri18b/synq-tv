const fs = require("fs");

let admin = fs.readFileSync("src/pages/Admin.jsx", "utf8");

admin = admin.replace(
  `        <a href="/tv" target="_blank">פתיחת מסך TV</a>
      </aside>`,
  `        <a href="/tv" target="_blank">פתיחת מסך TV</a>
        <button className="logout-btn" onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}>
          יציאה
        </button>
      </aside>`
);

fs.writeFileSync("src/pages/Admin.jsx", admin, "utf8");

let css = fs.readFileSync("src/App.css", "utf8");

css += `
.logout-btn {
  margin-top: auto !important;
  background: #ef4444 !important;
  color: white !important;
  font-weight: 900 !important;
}
`;

fs.writeFileSync("src/App.css", css, "utf8");

console.log("Logout button fixed");
