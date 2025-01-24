import React, { useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { FaArrowRight, FaRegFilePdf, FaEraser, FaArrowLeft, FaRegLightbulb } from "react-icons/fa";
import { toast } from 'react-toastify';
import Spinner from '../../spinner/Spinner';
import { NavLink } from 'react-router-dom';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const subjects = [
    { value: "", label: "Choose a Subject" },
    { value: "english", label: "English" },
    { value: "mathematics", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "social_studies", label: "Social Studies" },
    { value: "art", label: "Art" },
    { value: "music", label: "Music" },
    { value: "physical_education", label: "Physical Education" },
    { value: "health", label: "Health" },
    { value: "technology", label: "Technology" },
    { value: "language", label: "Language" }
];

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
    { value: "12", label: "12th Grade" },
];

export default function WorkBook({ BASE_URL }) {
    const navigate = useNavigate();
    const btnStyle = {
        backgroundColor: '#FF683B',
        color: 'white',
    };

    const cancelStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
    }

    const pdfStyle = {
        backgroundColor: '#198754',
        color: 'white',
    }

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Assessment', active: true },
        { label: 'Workbook', active: true }
    ];

    const [formData, setFormData] = useState({
        subject: '',
        grade: '',
        textarea: '',
        pdf_file: null,
    });

    const fileInputRef = useRef(null);

    const handleCancel = () => {
        setFormData({
            subject: '',
            grade: '',
            textarea: '',
            pdf_file: null,
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const contentRef = useRef();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { subject, grade, textarea, pdf_file } = formData;

        if (!subject || !grade || !textarea || !pdf_file) {
            toast.error('Please fill in all fields.');
            return;
        }

        if (pdf_file && pdf_file.size > 500 * 1024) {
            toast.error('File size exceeds 500KB. Please upload a smaller file.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('subject', subject);
        formDataToSend.append('grade', grade);
        formDataToSend.append('command', textarea);
        formDataToSend.append('file', pdf_file);

        // Retrieve cookies for headers
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        setIsLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/generate_workbook`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authToken}`,
                    'X-Site-Url': siteUrl
                },
            });
            setApiResponse(response.data);
            setFormData({
                subject: '',
                grade: '',
                textarea: '',
                pdf_file: null,
            });
            toast.success('Workbook generated successfully!');
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
                    navigate('/Login');
                    window.location.reload();
                }, 2000); 
            } else {
                // console.error('Error:', error);
                toast.error('Failed to generate the workbook. Please try again.');
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
                                        <h4 className="text-center mb-3">Workbook Planner</h4>
                                        <div className="mb-2">
                                            <label htmlFor="subject" className="form-label">
                                                Subject <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className="form-select form-select-sm mb-3"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            >
                                                {subjects.map((element, index) => (
                                                    <option key={index} value={element.value}>
                                                        {element.label}
                                                    </option>
                                                ))}
                                            </select>
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

                                            <label htmlFor="pdf_file" className="form-label">
                                                File Upload <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control form-control-sm mb-2"
                                                id="pdf_file"
                                                name="pdf_file"
                                                accept="application/pdf"
                                                ref={fileInputRef}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />

                                            <label htmlFor="textarea" className="form-label">
                                                Your Topic <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <textarea
                                                type="text"
                                                className="form-control form-control-sm mb-2"
                                                placeholder="Briefly describe the file you are uploading (e.g., Arithmetic, History, or Ancient Egypt)"

                                                id="textarea"
                                                name="textarea"
                                                value={formData.textarea}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />

                                            <div className="mb-3">
                                                <small className="text-muted">
                                                    <strong className='text-danger'>Note:</strong>
                                                    <ul>
                                                        <li>For better results, Upload a <span style={{ color: 'red' }}>Lesson Planner</span> PDF under 500KB.</li>
                                                        <li>To shorten a large PDF,<NavLink to="/pdf-splitter" target='_blank'>
                                                            <span style={{ fontWeight: 'bold' }}> Click here</span>
                                                        </NavLink></li>
                                                    </ul>
                                                </small>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between mt-3">
                                            <button type="button" className="btn btn-sm" style={cancelStyle} onClick={handleCancel}>
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
                                {parseWorkbook(apiResponse)}
                                <button className="btn btn-sm mt-2 mb-3 me-2 no-print" style={btnStyle} onClick={() => setApiResponse(null)}>
                                    <FaArrowLeft /> Generate Another Workbook
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

const parseWorkbook = (workbook) => {

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
            <div className='mt-4'>
                <div className="d-flex justify-content-center mt-3">
                    <h2 className='mb-5'>Your High School Name</h2>
                </div>
                <div className="d-flex justify-content-between mt-5 mb-5">
                    <h5>Name : <span style={nameStyle}></span></h5>
                    <h5 className='me-3'>Date :  <span style={dateStyle}></span></h5>
                </div>
            </div>
            <div className='mt-4 mb-4'>
                <div className="mt-3">
                    <h3>Title : {workbook.title}</h3>
                </div>
                <div className="mt-3 mb-3">
                    <h5>Introduction</h5>
                    <p>{workbook.introduction.content}</p>
                </div>
            </div>

            <div className='mb-4'>
                <h5>Analogy</h5>
                <p>{workbook.analogy.content}</p>
            </div>

            <div className='mb-4'>
                <h5>Key Concepts</h5>
                <ul>
                    {workbook.keyConcepts.map((conceptObj, index) => (
                        <li key={index}>
                            <strong>{conceptObj.concept}:</strong> {conceptObj.explanation}
                        </li>
                    ))}
                </ul>
            </div>

            <div className='mb-4'>
                <h5>Exercises</h5>
                {workbook.exercises.map((exercise, index) => (
                    <div key={index}>
                        <p><strong>{exercise.question}</strong></p>
                        <ul>
                            {exercise.options.map((option, optionIndex) => (
                                <li key={optionIndex}>{option}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className='mb-4'>
                <h5>Summary</h5>
                <p>{workbook.summary.content}</p>
            </div>

            <div className='mb-4 border border-2 p-3'>
                <h5>Fun Fact <FaRegLightbulb size={25} /></h5>
                <p>{workbook.funFact.content}</p>
            </div>

            <div className='mb-4'>
                <h5>Answers</h5>
                {workbook.answers.map((answer, index) => (
                    <div key={index}>
                        <p><strong>{answer.question}</strong></p>
                        <p>Correct Answer: {answer.correctAnswer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
