import React, { useState, useRef } from 'react';
import NavBar from '../NavBar';
import { FaArrowRight, FaRegFilePdf, FaEraser, FaArrowLeft } from "react-icons/fa";
import { toast } from 'react-toastify';
import Spinner from '../../spinner/Spinner';
import { NavLink } from 'react-router-dom';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';

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
    { value: "12", label: "12th Grade" }
];

const lessonDurations = [
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

export default function LessonPlan() {

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
        { label: 'Planner', active: true },
        { label: 'Curriculum Planner', active: true }
    ];

    const [formData, setFormData] = useState({
        subject: '',
        grade: '',
        duration: '',
        textarea: '',
        pdf_file: null,
    });

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
        const { subject, grade, duration, textarea, pdf_file } = formData;

        if (!subject || !grade || !duration || !textarea || !pdf_file) {
            toast.error('Please fill in all fields.');
            return;
        }

        if (pdf_file && pdf_file.size > 500 * 1024) {
            toast.error('File size exceeds 500KB. Please upload a smaller file.');
            return;
        }

        setIsLoading(true);
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
                                        <h4 className="text-center mb-3">Curriculum Planner</h4>
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
                                                {lessonDurations.map((duration, index) => (
                                                    <option key={index} value={duration.value}>
                                                        {duration.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <label htmlFor="pdf_file" className="form-label">
                                                    File Upload <span style={{ color: 'red' }}>*</span>
                                                </label>
                                            </div>
                                            <input
                                                type="file"
                                                className="form-control form-control-sm mb-2"
                                                id="pdf_file"
                                                name="pdf_file"
                                                accept="application/pdf"
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />

                                            <label htmlFor="textarea" className="form-label">
                                               Additional Information <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <textarea
                                                type="text"
                                                className="form-control form-control-sm mb-2"
                                                placeholder="Briefly describe the file you are uploading (e.g., Chapter 1 - The Solar System Notes, or Midterm Study Guide)"
                                                id="textarea"
                                                name="textarea"
                                                rows={3}
                                                value={formData.textarea}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />
                                            <div className="mb-3">
                                                <small className="text-muted">
                                                    <strong className='text-danger'>Note:</strong>
                                                    <ul>
                                                        <li>Upload a single PDF file under 500KB.</li>
                                                        <li>To shorten a large PDF,<NavLink to="/pdf-splitter" target='_blank'>
                                                            <span style={{ fontWeight: 'bold' }}> Click here</span>
                                                        </NavLink></li>
                                                    </ul>
                                                </small>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between mt-3">
                                            <button type="button" className="btn btn-sm" style={cancelStyle} onClick={() => setFormData({
                                                subject: '',
                                                grade: '',
                                                duration: '',
                                                textarea: '',
                                                pdf_file: null,
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
        
                                <button className="btn btn-sm mt-2 mb-3 me-2 no-print" style={btnStyle} onClick={() => setApiResponse(null)}>
                                    <FaArrowLeft /> Generate Another Lesson
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
