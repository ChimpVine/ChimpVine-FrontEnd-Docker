import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../../spinner/Spinner';
import { FaArrowRight, FaEraser, FaArrowLeft, FaCloudDownloadAlt } from "react-icons/fa";
import NavBar from '../NavBar';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function BingoGenerator({ BASE_URL }) {
    const navigate = useNavigate();
    const btnStyle = { backgroundColor: '#FF683B', color: 'white' };
    const cancelStyle = { backgroundColor: '#dc3545', color: 'white' };

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Gamification', active: true },
        { label: 'Bingo Generator', active: true }
    ];

    const borderStyles = {
        flex: 1,
        minHeight: '80px',
        minWidth: '80px'
    };

    const onSubmit = async (data) => {
        
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');


        const payload = {
            topic: data.topic.trim(),
            num_students: parseInt(data.num_students),
        };

        setIsLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/generate_bingo`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`,
                    'X-Site-Url': siteUrl
                },
            });
            setApiResponse(response.data);
            reset();
            toast.success('Bingo cards generated successfully!');
        } catch (error) {
            if (error.response) {
                const backendErrorMessage = error.response.data.error || 'Failed to generate Bingo.';
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

    const nameStyle = {
        display: "inline-block",
        width: "200px",
        height: "1px",
        backgroundColor: "black",
        borderBottom: "1px solid black",
    };

    const generatePdf = () => {
        window.print();
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
                                        <h4 className="text-center mb-3">Bingo Generator</h4>
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

                                            <label htmlFor="num_students" className="form-label">
                                                Number of Students <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.num_students ? 'is-invalid' : ''}`}
                                                id="num_students"
                                                {...register('num_students', {
                                                    required: 'Please select the number of students.',
                                                })}
                                            >
                                                <option value="">Choose Number of Students</option>
                                                {[...Array(6)].map((_, i) => (
                                                    <option key={i + 5} value={i + 5}>
                                                        {i + 5}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.num_students && <div className="invalid-feedback">{errors.num_students.message}</div>}
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
                                <div className="container-fluid text-center">
                                    <div className="row gap-4 justify-content-center">
                                        {Object.entries(apiResponse.bingo_cards)
                                            .map(([key, bingoCard], index) => (
                                                Array.isArray(bingoCard) && (
                                                    <div
                                                        id="bingo-container"
                                                        key={index}
                                                        className="col-md-5 col-12 d-flex flex-column border p-4 mb-5"
                                                    >
                                                        <h5 className="mb-4 text-center">
                                                            Name: <span style={nameStyle}></span>
                                                        </h5>
                                                        <div className="d-flex flex-column">
                                                            {bingoCard.map((row, rowIndex) => (
                                                                <div key={rowIndex} className="d-flex">
                                                                    {row.map((word, wordIndex) => (
                                                                        <div
                                                                            key={wordIndex}
                                                                            className="border d-flex justify-content-center align-items-center p-2"
                                                                            style={borderStyles}
                                                                        >
                                                                            <p className="fs-6 text-break">{word}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-sm mt-2 mb-3 me-3 no-print" style={btnStyle} onClick={() => setApiResponse(null)}>
                                        <FaArrowLeft /> Generate More Bingo
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger mt-2 mb-3  no-print"
                                        onClick={generatePdf}
                                    >
                                        <FaCloudDownloadAlt /> Download PDF
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
