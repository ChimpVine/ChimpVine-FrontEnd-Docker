import React, { useState } from 'react';
import axios from 'axios';
import { FaArrowRight, FaEraser, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../spinner/Spinner';
import NavBar from '../NavBar';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';

export default function YTSummarizer({ BASE_URL }) {
    const btnStyle = { backgroundColor: '#FF683B', color: 'white' };
    const cancelStyle = { backgroundColor: '#dc3545', color: 'white' };
    const headingStyle = { color: '#dc3545' };

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Summarizer', active: true },
        { label: 'YouTube Summarizer', active: true }
    ];

    const onSubmit = async (data) => {
        const { topic } = data;

        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/get_response`, { topic }, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`,
                    'X-Site-Url': siteUrl
                },
            });
            setApiResponse(response.data);
            reset(); // Clear form fields
            toast.success('Youtube Summary generated successfully!');
        } catch (error) {
            if (error.response) {
                const backendErrorMessage = error.response.data.error || 'Failed to generate YT Summarizer.';
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

    const renderSummary = (summaryData) => {
        return (
            <div className="accordion mt-3 mb-4" id="accordionExample">
                <h3 className="mb-3 text-center" style={headingStyle}>
                    <strong>Your YouTube Summarizer</strong>
                </h3>
                {summaryData.summarizer.map((section, index) => (
                    <div key={index} className="col-md-6 offset-md-3 accordion-item">
                        <h2 className="accordion-header" id={`heading${index}`}>
                            <button
                                className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse${index}`}
                                aria-expanded={index === 0 ? 'true' : 'false'}
                                aria-controls={`collapse${index}`}
                            >
                                <strong>{section.title}:</strong>
                                <strong className="ms-2">{section.timestamp}</strong>
                            </button>
                        </h2>
                        <div
                            id={`collapse${index}`}
                            className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                            aria-labelledby={`heading${index}`}
                            data-bs-parent="#accordionExample"
                        >
                            <div className="accordion-body">
                                <p><strong>{section.summary}</strong></p>
                                {section.points ? (
                                    <div>
                                        {section.points.map((point, idx) => (
                                            <div key={idx} className="mt-3">
                                                <strong>{point.title}</strong> <span>({point.timestamp})</span>
                                                <ul>
                                                    {point.details.map((detail, idy) => (
                                                        <li key={idy}>{detail}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <ul>
                                        {section.details.map((detail, idx) => (
                                            <li key={idx}>{detail}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <NavBar />
            <ToastContainer position="top-right" autoClose={1500} />
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
                                        <h4 className="text-center mb-3">YouTube Summarizer</h4>
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <label htmlFor="topic" className="form-label">
                                                    Youtube Video Transcript <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    className="btn btn-warning btn-sm"
                                                    onClick={handleModalToggle}
                                                >
                                                    <HiMiniQuestionMarkCircle /> How to use
                                                </button>
                                            </div>
                                            <textarea
                                                className={`form-control form-control-sm resizeStyle mb-2 ${
                                                    errors.topic ? 'is-invalid' : ''
                                                }`}
                                                id="topic"
                                                {...register('topic', { required: 'YouTube Video Transcript is required.' })}
                                                disabled={isLoading}
                                                placeholder="Enter YouTube Video Transcript"
                                                rows={8}
                                            ></textarea>
                                            {errors.topic && <small className="text-danger">
                                            {errors.topic.message}</small>}
                                        </div>
                                        <div className="mb-3">
                                            <small className="text-muted">
                                                <strong className='text-danger'>Note:</strong>
                                                <ul>
                                                    <li>Please ensure the YouTube video includes transcript.</li>
                                                </ul>
                                            </small>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-sm"
                                                style={cancelStyle}
                                                onClick={() => reset()}
                                                disabled={isLoading}
                                            >
                                                <FaEraser /> Reset
                                            </button>
                                            <button type="submit" className="btn btn-sm" style={btnStyle} disabled={isLoading}>
                                                Summarize <FaArrowRight />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="mt-3">
                                {renderSummary(apiResponse)}
                                <div className="text-center">
                                    <button className="btn btn-sm mt-2 mb-3 me-2" style={btnStyle} onClick={() => setApiResponse(null)}>
                                        <FaArrowLeft /> Summarize Another Video
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            {showModal && (
                <div
                    className="modal fade show d-flex align-items-center justify-content-center"
                    style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">How to Use</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleModalToggle}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <ol>
                                    <li>Open the video you want to transcribe on YouTube.</li>
                                    <li>Click “…more” under the title of the video in the description box.</li>
                                    <li>Click the <strong>Show Transcript</strong> button in the description box under the video title.</li>
                                    <li>The transcript will appear on the right side of the video.</li>
                                    <li>Highlight the full text, right-click, and copy it.</li>
                                    <li>Paste it into the <strong>YouTube Video Transcript</strong> field for the YouTube Transcript.</li>
                                </ol>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleModalToggle}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

