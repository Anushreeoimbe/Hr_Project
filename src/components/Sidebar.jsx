import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  ClipboardList,
  ChartNoAxesColumnIncreasing,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Employees",
    icon: Users,
    path: "/employees",
  },
  {
    name: "Departments",
    icon: Building2,
    path: "/departments",
  },
  {
    name: "Attendance",
    icon: CalendarCheck,
    path: "/attendance",
  },
  {
    name: "Leave Management",
    icon: ClipboardList,
    path: "/leave",
  },
  {
    name: "Performance",
    icon: ChartNoAxesColumnIncreasing,
    path: "/performance",
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Sparkles size={20} />
        </div>

        <div>
          <h2>PeoplePulse</h2>
          <span>HR Management</span>
        </div>
      </div>

      <div className="menu-section">
        <p className="menu-title">MAIN MENU</p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${
                    isActive ? "active" : ""
                  }`
                }
                key={item.name}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>

        <a href="#" className="sidebar-item">
          <HelpCircle size={19} />
          <span>Help & Support</span>
        </a>

        <div className="upgrade-card">
          <div className="upgrade-icon">
            <Sparkles size={18} />
          </div>

          <strong>People first</strong>

          <p>
            Build a better workplace with PeoplePulse.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;