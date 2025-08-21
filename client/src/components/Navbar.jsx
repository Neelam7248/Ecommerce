// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">MyApp</div>
      <ul className="nav-links li" >
        <li ><Link to="/">Home</Link></li>
        <li><Link to="/ClientOrderPage">ClientOrderPage</Link></li>
        <li><Link to="/CustomerForm">InlineCustomerForm</Link></li>
        <li><Link to="/PopupCustomerForm">PopupCustomerForm</Link></li>
        <li><Link to="/MproductsForm">ProductsForm</Link></li>
        <li><Link to="/OrderMaster">OrdersForm</Link></li>
        <li><Link to="/MproductsForm">ProductsForm</Link></li>
       <li><Link to="/ParentOrderForm">ParentOrderForm</Link></li>
        <li><Link to="/ParentOrderPopupForm">ParentOrderPopupForm</Link></li>
      
      </ul>
    </nav>
  );
};

export default Navbar;
