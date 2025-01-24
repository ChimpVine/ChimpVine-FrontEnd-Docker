import React, { useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { FaArrowRight, FaRegFilePdf, FaEraser, FaArrowLeft } from "react-icons/fa";
import { toast } from 'react-toastify';
import Spinner from '../../spinner/Spinner';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import Cookies from 'js-cookie'; 
import { useNavigate } from 'react-router-dom';

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

const durations = [
    { value: "", label: "Choose the Duration" },
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
    { value: "75", label: "1 hour 15 minutes" },
    { value: "90", label: "1 hour 30 minutes" },
    { value: "105", label: "1 hour 45 minutes" },
    { value: "120", label: "2 hours" },
    { value: "135", label: "2 hours 15 minutes" },
    { value: "150", label: "2 hours 30 minutes" },
    { value: "165", label: "2 hours 45 minutes" },
    { value: "180", label: "3 hours" }
];


export default function SELGenerator({ BASE_URL }) {
    const navigate = useNavigate();
    const btnStyle = {
        backgroundColor: '#FF683B',
        color: 'white',
    };

    const cancelStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
    };

    const pdfStyle = {
        backgroundColor: '#198754',
        color: 'white',
    };

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Planner', active: true },
        { label: 'SEL Generator', active: true }
    ];

    const [formData, setFormData] = useState({
        grade: '',
        sel_topic: '',
        learning_objectives: '',
        duration: '',
    });

    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const contentRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { grade, sel_topic, learning_objectives, duration } = formData;

        if (!grade || !sel_topic || !learning_objectives || !duration) {
            toast.error('Please fill in all fields.');
            return;
        }


        const formDataToSend = {
            grade,
            sel_topic,
            learning_objectives,
            duration
        };

        const learningObjectivesArray = learning_objectives.split('\n');
        const totalWords = learningObjectivesArray.reduce((acc, objective) => acc + objective.split(' ').length, 0);

        // Retrieve cookies for headers
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        setIsLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/generate_sel_plan`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                        'X-Site-Url': siteUrl
                    }
                }
            );
            setApiResponse(response.data);
            setFormData({
                grade: '',
                sel_topic: '',
                learning_objectives: '',
                duration: '',
            });
            toast.success('SEL plan generated successfully!');
        } catch (error) {
            if (
                error.response.status === 401 
            ) {
                // console.error('Error: Invalid token.');
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
            } else {
                toast.error('Error:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <NavBar id="main-nav" />
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
                            <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded no-print">
                                <form onSubmit={handleSubmit}>
                                    <h4 className="text-center mb-3">SEL Plan Generator</h4>
                                    <div className="mb-2">
                                        <label htmlFor="grade" className="form-label">
                                            Grade <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <select
                                            className="form-select form-select-sm mb-3"
                                            id="grade"
                                            name="grade"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        >
                                            {grades.map((grade, index) => (
                                                <option key={index} value={grade.value}>
                                                    {grade.label}
                                                </option>
                                            ))}
                                        </select>

                                        <label htmlFor="duration" className="form-label">
                                            Duration <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <select
                                            className="form-select form-select-sm mb-3"
                                            id="duration"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        >
                                            {durations.map((duration, index) => (
                                                <option key={index} value={duration.value}>
                                                    {duration.label}
                                                </option>
                                            ))}
                                        </select>

                                        <label htmlFor="sel_topic" className="form-label">
                                            SEL Topic <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <textarea
                                            type="text"
                                            className="form-control form-control-sm mb-2"
                                            placeholder="For eg. Self-awareness"
                                            id="sel_topic"
                                            name="sel_topic"
                                            value={formData.sel_topic}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />

                                        <label htmlFor="learning_objectives" className="form-label">
                                            Learning Objectives <span style={{ color: 'red' }}>*</span> <br />
                                        </label>
                                        <textarea
                                            type="text"
                                            className="form-control form-control-sm mb-2"
                                            placeholder="For eg. 1. Demonstrates an awareness and understanding of own emotions."
                                            id="learning_objectives"
                                            name="learning_objectives"
                                            value={formData.learning_objectives}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted">
                                            <strong className='text-danger'>Note:</strong>
                                            <ul>
                                                <li>Please ensure that the learning objectives are concise and do not exceed 250 words.</li>
                                            </ul>
                                        </small>
                                    </div>
                                    <div className="d-flex justify-content-between mt-3">
                                        <button type="button" className="btn btn-sm" style={cancelStyle} onClick={() => setFormData({
                                            grade: '',
                                            sel_topic: '',
                                            learning_objectives: '',
                                            duration: '',
                                        })} disabled={isLoading}>
                                            <FaEraser /> Reset
                                        </button>
                                        <button type="submit" className="btn btn-sm" style={btnStyle} disabled={isLoading}>
                                            Generate <FaArrowRight />
                                        </button>
                                    </div>
                                </form>
                            </div>
                            </>
                        ) : (
                            <div className="mt-3" ref={contentRef} id="main-btn">
                                {renderSELPlan(apiResponse)}
                                <button className="btn btn-sm mt-2 mb-3 me-2 no-print" style={btnStyle} onClick={() => setApiResponse(null)}>
                                    <FaArrowLeft /> Generate Another SEL Plan
                                </button>
                                <button className="btn btn-sm mt-2 mb-3 no-print" style={pdfStyle} onClick={handlePrint}>
                                    <FaRegFilePdf /> View PDF
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

const renderSELPlan = (selPlan) => {

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
        <div className="container-fluid mt-3 mb-2 ps-5 pe-5 print-content">
            <div className="mt-4">
                <div className="d-flex justify-content-center mt-3">
                    <h2 className='mb-5'>Your High School Name</h2>
                </div>
                <div className="d-flex justify-content-between mt-5 mb-5">
                    <h5>Name : <span style={nameStyle}></span></h5>
                    <h5 className='me-3'>Date :  <span style={dateStyle}></span></h5>
                </div>
                <h4>SEL Plan for Grade {selPlan.grade}</h4>
                <div className='mb-3'>
                    <h5>Topic: {selPlan.topic} </h5>
                    <h5>Duration: {selPlan.duration}</h5>
                </div>

                <section>
                    <h4>Learning Objectives:</h4>
                    <ul>
                        {selPlan.learningObjectives.map((objective, index) => (
                            <li key={index}>{objective}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h4>Lesson Activities:</h4>
                    {selPlan.lessonActivities.map((activity, index) => (
                        <div key={index} className="mb-3">
                            <h5>{activity.activity} ({activity.duration})</h5>
                            <p><strong>Objective:</strong> {activity.objective}</p>
                            <ul>
                                {activity.steps.map((step, stepIndex) => (
                                    <li key={stepIndex}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>

                <section>
                    <h4>Assessment:</h4>
                    <ul>
                        {selPlan.assessment.map((assess, index) => (
                            <li key={index}><strong>{assess.method}</strong>: {assess.details}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h4>Reflection and Closure:</h4>
                    <ul>
                        {selPlan.reflectionAndClosure.map((reflection, index) => (
                            <li key={index}>{reflection.activity}: {reflection.details}</li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h4>Extensions:</h4>
                    <ul>
                        {Object.keys(selPlan.extension).map((key, index) => (
                            <li key={index}><strong>{key}:</strong> {selPlan.extension[key]}</li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};
