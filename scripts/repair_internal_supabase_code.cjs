const fs = require("fs");

const files = [
  "src/pages/Admin.jsx",
  "src/pages/TV.jsx",
  "src/pages/FeaturePage.jsx",
  "src/lib/supabase.js"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;

  let text = fs.readFileSync(file, "utf8");

  text = text.replace(/import\s+\{\s*הענן\s*\}\s+from\s+["']\.\.\/lib\/הענן["'];/g, 'import { supabase } from "../lib/supabase";');
  text = text.replace(/import\s+\{\s*הענן\s*\}\s+from\s+["']\.\.\/lib\/supabase["'];/g, 'import { supabase } from "../lib/supabase";');
  text = text.replace(/import\s+\{\s*supabase\s*\}\s+from\s+["']\.\.\/lib\/הענן["'];/g, 'import { supabase } from "../lib/supabase";');

  text = text.replace(/\bהענן(?=\.)/g, "supabase");
  text = text.replace(/\bcreateClient\([^)]*\)/g, (match) => match);

  fs.writeFileSync(file, text, "utf8");
}

console.log("Internal supabase code repaired");
