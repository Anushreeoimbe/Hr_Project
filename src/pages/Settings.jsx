import { useEffect, useState } from "react";
import {
  User,
  Bell,
  Lock,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

function Settings() {
  const savedUser = localStorage.getItem("peoplepulse_user");

  const user = savedUser
    ? JSON.parse(savedUser)
    : {
        name: "Anushree",
        email: "admin@peoplepulse.com",
        role: "HR Admin",
      };

  const [profile, setProfile] = useState({
    name: user.name || "Anushree",
    email: user.email || "admin@peoplepulse.com",
    role: user.role || "HR Admin",
    phone: "+91 98765 43210",
    location: "Pune, India",
  });

  const [notifications, setNotifications] = useState({
    leaveRequests: true,
    attendanceAlerts: true,
    performanceUpdates: true,
    emailNotifications: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [activeSection, setActiveSection] = useState("profile");

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const handleNotificationChange = (name) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  const saveProfile = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!profile.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!profile.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (
      profile.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!profile.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedUser = {
      name: profile.name,
      email: profile.email,
      role: profile.role,
    };

    localStorage.setItem(
      "peoplepulse_user",
      JSON.stringify(updatedUser)
    );

    setErrors({});
    setToast("Profile settings saved successfully.");
  };

  const saveNotifications = () => {
    localStorage.setItem(
      "peoplepulse_notifications",
      JSON.stringify(notifications)
    );

    setToast("Notification preferences updated.");
  };

  const changePassword = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword =
        "Current password is required.";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword =
        "New password is required.";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword =
        "Password must contain at least 8 characters.";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your new password.";
    } else if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (
      passwordData.currentPassword !== "Admin@123"
    ) {
      setErrors({
        currentPassword: "Current password is incorrect.",
      });
      return;
    }

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setErrors({});
    setToast("Password changed successfully.");
  };

  const renderPasswordToggle = (
    visible,
    setVisible
  ) => (
    <button
      type="button"
      className="settings-password-toggle"
      onClick={() => setVisible(!visible)}
    >
      {visible ? (
        <EyeOff size={17} />
      ) : (
        <Eye size={17} />
      )}
    </button>
  );

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <h1>Settings</h1>
          <p>
            Manage your PeoplePulse account and preferences.
          </p>
        </div>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <button
            className={
              activeSection === "profile"
                ? "settings-nav active"
                : "settings-nav"
            }
            onClick={() => setActiveSection("profile")}
          >
            <User size={18} />
            Profile
          </button>

          <button
            className={
              activeSection === "notifications"
                ? "settings-nav active"
                : "settings-nav"
            }
            onClick={() =>
              setActiveSection("notifications")
            }
          >
            <Bell size={18} />
            Notifications
          </button>

          <button
            className={
              activeSection === "password"
                ? "settings-nav active"
                : "settings-nav"
            }
            onClick={() =>
              setActiveSection("password")
            }
          >
            <Lock size={18} />
            Password
          </button>
        </aside>

        <section className="settings-content">
          {activeSection === "profile" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h2>Profile Information</h2>
                  <p>
                    Update your personal and account
                    information.
                  </p>
                </div>

                <div className="settings-profile-avatar">
                  {profile.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              </div>

              <form
                className="settings-form"
                onSubmit={saveProfile}
              >
                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <label>Full Name *</label>

                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your name"
                    />

                    {errors.name && (
                      <span className="form-error">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="settings-form-group">
                    <label>Email Address *</label>

                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      placeholder="Enter email"
                    />

                    {errors.email && (
                      <span className="form-error">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <label>Role</label>

                    <input
                      type="text"
                      name="role"
                      value={profile.role}
                      readOnly
                    />
                  </div>

                  <div className="settings-form-group">
                    <label>Phone Number *</label>

                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      placeholder="Enter phone number"
                    />

                    {errors.phone && (
                      <span className="form-error">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="settings-form-row">
                  <div className="settings-form-group">
                    <label>Location</label>

                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="settings-form-group">
                    <label>Account Status</label>

                    <div className="settings-status-field">
                      <span className="settings-active-dot" />
                      Active
                    </div>
                  </div>
                </div>

                <div className="settings-form-actions">
                  <button
                    type="submit"
                    className="primary-button"
                  >
                    <Save size={17} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h2>Notification Preferences</h2>
                  <p>
                    Choose which notifications you want to
                    receive.
                  </p>
                </div>

                <div className="settings-section-icon">
                  <Bell size={21} />
                </div>
              </div>

              <div className="settings-notifications">
                <div className="settings-notification-item">
                  <div>
                    <strong>Leave Requests</strong>
                    <p>
                      Receive notifications when employees
                      submit leave requests.
                    </p>
                  </div>

                  <button
                    type="button"
                    className={
                      notifications.leaveRequests
                        ? "settings-switch active"
                        : "settings-switch"
                    }
                    onClick={() =>
                      handleNotificationChange(
                        "leaveRequests"
                      )
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-notification-item">
                  <div>
                    <strong>Attendance Alerts</strong>
                    <p>
                      Get alerts about attendance and
                      check-in activity.
                    </p>
                  </div>

                  <button
                    type="button"
                    className={
                      notifications.attendanceAlerts
                        ? "settings-switch active"
                        : "settings-switch"
                    }
                    onClick={() =>
                      handleNotificationChange(
                        "attendanceAlerts"
                      )
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-notification-item">
                  <div>
                    <strong>Performance Updates</strong>
                    <p>
                      Receive updates about performance
                      reviews and goals.
                    </p>
                  </div>

                  <button
                    type="button"
                    className={
                      notifications.performanceUpdates
                        ? "settings-switch active"
                        : "settings-switch"
                    }
                    onClick={() =>
                      handleNotificationChange(
                        "performanceUpdates"
                      )
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-notification-item">
                  <div>
                    <strong>Email Notifications</strong>
                    <p>
                      Receive important PeoplePulse
                      notifications by email.
                    </p>
                  </div>

                  <button
                    type="button"
                    className={
                      notifications.emailNotifications
                        ? "settings-switch active"
                        : "settings-switch"
                    }
                    onClick={() =>
                      handleNotificationChange(
                        "emailNotifications"
                      )
                    }
                  >
                    <span />
                  </button>
                </div>
              </div>

              <div className="settings-form-actions">
                <button
                  className="primary-button"
                  onClick={saveNotifications}
                >
                  <Save size={17} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeSection === "password" && (
            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h2>Change Password</h2>
                  <p>
                    Update your account password securely.
                  </p>
                </div>

                <div className="settings-section-icon">
                  <Lock size={21} />
                </div>
              </div>

              <form
                className="settings-password-form"
                onSubmit={changePassword}
              >
                <div className="settings-form-group">
                  <label>Current Password *</label>

                  <div className="settings-password-input">
                    <input
                      type={
                        showCurrent
                          ? "text"
                          : "password"
                      }
                      name="currentPassword"
                      value={
                        passwordData.currentPassword
                      }
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />

                    {renderPasswordToggle(
                      showCurrent,
                      setShowCurrent
                    )}
                  </div>

                  {errors.currentPassword && (
                    <span className="form-error">
                      {errors.currentPassword}
                    </span>
                  )}
                </div>

                <div className="settings-form-group">
                  <label>New Password *</label>

                  <div className="settings-password-input">
                    <input
                      type={
                        showNew
                          ? "text"
                          : "password"
                      }
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />

                    {renderPasswordToggle(
                      showNew,
                      setShowNew
                    )}
                  </div>

                  {errors.newPassword && (
                    <span className="form-error">
                      {errors.newPassword}
                    </span>
                  )}
                </div>

                <div className="settings-form-group">
                  <label>Confirm New Password *</label>

                  <div className="settings-password-input">
                    <input
                      type={
                        showConfirm
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={
                        passwordData.confirmPassword
                      }
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />

                    {renderPasswordToggle(
                      showConfirm,
                      setShowConfirm
                    )}
                  </div>

                  {errors.confirmPassword && (
                    <span className="form-error">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                <div className="settings-password-note">
                  <Lock size={16} />
                  <span>
                    Password must contain at least 8
                    characters.
                  </span>
                </div>

                <div className="settings-form-actions">
                  <button
                    type="submit"
                    className="primary-button"
                  >
                    <Lock size={17} />
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>

      {toast && (
        <div className="success-toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}

export default Settings;