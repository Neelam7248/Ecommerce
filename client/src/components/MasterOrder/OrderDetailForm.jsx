import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
export default function OrderDetailForm({ orderId }) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
const navigate = useNavigate();
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = () => {
    if (!productId || quantity <= 0) {
      return alert('Please select product and enter valid quantity');
    }
    const selectedProduct = products.find(p => p._id === productId);
    if (!selectedProduct) return;

    const finalPrice = price > 0 ? price : selectedProduct.price; // allow override
    const amount = quantity * finalPrice;

    setItems([
      ...items,
      { productId: selectedProduct._id, productName: selectedProduct.name, quantity, price: finalPrice, amount }
    ]);

    setProductId('');
    setQuantity(0);
    setPrice('');
  };

  const submitDetails = async () => {
    if (items.length === 0) return alert('Add at least one product');

    try {
      const res = await fetch('/api/orderdetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, items })
      });
      const data = await res.json();

      if (res.ok) {
        alert('Order details saved successfully!');
        setItems([]);
        navigate('/MasterOrderForm'); // Redirect to orders page
      } else {
        alert(data.error || 'Error saving order details');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm flex flex-col gap-4 max-w-lg mx-auto mt-10">
      <h2 className="text-lg font-semibold">Add Products for OrderID: {orderId}</h2>

      <div className="flex flex-wrap gap-2">
        {/* Product Dropdown */}
        <select
          value={productId}
          onChange={e => setProductId(e.target.value)}
          className="p-2 border rounded flex-1 min-w-[120px]"
        >
          <option value="" style={{textAlign:"center"}}>Select Product</option>
          {products.map(p => (
            <option key={p._id} value={p._id} style={{testAlign:"center"}}>
              {p.name} (Rs.{p.price})
            </option>
          ))}
        </select>

        {/* Quantity */}
        <input style={{textAlign:"center"}}
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(+e.target.value)}
          className="p-2 border rounded w-[80px]"
        />

        {/* Price (auto-fills but can override) */}
        <input style={{textAlign:"center" }}
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(+e.target.value)}
          className="p-2 border rounded w-[100px]"
        />

        <button style={{textAlign:"center"}}
          type="button"
          onClick={addProduct}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
        >
          Add Product
        </button>
      </div>

      {/* Items List */}
      <ul className="mt-2 flex flex-col gap-1">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between bg-gray-100 p-2 rounded">
            <span>{item.productName}</span>
            <span>Qty: {item.quantity}</span>
            <span>Price: {item.price}</span>
            <span>Amount: {item.amount}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-2">
        <span className="font-semibold">
          Total: {items.reduce((acc, item) => acc + item.amount, 0)}
        </span>
        <button
          type="button"
          onClick={submitDetails}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Submit All Details
        </button>
      </div>
    </div>
  );
}
