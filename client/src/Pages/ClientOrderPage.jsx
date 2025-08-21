import React, { useState } from "react";
import CustomerSelector from "../components/CustomerSelector";
import ProductSelector from "../components/ProductSelector";

function ClientOrderPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const handleOrderSubmit = async (items) => {
    if (!selectedCustomer) {
      alert("Please select a customer first!");
      return;
    }
 if (!items || !Array.isArray(items) || items.length === 0) {
      alert("Please select at least one product first!");
      return;
    }
    

  // Optional: also check if all items have quantity > 0
  const invalidItems = items.filter(
    (item) => !item.productId || !item.quantity || item.quantity <= 0
  );

  if (invalidItems.length > 0) {
    alert("Please make sure all selected products have a valid quantity!");
    return;
  }
   try{  const res = await fetch("http://localhost:5000/api/clientorders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: selectedCustomer.customerId,
        name: selectedCustomer.name,
        email:selectedCustomer.email,
        address: selectedCustomer.address,
        items,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      alert(`The order is not placed: ${result.error}`);
      return;
    }
    alert("Order placed successfully!");
    setSelectedCustomer(null);
  }
catch (err) {
    console.error(err);
    alert("Something went wrong while placing the order!");
  }}
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {!selectedCustomer ? (
        <CustomerSelector onCustomerSelect={setSelectedCustomer} />
       
      ) : (
        <>
          <h1>
            Order for {selectedCustomer.email}
          </h1>
          <ProductSelector onSelect={handleOrderSubmit} />
        </>
      )}
    </div>
  );
}

export default ClientOrderPage;
