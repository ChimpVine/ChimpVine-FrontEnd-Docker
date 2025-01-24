import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../../spinner/Spinner';
import { FaArrowRight, FaEraser, FaArrowLeft, FaCloudDownloadAlt, FaFilePdf } from "react-icons/fa";
import NavBar from '../NavBar';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function JokesGenerator({ BASE_URL }) {
    const navigate = useNavigate();
    const btnStyle = { backgroundColor: '#FF683B', color: 'white' };
    const cancelStyle = { backgroundColor: '#dc3545', color: 'white' };
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Gamification', active: true },
        { label: 'Teacher Joke', active: true }
    ];

    const onSubmit = async (data) => {

        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        const payload = {
            topic: data.topic,
            number_of_jokes: parseInt(data.number_of_jokes),
        };

        setIsLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/teacher_joke`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`,
                    'X-Site-Url': siteUrl
                },
            });
            setApiResponse(response.data);
            reset();
            toast.success('Jokes generated successfully!');
        } catch (error) {
            if (error.response) {
                const backendErrorMessage = error.response.data.error || 'Failed to generate jokes.';
                toast.error(backendErrorMessage);
                if (error.response.status === 401) {
                    toast.warning('This email has been already used on another device.');
                    Cookies.remove('authToken');
                    Cookies.remove('site_url');
                    Cookies.remove('Display_name');
                    Cookies.remove('user_email');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('authUser');
                    setTimeout(() => {
                        navigate('/login');
                        window.location.reload();
                    }, 2000);
                }
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAnswers = () => setShowAnswers(!showAnswers);

    const generatePdf = (showAnswers) => {
        const answerDivs = document.querySelectorAll('.answer');
        answerDivs.forEach(div => {
            div.style.display = showAnswers ? 'block' : 'none';
        });
        window.print();
        answerDivs.forEach(div => {
            div.style.display = '';
        });
    };

    const nameStyle = {
        display: "inline-block",
        width: "200px",
        height: "1px",
        backgroundColor: "black",
        borderBottom: "1px solid black",
    };

    const dateStyle = {
        display: "inline-block",
        width: "100px",
        height: "1px",
        backgroundColor: "black",
        borderBottom: "1px solid black",
    };

    return (
        <>
            <NavBar />
            <div className="container-fluid">
                <div className="row justify-content-center mt-5">
                    {isLoading ? (
                        <div className="col-md-5 text-center">
                            <Spinner />
                        </div>
                    ) : (
                        !apiResponse ? (
                            <>
                                <NavBreadcrumb items={breadcrumbItems} />
                                <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <h4 className="text-center mb-3">Teacher Joke Generator</h4>
                                        <div className="mb-2">
                                            <label htmlFor="topic" className="form-label">
                                                Topic <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.topic ? 'is-invalid' : ''}`}
                                                id="topic"
                                                {...register('topic', { required: 'Topic is required.' })}
                                                placeholder="Enter topic (e.g., Space, Animals)"
                                            />
                                            {errors.topic && <div className="invalid-feedback">{errors.topic.message}</div>}

                                            <label htmlFor="number_of_jokes" className="form-label">
                                                Number of Jokes <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.number_of_jokes ? 'is-invalid' : ''}`}
                                                id="number_of_jokes"
                                                {...register('number_of_jokes', {
                                                    required: 'Please select the number of jokes.',
                                                })}
                                            >
                                                <option value="">Choose Number of Jokes</option>
                                                {[...Array(6)].map((_, i) => (
                                                    <option key={i + 5} value={i + 5}>
                                                        {i + 5}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.number_of_jokes && <div className="invalid-feedback">{errors.number_of_jokes.message}</div>}
                                        </div>

                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-sm"
                                                style={cancelStyle}
                                                onClick={() => reset()}
                                            >
                                                <FaEraser /> Reset
                                            </button>
                                            <button type="submit" className="btn btn-sm" style={btnStyle}>
                                                Generate <FaArrowRight />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="mt-3">
                                <div className='mb-5'>
                                    <div id="headerContent">
                                        <div className="d-flex justify-content-center mt-3">
                                            <h2 className='mb-5'>Your High School Name</h2>
                                        </div>
                                        <div className="d-flex justify-content-between mt-5 mb-5">
                                            <h5>Name : <span style={nameStyle}></span></h5>
                                            <h5 className='me-3'>Date :  <span style={dateStyle}></span></h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {apiResponse.teacher_jokes.jokes.map((joke, index) => (
                                        <div key={index} className="col-md-6 mb-4">
                                            <div className="card border-primary w-auto">
                                                <div className="card-body">
                                                    <p className="card-text">
                                                        <strong>Question:</strong> {joke.setup}
                                                    </p>
                                                    <p className="card-text">
                                                        <strong>Answer:</strong> {showAnswers ? "__________" : joke.punchline}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button
                                        className="btn btn-sm mt-2 mb-3 me-2 no-print"
                                        style={btnStyle}
                                        onClick={() => setApiResponse(null)}
                                    >
                                        <FaArrowLeft /> Generate More Jokes
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger mt-2 mb-3 me-2 no-print"
                                        onClick={generatePdf}
                                    >
                                        <FaCloudDownloadAlt /> Download PDF
                                    </button>
                                    <button
                                        className="btn btn-sm btn-warning mt-2 mb-3 no-print"
                                        onClick={toggleAnswers}
                                    >
                                        <FaFilePdf /> {showAnswers ? 'Hide Answers' : 'Show Answers'}
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}
