import React, { useState } from "react";

const CustomerForm = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new customer
const handleAdd = (e) => {
  e.preventDefault();

  fetch("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: formData.name, email: formData.email }),
  })
    .then((res) => res.json())
    .then((newCustomer) => {
      setCustomers((prev) => [...prev, newCustomer]); // add new customer to list
      setFormData({ name: "", email: "" }); // reset form
    })
    .catch((neelam) => console.error("Error adding customer:",neelam));
};// Start editing a customer
  const handleEditClick = (customer) => {
    setIsEditing(true);
    setFormData(customer);
  };

  // Save edited customer
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill all fields");
      return;
    }
    setCustomers((prev) =>
      prev.map((cust) => (cust.id === formData.id ? formData : cust))
    );
    setIsEditing(false);
    setFormData({ id: null, name: "", email: "" });
  };

  // Delete a customer
  const handleDelete = (id) => {
    setCustomers((prev) => prev.filter((cust) => cust.id !== id));
    // If deleting the currently edited customer, reset form
    if (isEditing && formData.id === id) {
      setIsEditing(false);
      setFormData({ id: null, name: "", email: "" });
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Customer Form</h2>
      <form onSubmit={isEditing ? handleUpdate : handleAdd}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Customer Name"
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Customer Email"
          />
        </div>
        <button style={{ marginTop: 12 }} type="submit">
          {isEditing ? "Update" : "Add"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setFormData({ id: null, name: "", email: "" });
            }}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3 style={{ marginTop: 30 }}>Customer List</h3>
      {customers.length === 0 ? (
        <p>No customers added yet.</p>
      ) : (
        <ul>
          {customers.map((cust) => (
            <li key={cust.id} style={{ marginBottom: 10 }}>
              <strong>{cust.name}</strong> ({cust.email})
              <button
                onClick={() => handleEditClick(cust)}
                style={{ marginLeft: 10 }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cust.id)}
                style={{ marginLeft: 5 }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerForm;
