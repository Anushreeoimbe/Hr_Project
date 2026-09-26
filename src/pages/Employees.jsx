import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
} from "lucide-react";

import initialEmployees from "../data/initialData";

function Employees() {
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem(
      "peoplepulse_employees"
    );

    return savedEmployees
      ? JSON.parse(savedEmployees)
      : initialEmployees;
  });

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  const [currentPage, setCurrentPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [toast, setToast] = useState("");

  const employeesPerPage = 5;

  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    status: "Active",
    joiningDate: "",
    location: "",
  };

  const [form, setForm] = useState(emptyForm);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem(
      "peoplepulse_employees",
      JSON.stringify(employees)
    );
  }, [employees]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const departments = [
    "All",
    ...new Set(employees.map((employee) => employee.department)),
  ];

  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((employee) => {
        const fullName =
          `${employee.firstName} ${employee.lastName}`.toLowerCase();

        return (
          fullName.includes(searchValue) ||
          employee.email.toLowerCase().includes(searchValue) ||
          employee.department
            .toLowerCase()
            .includes(searchValue) ||
          employee.position.toLowerCase().includes(searchValue)
        );
      });
    }

    if (departmentFilter !== "All") {
      result = result.filter(
        (employee) =>
          employee.department === departmentFilter
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (employee) => employee.status === statusFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") {
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      }

      if (sortBy === "department") {
        return a.department.localeCompare(b.department);
      }

      if (sortBy === "joiningDate") {
        return new Date(a.joiningDate) - new Date(b.joiningDate);
      }

      return 0;
    });

    return result;
  }, [
    employees,
    search,
    departmentFilter,
    statusFilter,
    sortBy,
  ]);

  const totalPages = Math.ceil(
    filteredEmployees.length / employeesPerPage
  );

  const startIndex =
    (currentPage - 1) * employeesPerPage;

  const currentEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + employeesPerPage
  );

  const openAddForm = () => {
    setEditingEmployee(null);
    setForm(emptyForm);
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (employee) => {
    setEditingEmployee(employee);
    setForm(employee);
    setErrors({});
    setShowForm(true);
  };

  const openDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
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

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!form.department) {
      newErrors.department = "Department is required.";
    }

    if (!form.position.trim()) {
      newErrors.position = "Position is required.";
    }

    if (!form.joiningDate) {
      newErrors.joiningDate =
        "Joining date is required.";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingEmployee) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingEmployee.id
            ? {
                ...form,
                id: editingEmployee.id,
              }
            : employee
        )
      );

      setToast("Employee updated successfully.");
    } else {
      const newEmployee = {
        ...form,
        id: Date.now(),
      };

      setEmployees((previous) => [
        newEmployee,
        ...previous,
      ]);

      setToast("Employee added successfully.");
    }

    closeForm();
  };

  const handleDelete = (id) => {
    const employee = employees.find(
      (item) => item.id === id
    );

    if (!employee) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
    );

    if (!confirmed) return;

    setEmployees((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setToast("Employee deleted successfully.");
  };

  const getInitials = (employee) => {
    return `${employee.firstName[0]}${employee.lastName[0]}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="employees-page">
      <div className="employees-heading">
        <div>
          <span className="page-eyebrow">
            PEOPLE MANAGEMENT
          </span>

          <h1>Employees</h1>

          <p>
            Manage your employees, roles and workplace
            information.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      <div className="employee-summary">
        <div className="summary-icon">
          <Users size={21} />
        </div>

        <div>
          <strong>{employees.length}</strong>
          <span>Total Employees</span>
        </div>
      </div>

      <div className="employee-toolbar">
        <div className="employee-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => {
            setDepartmentFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          {departments.map((department) => (
            <option
              value={department}
              key={department}
            >
              {department === "All"
                ? "All Departments"
                : department}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="On Leave">On Leave</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort: Name</option>
          <option value="department">
            Sort: Department
          </option>
          <option value="joiningDate">
            Sort: Joining Date
          </option>
        </select>
      </div>

      <div className="employees-card">
        <div className="employees-table-wrapper">
          <table className="employees-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Joining Date</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="employee-table-person">
                        <div className="employee-avatar large">
                          {getInitials(employee)}
                        </div>

                        <div>
                          <strong>
                            {employee.firstName}{" "}
                            {employee.lastName}
                          </strong>

                          <span>{employee.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>{employee.department}</td>

                    <td>{employee.position}</td>

                    <td>
                      <span
                        className={`status-badge ${employee.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td>
                      {formatDate(employee.joiningDate)}
                    </td>

                    <td>{employee.location}</td>

                    <td>
                      <div className="employee-actions">
                        <button
                          title="View"
                          onClick={() =>
                            openDetails(employee)
                          }
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          title="Edit"
                          onClick={() =>
                            openEditForm(employee)
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          title="Delete"
                          className="delete-action"
                          onClick={() =>
                            handleDelete(employee.id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="employee-empty"
                  >
                    <Users size={35} />

                    <strong>
                      No employees found
                    </strong>

                    <span>
                      Try changing your search or filters.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length > 0 && (
          <div className="employee-pagination">
            <span>
              Showing {startIndex + 1}-
              {Math.min(
                startIndex + employeesPerPage,
                filteredEmployees.length
              )}{" "}
              of {filteredEmployees.length} employees
            </span>

            <div className="pagination-buttons">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (previous) => previous - 1
                  )
                }
              >
                <ChevronLeft size={17} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  className={
                    currentPage === page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage(
                    (previous) => previous + 1
                  )
                }
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="employee-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingEmployee
                    ? "Edit Employee"
                    : "Add New Employee"}
                </h2>

                <p>
                  {editingEmployee
                    ? "Update employee information."
                    : "Add a new employee to your team."}
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
              className="employee-form"
              onSubmit={handleSubmit}
            >
              <div className="form-grid">
                <div className="employee-form-group">
                  <label>First Name *</label>

                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />

                  {errors.firstName && (
                    <small>{errors.firstName}</small>
                  )}
                </div>

                <div className="employee-form-group">
                  <label>Last Name *</label>

                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />

                  {errors.lastName && (
                    <small>{errors.lastName}</small>
                  )}
                </div>

                <div className="employee-form-group">
                  <label>Email *</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                  />

                  {errors.email && (
                    <small>{errors.email}</small>
                  )}
                </div>

                <div className="employee-form-group">
                  <label>Phone *</label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                  />

                  {errors.phone && (
                    <small>{errors.phone}</small>
                  )}
                </div>

                <div className="employee-form-group">
                  <label>Department *</label>

                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select department
                    </option>

                    <option>
                      Engineering
                    </option>

                    <option>
                      Product Design
                    </option>

                    <option>Product</option>

                    <option>Marketing</option>

                    <option>
                      Human Resources
                    </option>

                    <option>Finance</option>

                    <option>Sales</option>

                    <option>Operations</option>
                  </select>

                  {errors.department && (
                    <small>{errors.department}</small>
                  )}
                </div>

                <div className="employee-form-group">
                  <label>Position *</label>

                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="Enter job position"
                  />

                  {errors.position && (
                    <small>{errors.position}</small>
                  )}
                </div>

                <div className="employee-form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>On Leave</option>
                  </select>
                </div>

                <div className="employee-form-group">
                  <label>Joining Date *</label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={form.joiningDate}
                    onChange={handleChange}
                  />

                  {errors.joiningDate && (
                    <small>
                      {errors.joiningDate}
                    </small>
                  )}
                </div>

                <div className="employee-form-group full-width">
                  <label>Location *</label>

                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Pune"
                  />

                  {errors.location && (
                    <small>{errors.location}</small>
                  )}
                </div>
              </div>

              <div className="modal-footer">
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
                  {editingEmployee
                    ? "Update Employee"
                    : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetails && selectedEmployee && (
        <div className="modal-overlay">
          <div className="employee-details-modal">
            <div className="modal-header">
              <div>
                <h2>Employee Profile</h2>
                <p>
                  Complete employee information
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowDetails(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="employee-profile-top">
              <div className="employee-avatar profile-avatar-large">
                {getInitials(selectedEmployee)}
              </div>

              <div>
                <h2>
                  {selectedEmployee.firstName}{" "}
                  {selectedEmployee.lastName}
                </h2>

                <p>{selectedEmployee.position}</p>

                <span
                  className={`status-badge ${selectedEmployee.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {selectedEmployee.status}
                </span>
              </div>
            </div>

            <div className="employee-detail-grid">
              <div>
                <span>Email</span>
                <strong>
                  {selectedEmployee.email}
                </strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>
                  {selectedEmployee.phone}
                </strong>
              </div>

              <div>
                <span>Department</span>
                <strong>
                  {selectedEmployee.department}
                </strong>
              </div>

              <div>
                <span>Position</span>
                <strong>
                  {selectedEmployee.position}
                </strong>
              </div>

              <div>
                <span>Joining Date</span>
                <strong>
                  {formatDate(
                    selectedEmployee.joiningDate
                  )}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {selectedEmployee.location}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="success-toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}

export default Employees;