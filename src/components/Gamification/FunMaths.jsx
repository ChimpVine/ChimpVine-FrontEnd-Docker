import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import Spinner from '../../spinner/Spinner';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import { FaArrowRight, FaEraser, FaArrowLeft, FaCloudDownloadAlt } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const grades = [
    { value: "", label: "Choose a Grade" },
    { value: "k", label: "Kindergarten" },
    { value: "1", label: "1st Grade" },
    { value: "2", label: "2nd Grade" },
    { value: "3", label: "3rd Grade" },
    { value: "4", label: "4th Grade" },
    { value: "5", label: "5th Grade" },
    { value: "6", label: "6th Grade" },
    { value: "7", label: "7th Grade" },
    { value: "8", label: "8th Grade" },
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" }
];

export default function FunMath({ BASE_URL }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);

    const btnStyle = { backgroundColor: '#FF683B', color: 'white' };
    const cancelStyle = { backgroundColor: '#dc3545', color: 'white' };

    const onSubmit = async (data) => {
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        setIsLoading(true);
        setApiResponse(null);

        try {
            const response = await axios.post(`${BASE_URL}/fun_maths`, data, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`,
                    'X-Site-Url': siteUrl
                },
            });
            setApiResponse(response.data);
            reset();
            toast.success('Fun math problem generated successfully!');
        } catch (error) {
            if (error.response) {
                const backendErrorMessage = error.response.data.error || 'Failed to generate Fun Maths.';
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

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Gamification', active: true },
        { label: 'Fun Math', active: true }
    ];

    const generatePdf = () => {
        window.print();
    };

    const renderFunMath = (response) => (
        <div className="container col-md-10 mt-3">
            <h5><strong>Riddle:</strong></h5>
            <p>{response.riddle.question}</p>
            <h5><strong>Hint:</strong></h5>
            <p>{response.riddle.hint}</p>
            <h5><strong>Answer:</strong></h5>
            <p>{response.answer.explanation}</p>
            <h6><strong>Steps:</strong></h6>
            <ul>
                <li>Spaceships: {response.answer.steps.spaceships}</li>
                <li>Boosters per Spaceship: {response.answer.steps.boosters_per_spaceship}</li>
                <li>Total Boosters: {response.answer.steps.total_boosters}</li>
            </ul>
            <h6><strong>Fun Fact:</strong></h6>
            <p>{response.answer.fun_fact}</p>
            <div className="d-flex justify-content-center">
                <button
                    className="btn btn-sm mt-2 mb-3 me-3 no-print"
                    style={btnStyle}
                    onClick={() => setApiResponse(null)}
                >
                    <FaArrowLeft /> Generate More
                </button>
                <button
                    className="btn btn-sm btn-danger mt-2 mb-3 me-3 no-print"
                    onClick={generatePdf}
                >
                    <FaCloudDownloadAlt /> Download PDF
                </button>
            </div>
        </div>
    );

    return (
        <>
            <NavBar />
            <div className="container-fluid">
                <div className="row justify-content-center mt-5 mb-4">
                    {isLoading ? (
                        <div className="col-md-5 text-center">
                            <Spinner />
                        </div>
                    ) : (
                        !apiResponse ? (
                            <>
                                <NavBreadcrumb items={breadcrumbItems} />
                                <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow bg-body rounded">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <h4 className="text-center mb-3">Fun Math Generator</h4>

                                        <div className="mb-2">
                                            <label htmlFor="grade_level" className="form-label">
                                                Grade <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className={`form-select form-select-sm mb-2 ${errors.grade_level ? 'is-invalid' : ''}`}
                                                id="grade_level"
                                                {...register('grade_level', { required: 'Grade is required' })}
                                            >
                                                {grades.map((grade, index) => (
                                                    <option key={index} value={grade.value}>
                                                        {grade.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.grade_level && <div className="invalid-feedback">{errors.grade_level.message}</div>}
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="math_topic" className="form-label">
                                                Math Topic <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm ${errors.math_topic ? 'is-invalid' : ''}`}
                                                id="math_topic"
                                                placeholder="Enter math topic (e.g. Fractions, Algebra)"
                                                {...register('math_topic', { required: 'Math topic is required' })}
                                            />
                                            {errors.math_topic && <div className="invalid-feedback">{errors.math_topic.message}</div>}
                                        </div>

                                        <div className="mb-2">
                                            <label htmlFor="interest" className="form-label">
                                                Interest <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm ${errors.interest ? 'is-invalid' : ''}`}
                                                id="interest"
                                                placeholder="Enter interest (e.g. Space, Sports)"
                                                {...register('interest', { required: 'Interest is required' })}
                                            />
                                            {errors.interest && <div className="invalid-feedback">{errors.interest.message}</div>}
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
                                            <button
                                                type="submit"
                                                className="btn btn-sm"
                                                style={btnStyle}
                                                disabled={isLoading}
                                            >
                                                Generate <FaArrowRight />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </>
                        ) : (
                            renderFunMath(apiResponse)
                        )
                    )}
                </div>
            </div>
        </>
    );
}
