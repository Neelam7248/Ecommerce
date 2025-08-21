import React, { useState } from "react";
import CustomerForm1 from "../components/CustomerFor";
import ProductSelector from "../components/ProductSelector";

function Home() {
  const [customer, setCustomer] = useState(null);
const [showCustomerList, setShowCustomerList] = useState(false);

  const handleCustomerSubmit = async info => {
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info)
    });
    const data = await res.json();

    setCustomer(data); // can include _id or full customer info
  };

  const handleOrderSubmit = async items => {
    console.log('items');
    console.log(items);
    console.log(customer);
  

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: customer._id,
        name: customer.name,
       address: customer.address,
        items
      })
    });
    const result = await res.json();
    if(!res.ok){
      alert(`the order is not placed:${result.error}`)
    }else {}
//alert(`Order placed! Order ID: ${result.order._id}`);
    alert("Order is  placed successfully!");
  };

  return (
<>


    <div style ={{textAlign:"center",padding:"20px"}}>
      {!customer ? (
        <CustomerForm1 onCustomerSubmit={handleCustomerSubmit} />
      ) : (

        <div><h1>Please select the quantity of the listed products to purchase</h1>
        <ProductSelector onSelect={handleOrderSubmit} />
      </div>
      )}
    </div></>
  );
}

export default Home;
