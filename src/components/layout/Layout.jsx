import Sidebar from "./Sidebar.jsx";
import "./Layout.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Layout({children}) {

    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1024);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobileView(mobile);
            if (!mobile) {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isMobileView) {
            setIsSidebarOpen(false);
        }
    }, [location.pathname, isMobileView]);

    return (
      <div className="layout">
          <Sidebar
              isOpen={isSidebarOpen}
              isMobileView={isMobileView}
              onClose={() => setIsSidebarOpen(false)}
          />
          {isMobileView && isSidebarOpen && (
              <button
                  className="layout-backdrop"
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setIsSidebarOpen(false)}
              />
          )}
          <div className="layout-content">
              {isMobileView && (
                  <div className="layout-mobile-topbar">
                      <button
                          className="layout-menu-btn"
                          type="button"
                          onClick={() => setIsSidebarOpen((prev) => !prev)}
                      >
                          ☰ Menu
                      </button>
                  </div>
              )}
              {children}
          </div>
      </div>
    );
}