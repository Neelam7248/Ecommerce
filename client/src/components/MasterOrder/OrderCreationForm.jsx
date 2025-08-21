import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UnifiedOrderFormBootstrap() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [orderId, setOrderId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Fetch customers
  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch(console.error);
  }, []);

  // Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  // Step 1: Create MasterOrder
  const handleCreateMasterOrder = async () => {
    if (!selectedCustomer) return alert("Please select a customer");

    const res = await fetch("/api/masterorders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: selectedCustomer._id,
        remarks,
        orderDateTime: new Date(),
      }),
    });
    const data = await res.json();
    setOrderId(data._id);
    alert("Master order created! You can now select products.");
  };//for calculating the amount of the order
const totalAmount = selectedProducts.reduce(
  (sum, p) => sum + p.price * p.quantity,
  0
);

  // Step 2: Add product
  const addProduct = (product) => {
    const exists = selectedProducts.find((p) => p.productId === product._id);
    if (exists) return alert("Product already added");

    setSelectedProducts([
      ...selectedProducts,
      {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        amount: product.price,
      },
    ]);
  };

  const updateQuantity = (productId, quantity) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId
          ? { ...p, quantity, amount: p.price * quantity }
          : p
      )
    );
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId));
  };

  // Submit all order details
  const handleSubmitOrderDetails = async () => {
    if (!orderId) return alert("Master order not created yet");
    if (selectedProducts.length === 0) return alert("Select at least one product");

    const res = await fetch("/api/orderdetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        items: selectedProducts,
        customer: {
          name: selectedCustomer.name,
          email: selectedCustomer.email,
          address: selectedCustomer.address,
        },
      }),
    });

    const data = await res.json();
    alert("Order placed successfully!");
    console.log(data);

    // Reset form
    setOrderId(null);
    setSelectedCustomer(null);
    setSelectedProducts([]);
    setRemarks("");
  };

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Create Order</h2>

          {/* Step 1: Master Order */}
          {!orderId && (
            <form>
              <div className="mb-3">
                <label className="form-label">Select Customer</label>
                <select
                  className="form-select"
                  value={selectedCustomer?._id || ""}
                  onChange={(e) =>
                    setSelectedCustomer(customers.find((c) => c._id === e.target.value))
                  }
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Remarks</label>
                <input
                  type="text"
                  className="form-control"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks"
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateMasterOrder}
              >
                Create Master Order
              </button>
            </form>
          )}

          {/* Step 2: Order Details */}
          {orderId && (
            <>
              {/* Customer Info Card */}
              <div className="card mb-3 bg-light">
                <div className="card-body">
                  <h5 className="card-title">Customer Info</h5>
                  <p><strong>Name:</strong> {selectedCustomer.name}</p>
                  <p><strong>Email:</strong> {selectedCustomer.email}</p>
                  <p><strong>Address:</strong> {selectedCustomer.address}</p>
                </div>
              </div>

              {/* Products List */}
              <h5 className="mb-2">Products</h5>
              <div className="row mb-3">
                {products.map((p) => (
                  <div key={p._id} className="col-md-4 mb-2">
                    <div
                      className="card p-2 h-100"
                      style={{ cursor: "pointer" }}
                      onClick={() => addProduct(p)}
                    >
                      <div className="card-body">
                        <p className="card-text mb-1">{p.name}</p>
                        <p className="card-text mb-0">Rs {p.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Products Cards */}
              {selectedProducts.length > 0 && (
                <>
                  <h5 className="mb-2">Selected Products</h5>
                  <div className="row mb-3">
                    {selectedProducts.map((p) => (
                      <div key={p.productId} className="col-md-4 mb-2">
                        <div className="card p-2 h-100 border">
                          <div className="card-body d-flex flex-column">
                            <h6 className="card-title">{p.productName}</h6>
                            <p className="card-text mb-1">Rs {p.price}</p>
                            <div className="d-flex align-items-center mb-2">
                              <input
                                type="number"
                                min={1}
                                className="form-control me-2"
                                value={p.quantity}
                                onChange={(e) =>
                                  updateQuantity(p.productId, parseInt(e.target.value))
                                }
                              />
                              <span>Rs {p.amount}</span>
                            </div>
                            <button
                              className="btn btn-sm btn-danger mt-auto"
                              onClick={() => removeProduct(p.productId)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {selectedProducts.length > 0 && (
  <div className="mb-3">
    <button
      type="button"
      className="btn btn-info w-100"
      disabled
    >
      Total Amount of your Order is: Rs {totalAmount}
    </button>
  </div>
)}

                  </div>
                </>
              )}

              <button
                className="btn btn-success"
                onClick={handleSubmitOrderDetails}
              >
                Submit All Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
