import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="synq-home">
      <div className="synq-home-overlay"></div>

      <div className="synq-home-content">
        <img
          src="/synq-logo.png"
          alt="SYNQ"
          className="synq-home-logo"
        />

        <h1>מערכת הודעות דיגיטלית למעון סטודנטים</h1>

        <div className="synq-home-buttons">
          <Link to="/tv">
            <button>מסך TV</button>
          </Link>

          <Link to="/admin">
            <button>כניסת מנהל</button>
          </Link>
        </div>
      </div>
    </div>
  );
}