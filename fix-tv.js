const fs = require("fs");

const tv = `export default function TV() {
  return (
    <div className="tv-screen">
      <header className="tv-header">
        <div>
          <h1>SYNQ</h1>
          <span>By Shbiro</span>
        </div>
        <div className="clock">
          {new Date().toLocaleDateString("he-IL")}
        </div>
      </header>

      <main className="tv-grid">
        <section className="hero-card">
          <p className="label">\\u05d4\\u05d5\\u05d3\\u05e2\\u05d4 \\u05d7\\u05de\\u05d4</p>
          <h2>\\u05d1\\u05e8\\u05d5\\u05db\\u05d9\\u05dd \\u05d4\\u05d1\\u05d0\\u05d9\\u05dd \\u05dc\\u05de\\u05e2\\u05d5\\u05df \\u05d4\\u05e1\\u05d8\\u05d5\\u05d3\\u05e0\\u05d8\\u05d9\\u05dd SYNQ</h2>
          <p>\\u05db\\u05d0\\u05df \\u05d9\\u05d5\\u05e6\\u05d2\\u05d5 \\u05d4\\u05d5\\u05d3\\u05e2\\u05d5\\u05ea \\u05d7\\u05e9\\u05d5\\u05d1\\u05d5\\u05ea, \\u05d0\\u05d9\\u05e8\\u05d5\\u05e2\\u05d9\\u05dd, \\u05e2\\u05d3\\u05db\\u05d5\\u05e0\\u05d9 \\u05ea\\u05d7\\u05d6\\u05d5\\u05e7\\u05d4 \\u05d5\\u05d7\\u05d3\\u05e9\\u05d5\\u05ea \\u05dc\\u05d3\\u05d9\\u05d9\\u05e8\\u05d9\\u05dd.</p>
        </section>

        <section className="side-card">
          <h3>\\u05d0\\u05d9\\u05e8\\u05d5\\u05e2\\u05d9\\u05dd \\u05e7\\u05e8\\u05d5\\u05d1\\u05d9\\u05dd</h3>
          <p>\\u05e2\\u05e8\\u05d1 \\u05e1\\u05d8\\u05d5\\u05d3\\u05e0\\u05d8\\u05d9\\u05dd \\u05d1\\u05dc\\u05d5\\u05d1\\u05d9 \\u05d4\\u05de\\u05e8\\u05db\\u05d6\\u05d9 - \\u05d9\\u05d5\\u05dd \\u05e8\\u05d1\\u05d9\\u05e2\\u05d9 20:30</p>
        </section>

        <section className="side-card">
          <h3>\\u05e2\\u05d3\\u05db\\u05d5\\u05e0\\u05d9\\u05dd</h3>
          <p>\\u05d7\\u05d3\\u05e8 \\u05d4\\u05db\\u05d1\\u05d9\\u05e1\\u05d4 \\u05d1\\u05e7\\u05d5\\u05de\\u05d4 2 \\u05e4\\u05e2\\u05d9\\u05dc \\u05db\\u05e8\\u05d2\\u05d9\\u05dc.</p>
        </section>
      </main>

      <footer className="ticker">
        <span>SYNQ By Shbiro - \\u05e2\\u05d3\\u05db\\u05d5\\u05e0\\u05d9\\u05dd \\u05d7\\u05de\\u05d9\\u05dd - \\u05d0\\u05d9\\u05e8\\u05d5\\u05e2\\u05d9\\u05dd - \\u05ea\\u05d7\\u05d6\\u05d5\\u05e7\\u05d4 - \\u05d4\\u05d5\\u05d3\\u05e2\\u05d5\\u05ea \\u05dc\\u05d3\\u05d9\\u05d9\\u05e8\\u05d9\\u05dd</span>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync("src/pages/TV.jsx", tv, "utf8");
console.log("TV.jsx fixed successfully");
