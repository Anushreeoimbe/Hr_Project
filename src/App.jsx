import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MobileNav from "./components/MobileNav";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Performance from "./pages/Performance";
import Settings from "./pages/Settings";

function ProtectedLayout() {
  const isLoggedIn =
    localStorage.getItem("peoplepulse_logged_in") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Header />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/employees"
              element={<Employees />}
            />

            <Route
              path="/departments"
              element={<Departments />}
            />

            <Route
              path="/attendance"
              element={<Attendance />}
            />

            <Route
              path="/leave"
              element={<Leave />}
            />

            <Route
              path="/performance"
              element={<Performance />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>
        </main>

        <MobileNav />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Create Account */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Application */}
        <Route
          path="/*"
          element={<ProtectedLayout />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;