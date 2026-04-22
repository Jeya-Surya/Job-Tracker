import {NavLink, useNavigate} from "react-router-dom";
import "./Sidebar.css";

const navItems = [
    { path:"/dashboard", icon: "⬡", label: "Dashboard"},
    { path: "/applications", icon: "◫", label: "Applications" },
    { path: "/analytics", icon: "◈", label: "Analytics" }
];

export default function Sidebar({ isOpen, isMobileView, onClose }) {

    const navigate = useNavigate();

    const username = localStorage.getItem("username") || "User";

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/login");
      if (isMobileView) {
          onClose();
      }
    };

    const sidebarClass = [
        "sidebar",
        isMobileView ? "sidebar-mobile" : "",
        isMobileView && isOpen ? "sidebar-mobile-open" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
      <aside className={sidebarClass} aria-hidden={isMobileView && !isOpen}>
          <div className="sidebar-logo">
              <span className="logo-job">Job</span>
              <span className="logo-track">Track</span>
              <p className="sidebar-tagline">Placement Dashboard</p>
              {isMobileView && (
                  <button className="sidebar-close-btn" type="button" onClick={onClose}>
                      ✕
                  </button>
              )}
          </div>

          <nav className="sidebar-nav">
              {navItems.map(item => (
                  <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                          if (isMobileView) {
                              onClose();
                          }
                      }}
                      className={({ isActive }) =>
                          isActive ? "nav-item nav-item-active" : "nav-item"
                      }
                  >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                  </NavLink>
              ))}
          </nav>

          <div className={"sidebar-footer"}>
              <div className="user-card">
                  <div className="user-avatar">
                      {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                      <div className="user-name">{username}</div>
                  </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                  ⎋ Logout
              </button>
          </div>
      </aside>
    );
}