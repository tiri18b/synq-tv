import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/admin");
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("אימייל או סיסמה שגויים");
      console.log(error);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="synq-login-page">
      <div className="synq-login-box">
        <img src="/synq-logo.png" alt="SYNQ" className="synq-login-logo" />

        <h1>כניסת מנהל</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
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

          <button type="submit">כניסה למערכת</button>
        </form>
      </div>
    </div>
  );
}
