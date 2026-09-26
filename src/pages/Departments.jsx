import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Building2,
  Users,
  MapPin,
  X,
} from "lucide-react";

import { initialDepartments } from "../data/departmentData";

const STORAGE_KEY = "peoplepulse_departments";

function getInitialDepartments() {
  const savedDepartments = localStorage.getItem(STORAGE_KEY);

  if (savedDepartments) {
    try {
      return JSON.parse(savedDepartments);
    } catch {
      return initialDepartments;
    }
  }

  return initialDepartments;
}

function Departments() {
  const [departments, setDepartments] = useState(getInitialDepartments);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    location: "",
    employees: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) => {
      const search = searchTerm.toLowerCase().trim();

      if (!search) return true;

      return (
        department.name.toLowerCase().includes(search) ||
        department.manager.toLowerCase().includes(search) ||
        department.location.toLowerCase().includes(search)
      );
    });
  }, [departments, searchTerm]);

  const totalEmployees = departments.reduce(
    (total, department) => total + Number(department.employees || 0),
    0
  );

  const activeDepartments = departments.filter(
    (department) => department.status === "Active"
  ).length;

  const openAddModal = () => {
    setEditingDepartment(null);

    setFormData({
      name: "",
      manager: "",
      location: "",
      employees: "",
      status: "Active",
    });

    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (department) => {
    setEditingDepartment(department);

    setFormData({
      name: department.name,
      manager: department.manager,
      location: department.location,
      employees: department.employees,
      status: department.status,
    });

    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
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

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required.";
    }

    if (!formData.manager.trim()) {
      newErrors.manager = "Manager name is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (
      formData.employees === "" ||
      Number(formData.employees) < 0
    ) {
      newErrors.employees = "Enter a valid employee count.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingDepartment) {
      setDepartments((previous) =>
        previous.map((department) =>
          department.id === editingDepartment.id
            ? {
                ...department,
                name: formData.name.trim(),
                manager: formData.manager.trim(),
                location: formData.location.trim(),
                employees: Number(formData.employees),
                status: formData.status,
              }
            : department
        )
      );

      setToast("Department updated successfully.");
    } else {
      const newDepartment = {
        id: Date.now(),
        name: formData.name.trim(),
        manager: formData.manager.trim(),
        location: formData.location.trim(),
        employees: Number(formData.employees),
        status: formData.status,
      };

      setDepartments((previous) => [
        ...previous,
        newDepartment,
      ]);

      setToast("Department added successfully.");
    }

    closeModal();
  };

  const handleDelete = (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${department.name}?`
    );

    if (!confirmed) {
      return;
    }

    setDepartments((previous) =>
      previous.filter((item) => item.id !== department.id)
    );

    setToast("Department deleted successfully.");
  };

  return (
    <div className="departments-page">
      <div className="departments-heading">
        <div>
          <p className="page-eyebrow">Organization</p>

          <h1>Departments</h1>

          <p>
            Manage departments, managers and workforce distribution.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Department
        </button>
      </div>

      <div className="department-summary">
        <div className="department-summary-card">
          <div className="department-summary-icon">
            <Building2 size={20} />
          </div>

          <div>
            <span>Total Departments</span>
            <strong>{departments.length}</strong>
          </div>
        </div>

        <div className="department-summary-card">
          <div className="department-summary-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Total Employees</span>
            <strong>{totalEmployees}</strong>
          </div>
        </div>

        <div className="department-summary-card">
          <div className="department-summary-icon">
            <Building2 size={20} />
          </div>

          <div>
            <span>Active Departments</span>
            <strong>{activeDepartments}</strong>
          </div>
        </div>
      </div>

      <div className="department-toolbar">
        <div className="department-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search department, manager or location..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>
      </div>

      <div className="departments-card">
        <div className="departments-card-header">
          <div>
            <h2>Department List</h2>

            <p>
              {filteredDepartments.length} department
              {filteredDepartments.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {filteredDepartments.length === 0 ? (
          <div className="department-empty-state">
            <Building2 size={42} />

            <h3>No departments found</h3>

            <p>
              Try changing your search or add a new department.
            </p>
          </div>
        ) : (
          <div className="departments-table-wrapper">
            <table className="departments-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Manager</th>
                  <th>Location</th>
                  <th>Employees</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDepartments.map((department) => (
                  <tr key={department.id}>
                    <td>
                      <div className="department-name-cell">
                        <div className="department-avatar">
                          {department.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>{department.name}</strong>
                          <span>
                            Department #{department.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>{department.manager}</td>

                    <td>
                      <div className="department-location">
                        <MapPin size={15} />
                        {department.location}
                      </div>
                    </td>

                    <td>
                      <div className="department-employee-count">
                        <Users size={16} />
                        {department.employees}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          department.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }`}
                      >
                        {department.status}
                      </span>
                    </td>

                    <td>
                      <div className="department-actions">
                        <button
                          type="button"
                          className="icon-action edit-action"
                          title="Edit department"
                          onClick={() =>
                            openEditModal(department)
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="icon-action delete-action"
                          title="Delete department"
                          onClick={() =>
                            handleDelete(department)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="department-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="department-modal-header">
              <div>
                <h2>
                  {editingDepartment
                    ? "Edit Department"
                    : "Add Department"}
                </h2>

                <p>
                  {editingDepartment
                    ? "Update department information."
                    : "Create a new department."}
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
              className="department-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>
                  Department Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Engineering"
                  value={formData.name}
                  onChange={handleChange}
                />

                {errors.name && (
                  <small className="form-error">
                    {errors.name}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>
                  Manager
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="manager"
                  placeholder="e.g. Arjun Mehta"
                  value={formData.manager}
                  onChange={handleChange}
                />

                {errors.manager && (
                  <small className="form-error">
                    {errors.manager}
                  </small>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Location
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Pune"
                    value={formData.location}
                    onChange={handleChange}
                  />

                  {errors.location && (
                    <small className="form-error">
                      {errors.location}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Employees
                    <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="employees"
                    min="0"
                    placeholder="0"
                    value={formData.employees}
                    onChange={handleChange}
                  />

                  {errors.employees && (
                    <small className="form-error">
                      {errors.employees}
                    </small>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="department-form-actions">
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
                  {editingDepartment
                    ? "Update Department"
                    : "Add Department"}
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

export default Departments;