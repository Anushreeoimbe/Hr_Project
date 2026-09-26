import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (
        email.toLowerCase() === "admin@peoplepulse.com" &&
        password === "Admin@123"
      ) {
        localStorage.setItem("peoplepulse_logged_in", "true");

        localStorage.setItem(
          "peoplepulse_user",
          JSON.stringify({
            name: "Anushree",
            email: "admin@peoplepulse.com",
            role: "HR Admin",
          })
        );

        if (rememberMe) {
          localStorage.setItem("peoplepulse_remember", "true");
        } else {
          localStorage.removeItem("peoplepulse_remember");
        }

        navigate("/");
      } else {
        setError("Invalid email or password.");
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-decoration decoration-one"></div>
      <div className="login-decoration decoration-two"></div>

      <div className="login-container">
        <div className="login-brand">
          <div className="login-brand-icon">
            <Sparkles size={24} />
          </div>

          <div>
            <h1>PeoplePulse</h1>
            <span>HR Management</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-heading">
            <div className="login-welcome-icon">
              <ShieldCheck size={25} />
            </div>

            <h2>Welcome back</h2>

            <p>
              Sign in to manage your people, performance and workplace.
            </p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>

              <div className="input-wrapper">
                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <Lock size={19} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
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

            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />

                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  setError("Please contact your HR administrator to reset your password.")
                }
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="demo-login">
            <strong>Demo Account</strong>

            <span>admin@peoplepulse.com</span>

            <span>Password: Admin@123</span>
          </div>
        </div>

        <p className="login-footer">
          © 2026 PeoplePulse HR · People. Progress. Performance.
        </p>
      </div>
    </div>
  );
}

export default Login;