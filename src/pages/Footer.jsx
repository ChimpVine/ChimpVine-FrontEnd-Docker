import React from 'react'
import logo from "../assests/img/ChimpVine_Logo.png";
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaInstagramSquare } from "react-icons/fa";
import background from "../assests/img/footer_img.png";

export default function Footer() {

    const footerStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center', 
    };
    return (
        <>
            <footer className="footer mt-5 bg-body-tertiary text-white"
                style={footerStyle}>
                <div className="container">
                    <div className="row pt-5">
                        <div className="col-md-3">
                            <NavLink className="navbar-brand" to="/">
                                <img src={logo} alt="ChimpVineLogo" width="185" height="56" className='mb-3' />
                            </NavLink>
                            <h6>Gamified learning platform to engage young minds.</h6>
                            <div className="d-flex mt-3 social-media">
                                <NavLink
                                    className="social-content"
                                    to="https://www.facebook.com/ChimpVineGlobal"
                                    target='_blank'>
                                    <FaFacebook className="me-3" size={25} />
                                </NavLink>
                                <NavLink
                                    className="social-content"
                                    to="https://www.linkedin.com/company/chimpvineglobal"
                                    target='_blank'>
                                    <FaLinkedin className="me-3" size={25} />
                                </NavLink>
                                <NavLink
                                    className="social-content"
                                    to="https://www.instagram.com/chimpvine.global/"
                                    target='_blank'>
                                    <FaInstagramSquare className="me-3" size={25} />
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-md-3 pt-3">
                            <h5>Our Products</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <NavLink className="content" to="https://site.chimpvine.com/"
                                        target='_blank'>
                                        Educational Games
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="content" to="/math-homework-help"
                                        target='_blank'>
                                        Math Homework Help
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-3 pt-3">
                            <h5>Content</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <NavLink
                                        className="content"
                                        to="https://site.chimpvine.com/category/games/"
                                        target='_blank'>
                                        Games
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="content"
                                        to="https://site.chimpvine.com/category/interactive-content/"
                                        target='_blank'>
                                        Interactive Content
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="content"
                                        to="https://site.chimpvine.com/subject/mathematics/"
                                        target='_blank'>
                                        Mathematics
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="content"
                                        to="https://site.chimpvine.com/subject/english/"
                                        target='_blank'>
                                        English
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="content"
                                        to="https://site.chimpvine.com/article/"
                                        target='_blank'>
                                        Articles
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-3 pt-3">
                            <h5>Others</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <NavLink
                                        className="content"
                                        to="/about-us"
                                        target='_blank'>
                                        About Us
                                    </NavLink>

                                </li>
                                <li>
                                    <NavLink
                                        className="content"
                                        to="https://site.chimpvine.com/policy/"
                                        target='_blank'>
                                        Privacy Policy
                                    </NavLink>

                                </li>
                                <li>
                                    <NavLink
                                        className="content"
                                        to="https://site.chimpvine.com/faqs/"
                                        target='_blank'>
                                        FAQ's
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="content"
                                        to="https://site.chimpvine.com/contact-us/"
                                        target='_blank'  
                                    >
                                        Contact Us
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-12 text-center">
                            <p className='fw-bold copyright'> Copyright &copy; 2025 | Product of  
                                <NavLink
                                    to="https://dansonsolutions.com/"
                                    target='_blank'
                                    className='ms-2 danson_trademark'
                                >
                                     Danson Solutions
                                </NavLink>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>

    )
}
