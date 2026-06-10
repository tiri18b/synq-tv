const fs = require("fs");
let file = fs.readFileSync("src/pages/Admin.jsx", "utf8");

file = file.replace(
  `import { useEffect, useState } from "react";`,
  `import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";`
);

file = file.replace(
  `export default function Admin() {`,
  `export default function Admin() {
  const navigate = useNavigate();`
);

file = file.replace(
  `useEffect(() => {
    loadPosts();
    loadSettings();
  }, []);`,
  `useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
        return;
      }

      loadPosts();
      loadSettings();
    };

    init();
  }, []);`
);

fs.writeFileSync("src/pages/Admin.jsx", file, "utf8");
console.log("Admin auth fixed");
