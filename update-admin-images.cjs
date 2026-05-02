const fs = require("fs");

fs.writeFileSync("src/pages/Admin.jsx", `import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("info");
  const [image, setImage] = useState(null);

  const loadPosts = async () => {
    const { data } = await supabase.from("posts").select("*").order("id", { ascending: false });
    setPosts(data || []);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const uploadImage = async () => {
    if (!image) return null;

    const fileName = Date.now() + "_" + image.name;

    const { error } = await supabase.storage
      .from("images")
      .upload(fileName, image);

    if (error) {
      console.log(error);
      return null;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSave = async () => {
    const imageUrl = await uploadImage();

    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        type,
        active: true,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      alert("שגיאה");
      console.log(error);
      return;
    }

    setTitle("");
    setContent("");
    setImage(null);
    loadPosts();
  };

  return (
    <div className="admin-page">
      <h1>ניהול מסך SYNQ</h1>

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="כותרת" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="תוכן" />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="info">רגיל</option>
        <option value="urgent">דחוף</option>
        <option value="event">אירוע</option>
      </select>

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <button onClick={handleSave}>שמור</button>

      {posts.map((post) => (
        <div key={post.id}>
          <strong>{post.title}</strong>
          {post.image_url && <img src={post.image_url} width="100" />}
        </div>
      ))}
    </div>
  );
}
`, "utf8");

console.log("Admin updated with images");
