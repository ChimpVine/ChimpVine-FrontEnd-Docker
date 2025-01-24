import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import logo from "../../assests/img/ChimpVine-UI.png";
import NavBar from '../../components/NavBar';
import { UserContext } from '../../context/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
};


const leftSectionStyle = {
    backgroundColor: '#8F47D7',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
};

const logoStyle = {
    width: '200px',
};

const rightSectionStyle = {
    padding: '2.5rem',
    backgroundColor: 'white',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
};

const textStyle = {
    color: '#8F47D7'
};

const errorMessageStyle = {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
    fontSize: '0.9rem',
    maxWidth: '100%',
};

const pointerStyle = {
    cursor: 'pointer'
};

const Login = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { login, verifyToken } = useContext(UserContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const API_BASE_URL = 'https://site.chimpvine.com';

    useEffect(() => {
        const checkToken = async () => {
            const isValid = await verifyToken();
            if (isValid) {
                navigate('/ai-tools-for-teachers');
            } else {
                setLoading(false);
            }
        };
        checkToken();
    }, [navigate, verifyToken]);

    const onSubmit = async (data) => {
        setErrorMessage('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/wp-json/custom/v1/login`, {
                username: data.username,
                password: data.password,
            });
            if (response.data.status === 'success') {
                login(response.data.token);
                // console.log(response.data.token);
                navigate('/ai-tools-for-teachers');
            } else {
                setErrorMessage(response.data.message);
            }
        } catch {
            setErrorMessage('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleReset = () => {
        reset();
        setErrorMessage('');
    };

    return loading ? (
        <div className="text-center" style={containerStyle}>
            <PulseLoader color="#FF6F3C" size={10} />
        </div>
    ) : (
        <>
            <NavBar />
            <div style={containerStyle} className="mt-4">
                <div className="row">
                    <div className="col-md-5" style={leftSectionStyle}>
                        <img src={logo} alt="ChimpVine Logo" style={logoStyle} className="img-fluid" />
                    </div>
                    <div className="col-md-7" style={rightSectionStyle}>
                        <h3 className="text-center mb-5" style={textStyle}>Login</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group mb-4">
                                <label>Email</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.username ? 'is-invalid' : ''}`}
                                    placeholder="Enter your email"
                                    autoComplete="username"
                                    disabled={loading}
                                    {...register('username', { required: 'Email is required' })}
                                />
                                {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                            </div>
                            <div className="form-group mb-4">
                                <label>Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control form-control-sm ${errors.password ? 'is-invalid' : ''}`}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        disabled={loading}
                                        {...register('password', { required: 'Password is required' })}
                                    />
                                    <span
                                        className="input-group-text"
                                        style={{
                                            cursor: 'pointer',
                                            backgroundColor: 'white', 
                                            border: errors.password ? '1px solid red' : '', 
                                        }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEye size={15} /> : <FaEyeSlash size={15} />}
                                    </span>
                                </div>
                                {errors.password && (
                                    <div className="invalid-feedback" style={{ display: 'block' }}>
                                        {errors.password.message}
                                    </div>
                                )}
                            </div>

                            <div className='mb-3'>
                                <NavLink to={`${API_BASE_URL}/login/?action=forgot_password`}>
                                    <label style={pointerStyle}>Forgot Password?</label>
                                </NavLink>
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="button" className='btn btn-outline-danger btn-sm' onClick={handleReset} disabled={loading}>
                                    Reset
                                </button>
                                <button type="submit" className='btn btn-outline-dark btn-sm' disabled={loading}>
                                    Login
                                </button>
                            </div>
                            {errorMessage && <div style={errorMessageStyle}>{errorMessage}</div>}
                        </form>
                        <div className='mt-3'>
                            <span>Dont have an account? </span>
                            <NavLink to={`${API_BASE_URL}/register/subscription-free-for-2-months/`}>
                                <label className='fw-bold' style={pointerStyle}>Sign Up Now</label>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;

