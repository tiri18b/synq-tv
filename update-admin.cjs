const fs = require("fs");

fs.writeFileSync("src/pages/Admin.jsx", `import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("info");

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setPosts(data || []);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSave = async () => {
    if (!title || !content) {
      alert("נא למלא כותרת ותוכן");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        type,
        active: true,
      },
    ]);

    if (error) {
      alert("שגיאה בשמירה");
      console.log(error);
      return;
    }

    alert("נשמר בהצלחה");
    setTitle("");
    setContent("");
    setType("info");
    loadPosts();
  };

  const toggleActive = async (post) => {
    const { error } = await supabase
      .from("posts")
      .update({ active: !post.active })
      .eq("id", post.id);

    if (error) {
      alert("שגיאה בעדכון");
      console.log(error);
      return;
    }

    loadPosts();
  };

  const deletePost = async (id) => {
    if (!confirm("למחוק את ההודעה?")) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) {
      alert("שגיאה במחיקה");
      console.log(error);
      return;
    }

    loadPosts();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>ניהול מסך SYNQ</h1>
          <p>הוספה וניהול הודעות למסכי המעון</p>
        </div>

        <div className="admin-brand">
          <strong>SYNQ</strong>
          <span>By Shbiro</span>
        </div>
      </div>

      <form className="admin-form">
        <label>
          כותרת
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="לדוגמה: הפסקת מים היום" />
        </label>

        <label>
          תוכן
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="כתוב כאן את ההודעה..." />
        </label>

        <label>
          סוג הודעה
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="info">עדכון רגיל</option>
            <option value="urgent">הודעה דחופה</option>
            <option value="event">אירוע</option>
            <option value="maintenance">תחזוקה</option>
            <option value="news">חדשות המעון</option>
          </select>
        </label>

        <button type="button" onClick={handleSave}>שמור הודעה</button>
      </form>

      <section className="posts-list">
        <h2>הודעות קיימות</h2>

        {posts.length === 0 && <p>אין עדיין הודעות.</p>}

        {posts.map((post) => (
          <div key={post.id} className={"post-row " + (!post.active ? "inactive" : "")}>
            <div>
              <strong>{post.title}</strong>
              <p>{post.content}</p>
              <small>סוג: {post.type} | מצב: {post.active ? "מוצג" : "מוסתר"}</small>
            </div>

            <div className="post-actions">
              <button type="button" onClick={() => toggleActive(post)}>
                {post.active ? "הסתר" : "הצג"}
              </button>

              <button type="button" className="delete-btn" onClick={() => deletePost(post.id)}>
                מחק
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
`, "utf8");

console.log("Admin updated successfully");
