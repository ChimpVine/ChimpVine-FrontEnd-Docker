import React from 'react'
import ReactDOM from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import RoutingConfig from "./routing/RoutingConfig"
import { BrowserRouter as Router } from 'react-router-dom';
import "./assests/css/style.css";
import UserProvider from './context/UserContext';
import SmartlookClient from 'smartlook-client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

SmartlookClient.init('8c4b260da4d6c06d02e08e7e3ed233dc4b46d89b');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
    <UserProvider>
      <ToastContainer position="top-right" autoClose={500} pauseOnHover={false}/>
      <RoutingConfig />
    </UserProvider>
    </Router>
  </React.StrictMode>,
)

