import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/customers"; // Replace with your API endpoint

const CustomerForm = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: "", email: "" ,address:""});
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
      const response = await fetch(API_URL);
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
    if (!formData.name || !formData.email||!formData.address) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email,address:formData.address }),
      });
      if (!response.ok) throw new Error("Failed to add customer");
      const newCustomer = await response.json();
      setCustomers((prev) => [...prev, newCustomer]);
      setFormData({ id: null, name: "", email: "",address:"" });
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
   // setFormData({ _id: customer._id, name: customer.name, email: customer.email });//it isused to explicitly caal the id:,name,email fieslds from the data object. 
    setFormData(customer);//This copies the entire customer object into formData

//If customer has fields like createdAt, address, __v, etc., they will also be included

//That may cause issues when submitting the form (e.g., updating with extra fields backend doesn't expect)//
  };

  // Update customer
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email||!formData.address) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, address:formData.address }),
      });
      if (!response.ok) throw new Error("Failed to update customer");
      const updatedCustomer = await response.json();
      setCustomers((prev) =>
        prev.map((cust) => (cust._id === updatedCustomer._id ? updatedCustomer : cust))
      );
      setIsEditing(false);
      setFormData({ _id: null, name: "", email: "",address:"" });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const handleDelete = async (_id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${_id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete customer");
      setCustomers((prev) => prev.filter((cust) => cust._id !== _id));
      if (isEditing && formData._id === _id) {  
        setIsEditing(false);
        setFormData({ _id: null, name: "", email: "" ,address:""});
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <div style={{ maxWidth: 400, margin: "auto"}}>
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
<div style={{ marginTop: 8 }}>
          <label>Address:</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Customer address"
            type="varchar"
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
              setFormData({ id: null, name: "", email: "",address:"" });
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
            <strong>{cust.name}</strong> ({cust.email})<address>{cust.address}</address>
            <button
              onClick={() => handleEditClick(cust)}
              style={{ marginLeft: 10 }}
              disabled={loading}
            >
              Edit
            </button>
            <button
              onClick={() => 
               {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      handleDelete(cust._id);
    }
  }}
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
