import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("peoplepulse_logged_in");
    localStorage.removeItem("peoplepulse_user");

    navigate("/login");
  };

  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search employees, departments..."
        />

        <span className="search-shortcut">⌘ K</span>
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile-menu">
          <div className="profile-avatar">
            AO
          </div>

          <div className="profile-info">
            <strong>Anushree</strong>
            <span>HR Admin</span>
          </div>

          <ChevronDown size={17} />

          <button
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;