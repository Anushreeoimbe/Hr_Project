import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Star,
  Eye,
  Pencil,
  Trash2,
  Target,
  CheckCircle2,
  Clock3,
  Award,
  X,
} from "lucide-react";

import { initialPerformanceData } from "../data/performanceData";

const STORAGE_KEY = "peoplepulse_performance";

const emptyForm = {
  employeeName: "",
  department: "",
  role: "",
  reviewPeriod: "Q3 2026",
  rating: "",
  goalsCompleted: "",
  totalGoals: "10",
  status: "In Progress",
  reviewer: "",
  reviewDate: "",
  strengths: "",
  achievements: "",
  feedback: "",
};

function Performance() {
  const [performanceData, setPerformanceData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialPerformanceData;
      }
    }

    return initialPerformanceData;
  });

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(performanceData)
    );
  }, [performanceData]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const departments = useMemo(() => {
    return [
      "All",
      ...new Set(
        performanceData.map((item) => item.department)
      ),
    ];
  }, [performanceData]);

  const filteredData = useMemo(() => {
    return performanceData.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.employeeName.toLowerCase().includes(searchValue) ||
        item.department.toLowerCase().includes(searchValue) ||
        item.role.toLowerCase().includes(searchValue);

      const matchesDepartment =
        departmentFilter === "All" ||
        item.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesRating =
        ratingFilter === "All" ||
        (ratingFilter === "Excellent" && item.rating >= 4.5) ||
        (ratingFilter === "Good" &&
          item.rating >= 4 &&
          item.rating < 4.5) ||
        (ratingFilter === "Needs Improvement" &&
          item.rating < 4);

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesRating
      );
    });
  }, [
    performanceData,
    search,
    departmentFilter,
    statusFilter,
    ratingFilter,
  ]);

  const averageRating = useMemo(() => {
    if (!performanceData.length) return "0.0";

    const total = performanceData.reduce(
      (sum, item) => sum + Number(item.rating),
      0
    );

    return (total / performanceData.length).toFixed(1);
  }, [performanceData]);

  const completedReviews = performanceData.filter(
    (item) => item.status === "Completed"
  ).length;

  const inProgressReviews = performanceData.filter(
    (item) => item.status === "In Progress"
  ).length;

  const totalGoals = performanceData.reduce(
    (sum, item) => sum + Number(item.totalGoals || 0),
    0
  );

  const completedGoals = performanceData.reduce(
    (sum, item) => sum + Number(item.goalsCompleted || 0),
    0
  );

  const goalPercentage = totalGoals
    ? Math.round((completedGoals / totalGoals) * 100)
    : 0;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "performance-status performance-completed";
    }

    return "performance-status performance-progress";
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Good";
    return "Needs Improvement";
  };

  const getRatingClass = (rating) => {
    if (rating >= 4.5) return "rating-excellent";
    if (rating >= 4) return "rating-good";
    return "rating-improvement";
  };

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);

    return (
      <div className="performance-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
            fill={
              star <= roundedRating
                ? "currentColor"
                : "none"
            }
          />
        ))}
      </div>
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = "Employee name is required.";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required.";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required.";
    }

    if (!formData.rating) {
      newErrors.rating = "Rating is required.";
    } else if (
      Number(formData.rating) < 1 ||
      Number(formData.rating) > 5
    ) {
      newErrors.rating = "Rating must be between 1 and 5.";
    }

    if (formData.goalsCompleted === "") {
      newErrors.goalsCompleted =
        "Completed goals are required.";
    } else if (
      Number(formData.goalsCompleted) < 0 ||
      Number(formData.goalsCompleted) >
        Number(formData.totalGoals)
    ) {
      newErrors.goalsCompleted =
        "Completed goals cannot exceed total goals.";
    }

    if (!formData.totalGoals) {
      newErrors.totalGoals = "Total goals are required.";
    }

    if (!formData.reviewer.trim()) {
      newErrors.reviewer = "Reviewer is required.";
    }

    if (!formData.reviewDate) {
      newErrors.reviewDate = "Review date is required.";
    }

    if (!formData.strengths.trim()) {
      newErrors.strengths = "Strengths are required.";
    }

    if (!formData.achievements.trim()) {
      newErrors.achievements =
        "Achievements are required.";
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = "Feedback is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
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

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setShowForm(true);
  };

  const openEditModal = (review) => {
    setEditingId(review.id);

    setFormData({
      employeeName: review.employeeName,
      department: review.department,
      role: review.role,
      reviewPeriod: review.reviewPeriod,
      rating: String(review.rating),
      goalsCompleted: String(review.goalsCompleted),
      totalGoals: String(review.totalGoals),
      status: review.status,
      reviewer: review.reviewer,
      reviewDate: review.reviewDate,
      strengths: review.strengths,
      achievements: review.achievements,
      feedback: review.feedback,
    });

    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const review = {
      id:
        editingId ||
        Date.now(),

      employeeId:
        editingId
          ? performanceData.find(
              (item) => item.id === editingId
            )?.employeeId || Date.now()
          : Date.now(),

      employeeName: formData.employeeName.trim(),
      department: formData.department.trim(),
      role: formData.role.trim(),
      reviewPeriod: formData.reviewPeriod.trim(),
      rating: Number(formData.rating),
      goalsCompleted: Number(formData.goalsCompleted),
      totalGoals: Number(formData.totalGoals),
      status: formData.status,
      reviewer: formData.reviewer.trim(),
      reviewDate: formData.reviewDate,
      strengths: formData.strengths.trim(),
      achievements: formData.achievements.trim(),
      feedback: formData.feedback.trim(),
    };

    if (editingId) {
      setPerformanceData((previous) =>
        previous.map((item) =>
          item.id === editingId ? review : item
        )
      );

      setToast("Performance review updated successfully.");
    } else {
      setPerformanceData((previous) => [
        review,
        ...previous,
      ]);

      setToast("Performance review added successfully.");
    }

    closeForm();
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this performance review?"
    );

    if (!confirmed) return;

    setPerformanceData((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setToast("Performance review deleted successfully.");
  };

  const openDetails = (review) => {
    setSelectedReview(review);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setSelectedReview(null);
    setShowDetails(false);
  };

  return (
    <div className="performance-page">
      <div className="performance-heading">
        <div>
          <h1>Performance Management</h1>
          <p>
            Track employee performance, goals and review progress.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Review
        </button>
      </div>

      <div className="performance-summary">
        <div className="performance-summary-card">
          <div className="performance-summary-icon">
            <Star size={21} />
          </div>

          <div>
            <span>Average Rating</span>
            <strong>{averageRating}/5</strong>
          </div>
        </div>

        <div className="performance-summary-card">
          <div className="performance-summary-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Completed Reviews</span>
            <strong>{completedReviews}</strong>
          </div>
        </div>

        <div className="performance-summary-card">
          <div className="performance-summary-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>{inProgressReviews}</strong>
          </div>
        </div>

        <div className="performance-summary-card">
          <div className="performance-summary-icon">
            <Target size={21} />
          </div>

          <div>
            <span>Goals Completed</span>
            <strong>{goalPercentage}%</strong>
          </div>
        </div>
      </div>

      <div className="performance-toolbar">
        <div className="performance-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search employee, department or role..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="performance-filters">
          <select
            value={departmentFilter}
            onChange={(event) =>
              setDepartmentFilter(event.target.value)
            }
          >
            {departments.map((department) => (
              <option
                key={department}
                value={department}
              >
                {department === "All"
                  ? "All Departments"
                  : department}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">
              In Progress
            </option>
          </select>

          <select
            value={ratingFilter}
            onChange={(event) =>
              setRatingFilter(event.target.value)
            }
          >
            <option value="All">All Ratings</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Needs Improvement">
              Needs Improvement
            </option>
          </select>
        </div>
      </div>

      <div className="performance-card">
        <div className="performance-card-header">
          <div>
            <h2>Employee Performance</h2>
            <p>
              {filteredData.length} review
              {filteredData.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="performance-table-wrapper">
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Review Period</th>
                  <th>Rating</th>
                  <th>Goals</th>
                  <th>Status</th>
                  <th>Review Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((review) => (
                  <tr key={review.id}>
                    <td>
                      <div className="performance-employee">
                        <div className="performance-avatar">
                          {review.employeeName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {review.employeeName}
                          </strong>
                          <span>{review.role}</span>
                        </div>
                      </div>
                    </td>

                    <td>{review.department}</td>

                    <td>
                      <span className="performance-period">
                        {review.reviewPeriod}
                      </span>
                    </td>

                    <td>
                      <div className="performance-rating">
                        {renderStars(review.rating)}

                        <strong>
                          {review.rating.toFixed(1)}
                        </strong>
                      </div>

                      <span
                        className={`rating-label ${getRatingClass(
                          review.rating
                        )}`}
                      >
                        {getRatingLabel(review.rating)}
                      </span>
                    </td>

                    <td>
                      <div className="goal-cell">
                        <strong>
                          {review.goalsCompleted}/
                          {review.totalGoals}
                        </strong>

                        <div className="goal-progress">
                          <span
                            style={{
                              width: `${
                                review.totalGoals
                                  ? Math.min(
                                      100,
                                      (review.goalsCompleted /
                                        review.totalGoals) *
                                        100
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          review.status
                        )}
                      >
                        {review.status}
                      </span>
                    </td>

                    <td>
                      {formatDate(review.reviewDate)}
                    </td>

                    <td>
                      <div className="performance-actions">
                        <button
                          className="icon-action"
                          title="View"
                          onClick={() =>
                            openDetails(review)
                          }
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          className="icon-action"
                          title="Edit"
                          onClick={() =>
                            openEditModal(review)
                          }
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          className="icon-action danger-action"
                          title="Delete"
                          onClick={() =>
                            handleDelete(review.id)
                          }
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="performance-empty-state">
            <Award size={42} />

            <h3>No performance reviews found</h3>

            <p>
              Try changing your filters or add a new
              performance review.
            </p>

            <button
              className="primary-button"
              onClick={openAddModal}
            >
              <Plus size={18} />
              Add Review
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className="success-toast">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={closeForm}
        >
          <div
            className="performance-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="performance-modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Performance Review"
                    : "Add Performance Review"}
                </h2>

                <p>
                  Enter employee performance and review
                  details.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeForm}
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="performance-form"
              onSubmit={handleSubmit}
            >
              <div className="form-row">
                <div className="form-group">
                  <label>Employee Name *</label>

                  <input
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    placeholder="Enter employee name"
                  />

                  {errors.employeeName && (
                    <span className="form-error">
                      {errors.employeeName}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Department *</label>

                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Enter department"
                  />

                  {errors.department && (
                    <span className="form-error">
                      {errors.department}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>

                  <input
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Enter employee role"
                  />

                  {errors.role && (
                    <span className="form-error">
                      {errors.role}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Review Period</label>

                  <input
                    name="reviewPeriod"
                    value={formData.reviewPeriod}
                    onChange={handleInputChange}
                    placeholder="Example: Q3 2026"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating *</label>

                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder="1 - 5"
                  />

                  {errors.rating && (
                    <span className="form-error">
                      {errors.rating}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="In Progress">
                      In Progress
                    </option>
                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Goals Completed *</label>

                  <input
                    type="number"
                    name="goalsCompleted"
                    value={formData.goalsCompleted}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Example: 8"
                  />

                  {errors.goalsCompleted && (
                    <span className="form-error">
                      {errors.goalsCompleted}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Total Goals *</label>

                  <input
                    type="number"
                    name="totalGoals"
                    value={formData.totalGoals}
                    onChange={handleInputChange}
                    min="1"
                  />

                  {errors.totalGoals && (
                    <span className="form-error">
                      {errors.totalGoals}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Reviewer *</label>

                  <input
                    name="reviewer"
                    value={formData.reviewer}
                    onChange={handleInputChange}
                    placeholder="Enter reviewer name"
                  />

                  {errors.reviewer && (
                    <span className="form-error">
                      {errors.reviewer}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Review Date *</label>

                  <input
                    type="date"
                    name="reviewDate"
                    value={formData.reviewDate}
                    onChange={handleInputChange}
                  />

                  {errors.reviewDate && (
                    <span className="form-error">
                      {errors.reviewDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Strengths *</label>

                <textarea
                  name="strengths"
                  value={formData.strengths}
                  onChange={handleInputChange}
                  placeholder="Describe employee strengths..."
                  rows="3"
                />

                {errors.strengths && (
                  <span className="form-error">
                    {errors.strengths}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Achievements *</label>

                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleInputChange}
                  placeholder="Describe key achievements..."
                  rows="3"
                />

                {errors.achievements && (
                  <span className="form-error">
                    {errors.achievements}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Feedback *</label>

                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  placeholder="Enter feedback and improvement areas..."
                  rows="3"
                />

                {errors.feedback && (
                  <span className="form-error">
                    {errors.feedback}
                  </span>
                )}
              </div>

              <div className="performance-form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingId
                    ? "Update Review"
                    : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetails && selectedReview && (
        <div
          className="modal-overlay"
          onClick={closeDetails}
        >
          <div
            className="performance-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="performance-modal-header">
              <div>
                <h2>Performance Review</h2>
                <p>
                  Detailed employee performance information.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeDetails}
              >
                <X size={20} />
              </button>
            </div>

            <div className="performance-detail-profile">
              <div className="performance-detail-avatar">
                {selectedReview.employeeName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h3>
                  {selectedReview.employeeName}
                </h3>

                <p>
                  {selectedReview.role} ·{" "}
                  {selectedReview.department}
                </p>

                <div className="performance-detail-rating">
                  {renderStars(selectedReview.rating)}
                  <strong>
                    {selectedReview.rating.toFixed(1)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="performance-detail-grid">
              <div>
                <span>Review Period</span>
                <strong>
                  {selectedReview.reviewPeriod}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selectedReview.status}
                </strong>
              </div>

              <div>
                <span>Goals Completed</span>
                <strong>
                  {selectedReview.goalsCompleted}/
                  {selectedReview.totalGoals}
                </strong>
              </div>

              <div>
                <span>Reviewer</span>
                <strong>
                  {selectedReview.reviewer}
                </strong>
              </div>

              <div>
                <span>Review Date</span>
                <strong>
                  {formatDate(selectedReview.reviewDate)}
                </strong>
              </div>

              <div>
                <span>Rating Level</span>
                <strong>
                  {getRatingLabel(
                    selectedReview.rating
                  )}
                </strong>
              </div>
            </div>

            <div className="performance-detail-section">
              <h4>Strengths</h4>
              <p>{selectedReview.strengths}</p>
            </div>

            <div className="performance-detail-section">
              <h4>Achievements</h4>
              <p>{selectedReview.achievements}</p>
            </div>

            <div className="performance-detail-section">
              <h4>Feedback</h4>
              <p>{selectedReview.feedback}</p>
            </div>

            <div className="performance-detail-actions">
              <button
                className="secondary-button"
                onClick={closeDetails}
              >
                Close
              </button>

              <button
                className="primary-button"
                onClick={() => {
                  closeDetails();
                  openEditModal(selectedReview);
                }}
              >
                <Pencil size={17} />
                Edit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Performance;