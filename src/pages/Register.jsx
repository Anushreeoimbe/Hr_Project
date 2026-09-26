import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "HR Executive",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const existingUsers = JSON.parse(
        localStorage.getItem("peoplepulse_users") || "[]"
      );

      const emailExists =
        email === "admin@peoplepulse.com" ||
        existingUsers.some((user) => user.email === email);

      if (emailExists) {
        setError("An account with this email already exists.");
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        password: form.password,
        role: form.role,
      };

      localStorage.setItem(
        "peoplepulse_users",
        JSON.stringify([...existingUsers, newUser])
      );

      setLoading(false);
      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }, 700);
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE */}

      <div className="register-left">

        <div className="register-brand">
          <div className="register-brand-icon">
            <Sparkles size={22} />
          </div>

          <div>
            <h1>PeoplePulse</h1>
            <p>HR Management</p>
          </div>
        </div>

        <div className="register-intro">

          <h2>Build a better workplace.</h2>

          <p>
            Create your PeoplePulse account and manage your people,
            attendance, leave and performance from one place.
          </p>

          <div className="register-points">

            <div>
              <CheckCircle size={19} />
              <span>Manage employees easily</span>
            </div>

            <div>
              <CheckCircle size={19} />
              <span>Track attendance and leave</span>
            </div>

            <div>
              <CheckCircle size={19} />
              <span>Monitor team performance</span>
            </div>

          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="register-right">

        <div className="register-card">

          <div className="register-header">

            <div className="register-title-icon">
              <UserPlus size={24} />
            </div>

            <h2>Create Account</h2>

            <p>
              Create your account to get started with PeoplePulse.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="register-message error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="register-message success">
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* FULL NAME */}

            <div className="register-field">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <User size={18} />

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="register-field">

              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="register-input-wrapper">

                <Mail size={18} />

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* ROLE */}

            <div className="register-field">

              <label htmlFor="role">
                Role
              </label>

              <div className="register-input-wrapper">

                <User size={18} />

                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="HR Executive">
                    HR Executive
                  </option>

                  <option value="HR Manager">
                    HR Manager
                  </option>

                  <option value="HR Admin">
                    HR Admin
                  </option>

                  <option value="Manager">
                    Manager
                  </option>

                  <option value="Employee">
                    Employee
                  </option>
                </select>

              </div>

            </div>

            {/* PASSWORD */}

            <div className="register-field">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-input-wrapper">

                <Lock size={18} />

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="register-field">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <Lock size={18} />

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* LOGIN LINK */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login here
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;