import {
  Users,
  UserCheck,
  CalendarDays,
  Building2,
  ArrowUpRight,
  MoreHorizontal,
  Clock3,
} from "lucide-react";

function Dashboard() {
  const stats = [
    {
      title: "Total Employees",
      value: "248",
      change: "+12.5%",
      description: "from last month",
      icon: Users,
      className: "purple",
    },
    {
      title: "Present Today",
      value: "221",
      change: "+5.2%",
      description: "attendance rate",
      icon: UserCheck,
      className: "green",
    },
    {
      title: "On Leave",
      value: "14",
      change: "-2.4%",
      description: "from yesterday",
      icon: CalendarDays,
      className: "coral",
    },
    {
      title: "Departments",
      value: "12",
      change: "+1",
      description: "this quarter",
      icon: Building2,
      className: "yellow",
    },
  ];

  const leaveRequests = [
    {
      name: "Priya Sharma",
      role: "UI/UX Designer",
      type: "Sick Leave",
      days: "2 days",
      avatar: "PS",
    },
    {
      name: "Rahul Patil",
      role: "Product Manager",
      type: "Casual Leave",
      days: "1 day",
      avatar: "RP",
    },
    {
      name: "Ananya Joshi",
      role: "Developer",
      type: "Annual Leave",
      days: "4 days",
      avatar: "AJ",
    },
  ];

  return (
    <div className="dashboard">
      <section className="welcome-section">
        <div>
          <span className="welcome-label">
            PEOPLEPULSE HR
          </span>

          <h1>
            Good afternoon, Anushree <span>👋</span>
          </h1>

          <p>
            Here's what's happening with your team today.
          </p>
        </div>

        <button className="date-button">
          <CalendarDays size={18} />
          September 26, 2026
        </button>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-card" key={stat.title}>
              <div className="stat-card-top">
                <div className={`stat-icon ${stat.className}`}>
                  <Icon size={21} />
                </div>

                <button className="card-more">
                  <MoreHorizontal size={19} />
                </button>
              </div>

              <div className="stat-value">
                {stat.value}
              </div>

              <div className="stat-title">
                {stat.title}
              </div>

              <div className="stat-bottom">
                <span className="stat-change">
                  <ArrowUpRight size={14} />
                  {stat.change}
                </span>

                <span>{stat.description}</span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card attendance-card">
          <div className="card-header">
            <div>
              <h3>Attendance Overview</h3>
              <p>Weekly attendance activity</p>
            </div>

            <button className="card-filter">
              This Week
              <Clock3 size={15} />
            </button>
          </div>

          <div className="attendance-chart">
            <div className="chart-y-axis">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <div className="chart-area">
              <div className="chart-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <svg
                className="attendance-line"
                viewBox="0 0 600 220"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopOpacity="0.25"
                    />

                    <stop
                      offset="100%"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 150 C60 130 75 145 120 100 C165 55 190 100 235 80 C280 60 300 110 340 85 C380 60 410 75 450 55 C490 35 530 75 600 30 L600 220 L0 220 Z"
                  fill="url(#chartGradient)"
                />

                <path
                  d="M0 150 C60 130 75 145 120 100 C165 55 190 100 235 80 C280 60 300 110 340 85 C380 60 410 75 450 55 C490 35 530 75 600 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>

              <div className="chart-days">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card leave-card">
          <div className="card-header">
            <div>
              <h3>Leave Requests</h3>
              <p>Recent requests</p>
            </div>

            <button className="view-all">
              View all
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="leave-list">
            {leaveRequests.map((request) => (
              <div className="leave-item" key={request.name}>
                <div className="employee-avatar">
                  {request.avatar}
                </div>

                <div className="leave-person">
                  <strong>{request.name}</strong>
                  <span>{request.role}</span>
                </div>

                <div className="leave-info">
                  <strong>{request.type}</strong>
                  <span>{request.days}</span>
                </div>

                <span className="pending-badge">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-card performance-card">
        <div className="card-header">
          <div>
            <h3>Team Performance</h3>
            <p>Top performing employees this month</p>
          </div>

          <button className="view-all">
            View performance
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="performance-list">
          {[
            ["Ananya Joshi", "Product Design", "92%"],
            ["Priya Sharma", "Engineering", "89%"],
            ["Rahul Patil", "Product", "86%"],
            ["Sneha Kulkarni", "Marketing", "83%"],
          ].map(([name, department, score]) => (
            <div className="performance-row" key={name}>
              <div className="performance-person">
                <div className="employee-avatar">
                  {name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>

                <div>
                  <strong>{name}</strong>
                  <span>{department}</span>
                </div>
              </div>

              <div className="performance-progress">
                <div className="progress-track">
                  <div
                    className="progress-value"
                    style={{ width: score }}
                  ></div>
                </div>

                <strong>{score}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;