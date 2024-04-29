import React, { useState,useEffect } from 'react';
import './Navbar.css'; // Import CSS file for styling
import {Link} from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
function Navbar({isLoggedIn,handleout}) {
  let loginStatus = JSON.parse(localStorage.getItem('loginStatus'));
  return (
    <nav className="navbar">
      <div className="navbar-container">i,
        <h1 className="navbar-logo"><CurrencyExchangeIcon/>Personal Budget</h1>
        <ul className="nav-menu">
          {(!loginStatus && !isLoggedIn  ) && (
            <>
              <li className="nav-item">
                <Link to="/signup" className="nav-links"><PersonAddIcon/>Register</Link>
              </li>
              <li className="nav-item">
              <Link to="/login" className="nav-links"><LoginIcon/>Login</Link>
              </li>
            </>
          )}
          {(isLoggedIn || loginStatus ) && (
            <>
              <li className="nav-item">
              <Link to="/DashBoard" className="nav-links"><DashboardIcon/>DashBoard</Link>
              </li>
              <li className="nav-item">
                <Link to="/AddBudget" className='nav-links'><BusinessCenterIcon/>Add Budget</Link>
              </li>
              <li className="nav-item">
              <Link to="/AddExpense" className='nav-links'><LocalAtmIcon/>Add Expense</Link>
              </li>
              <li className="nav-item">
              <Link to="/login" className="nav-links" onClick={handleout}><ExitToAppIcon/>Logout</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
