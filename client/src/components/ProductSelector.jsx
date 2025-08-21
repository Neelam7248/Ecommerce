import React, { useState, useEffect } from "react";

const ProductSelector = ({ onSelect }) => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    fetch("/api/products") // proxy must be set to backend
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const handleQuantity = (id, qty,) => {
    setSelected({ ...selected, [id]: Number(qty) });
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const items = Object.entries(selected)
    .filter(([_, qty]) => qty > 0)
    .map(([productId, quantity]) => {
      const product = products.find(p => p._id === productId);
      return {
        productId,
        name: product.name,
        price: product.price,
        quantity:Number(quantity)
        
      };
    });

  onSelect(items); // 🔥 Pass complete items to App.js
};

  return (
    <form onSubmit={handleSubmit}>
      {products.map(p => (
        <div key={p._id}>
          <span>{p.name} (${p.price})</span>
          <input
            type="number"
            min="0"
            placeholder="Qty"
            onChange={e => handleQuantity(p._id, e.target.value)}
          />
        </div>
      ))}
      <button type="submit">Submit Order</button>
    </form>
  );
};

export default ProductSelector;
