import React, { useContext, useState } from 'react';
import logo from "../assests/img/ChimpVine_Logo.png";
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import { toast } from 'react-toastify';

export default function NavBar() {
    const { user, logout } = useContext(UserContext);
    const userName = user?.display_name;
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await logout();
        setLoading(false);
    };

    const btnStyle = {
        backgroundColor: '#FF683B',
        color: 'white',
    };

    const handleAIToolsClick = () => {
        if (!user) {
            toast.warning("Login to access AI Tools");
        }
    };

    const API_BASE_URL = 'https://site.chimpvine.com';

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary no-print">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">
                        <img
                            src={logo}
                            alt="ChimpVine Logo"
                            width="185"
                            height="56"
                            className="img-fluid"
                        />
                    </NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item mt-2 p-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        isActive ? "nav-link-home me-5 active-link" : "nav-link-home me-5"
                                    }
                                    to="/"
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item mt-1 me-5 p-2">
                                {user ? (
                                    <NavLink
                                        className="btn btn-sm"
                                        style={btnStyle}
                                        to="/ai-tools-for-teachers"
                                    >
                                        AI Tools
                                    </NavLink>
                                ) : (
                                    <button
                                        className="btn btn-sm"
                                        style={btnStyle}
                                        onClick={handleAIToolsClick}
                                    >
                                        AI Tools
                                    </button>
                                )}
                            </li>
                            <li className="nav-item mt-2 p-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        isActive ? "nav-link-elearning me-5 text-light active-link" : "nav-link-elearning me-5 text-light"
                                    }
                                    to={`${API_BASE_URL}`}>
                                    eLearning for kids
                                </NavLink>
                            </li>
                            <li className="nav-item dropdown mt-2">
                                <NavLink
                                    className="nav-link dropdown-toggle text-light me-5 ms-2"
                                    id="navbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Resources
                                </NavLink>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li>
                                        <NavLink
                                            className="nav-link-splitter p-2"
                                            to="/pdf-splitter"
                                        >
                                            PDF Splitter
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            {/* <li className="nav-item mt-2 p-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        isActive ? "nav-link-navigate me-5 text-light active-link" : "nav-link-navigate me-5 text-light"
                                    }
                                    to="/contact-us"
                                >
                                    Contact Us
                                </NavLink>
                            </li> */}
                            <li className="nav-item mt-2 p-2">
                                <NavLink
                                    className={({ isActive }) =>
                                        isActive ? "nav-link-navigate me-5 text-light active-link" : "nav-link-navigate me-5 text-light"
                                    }
                                    to="/feedback"
                                >
                                   Feedback
                                </NavLink>
                            </li>
                            {user ? (
                                <li className="nav-item text-white mt-1 p-2">
                                    Welcome, {userName}
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-outline-light btn-sm ms-2"
                                        disabled={loading}
                                    >
                                        {loading ? "Logging out..." : "Logout"}
                                    </button>
                                </li>
                            ) : (
                                <>
                                    <NavLink to="/login">
                                        <button className="btn btn-outline-light btn-sm mt-2 ms-2 me-2">
                                            Login
                                        </button>
                                    </NavLink>
                                    <NavLink to={`${API_BASE_URL}/register/subscription-free-for-2-months/`}>
                                        <button
                                            className="btn btn-sm mt-2 ms-2"
                                            style={btnStyle}
                                        >
                                            Register
                                        </button>
                                    </NavLink>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>

    );
}
