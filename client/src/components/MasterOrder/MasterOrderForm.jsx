import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MasterOrderForm({ onOrderCreated }) {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [orderDateTime, setOrderDateTime] = useState('');

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers');
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) return alert('Please select a customer');

    const res = await fetch('/api/masterorders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, remarks, orderDateTime })
    });
    const data = await res.json();
    onOrderCreated(data._id);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <h3 className="text-center mb-4">Create New Order</h3>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div className="form-group">
            <label>Select Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="form-control"
            >
              <option value="">-- Select Customer --</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <input
              type="text"
              placeholder="Enter remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Order Date & Time</label>
            <input
              type="datetime-local"
              value={orderDateTime}
              onChange={(e) => setOrderDateTime(e.target.value)}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
}
