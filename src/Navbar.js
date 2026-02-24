import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';
import "./navbar.css";
import App from "./App";  // This is your expenses list
import Logout from "./logout";
import 'font-awesome/css/font-awesome.min.css';
import Expenses from "./addexpenses";  // This is for adding expenses
import main from './main.png';
import { SketchPicker } from 'react-color'

const Mainpage = () => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState('#193b62'); // Default color
  const [selectedComponent, setSelectedComponent] = useState(<App />); // Start with the Expenses Sheet
  const navigate = useNavigate(); 

  const items = [
    { id: 1, label: (
      <>
        <i className="fa fa-list-alt" aria-hidden="true" title="Expenses Sheet"></i>
        <span className="d-none d-lg-inline"> Expenses Sheet</span>
      </>
    ), component: <App /> },
    { id: 2, label: (
      <>
        <i className="fa fa-cart-plus" aria-hidden="true" title="Add expenses"></i>
        <span className="d-none d-lg-inline"> Add Expenses</span>
      </>
    ), component: <Expenses /> },
    { id: 3, label: (
      <>
        <i className="fa fa-sign-out" aria-hidden="true" title="Logout"></i>
        <span className="d-none d-lg-inline"> Logout</span>
      </>
    ), component: <Logout /> },
  ];

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const handleItemClick = (item) => {
    if (item.id === 3) {
      localStorage.clear();
      sessionStorage.removeItem('isLoggedIn');
      navigate('/'); 
    } else {
      setSelectedComponent(item.component); 
    }
  };

 useEffect(() => {
  const savedColor = localStorage.getItem('navbarColor');
  if (savedColor) {
    setColor(savedColor);
    document.documentElement.style.setProperty('--custom-background-color', savedColor);
  }
}, []);

const toggleColorPicker = () => {
  setShowColorPicker(!showColorPicker);
};

const handleColorChange = (color) => {
  setColor(color.hex);
  localStorage.setItem('navbarColor', color.hex);
  document.documentElement.style.setProperty('--custom-background-color', color.hex);
};


const handleClickOutside = (event) => {
  if (showColorPicker && !event.target.closest('.color-picker-container') && !event.target.closest('.fa-paint-brush')) {
    setShowColorPicker(false);
  }
};

React.useEffect(() => {
  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [showColorPicker]);


  return ( 
    <>
    <Navbar expand="lg" className="custom-navbar container-fluid">
      <Container className="navbar-container d-flex justify-content-between align-items-center">
        <Navbar.Brand className="d-flex align-items-center">
          <img src={main} width="50" height="50" alt="logo" className="me-2" />
          <span style={{ color: '#D9B466', fontSize: '20px'}}>expenses</span>
        </Navbar.Brand>
        <div className="d-flex align-items-center">
          <NavDropdown
            title={<FontAwesomeIcon  icon={faBars} aria-hidden="true" style={{ color: 'white', fontSize: '18px' }}/>}
            className="me-3"
            menuAlign="right"
          >
             {items.map((item) => (
                <NavDropdown.Item
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                >
                  {item.label}
                </NavDropdown.Item>
              ))}
          </NavDropdown>
          <Nav.Item onClick={toggleColorPicker}>
            <i
              className="fa fa-paint-brush"
              aria-hidden="true"
              style={{ cursor: 'pointer', color: 'white', fontSize: '18px' }}
            ></i>
          </Nav.Item>
        </div>
      </Container>
    </Navbar>

    {showColorPicker && (
      <div className="color-picker-container">
        <SketchPicker color={color} onChangeComplete={handleColorChange} />
      </div>
    )}

    {selectedComponent}
  </>
  );
};

export default Mainpage;
