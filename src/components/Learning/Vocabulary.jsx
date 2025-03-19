import React, { useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { FaArrowRight, FaEraser, FaArrowLeft, FaRegFilePdf } from "react-icons/fa";
import { toast } from 'react-toastify';
import Spinner from '../../spinner/Spinner';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// Subjects list
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

// Grades list
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

// Difficulty Levels list
const difficultyLevels = [
    { value: "", label: "Choose a Difficulty Level" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
];

// Number of Words options
const numbers = [
    { value: "", label: "Choose the Number of Words" },
    { value: "5", label: "5" },
    { value: "10", label: "10" }
];

const breadcrumbItems = [
    { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
    { label: 'Learning', active: true },
    { label: 'Vocabulary', active: true }
];


export default function VocabularyPlan({ BASE_URL }) {
    const navigate = useNavigate();
    const btnStyle = { backgroundColor: '#FF683B', color: 'white' };
    const cancelStyle = { backgroundColor: '#dc3545', color: 'white' };
    const pdfStyle = {
        backgroundColor: '#198754',
        color: 'white',
    }

    const [formData, setFormData] = useState({
        subject: '',
        grade: '',
        difficultyLevel: '',
        topic: '',
        numberOfWords: ''
    });

    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const contentRef = useRef();

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { subject, grade, difficultyLevel, topic, numberOfWords } = formData;

        // Check if all required fields are filled
        if (!subject || !grade || !difficultyLevel || !topic || !numberOfWords) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const formDataToSend = {
            grade_level: grade,
            subject: subject,
            topic: topic,
            num_words: numberOfWords,
            difficulty_level: difficultyLevel
        };

        // Retrieve cookies for headers
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');


        setIsLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/generate-vocab-list`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                        'X-Site-Url': siteUrl
                    }
                }
            );
            setApiResponse(response.data);
            setFormData({
                subject: '',
                grade: '',
                difficultyLevel: '',
                topic: '',
                numberOfWords: ''
            });
            toast.success('Vocabulary generated successfully!');
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
                // console.error('Error:', error);
                toast.error('Failed to generate the Vocabulary. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle print action
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
                                        <h4 className="text-center mb-3">Vocabulary Builder</h4>
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

                                            <label htmlFor="difficultyLevel" className="form-label">
                                                Difficulty Level <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className="form-select form-select-sm mb-3"
                                                id="difficultyLevel"
                                                name="difficultyLevel"
                                                value={formData.difficultyLevel}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            >
                                                {difficultyLevels.map((level, index) => (
                                                    <option key={index} value={level.value}>
                                                        {level.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <label htmlFor="numberOfWords" className="form-label">
                                                Number of Words <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className="form-select form-select-sm mb-2"
                                                id="numberOfWords"
                                                name="numberOfWords"
                                                value={formData.numberOfWords}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            >
                                                {numbers.map((number, index) => (
                                                    <option key={index} value={number.value}>
                                                        {number.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <label htmlFor="topic" className="form-label">
                                                Topic <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mb-2"
                                                id="topic"
                                                name="topic"
                                                value={formData.topic}
                                                onChange={handleChange}
                                                disabled={isLoading} 
                                                placeholder="Enter topic (e.g. Force, Algebra, or Ancient Egypt)"
                                            />
                                        </div>

                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-sm"
                                                style={cancelStyle}
                                                onClick={() => setFormData({
                                                    subject: '',
                                                    grade: '',
                                                    difficultyLevel: '',
                                                    topic: '',
                                                    numberOfWords: ''
                                                })}
                                                disabled={isLoading}
                                            >
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
                            <div className="mt-3" ref={contentRef}>
                                {renderVocabulary(apiResponse)}
                                <button className="btn btn-sm mt-2 mb-3 me-2 no-print" style={btnStyle} onClick={() => setApiResponse(null)}>
                                    <FaArrowLeft /> Generate Another Vocabulary
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

const renderVocabulary = (vocabularyData) => {
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
            <div className='section'>
                <div className="d-flex justify-content-between mt-5 mb-5">
                    <h5>Name : <span style={nameStyle}></span></h5>
                    <h5 className='me-3'>Date :  <span style={dateStyle}></span></h5>
                </div>
                <div className='mb-5'>
                    <h5>Grade: {vocabularyData.grade_level}</h5>
                    <h5>Subject: {vocabularyData.subject}</h5>
                    <h5>Difficulty: {vocabularyData.difficulty_level}</h5>
                    <h5>Topic: {vocabularyData.topic}</h5>
                    <h5>Number of Words: {vocabularyData.num_words}</h5>
                </div>

                {/* Vocabulary List */}
                <section className='mb-5'>
                    <h4>Vocabulary List:</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Word</th>
                                <th>Definition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vocabularyData.vocab_list.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.word}</td>
                                    <td>{item.definition}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Sentence Table */}
                <section className='mt-5'>
                    <h4>Sentence Table:</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Word</th>
                                <th>Example Sentence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vocabularyData.sentence_table.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.word}</td>
                                    <td>{item.example_sentence || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};