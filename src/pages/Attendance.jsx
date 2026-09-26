import { useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  UserCheck,
  Pencil,
  X,
} from "lucide-react";

import { initialAttendance } from "../data/attendanceData";

const STORAGE_KEY = "peoplepulse_attendance";

function getInitialAttendance() {
  const savedAttendance = localStorage.getItem(STORAGE_KEY);

  if (savedAttendance) {
    try {
      return JSON.parse(savedAttendance);
    } catch {
      return initialAttendance;
    }
  }

  return initialAttendance;
}

function Attendance() {
  const [attendance, setAttendance] = useState(
    getInitialAttendance
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(
    "2026-09-26"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] =
    useState(null);

  const [formData, setFormData] = useState({
    status: "Present",
    checkIn: "",
    checkOut: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(attendance)
    );
  }, [attendance]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const filteredAttendance = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return attendance.filter((record) => {
      const matchesSearch =
        !search ||
        record.employeeName
          .toLowerCase()
          .includes(search) ||
        record.department
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      const matchesDate =
        record.date === selectedDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    attendance,
    searchTerm,
    statusFilter,
    selectedDate,
  ]);

  const todayAttendance = attendance.filter(
    (record) => record.date === selectedDate
  );

  const presentCount = todayAttendance.filter(
    (record) => record.status === "Present"
  ).length;

  const lateCount = todayAttendance.filter(
    (record) => record.status === "Late"
  ).length;

  const absentCount = todayAttendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const leaveCount = todayAttendance.filter(
    (record) => record.status === "On Leave"
  ).length;

  const openEditModal = (record) => {
    setEditingAttendance(record);

    setFormData({
      status: record.status,
      checkIn:
        record.checkIn === "-"
          ? ""
          : record.checkIn,
      checkOut:
        record.checkOut === "-"
          ? ""
          : record.checkOut,
    });

    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAttendance(null);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.status) {
      newErrors.status = "Please select attendance status.";
    }

    if (
      formData.status === "Present" ||
      formData.status === "Late" ||
      formData.status === "Half Day"
    ) {
      if (!formData.checkIn) {
        newErrors.checkIn =
          "Check-in time is required.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setAttendance((previous) =>
      previous.map((record) => {
        if (record.id !== editingAttendance.id) {
          return record;
        }

        return {
          ...record,
          status: formData.status,
          checkIn:
            formData.checkIn.trim() || "-",
          checkOut:
            formData.checkOut.trim() || "-",
        };
      })
    );

    setToast(
      `${editingAttendance.employeeName}'s attendance updated successfully.`
    );

    closeModal();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Present":
        return "attendance-present";

      case "Late":
        return "attendance-late";

      case "Absent":
        return "attendance-absent";

      case "Half Day":
        return "attendance-halfday";

      case "On Leave":
        return "attendance-leave";

      default:
        return "";
    }
  };

  return (
    <div className="attendance-page">
      <div className="attendance-heading">
        <div>
          <p className="page-eyebrow">
            Workforce Tracking
          </p>

          <h1>Attendance</h1>

          <p>
            Monitor employee attendance and daily
            working hours.
          </p>
        </div>

        <div className="attendance-date-display">
          <CalendarDays size={18} />

          <span>
            {new Date(
              `${selectedDate}T00:00:00`
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Summary */}

      <div className="attendance-summary">
        <div className="attendance-summary-card">
          <div className="attendance-summary-icon attendance-icon-present">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Present</span>
            <strong>{presentCount}</strong>
          </div>
        </div>

        <div className="attendance-summary-card">
          <div className="attendance-summary-icon attendance-icon-late">
            <Clock3 size={21} />
          </div>

          <div>
            <span>Late</span>
            <strong>{lateCount}</strong>
          </div>
        </div>

        <div className="attendance-summary-card">
          <div className="attendance-summary-icon attendance-icon-absent">
            <XCircle size={21} />
          </div>

          <div>
            <span>Absent</span>
            <strong>{absentCount}</strong>
          </div>
        </div>

        <div className="attendance-summary-card">
          <div className="attendance-summary-icon attendance-icon-leave">
            <UserCheck size={21} />
          </div>

          <div>
            <span>On Leave</span>
            <strong>{leaveCount}</strong>
          </div>
        </div>
      </div>

      {/* Filters */}

      <div className="attendance-toolbar">
        <div className="attendance-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search employee or department..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="attendance-filters">
          <div className="attendance-date-input">
            <CalendarDays size={17} />

            <input
              type="date"
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(event.target.value)
              }
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="Half Day">Half Day</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Table */}

      <div className="attendance-card">
        <div className="attendance-card-header">
          <div>
            <h2>Daily Attendance</h2>

            <p>
              {filteredAttendance.length} employee
              {filteredAttendance.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {filteredAttendance.length === 0 ? (
          <div className="attendance-empty-state">
            <CalendarDays size={42} />

            <h3>No attendance records found</h3>

            <p>
              Try changing the date, search or status
              filter.
            </p>
          </div>
        ) : (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="attendance-employee">
                        <div className="attendance-avatar">
                          {record.employeeName
                            .split(" ")
                            .map((name) =>
                              name.charAt(0)
                            )
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div>
                          <strong>
                            {record.employeeName}
                          </strong>

                          <span>
                            Employee #{record.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>{record.department}</td>

                    <td>
                      <span className="attendance-time">
                        {record.checkIn}
                      </span>
                    </td>

                    <td>
                      <span className="attendance-time">
                        {record.checkOut}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`attendance-status ${getStatusClass(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="icon-action edit-action"
                        title="Edit attendance"
                        onClick={() =>
                          openEditModal(record)
                        }
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="attendance-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="attendance-modal-header">
              <div>
                <h2>Edit Attendance</h2>

                <p>
                  {editingAttendance?.employeeName}
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="attendance-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>
                  Attendance Status
                  <span>*</span>
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Present">
                    Present
                  </option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="Half Day">
                    Half Day
                  </option>
                  <option value="On Leave">
                    On Leave
                  </option>
                </select>

                {errors.status && (
                  <small className="form-error">
                    {errors.status}
                  </small>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Check In</label>

                  <input
                    type="text"
                    name="checkIn"
                    placeholder="e.g. 09:10 AM"
                    value={formData.checkIn}
                    onChange={handleChange}
                  />

                  {errors.checkIn && (
                    <small className="form-error">
                      {errors.checkIn}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>Check Out</label>

                  <input
                    type="text"
                    name="checkOut"
                    placeholder="e.g. 06:10 PM"
                    value={formData.checkOut}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="attendance-form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Update Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="success-toast">
          {toast}
        </div>
      )}
    </div>
  );
}

export default Attendance;