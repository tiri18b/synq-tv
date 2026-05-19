import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === "shbiro@dsystems.co.il" &&
      password === "12345678!@"
    ) {
      localStorage.setItem("synq_admin", "true");
      navigate("/admin");
    } else {
      alert("אימייל או סיסמה שגויים");
    }
  };

  return (
    <div className="synq-login-page">
      <div className="synq-login-box">
        <img
          src="/synq-logo.png"
          alt="SYNQ"
          className="synq-login-logo"
        />

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
