import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  X,
  FileText,
} from "lucide-react";

import { initialLeaveData } from "../data/leaveData";

const STORAGE_KEY = "peoplepulse_leave";

function getInitialLeaveData() {
  const savedLeave = localStorage.getItem(STORAGE_KEY);

  if (savedLeave) {
    try {
      return JSON.parse(savedLeave);
    } catch {
      return initialLeaveData;
    }
  }

  return initialLeaveData;
}

function Leave() {
  const [leaveData, setLeaveData] = useState(
    getInitialLeaveData
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [leaveTypeFilter, setLeaveTypeFilter] =
    useState("All");

  const [isApplyModalOpen, setIsApplyModalOpen] =
    useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] =
    useState(false);

  const [selectedLeave, setSelectedLeave] =
    useState(null);

  const [toast, setToast] = useState("");

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    employeeName: "",
    department: "",
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(leaveData)
    );
  }, [leaveData]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const filteredLeave = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return leaveData.filter((leave) => {
      const matchesSearch =
        !search ||
        leave.employeeName
          .toLowerCase()
          .includes(search) ||
        leave.department
          .toLowerCase()
          .includes(search) ||
        leave.leaveType
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        leave.status === statusFilter;

      const matchesLeaveType =
        leaveTypeFilter === "All" ||
        leave.leaveType === leaveTypeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLeaveType
      );
    });
  }, [
    leaveData,
    searchTerm,
    statusFilter,
    leaveTypeFilter,
  ]);

  const pendingCount = leaveData.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const approvedCount = leaveData.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const rejectedCount = leaveData.filter(
    (leave) => leave.status === "Rejected"
  ).length;

  const totalLeaveDays = leaveData
    .filter((leave) => leave.status === "Approved")
    .reduce((total, leave) => total + leave.days, 0);

  const openDetails = (leave) => {
    setSelectedLeave(leave);
    setIsDetailsModalOpen(true);
  };

  const closeDetails = () => {
    setSelectedLeave(null);
    setIsDetailsModalOpen(false);
  };

  const openApplyModal = () => {
    setFormData({
      employeeName: "",
      department: "",
      leaveType: "Casual Leave",
      fromDate: "",
      toDate: "",
      reason: "",
    });

    setErrors({});
    setIsApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
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

  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) {
      return 0;
    }

    const start = new Date(`${fromDate}T00:00:00`);
    const end = new Date(`${toDate}T00:00:00`);

    const difference =
      end.getTime() - start.getTime();

    if (difference < 0) {
      return 0;
    }

    return (
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeName.trim()) {
      newErrors.employeeName =
        "Employee name is required.";
    }

    if (!formData.department.trim()) {
      newErrors.department =
        "Department is required.";
    }

    if (!formData.fromDate) {
      newErrors.fromDate =
        "Start date is required.";
    }

    if (!formData.toDate) {
      newErrors.toDate =
        "End date is required.";
    }

    if (
      formData.fromDate &&
      formData.toDate &&
      formData.toDate < formData.fromDate
    ) {
      newErrors.toDate =
        "End date cannot be before start date.";
    }

    if (!formData.reason.trim()) {
      newErrors.reason =
        "Please enter a reason for leave.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleApplyLeave = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const days = calculateDays(
      formData.fromDate,
      formData.toDate
    );

    const newLeave = {
      id:
        leaveData.length > 0
          ? Math.max(
              ...leaveData.map((leave) => leave.id)
            ) + 1
          : 1,

      employeeId: leaveData.length + 1,

      employeeName:
        formData.employeeName.trim(),

      department:
        formData.department.trim(),

      leaveType: formData.leaveType,

      fromDate: formData.fromDate,

      toDate: formData.toDate,

      days,

      reason: formData.reason.trim(),

      appliedOn: new Date()
        .toISOString()
        .split("T")[0],

      status: "Pending",
    };

    setLeaveData((previous) => [
      newLeave,
      ...previous,
    ]);

    setToast(
      "Leave application submitted successfully."
    );

    closeApplyModal();
  };

  const updateLeaveStatus = (id, status) => {
    const leave = leaveData.find(
      (item) => item.id === id
    );

    if (!leave) {
      return;
    }

    setLeaveData((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );

    setToast(
      `${leave.employeeName}'s leave has been ${status.toLowerCase()}.`
    );

    if (selectedLeave?.id === id) {
      setSelectedLeave({
        ...leave,
        status,
      });
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "leave-status-pending";

      case "Approved":
        return "leave-status-approved";

      case "Rejected":
        return "leave-status-rejected";

      default:
        return "";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="leave-page">
      <div className="leave-heading">
        <div>
          <p className="page-eyebrow">
            Time Off & Requests
          </p>

          <h1>Leave Management</h1>

          <p>
            Manage employee leave applications,
            approvals and leave history.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openApplyModal}
        >
          <Plus size={18} />
          Apply Leave
        </button>
      </div>

      {/* Summary */}

      <div className="leave-summary">
        <div className="leave-summary-card">
          <div className="leave-summary-icon leave-icon-pending">
            <Clock3 size={21} />
          </div>

          <div>
            <span>Pending Requests</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="leave-summary-card">
          <div className="leave-summary-icon leave-icon-approved">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>
        </div>

        <div className="leave-summary-card">
          <div className="leave-summary-icon leave-icon-rejected">
            <XCircle size={21} />
          </div>

          <div>
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>

        <div className="leave-summary-card">
          <div className="leave-summary-icon leave-icon-days">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>Approved Leave Days</span>
            <strong>{totalLeaveDays}</strong>
          </div>
        </div>
      </div>

      {/* Toolbar */}

      <div className="leave-toolbar">
        <div className="leave-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search employee, department or leave type..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="leave-filters">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">
              Approved
            </option>
            <option value="Rejected">
              Rejected
            </option>
          </select>

          <select
            value={leaveTypeFilter}
            onChange={(event) =>
              setLeaveTypeFilter(event.target.value)
            }
          >
            <option value="All">
              All Leave Types
            </option>
            <option value="Casual Leave">
              Casual Leave
            </option>
            <option value="Sick Leave">
              Sick Leave
            </option>
            <option value="Earned Leave">
              Earned Leave
            </option>
            <option value="Maternity Leave">
              Maternity Leave
            </option>
          </select>
        </div>
      </div>

      {/* Leave Table */}

      <div className="leave-card">
        <div className="leave-card-header">
          <div>
            <h2>Leave Requests</h2>

            <p>
              {filteredLeave.length} request
              {filteredLeave.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {filteredLeave.length === 0 ? (
          <div className="leave-empty-state">
            <FileText size={42} />

            <h3>No leave requests found</h3>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="leave-table-wrapper">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Duration</th>
                  <th>Days</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeave.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <div className="leave-employee">
                        <div className="leave-avatar">
                          {leave.employeeName
                            .split(" ")
                            .map((name) =>
                              name.charAt(0)
                            )
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div>
                          <strong>
                            {leave.employeeName}
                          </strong>

                          <span>
                            {leave.department}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="leave-type">
                        {leave.leaveType}
                      </span>
                    </td>

                    <td>
                      <div className="leave-duration">
                        <span>
                          {formatDate(
                            leave.fromDate
                          )}
                        </span>

                        <span>to</span>

                        <span>
                          {formatDate(
                            leave.toDate
                          )}
                        </span>
                      </div>
                    </td>

                    <td>
                      <strong>
                        {leave.days}
                      </strong>
                    </td>

                    <td>
                      {formatDate(
                        leave.appliedOn
                      )}
                    </td>

                    <td>
                      <span
                        className={`leave-status ${getStatusClass(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </td>

                    <td>
                      <div className="leave-actions">
                        <button
                          type="button"
                          className="icon-action"
                          title="View details"
                          onClick={() =>
                            openDetails(leave)
                          }
                        >
                          <Eye size={16} />
                        </button>

                        {leave.status ===
                          "Pending" && (
                          <>
                            <button
                              type="button"
                              className="icon-action leave-approve-action"
                              title="Approve leave"
                              onClick={() =>
                                updateLeaveStatus(
                                  leave.id,
                                  "Approved"
                                )
                              }
                            >
                              <Check size={16} />
                            </button>

                            <button
                              type="button"
                              className="icon-action leave-reject-action"
                              title="Reject leave"
                              onClick={() =>
                                updateLeaveStatus(
                                  leave.id,
                                  "Rejected"
                                )
                              }
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}

      {isApplyModalOpen && (
        <div
          className="modal-overlay"
          onClick={closeApplyModal}
        >
          <div
            className="leave-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="leave-modal-header">
              <div>
                <h2>Apply Leave</h2>

                <p>
                  Create a new employee leave request.
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeApplyModal}
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="leave-form"
              onSubmit={handleApplyLeave}
            >
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Employee Name <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="employeeName"
                    placeholder="Enter employee name"
                    value={formData.employeeName}
                    onChange={handleChange}
                  />

                  {errors.employeeName && (
                    <small className="form-error">
                      {errors.employeeName}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Department <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleChange}
                  />

                  {errors.department && (
                    <small className="form-error">
                      {errors.department}
                    </small>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>
                  Leave Type <span>*</span>
                </label>

                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                >
                  <option value="Casual Leave">
                    Casual Leave
                  </option>

                  <option value="Sick Leave">
                    Sick Leave
                  </option>

                  <option value="Earned Leave">
                    Earned Leave
                  </option>

                  <option value="Maternity Leave">
                    Maternity Leave
                  </option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    From Date <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                  />

                  {errors.fromDate && (
                    <small className="form-error">
                      {errors.fromDate}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    To Date <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                  />

                  {errors.toDate && (
                    <small className="form-error">
                      {errors.toDate}
                    </small>
                  )}
                </div>
              </div>

              {formData.fromDate &&
                formData.toDate &&
                calculateDays(
                  formData.fromDate,
                  formData.toDate
                ) > 0 && (
                  <div className="leave-days-preview">
                    <CalendarDays size={17} />

                    <span>
                      Total leave days:{" "}
                      <strong>
                        {calculateDays(
                          formData.fromDate,
                          formData.toDate
                        )}
                      </strong>
                    </span>
                  </div>
                )}

              <div className="form-group">
                <label>
                  Reason <span>*</span>
                </label>

                <textarea
                  name="reason"
                  rows="4"
                  placeholder="Enter reason for leave..."
                  value={formData.reason}
                  onChange={handleChange}
                />

                {errors.reason && (
                  <small className="form-error">
                    {errors.reason}
                  </small>
                )}
              </div>

              <div className="leave-form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeApplyModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <CheckCircle2 size={17} />
                  Submit Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}

      {isDetailsModalOpen &&
        selectedLeave && (
          <div
            className="modal-overlay"
            onClick={closeDetails}
          >
            <div
              className="leave-modal leave-details-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="leave-modal-header">
                <div>
                  <h2>Leave Details</h2>

                  <p>
                    Leave request #
                    {selectedLeave.id}
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close-button"
                  onClick={closeDetails}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="leave-details">
                <div className="leave-detail-profile">
                  <div className="leave-detail-avatar">
                    {selectedLeave.employeeName
                      .split(" ")
                      .map((name) =>
                        name.charAt(0)
                      )
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div>
                    <h3>
                      {selectedLeave.employeeName}
                    </h3>

                    <p>
                      {selectedLeave.department}
                    </p>
                  </div>

                  <span
                    className={`leave-status ${getStatusClass(
                      selectedLeave.status
                    )}`}
                  >
                    {selectedLeave.status}
                  </span>
                </div>

                <div className="leave-detail-grid">
                  <div>
                    <span>Leave Type</span>
                    <strong>
                      {selectedLeave.leaveType}
                    </strong>
                  </div>

                  <div>
                    <span>Total Days</span>
                    <strong>
                      {selectedLeave.days} day
                      {selectedLeave.days !== 1
                        ? "s"
                        : ""}
                    </strong>
                  </div>

                  <div>
                    <span>From Date</span>
                    <strong>
                      {formatDate(
                        selectedLeave.fromDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>To Date</span>
                    <strong>
                      {formatDate(
                        selectedLeave.toDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Applied On</span>
                    <strong>
                      {formatDate(
                        selectedLeave.appliedOn
                      )}
                    </strong>
                  </div>
                </div>

                <div className="leave-detail-reason">
                  <span>Reason</span>

                  <p>
                    {selectedLeave.reason}
                  </p>
                </div>

                {selectedLeave.status ===
                  "Pending" && (
                  <div className="leave-detail-actions">
                    <button
                      type="button"
                      className="leave-reject-button"
                      onClick={() =>
                        updateLeaveStatus(
                          selectedLeave.id,
                          "Rejected"
                        )
                      }
                    >
                      <X size={17} />
                      Reject
                    </button>

                    <button
                      type="button"
                      className="leave-approve-button"
                      onClick={() =>
                        updateLeaveStatus(
                          selectedLeave.id,
                          "Approved"
                        )
                      }
                    >
                      <Check size={17} />
                      Approve
                    </button>
                  </div>
                )}
              </div>
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

export default Leave;