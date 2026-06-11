const fs = require("fs");

const files = [
  "src/pages/TV.jsx",
  "src/pages/Admin.jsx",
  "src/pages/FeaturePage.jsx"
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;

  let text = fs.readFileSync(file, "utf8");

  // תיקון imports שנשברו
  text = text.replace(
    /import\s+\{\s*הענן\s*\}\s+from\s+["']\.\.\/lib\/הענן["'];/g,
    'import { supabase } from "../lib/supabase";'
  );

  text = text.replace(
    /import\s+\{\s*הענן\s*\}\s+from\s+["']\.\.\/lib\/supabase["'];/g,
    'import { supabase } from "../lib/supabase";'
  );

  text = text.replace(
    /import\s+\{\s*supabase\s*\}\s+from\s+["']\.\.\/lib\/הענן["'];/g,
    'import { supabase } from "../lib/supabase";'
  );

  // תיקון שימושי קוד כמו הענן.from / הענן.auth / הענן.channel
  text = text.replace(/\bהענן(?=\.)/g, "supabase");

  fs.writeFileSync(file, text, "utf8");
}

console.log("Fixed broken internal supabase references");
