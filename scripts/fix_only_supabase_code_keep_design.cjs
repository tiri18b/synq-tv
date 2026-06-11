const fs = require("fs");
const path = require("path");

function walk(dir) {
  let files = [];

  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);

    if (item.isDirectory()) {
      files = files.concat(walk(full));
    } else if (
      item.isFile() &&
      (
        full.endsWith(".jsx") ||
        full.endsWith(".js") ||
        full.endsWith(".tsx") ||
        full.endsWith(".ts")
      )
    ) {
      files.push(full);
    }
  }

  return files;
}

for (const file of walk("src")) {
  let text = fs.readFileSync(file, "utf8");

  text = text.replace(/import\s+\{\s*הענן\s*\}\s+from\s+["'][^"']*["'];/g, 'import { supabase } from "../lib/supabase";');
  text = text.replace(/from\s+["']\.\.\/lib\/הענן["']/g, 'from "../lib/supabase"');

  text = text.replace(/\bהענן(?=\.)/g, "supabase");

  fs.writeFileSync(file, text, "utf8");
}

console.log("Restored only internal supabase code references. Design was not changed.");
