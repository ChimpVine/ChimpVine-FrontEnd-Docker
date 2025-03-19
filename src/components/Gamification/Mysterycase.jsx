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

export default function MysteryGameGenerator({BASE_URL}) {
    const navigate = useNavigate();
    const btnStyle = { backgroundColor: '#FF683B', color: 'white' };
    const cancelStyle = { backgroundColor: '#dc3545', color: 'white' };
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showAnswers, setShowAnswers] = useState(true);

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Gamification', active: true },
        { label: 'Mystery Game', active: true }
    ];

    const onSubmit = async (data) => {

        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        const payload = {
            topic: data.case_study_topic,
            difficulty: data.difficulty_level,
            no_of_clues: parseInt(data.number_of_clues),
        };

        setIsLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`,
                    'X-Site-Url': siteUrl
                },
            });
            setApiResponse(response.data.mystery_game);
            reset();
            toast.success('Mystery game generated successfully!');
        } catch (error) {
            if (error.response) {
                const backendErrorMessage = error.response.data.error || 'Failed to generate mystery game.';
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
                                        <h4 className="text-center mb-3">Mystery Game Generator</h4>
                                        <div className="mb-2">
                                            <label htmlFor="case_study_topic" className="form-label">
                                                Case Study Topic <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.case_study_topic ? 'is-invalid' : ''}`}
                                                id="case_study_topic"
                                                {...register('case_study_topic', { required: 'Topic is required.' })}
                                                placeholder="Enter topic (e.g. Space, Animals)"
                                            />
                                            {errors.case_study_topic && (
                                                <div className="invalid-feedback">{errors.case_study_topic.message}</div>
                                            )}

                                            <label htmlFor="difficulty_level" className="form-label">
                                                Difficulty Level <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.difficulty_level ? 'is-invalid' : ''}`}
                                                id="difficulty_level"
                                                {...register('difficulty_level', {
                                                    required: 'Please select a difficulty level.',
                                                })}
                                            >
                                                <option value="">Choose Difficulty Level</option>
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                            {errors.difficulty_level && (
                                                <div className="invalid-feedback">{errors.difficulty_level.message}</div>
                                            )}

                                            <label htmlFor="number_of_clues" className="form-label">
                                                Number of Clues <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.number_of_clues ? 'is-invalid' : ''}`}
                                                id="number_of_clues"
                                                {...register('number_of_clues', {
                                                    required: 'Please select the number of clues.',
                                                })}
                                            >
                                                <option value="">Choose Number of Clues</option>
                                                {[...Array(10)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.number_of_clues && (
                                                <div className="invalid-feedback">{errors.number_of_clues.message}</div>
                                            )}
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
                            <div className="col-md-10 mt-3">
                                <h5>Story:</h5>
                                <p>{apiResponse.story}</p>
                                <h6>Question:</h6>
                                <p>{apiResponse.question}</p>
                                <h6>Clues:</h6>
                                <ul>
                                    {apiResponse.clues.map((clue, index) => (
                                        <li key={index}>{clue}</li>
                                    ))}
                                </ul>
                                <h6>Answer:</h6>
                                {showAnswers ? "" : apiResponse.answer}
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-sm mt-2 mb-3 me-3 no-print" style={btnStyle} onClick={() => setApiResponse(null)}>
                                        <FaArrowLeft /> Generate More Cases
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger mt-2 mb-3 me-3 no-print"
                                        onClick={generatePdf}
                                    >
                                        <FaCloudDownloadAlt /> Download PDF
                                    </button>
                                    <button
                                        className="btn btn-sm btn-warning mt-2 mb-3 no-print"
                                        onClick={toggleAnswers}
                                    >
                                        <FaFilePdf /> {showAnswers ? 'Show Answer' : 'Hide Answer'}
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
