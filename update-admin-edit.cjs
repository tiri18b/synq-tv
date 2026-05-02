const fs = require("fs");

fs.writeFileSync("src/pages/Admin.jsx", `import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("info");
  const [image, setImage] = useState(null);
  const [fileKey, setFileKey] = useState(Date.now());

  useEffect(() => {
    checkUser();
    loadPosts();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) navigate("/login");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const loadPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    setPosts(data || []);
  };

  const uploadImage = async () => {
    if (!image) return null;

    const ext = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = "upload_" + Date.now() + "." + ext;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, image);

    if (error) {
      alert("שגיאה בהעלאת תמונה");
      console.log(error);
      return null;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setType("info");
    setImage(null);
    setFileKey(Date.now());
  };

  const handleSave = async () => {
    if (!title || !content) {
      alert("נא למלא כותרת ותוכן");
      return;
    }

    const imageUrl = await uploadImage();

    const urgentUntil =
      type === "urgent"
        ? new Date(Date.now() + 10 * 60 * 1000).toISOString()
        : null;

    const payload = {
      title,
      content,
      type,
      active: true,
      urgent_until: urgentUntil,
    };

    if (imageUrl) {
      payload.image_url = imageUrl;
    }

    let error;

    if (editingId) {
      const result = await supabase
        .from("posts")
        .update(payload)
        .eq("id", editingId);

      error = result.error;
    } else {
      const result = await supabase
        .from("posts")
        .insert([payload]);

      error = result.error;
    }

    if (error) {
      alert("שגיאה בשמירה");
      console.log(error);
      return;
    }

    alert(editingId ? "ההודעה עודכנה בהצלחה" : "נשמר בהצלחה");
    resetForm();
    loadPosts();
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title || "");
    setContent(post.content || "");
    setType(post.type || "info");
    setImage(null);
    setFileKey(Date.now());

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleActive = async (post) => {
    await supabase
      .from("posts")
      .update({ active: !post.active })
      .eq("id", post.id);

    loadPosts();
  };

  const deletePost = async (id) => {
    if (!confirm("למחוק את ההודעה?")) return;

    await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (editingId === id) resetForm();

    loadPosts();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>ניהול מסך SYNQ</h1>
          <p>
            {editingId
              ? "עריכת הודעה קיימת"
              : "הוספה וניהול הודעות, אירועים, עדכונים ותמונות"}
          </p>
        </div>

        <div className="admin-brand">
          <strong>SYNQ</strong>
          <span>By Shbiro</span>
          <button type="button" onClick={logout}>התנתק</button>
        </div>
      </div>

      <form className="admin-form">
        {editingId && (
          <div className="edit-mode-banner">
            מצב עריכה פעיל — אתה מעדכן הודעה קיימת
          </div>
        )}

        <label>
          כותרת
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="לדוגמה: ערב סטודנטים"
          />
        </label>

        <label>
          תוכן
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="כתוב כאן את תוכן ההודעה..."
          />
        </label>

        <label>
          סוג הודעה
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="info">עדכון רגיל</option>
            <option value="urgent">הודעה דחופה - מסך מלא 10 דקות</option>
            <option value="event">אירוע</option>
            <option value="maintenance">תחזוקה</option>
            <option value="news">חדשות המעון</option>
          </select>
        </label>

        <label>
          תמונה
          <input
            key={fileKey}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {editingId && (
            <small>אם לא תבחר תמונה חדשה, התמונה הקיימת תישאר.</small>
          )}
        </label>

        <button type="button" onClick={handleSave}>
          {editingId ? "עדכן הודעה" : "שמור הודעה"}
        </button>

        {editingId && (
          <button type="button" className="cancel-edit-btn" onClick={resetForm}>
            ביטול עריכה
          </button>
        )}
      </form>

      <section className="posts-list">
        <h2>הודעות קיימות</h2>

        {posts.map((post) => (
          <div key={post.id} className={"post-row " + (!post.active ? "inactive" : "")}>
            <div>
              <strong>{post.type === "urgent" ? "⚠️ " : ""}{post.title}</strong>
              <p>{post.content}</p>
              <small>סוג: {post.type} | מצב: {post.active ? "מוצג" : "מוסתר"}</small>

              {post.image_url && (
                <img className="admin-thumb" src={post.image_url} alt={post.title} />
              )}
            </div>

            <div className="post-actions">
              <button type="button" onClick={() => startEdit(post)}>
                ערוך
              </button>

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

console.log("Admin updated with edit feature");
