import React, { useState, useEffect } from "react";
import "./PopupCustomerForm.css";

const API_URL = "http://localhost:5000/api/customers";

const PopupCustomerForm = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ _id: null, name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
   fetchCustomers();
  },[]);

  const fetchCustomers=async(e)=>{
try{
  const response=await fetch(API_URL);
  const data=await response.json();
  setCustomers(data);
  setError(null);
  setShowModal(false);

}catch(err){
  setError("Failed to fetch customers")
}

  }

const handleChange=(e)=>{
    const{name,value}=e.target;
    setFormData((prev)=>({...prev,[name]:value}));
  }
  

  const handleAddOrUpdate=async(e)=>{
    e.preventDefault();
    if(!formData.name.trim()||!formData.email.trim()){
      alert("Please fill the form Correctly");
      return;
    }
    const existingCustomer=customers.find((cust)=>
      cust.email===formData.email&& cust._id!==formData._id);
    
  if(!isEditing && existingCustomer){
      alert("customer with this email already exists");
       setFormData({id:null,name:"",email:""});  
 return;
   
    }
    
    
    try{
      const method=isEditing?"PUT":"POST";
      const url=isEditing?`${API_URL}/${formData._id}`:API_URL;
      const response=await fetch(url,{
        method,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:formData.name,email:formData.email})
      })
      const data=await response.json();
      if(isEditing){
        setCustomers((prev)=>
        prev.map((cust)=>(cust._id===data._id?data:cust)))
      }else{
        setCustomers((prev=>([...prev,data])))
      }
      setError(null);
      setShowModal(false);
      setFormData({_id:null,name:"",email:""});
    setIsEditing(false);
    }
  
  catch(err){
    setError("failed to save customers");
  }
  }
  const handleEdit = (customer) => {
    setFormData(customer);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setCustomers((prev) => prev.filter((cust) => cust._id !== id));
    } catch {
      setError("Failed to delete customer");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData({ _id: null, name: "", email: "" });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="customer-container">
      <h2>Customers</h2>

      <button className="add-button" onClick={() => setShowModal(true)}>
        Add Customer
      </button>

      {error && <p className="error">{error}</p>}

      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust._id}>
              <td>{cust.name}</td>
              <td>{cust.email}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(cust)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(cust._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
       <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 30,
              borderRadius: 8,
              width: 300,
              boxShadow: "0 5px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3>{isEditing ? "Edit Customer" : "Add Customer"}</h3>
            <form onSubmit={handleAddOrUpdate}>
             
  <div className="form-group">
    <label>Name</label>
    <input
      name="name"
      placeholder="Enter Name"
      value={formData.name}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label>Email</label>
    <input
      name="email"
      placeholder="Enter Email"
      type="email"
      value={formData.email}
      onChange={handleChange}
    />
  </div>

  {error && <p className="error">{error}</p>}

  <div className="btn-group">
    <button type="submit" >{isEditing ? "Update" : "Add"}</button>
    <button type="button"  onClick={handleClose}>Cancel</button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default PopupCustomerForm;
