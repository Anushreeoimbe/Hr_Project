import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Menu,
} from "lucide-react";

function MobileNav() {
  return (
    <nav className="mobile-nav">
      <a href="/" className="mobile-nav-item active">
        <LayoutDashboard size={21} />
        <span>Home</span>
      </a>

      <a href="/employees" className="mobile-nav-item">
        <Users size={21} />
        <span>People</span>
      </a>

      <a href="/leave" className="mobile-nav-item">
        <CalendarDays size={21} />
        <span>Leave</span>
      </a>

      <a href="/performance" className="mobile-nav-item">
        <ChartNoAxesColumnIncreasing size={21} />
        <span>Stats</span>
      </a>

      <button className="mobile-nav-item">
        <Menu size={21} />
        <span>More</span>
      </button>
    </nav>
  );
}

export default MobileNav;