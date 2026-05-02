import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("פרטי התחברות שגויים");
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="admin-page">
      <div className="admin-form">
        <h1>כניסה לניהול SYNQ</h1>

        <input
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={login}>כניסה</button>
      </div>
    </div>
  );
}
