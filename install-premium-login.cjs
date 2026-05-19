const fs = require("fs");

fs.writeFileSync("src/pages/Login.jsx", `import { useState } from "react";
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
`, "utf8");

let css = fs.readFileSync("src/App.css", "utf8");

css += `

/* LOGIN PAGE */

.synq-login-page {
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(circle at top, rgba(139,92,246,.22), transparent 35%),
    linear-gradient(180deg, #020617 0%, #030712 100%);
}

.synq-login-box {
  width: 420px;
  max-width: 90vw;

  background: rgba(10,15,35,.82);

  border: 1px solid rgba(168,85,247,.25);

  border-radius: 28px;

  padding: 40px;

  text-align: center;

  backdrop-filter: blur(12px);

  box-shadow:
    0 0 35px rgba(168,85,247,.16),
    0 0 70px rgba(168,85,247,.08);
}

.synq-login-logo {
  width: 240px;
  max-width: 80%;

  margin-bottom: 20px;

  filter: drop-shadow(0 0 18px rgba(168,85,247,.35));
}

.synq-login-box h1 {
  color: white;

  font-size: 34px;
  margin-bottom: 30px;
}

.synq-login-box form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.synq-login-box input {
  height: 58px;

  border-radius: 16px;

  border: 1px solid rgba(255,255,255,.08);

  background: rgba(255,255,255,.04);

  color: white;

  font-size: 18px;

  padding: 0 18px;

  outline: none;
}

.synq-login-box input::placeholder {
  color: rgba(255,255,255,.45);
}

.synq-login-box button {
  height: 58px;

  border: none;

  border-radius: 16px;

  background: linear-gradient(
    135deg,
    #7c3aed,
    #d946ef
  );

  color: white;

  font-size: 20px;
  font-weight: 800;

  cursor: pointer;

  transition: .25s;

  box-shadow:
    0 0 25px rgba(168,85,247,.35);
}

.synq-login-box button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 0 35px rgba(217,70,239,.45);
}
`;

fs.writeFileSync("src/App.css", css, "utf8");

console.log("Premium login installed");
