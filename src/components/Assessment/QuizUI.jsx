import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../../spinner/Spinner.jsx';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import {
    FaArrowRight,
    FaCheckCircle,
    FaArrowLeft,
    FaDownload,
    FaRandom,
    FaEraser
} from "react-icons/fa";
import NavBar from '../NavBar.jsx';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb.jsx'
import Cookies from 'js-cookie'; 
import { useNavigate } from 'react-router-dom';


const QuizUI = ({ BASE_URL }) => {
    const navigate = useNavigate();
    const mystyle = {
        color: 'red',
    };

    const btnStyle = {
        backgroundColor: '#FF683B',
        color: 'white',
    };

    const cancelStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
    }

    const gapStyle = {
        marginRight: '10px',
    };

    const pdfStyle = {
        backgroundColor: '#198754',
        color: 'white',
    }

    const backStyle = {
        backgroundColor: '#6c757d',
        color: 'white',
    }

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Assessment', active: true },
        { label: 'Quiz Generator', active: true }
    ];


    const defaultNumberOfQuestionnaires = 10;
    const questionsPerPage = 10;

    const [inputData, setInputData] = useState({
        subject: '',
        topic: '',
        difficulty: '',
        language: '',
        numberOfQuestions: defaultNumberOfQuestionnaires,
    });

    const [userQuizQuestions, setUserQuizQuestions] = useState([]);
    const [additionalQuizQuestions, setAdditionalQuizQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [approvalStatus, setApprovalStatus] = useState({});
    const [loading, setLoading] = useState(false);
    const [regenerationAttempts, setRegenerationAttempts] = useState(5)
    const downloadPdfRef = useRef(null);
    const [showModal, setShowModal] = useState(false);


    const handleShowModal = () => {
        setShowModal(true);
    };


    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateInput = () => {
        const noSpacesRegex = /^\S+$/; // No spaces allowed
        const noNumbersRegex = /^[^0-9]+$/; // No numbers allowed
        const noSymbolsRegex = /^[a-zA-Z]+$/; // Only letters allowed, no symbols
    
        if (!inputData.subject.trim()) {
            toast.warning('Please enter a subject.');
            return false;
        }
        if (!noSpacesRegex.test(inputData.subject)) {
            toast.warning('Subject should not contain spaces.');
            return false;
        }
        if (!noNumbersRegex.test(inputData.subject)) {
            toast.warning('Subject should not contain numbers.');
            return false;
        }
        if (!noSymbolsRegex.test(inputData.subject)) {
            toast.warning('Subject should not contain symbols.');
            return false;
        }
    
        if (!inputData.topic.trim()) {
            toast.warning('Please enter a topic.');
            return false;
        }
        if (!noSpacesRegex.test(inputData.topic)) {
            toast.warning('Topic should not contain spaces.');
            return false;
        }
        if (!noNumbersRegex.test(inputData.topic)) {
            toast.warning('Topic should not contain numbers.');
            return false;
        }
        if (!noSymbolsRegex.test(inputData.topic)) {
            toast.warning('Topic should not contain symbols.');
            return false;
        }
    
        if (!inputData.difficulty.trim()) {
            toast.warning('Please select a difficulty.');
            return false;
        }
    
        if (!inputData.language.trim()) {
            toast.warning('Please select a language.');
            return false;
        }
    
        if (parseInt(inputData.numberOfQuestions) !== 10) {
            toast.warning('Number of questions should be exactly 10.');
            return false;
        }
    
        return true;
    };
    

    const handleGenerateQuiz = async () => {
        if (!validateInput()) {
            return;
        }

        try {

            // Retrieve cookies for headers
            const authToken = Cookies.get('authToken');
            const siteUrl = Cookies.get('site_url');

            setLoading(true);

            const apiUrl = `${BASE_URL}/generate_quiz?topic=${inputData.topic}&language=${inputData.language}&subject=${inputData.subject}&number=${inputData.numberOfQuestions}&difficulty=${inputData.difficulty}`;

            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, 
                    'X-Site-Url': siteUrl 
                }
            });

            if (!response.ok) {
                // throw new Error(`HTTP error! Status: ${response.status}`);
                toast.error('Some problem encountered. Please try again later.');
            }

            const data = await response.json();

            if (data && data.Quiz && Array.isArray(data.Quiz) && data.Quiz.length > 0) {
                const quizWithIds = data.Quiz.map((question) => ({
                    ...question,
                    id: uuidv4(),
                }));
                setUserQuizQuestions(quizWithIds.slice(0, defaultNumberOfQuestionnaires));
                setAdditionalQuizQuestions(quizWithIds.slice(defaultNumberOfQuestionnaires));
                setCurrentPage(1);
                setApprovalStatus({});
                toast.success('Quiz generated successfully');
            } else {
                // console.error('Invalid API response. Expected a non-empty array:', data);
                toast.error('Some error encountered. Please try again later.');
            }
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
                toast.error('Failed to fetch quiz questions. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };


    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = userQuizQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const handleBack = () => {
        setInputData({
            subject: '',
            topic: '',
            language: '',
            numberOfQuestions: defaultNumberOfQuestionnaires,
        });
        setUserQuizQuestions([]);
        setAdditionalQuizQuestions([]);
        setCurrentPage(1);
        setSelectedQuestions([]);
        setApprovalStatus({});
    };

    const handleReset = () => {
        setInputData({
            subject: '',
            topic: '',
            difficulty: '',
            language: '',
            numberOfQuestions: defaultNumberOfQuestionnaires,
        });
    };

    const handleCancel = () => {
        setSelectedQuestions([]);
        setApprovalStatus({});
    };

    const handleApprove = (id) => {
        setApprovalStatus((prev) => ({ ...prev, [id]: true }));
        setSelectedQuestions((prevSelected) => [...prevSelected, id]);
    };

    const handleReject = (id) => {
        setApprovalStatus((prev) => ({ ...prev, [id]: false }));
    };

    const handleToggleSelectAll = () => {
        const allQuestionsSelected = selectedQuestions.length === userQuizQuestions.length;

        if (allQuestionsSelected) {
            setSelectedQuestions([]);
        } else {
            const allQuestions = userQuizQuestions.map((question) => question.id);
            setSelectedQuestions(allQuestions);
        }
    };

    const generatePdf = () => {
        if (selectedQuestions.length === 0) {
            toast.warning('Please select questions to download as PDF.');
            return;
        }

        const pdf = new jsPDF();
        const fontSize = 10;
        const maxQuestionsPerPage = 3;
        let questionCounter = 0;
        let yOffset = 20;
        let currentPage = 1;

        const addQuestionPage = () => {
            if (questionCounter > 0) {
                pdf.addPage();
                currentPage++;
                yOffset = 20;
            }
        };

        selectedQuestions.forEach((questionId, index) => {
            const question = userQuizQuestions.find(q => q.id === questionId);
            if (question) {
                if (questionCounter % maxQuestionsPerPage === 0) {
                    addQuestionPage();
                }

                pdf.setFontSize(fontSize);
                pdf.text(`Question ${questionCounter + 1} : ${question.Question}`, 10, yOffset);
                yOffset += fontSize + 2;
                ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'].forEach(answerKey => {
                    pdf.text(`${answerKey.charAt(answerKey.length - 1)}. ${question[answerKey]}`, 15, yOffset);
                    yOffset += fontSize + 2;
                });
                yOffset += 5; // Space between questions
                questionCounter++;
            } else {
                console.error(`Question with ID ${questionId} not found.`);
            }
        });

        addQuestionPage(); // Add page for Correct Answers

        selectedQuestions.forEach((questionId, index) => {
            const question = userQuizQuestions.find(q => q.id === questionId);
            if (question) {
                pdf.text(`Question ${index + 1} : Correct Answer: ${question['Correct Answer']}`, 10, yOffset);
                yOffset += fontSize + 5;
            }
        });

        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setPage(currentPage);
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;
        const centerX = pageWidth / 2;
        const centerY = pageHeight - 10;
        pdf.text(`Page ${currentPage} of ${pageCount}`, centerX, centerY, { align: 'center' });

        pdf.save('selected_questions.pdf');
        handleBack();
        toast.success('PDF downloaded successfully');
    };

    const handleDownloadPdf = () => {
        generatePdf();
    };

    const handleRegenerateQuestion = (index) => {
        if (additionalQuizQuestions.length <= index) {
            // console.error(`No additional question found at index: ${index}`);
            toast.error('Error regenerating question');
            return;
        }

        if (regenerationAttempts === 0) {
            toast.warning('You have already attempted to regenerate 5 questions.');
            return;
        }

        const newQuestion = additionalQuizQuestions[index];
        if (newQuestion) {
            setUserQuizQuestions((prevQuestions) => {
                const updatedQuestions = [...prevQuestions];
                updatedQuestions[indexOfFirstQuestion + index] = newQuestion; // Update the correct index
                return updatedQuestions;
            });
            setAdditionalQuizQuestions((prevAdditional) => prevAdditional.filter((_, i) => i !== index));
            setRegenerationAttempts(prevAttempts => prevAttempts - 1); // Decrease regeneration attempts
            toast.success('Question regenerated successfully');
        } else {
            // console.error('No additional question found at index:', index);
            toast.error('Error regenerating question');
        }
    };

    return (
        <>
            <NavBar />
            <div className="container">
                <div className="row justify-content-center mt-5 mb-4">
                    <div className="col-md-6 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded">
                        {loading ? (
                            <div className="text-center">
                                <Spinner />
                            </div>
                        ) : userQuizQuestions.length === 0 ? (
                            <>
                            <NavBreadcrumb items={breadcrumbItems} />
                            <form>
                                <h4 className="text-center mb-4">Quiz Generator</h4>
                                <div className="mb-3">
                                    <label htmlFor="subject" className="form-label">
                                        Subject <span style={mystyle}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mb-3"
                                        id="subject"
                                        name="subject"
                                        value={inputData.subject}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Enter subject (e.g. Science , Mathematics or History)"
                                    />

                                    <label htmlFor="topic" className="form-label">
                                        Topic <span style={mystyle}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm mb-3"
                                        id="topic"
                                        name="topic"
                                        value={inputData.topic}
                                        onChange={handleInputChange} 
                                        disabled={loading}
                                        placeholder="Enter topic (e.g. Force, Algebra, or Ancient Egypt)"
                                    />

                                    <label htmlFor="difficulty" className="form-label">
                                        Difficulty <span style={mystyle}>*</span>
                                    </label>
                                    <select
                                        className="form-select form-select-sm mb-3"
                                        id="difficulty"
                                        name="difficulty"
                                        type="text"
                                        value={inputData.difficulty}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Choose the Difficulty Level</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>

                                    <label htmlFor="language" className="form-label">
                                        Language <span style={mystyle}>*</span>
                                    </label>
                                    <select
                                        className="form-select form-select-sm mb-3"
                                        id="language"
                                        name="language"
                                        value={inputData.language}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    >
                                        <option defaultValue>Select a Language</option>
                                        <option value="english">English</option>
                                        <option value="spanish">Spanish</option>
                                        <option value="thai">Thai</option>
                                    </select>

                                    <label htmlFor="numberOfQuestions" className="form-label">
                                        Number of Questions <span style={mystyle}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm mb-3"
                                        id="numberOfQuestions"
                                        name="numberOfQuestions"
                                        value={inputData.numberOfQuestions}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                </div>
                                <div className="d-flex justify-content-between mb-3 mt-4">
                                    <button
                                        type="reset"
                                        className="btn btn-sm"
                                        style={cancelStyle}
                                        onClick={handleReset}
                                        disabled={loading}
                                    >
                                        <FaEraser />  Reset
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={btnStyle}
                                        onClick={handleGenerateQuiz}
                                        disabled={loading}
                                    >
                                        Generate <FaArrowRight />
                                    </button>
                                </div>
                            </form>
                            </>
                        ) : (
                            <div>
                                {currentQuestions.length > 0 && (
                                    <>
                                        <div>
                                            <div className="d-flex justify-content-center mb-2 fw-bold" style={{ color: "red" }}>To regenerate any Question and Answer: You only have {regenerationAttempts} attempt!</div>
                                            {currentQuestions.map((question, index) => (
                                                <div key={index} className="card mb-3">
                                                    <div className="card-header">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value=""
                                                                id={`flexCheckDefault${question.id}`}
                                                                checked={selectedQuestions.includes(question.id)}
                                                                onChange={() => {
                                                                    const isApprovedOrAllSelected = approvalStatus[question.id] || selectedQuestions.length === userQuizQuestions.length;
                                                                    if (isApprovedOrAllSelected) {
                                                                        const updatedQuestions = selectedQuestions.includes(question.id)
                                                                            ? selectedQuestions.filter((id) => id !== question.id)
                                                                            : [...selectedQuestions, question.id];
                                                                        setSelectedQuestions(updatedQuestions);
                                                                    }
                                                                }}
                                                                disabled={!approvalStatus[question.id] && selectedQuestions.length !== userQuizQuestions.length}
                                                            />
                                                            <label className="form-check-label">
                                                                <h6 className="card-title">
                                                                    {indexOfFirstQuestion + index + 1}. {question.Question}
                                                                </h6>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="card-body fs-6">
                                                        A.{question['Answer 1']}
                                                        <span style={gapStyle}></span>
                                                        B.{question['Answer 2']}
                                                        <span style={gapStyle}></span>
                                                        C.{question['Answer 3']}
                                                        <span style={gapStyle}></span>
                                                        D.{question['Answer 4']}
                                                        <span className='d-flex justify-content-end mt-3 fst-italic fs-6'>
                                                            Correct Answer: {question['Correct Answer']}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="card-footer"
                                                        style={{
                                                            backgroundColor: approvalStatus[question.id]
                                                                ? '#D1FFBD'
                                                                : approvalStatus[question.id] === false
                                                                    ? ''
                                                                    : '',
                                                        }}
                                                    >
                                                        {approvalStatus[question.id] === true ? (
                                                            <div className="text-center">
                                                                Approved <FaCheckCircle />
                                                            </div>
                                                        ) : approvalStatus[question.id] === false ? (
                                                            <div className="d-flex justify-content-center">
                                                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleRegenerateQuestion(index)}>
                                                                    Regenerate <FaRandom />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="d-flex justify-content-between">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-success btn-sm"
                                                                    onClick={() => handleApprove(question.id)}
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleReject(question.id)}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="d-flex justify-content-between mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={backStyle}
                                        onClick={handleBack}
                                    >
                                        <FaArrowLeft /> Back
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={btnStyle}
                                        onClick={handleToggleSelectAll}
                                    >
                                        {selectedQuestions.length === 0
                                            ? 'Select All'
                                            : selectedQuestions.length === userQuizQuestions.length
                                                ? 'Unselect All'
                                                : 'Select All'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={pdfStyle}
                                        onClick={handleDownloadPdf}
                                        ref={downloadPdfRef}
                                    >
                                        Download PDF <FaDownload />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm"
                                        style={cancelStyle}
                                        onClick={handleCancel}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default QuizUI;
