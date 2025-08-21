import React, { useState, useEffect } from "react";

const ORDER_API_URL = "http://localhost:5000/api/orders";
const CUSTOMER_API_URL = "http://localhost:5000/api/customers";

export default function OrdersMaster() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    orderId: "",
    userId: "", // this will store _id of customer
    email: "",
    orderDate: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch orders & customers
  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(ORDER_API_URL);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(CUSTOMER_API_URL);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.orderId || !form.userId || !form.orderDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${ORDER_API_URL}/${editId}` : ORDER_API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        if (isEditing) {
          setOrders(orders.map((o) => (o._id === editId ? data : o)));
        } else {
          setOrders([...orders, data]);
        }
        setForm({ orderId: "", userId: "", email: "", orderDate: "" });
        setIsEditing(false);
        setEditId(null);
      } else {
        alert(data.error || "Failed to save order");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (order) => {
    setForm({
      orderId: order.orderId || "",
      userId: order.userId || "",
      email: order.email || "",
      orderDate: order.orderDate ? order.orderDate.split("T")[0] : ""
    });
    setIsEditing(true);
    setEditId(order._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const res = await fetch(`${ORDER_API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders(orders.filter((o) => o._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order Master</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="orderId"
          placeholder="Order ID"
          value={form.orderId}
          onChange={handleChange}
          required
        />

        {/* Dropdown for selecting customer */}
        <select
          name="userId"
          value={form.userId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Customer --</option>
          {customers.map((cust) => (
            <option key={cust._id} value={cust._id}>
              {cust.name} ({cust.email})
            </option>
          ))}
        </select>

        <input
          name="email"
          placeholder="email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="date"
          name="orderDate"
          value={form.orderDate}
          onChange={handleChange}
          required
        />

        <button type="submit">{isEditing ? "Update" : "Add"} Order</button>
      </form>

      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const customer = customers.find((c) => c._id === o.userId);
            return (
              <tr key={o._id}>
                <td>{o.orderId}</td>
                <td>{customer ? `${customer.name} (${customer.email})` : "Unknown"}</td>
                <td>{o.email}</td>
                <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : ""}</td>
                <td>
                  <button onClick={() => handleEdit(o)}>Edit</button>
                  <button onClick={() => handleDelete(o._id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
