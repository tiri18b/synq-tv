const fs = require("fs");
const path = require("path");

const root = "src";

function walk(dir) {
  let files = [];

  if (!fs.existsSync(dir)) {
    throw new Error("src folder not found");
  }

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

function normalizeImportPath(file, text) {
  const slashFile = file.replaceAll("\\", "/");
  const isInPages = slashFile.includes("/pages/") || slashFile.startsWith("src/pages/");
  const supabasePath = isInPages ? "../lib/supabase" : "./lib/supabase";

  text = text.replace(
    /import\s+\{\s*הענן\s*\}\s+from\s+["'][^"']*["'];/g,
    `import { supabase } from "${supabasePath}";`
  );

  text = text.replace(
    /import\s+\{\s*supabase\s*\}\s+from\s+["'][^"']*\/הענן["'];/g,
    `import { supabase } from "${supabasePath}";`
  );

  text = text.replace(
    /from\s+["']\.\.\/lib\/הענן["']/g,
    `from "${supabasePath}"`
  );

  text = text.replace(
    /from\s+["']\.\/lib\/הענן["']/g,
    `from "${supabasePath}"`
  );

  return text;
}

function hasSupabaseImport(text) {
  return /import\s+\{\s*supabase\s*\}\s+from\s+["'][^"']*supabase["'];/.test(text);
}

function addHebrewAlias(text) {
  if (!hasSupabaseImport(text)) return text;
  if (!text.includes("הענן.")) return text;
  if (text.includes("const הענן = supabase;")) return text;

  return text.replace(
    /(import\s+\{\s*supabase\s*\}\s+from\s+["'][^"']*supabase["'];)/,
    `$1\n\nconst הענן = supabase;`
  );
}

const changed = [];

for (const file of walk(root)) {
  let text = fs.readFileSync(file, "utf8");
  const original = text;

  text = normalizeImportPath(file, text);

  // This keeps the old design untouched.
  // It only prevents runtime crashes where older code still calls הענן.from / הענן.channel.
  text = addHebrewAlias(text);

  if (text !== original) {
    fs.writeFileSync(file, text, "utf8");
    changed.push(file);
  }
}

console.log("Runtime white screen safety fix completed.");
console.log("Changed files:");
console.log(changed.length ? changed.join("\n") : "No files needed changes.");
console.log("");
console.log("Now run: npm run build");
