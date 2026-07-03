import "./Navbar.css";

export default function Navbar({ riskLevel = "LOW" }) {
  return (
    <nav className="navbar">
      <h2>🌊 FloodWatch Ghana</h2>

      <div className={`risk-badge ${riskLevel.toLowerCase()}`}>
        {riskLevel}
      </div>
    </nav>
  );
}