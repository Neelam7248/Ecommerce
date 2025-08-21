// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import ClientOrderPage from './Pages/ClientOrderPage';
import CustomerForm from './components/CustomerForm';
import Navbar from './components/Navbar';
import PopupCustomerForm from './components/PopupCustomerForm';
import MproductsForm from './components/Products/MproductsForm';
import OrderMaster from './components/Orders/AdminOrder'; 
import ParentOrderForm from './components/MasterOrder/ParentOrderForm';
import OrderCreationForm from './components/MasterOrder/OrderCreationForm';
import ParentOrderPopupForm from './components/MasterOrder/ParentOrderPopupForm';
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ClientOrderPage" element={<ClientOrderPage />} />
        
        <Route path="/CustomerForm" element={<CustomerForm />} />
        <Route path="/PopupCustomerForm" element={<PopupCustomerForm />} />
          <Route path="/MproductsForm" element={<MproductsForm />} />
      
        <Route path="/OrderMaster" element={<OrderMaster />} />
        <Route path="/ParentOrderForm" element={<ParentOrderForm />} />
          <Route path="/ParentOrderPopupForm" element={<ParentOrderPopupForm />} />
           </Routes>
    </Router>
  );
};

export default App;
