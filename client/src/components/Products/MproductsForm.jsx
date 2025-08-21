import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api/products";

export default function ProductMaster() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: "", name: "", price: "", description: "", stock: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch products
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {setProducts(data);
      console.log("products fetched successfully");

      })
      .catch(err => console.error(err));
  }, []);

  // Handle form changes
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Add / Update product
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_URL}/${editId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        if (isEditing) {
          setProducts(products.map(p => (p._id === editId ? data : p)));
        } else {
          setProducts([...products, data]);
        }
        setForm({ productId: "",name: "", price: "", description: "", stock: "" });
        setIsEditing(false);
        setEditId(null);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit product
  const handleEdit = product => {
    setForm(product);
    setIsEditing(true);
    setEditId(product._id);
  };

  // Delete product
  const handleDelete = async id => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Master For admin</h2>
      <form onSubmit={handleSubmit}>     
        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <button type="submit">{isEditing ? "Update" : "Add"} Product</button>
      </form>

      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.productId}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.description}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
