import React, { useState, useEffect } from "react";

const API_URL = "https://your-api-url.com/customers"; // Replace with your API endpoint

const CustomerForm = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customer');
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new customer
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });
      if (!response.ok) throw new Error("Failed to add customer");
      const newCustomer = await response.json();
      setCustomers((prev) => [...prev, newCustomer]);
      setFormData({ id: null, name: "", email: "" });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const handleEditClick = (customer) => {
    setIsEditing(true);
    setFormData(customer);
  };

  // Update customer
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email }),
      });
      if (!response.ok) throw new Error("Failed to update customer");
      const updatedCustomer = await response.json();
      setCustomers((prev) =>
        prev.map((cust) => (cust.id === updatedCustomer.id ? updatedCustomer : cust))
      );
      setIsEditing(false);
      setFormData({ id: null, name: "", email: "" });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete customer");
      setCustomers((prev) => prev.filter((cust) => cust.id !== id));
      if (isEditing && formData.id === id) {
        setIsEditing(false);
        setFormData({ id: null, name: "", email: "" });
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Customer Form</h2>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <form onSubmit={isEditing ? handleUpdate : handleAdd}>
        <div>
          <label>Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Customer Name"
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>Email:</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Customer Email"
            type="email"
          />
        </div>

        <button style={{ marginTop: 12 }} type="submit" disabled={loading}>
          {isEditing ? "Update" : "Add"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setFormData({ id: null, name: "", email: "" });
              setError(null);
            }}
            style={{ marginLeft: 8 }}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </form>

      <h3 style={{ marginTop: 30 }}>Customer List</h3>

      {loading && <p>Loading...</p>}

      {!loading && customers.length === 0 && <p>No customers found.</p>}

      <ul>
        {customers.map((cust) => (
          <li key={cust.id} style={{ marginBottom: 10 }}>
            <strong>{cust.name}</strong> ({cust.email})
            <button
              onClick={() => handleEditClick(cust)}
              style={{ marginLeft: 10 }}
              disabled={loading}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(cust.id)}
              style={{ marginLeft: 5 }}
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerForm;
