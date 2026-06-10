const fs = require("fs");

let admin = fs.readFileSync("src/pages/Admin.jsx", "utf8");

admin = admin.replace(
  `<a href="/tv" target="_blank">פתיחת מסך TV</a>`,
  `<a href="/tv" target="_blank">פתיחת מסך TV</a>
        <button onClick={async () => { await supabase.auth.signOut(); navigate("/login"); }}>
          יציאה
        </button>`
);

fs.writeFileSync("src/pages/Admin.jsx", admin, "utf8");

console.log("Logout button added");
