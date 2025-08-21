import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function OrderCreationPopupForm() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSelected, setModalSelected] = useState([]);

  useEffect(() => {
    fetch("/api/customers")
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(console.error);

    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);

  const totalAmount = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

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
  };

  const openModal = () => {
    setModalSelected(selectedProducts.map(p => p.productId)); // preselect already added
    setModalOpen(true);
  };

  const handleModalConfirm = () => {
    const newSelections = products
      .filter(p => modalSelected.includes(p._id))
      .map(p => ({
        productId: p._id,
        productName: p.name,
        price: p.price,
        quantity: 1,
        amount: p.price
      }));
    setSelectedProducts(newSelections);
    setModalOpen(false);
  };

  const toggleModalSelect = (productId) => {
    if (modalSelected.includes(productId)) {
      setModalSelected(modalSelected.filter(id => id !== productId));
    } else {
      setModalSelected([...modalSelected, productId]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.productId === productId ? { ...p, quantity, amount: p.price * quantity } : p
    ));
  };

  const removeProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
  };

  const handleSubmitOrderDetails = async () => {
    if (!orderId) return alert("Master order not created yet");
    if (selectedProducts.length === 0) return alert("Select at least one product");

    const res = await fetch("/api/orderdetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        items: selectedProducts,
        totalAmount,
        customer: {
          name: selectedCustomer.name,
          email: selectedCustomer.email,
          address: selectedCustomer.address
        }
      }),
    });

    const data = await res.json();
    alert("Order placed successfully!");
    console.log(data);

    setOrderId(null);
    setSelectedCustomer(null);
    setSelectedProducts([]);
    setRemarks("");
  };

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">Create Order</h2>

        {!orderId && (
          <form>
            <div className="mb-3">
              <label className="form-label">Select Customer</label>
              <select
                className="form-select"
                value={selectedCustomer?._id || ""}
                onChange={e => setSelectedCustomer(customers.find(c => c._id === e.target.value))}
              >
                <option value="">-- Select Customer --</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Remarks</label>
              <input
                type="text"
                className="form-control"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Enter remarks"
              />
            </div>

            <button type="button" className="btn btn-primary" onClick={handleCreateMasterOrder}>
              Create Master Order
            </button>
          </form>
        )}

        {orderId && (
          <form className="mt-4">
            <h4>Customer Info</h4>
            <div className="mb-3 p-3 border rounded bg-light">
              <p><strong>Name:</strong> {selectedCustomer.name}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Address:</strong> {selectedCustomer.address}</p>
            </div>

            <button type="button" className="btn btn-secondary mb-3" onClick={openModal}>
              Select Products
            </button>

            {selectedProducts.length > 0 && (
              <>
                <h5 className="mb-2">Selected Products</h5>
                {selectedProducts.map(p => (
                  <div key={p.productId} className="mb-2 p-2 border rounded d-flex align-items-center">
                    <div className="flex-grow-1">{p.productName} - Rs {p.price}</div>
                    <input
                      type="number"
                      min={1}
                      className="form-control me-2"
                      style={{ width: "80px" }}
                      value={p.quantity}
                      onChange={e => updateQuantity(p.productId, parseInt(e.target.value))}
                    />
                    <span className="me-2">Rs {p.amount}</span>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeProduct(p.productId)}>Remove</button>
                  </div>
                ))}

                <div className="mb-3 mt-2">
                  <button type="button" className="btn btn-info w-100" disabled>
                    Total Amount: Rs {totalAmount}
                  </button>
                </div>
              </>
            )}

            <button type="button" className="btn btn-success w-100" onClick={handleSubmitOrderDetails}>
              Submit All Order
            </button>
          </form>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select Products</h5>
                  <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    {products.map(p => (
                      <div key={p._id} className="col-md-4 mb-2">
                        <div className={`border p-2 rounded ${modalSelected.includes(p._id) ? 'bg-primary text-white' : ''}`} style={{ cursor: 'pointer' }}
                          onClick={() => toggleModalSelect(p._id)}>
                          <p className="mb-1">{p.name}</p>
                          <p className="mb-0">Rs {p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleModalConfirm}>Add Selected Products</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
