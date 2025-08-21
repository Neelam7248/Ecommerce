import React, { useState, useEffect } from "react";

const CustomerSelector = ({ onCustomerSelect }) => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Select Customer</h2>
      <input
        type="text"
        placeholder="Search customer by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "5px", marginBottom: "10px", width: "60%" }}
      />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <li
              key={customer._id}
              style={{
                cursor: "pointer",
                border: "1px solid #ccc",
                padding: "8px",
                margin: "5px",
              }}
              onClick={() => onCustomerSelect({
    customerId: customer.customerId,  // ✅ use auto-increment customerId
    name: customer.name,
    email: customer.email,
    address: customer.address,
  })}
            >
              {customer.name} - {customer.email}
            </li>
          ))
        ) : (
          <li>No customers found.</li>
        )}
      </ul>
    </div>
  );
};

export default CustomerSelector;
