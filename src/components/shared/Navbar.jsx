import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();

  const tabs = [
    { name: "Profile", path: "/profile" },
    { name: "Wardrobe", path: "/wardrobe" },
    { name: "Today", path: "/today" },
    { name: "Shop", path: "/shop" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>Wardrobe AI</h1>
        </div>

        <ul className="navbar-tabs">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <Link to={tab.path} className={`nav-link ${isActive(tab.path) ? "active" : ""}`}>
                {tab.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
