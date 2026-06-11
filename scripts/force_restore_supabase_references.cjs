const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];

  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);

    if (item.isDirectory()) {
      results = results.concat(walk(full));
    } else if (
      item.isFile() &&
      (
        full.endsWith(".jsx") ||
        full.endsWith(".js") ||
        full.endsWith(".ts") ||
        full.endsWith(".tsx")
      )
    ) {
      results.push(full);
    }
  }

  return results;
}

const files = walk("src");

for (const file of files) {
  let text = fs.readFileSync(file, "utf8");

  text = text.replace(
    /import\s+\{\s*הענן\s*\}\s+from\s+["'][^"']*הענן["'];/g,
    'import { supabase } from "../lib/supabase";'
  );

  text = text.replace(
    /import\s+\{\s*הענן\s*\}\s+from\s+["'][^"']*supabase["'];/g,
    'import { supabase } from "../lib/supabase";'
  );

  text = text.replace(
    /import\s+\{\s*supabase\s*\}\s+from\s+["'][^"']*הענן["'];/g,
    'import { supabase } from "../lib/supabase";'
  );

  text = text.replace(/\bהענן\b/g, "supabase");

  fs.writeFileSync(file, text, "utf8");
}

console.log("All broken Hebrew cloud code references were restored to supabase");
