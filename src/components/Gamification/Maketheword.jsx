import React, { useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { FaArrowRight, FaEraser, FaArrowLeft, FaCloudDownloadAlt, FaFilePdf } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Spinner from '../../spinner/Spinner';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import Cookies from 'js-cookie'; 
import { useNavigate } from 'react-router-dom';

const difficultyLevels = [
    { value: "", label: "Choose the Difficulty Level" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
];

const breadcrumbItems = [
    { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
    { label: 'Gamification', active: true },
    { label: 'Make the word', active: true }
];

const numberOfWords = [
    { value: "", label: "Choose Number of Words" },
    ...Array.from({ length: 6 }, (_, i) => ({ value: i + 5, label: `${i + 5}` }))
];

export default function Maketheword({ BASE_URL }) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [showAnswers, setShowAnswers] = useState(false); // State to toggle answers visibility
    const contentRef = useRef();

    const btnStyle = { backgroundColor: '#FF683B', color: 'white' };
    const cancelStyle = { backgroundColor: '#dc3545', color: 'white' };
    const pdfStyle = { backgroundColor: '#198754', color: 'white' };

    const onSubmit = async (data) => {
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        setIsLoading(true);
        setApiResponse(null);

        try {
            const response = await axios.post(
                `${BASE_URL}/make_the_word`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                        'X-Site-Url': siteUrl
                    }
                }
            );
            setApiResponse(response.data);
            toast.success('Words generated successfully!');
            reset();
        } catch (error) { 
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
            } else {
                const errorMessage = error.response?.data?.error || 'Failed to generate words. Please try again.';
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

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

    const toggleAnswers = () => setShowAnswers(!showAnswers);

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
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <h4 className="text-center mb-3">Make the Word Generator</h4>
                                        {/* Theme */}
                                        <div className="mb-2">
                                            <label htmlFor="theme" className="form-label">
                                                Theme <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm mb-2 ${errors.theme ? 'is-invalid' : ''}`}
                                                id="theme"
                                                {...register('theme', { required: 'Theme is required' })}
                                                placeholder="Enter Theme For E.g. Animals, Foods, Planets"
                                            />
                                            {errors.theme && <div className="invalid-feedback">{errors.theme.message}</div>}
                                        </div>

                                        {/* Difficulty Level */}
                                        <div className="mb-2">
                                            <label htmlFor="difficulty_level" className="form-label">
                                                Difficulty Level <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className={`form-select form-select-sm mb-2 ${errors.difficulty_level ? 'is-invalid' : ''}`}
                                                id="difficulty_level"
                                                {...register('difficulty_level', { required: 'Difficulty level is required' })}
                                            >
                                                {difficultyLevels.map((level, index) => (
                                                    <option key={index} value={level.value}>
                                                        {level.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.difficulty_level && <div className="invalid-feedback">{errors.difficulty_level.message}</div>}
                                        </div>

                                        {/* Number of Words */}
                                        <div className="mb-2">
                                            <label htmlFor="number_of_words" className="form-label">
                                                Number of Words <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className={`form-select form-select-sm mb-2 ${errors.number_of_words ? 'is-invalid' : ''}`}
                                                id="number_of_words"
                                                {...register('number_of_words', { required: 'Number of words is required' })}
                                            >
                                                {numberOfWords.map((num, index) => (
                                                    <option key={index} value={num.value}>
                                                        {num.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.number_of_words && <div className="invalid-feedback">{errors.number_of_words.message}</div>}
                                        </div>

                                        <div className="d-flex justify-content-between mt-3">
                                            <button type="button" className="btn btn-sm" style={cancelStyle} onClick={() => reset()} disabled={isLoading}>
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
                            <div id="main-btn">
                                {renderWordGame(apiResponse, showAnswers)}
                                <div className="text-center">
                                    <button className="btn btn-sm mt-2 mb-3 me-2 no-print" style={btnStyle} onClick={() => setApiResponse(null)}>
                                        <FaArrowLeft /> Generate Another Word Game
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm mt-2 mb-3 me-2 no-print"
                                        style={pdfStyle}
                                        onClick={() => generatePdf(showAnswers)}
                                    >
                                        <FaCloudDownloadAlt /> Download PDF
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-warning mt-2 mb-3 me-2 no-print"
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

const renderWordGame = (apiResponse, showAnswers) => {
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
    const headingStyle = { color: '#dc3545' };

    return (
        <div className="container-fluid mt-3 mb-2 ps-5 pe-5 print-content">
            <div id="headerContent" className='mt-4'>
                <div className="d-flex justify-content-center mt-3">
                    <h2 className='mb-5'>Your High School Name</h2>
                </div>
                <div className="d-flex justify-content-between mt-5 mb-5">
                    <h5>Name : <span style={nameStyle}></span></h5>
                    <h5 className='me-3'>Date :  <span style={dateStyle}></span></h5>
                </div>
            </div>
            <h4 style={headingStyle}><strong>Generated Make the Word</strong></h4>
            <section className='mb-5'>
                <p><strong>Theme:</strong> {apiResponse.theme}</p>
                <p><strong>Difficulty:</strong> {apiResponse.difficulty}</p>
                <p><strong>Number of Words:</strong> {apiResponse.no_of_words}</p>
                <p className="letters">
                    <strong>Letters: </strong>
                    {apiResponse.letters.map((letter, index) => (
                        <span key={index} className="letter">
                            {letter}{index < apiResponse.letters.length - 1 && ","}
                        </span>
                    ))}
                </p>
                <div className="row">
                    {apiResponse.words.map((wordObj, index) => (
                        <div key={index} className="col-md-6 mb-4">
                            <div className="p-3 border rounded">
                                <strong>Word: {showAnswers ? wordObj.word : ''}</strong>
                                <p className={showAnswers ? 'answer' : ''}><strong>Hint:</strong> {wordObj.hint}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
