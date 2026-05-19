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

  const [weatherCity, setWeatherCity] = useState("");
  const [weatherLat, setWeatherLat] = useState("");
  const [weatherLon, setWeatherLon] = useState("");

  useEffect(() => {
    checkUser();
    loadPosts();
    loadSettings();
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

  const loadSettings = async () => {
    const { data } = await supabase.from("app_settings").select("*");
    const settings = {};
    (data || []).forEach((row) => (settings[row.key] = row.value));

    setWeatherCity(settings.weather_city || "תל אביב");
    setWeatherLat(settings.weather_lat || "32.0853");
    setWeatherLon(settings.weather_lon || "34.7818");
  };

  const saveWeatherSettings = async () => {
    const updates = [
      { key: "weather_city", value: weatherCity },
      { key: "weather_lat", value: weatherLat },
      { key: "weather_lon", value: weatherLon },
    ];

    for (const item of updates) {
      await supabase
        .from("app_settings")
        .upsert(item, { onConflict: "key" });
    }

    alert("הגדרות מזג האוויר עודכנו");
    loadSettings();
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

    if (imageUrl) payload.image_url = imageUrl;

    let result;

    if (editingId) {
      result = await supabase.from("posts").update(payload).eq("id", editingId);
    } else {
      result = await supabase.from("posts").insert([payload]);
    }

    if (result.error) {
      alert("שגיאה בשמירה");
      console.log(result.error);
      return;
    }

    alert(editingId ? "ההודעה עודכנה" : "ההודעה נשמרה");
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
    await supabase.from("posts").update({ active: !post.active }).eq("id", post.id);
    loadPosts();
  };

  const deletePost = async (id) => {
    if (!confirm("למחוק את ההודעה?")) return;
    await supabase.from("posts").delete().eq("id", id);
    if (editingId === id) resetForm();
    loadPosts();
  };

  return (
    <div className="premium-admin">
      <header className="premium-admin-header">
        <div>
          <h1>ניהול SYNQ</h1>
          <p>ניהול הודעות, תמונות, עדכונים ומזג אוויר</p>
        </div>

        <div className="premium-admin-logo">
          <strong>SYNQ</strong>
          <span>By Shbiro</span>
          <button type="button" onClick={logout}>התנתק</button>
        </div>
      </header>

      <main className="premium-admin-grid">
        <section className="premium-admin-card">
          <h2>{editingId ? "עריכת הודעה" : "הוספת הודעה חדשה"}</h2>

          {editingId && <div className="edit-mode-banner">מצב עריכה פעיל</div>}

          <label>
            כותרת
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="כותרת ההודעה" />
          </label>

          <label>
            תוכן
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="תוכן ההודעה" />
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

          <label>
            תמונה
            <input key={fileKey} type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            {editingId && <small>אם לא תבחר תמונה חדשה, התמונה הקיימת תישאר.</small>}
          </label>

          <button type="button" className="premium-main-btn" onClick={handleSave}>
            {editingId ? "עדכן הודעה" : "שמור הודעה"}
          </button>

          {editingId && (
            <button type="button" className="premium-secondary-btn" onClick={resetForm}>
              ביטול עריכה
            </button>
          )}
        </section>

        <section className="premium-admin-card">
          <h2>מזג אוויר במסך</h2>

          <label>
            שם עיר להצגה
            <input value={weatherCity} onChange={(e) => setWeatherCity(e.target.value)} />
          </label>

          <label>
            Latitude
            <input value={weatherLat} onChange={(e) => setWeatherLat(e.target.value)} />
          </label>

          <label>
            Longitude
            <input value={weatherLon} onChange={(e) => setWeatherLon(e.target.value)} />
          </label>

          <button type="button" className="premium-main-btn" onClick={saveWeatherSettings}>
            שמור מזג אוויר
          </button>

          <p className="admin-note">
            לדוגמה תל אביב: 32.0853 / 34.7818
          </p>
        </section>
      </main>

      <section className="premium-posts">
        <h2>הודעות קיימות</h2>

        {posts.map((post) => (
          <div key={post.id} className={"premium-post-row " + (!post.active ? "inactive" : "")}>
            <div className="premium-post-content">
              <strong>{post.type === "urgent" ? "⚠️ " : ""}{post.title}</strong>
              <p>{post.content}</p>
              <small>סוג: {post.type} | מצב: {post.active ? "מוצג" : "מוסתר"}</small>
              {post.image_url && <img src={post.image_url} alt={post.title} />}
            </div>

            <div className="premium-post-actions">
              <button onClick={() => startEdit(post)}>ערוך</button>
              <button onClick={() => toggleActive(post)}>{post.active ? "הסתר" : "הצג"}</button>
              <button className="delete-btn" onClick={() => deletePost(post.id)}>מחק</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
`, "utf8");

console.log("Admin premium updated");
