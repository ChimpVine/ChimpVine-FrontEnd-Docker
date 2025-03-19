import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { toast } from 'react-toastify';
import { FaArrowRight, FaCloudDownloadAlt, FaFilePdf, FaEdit, FaArrowLeft, FaEraser } from "react-icons/fa";
import Spinner from '../../spinner/Spinner';
import MCQSingle from '../../pages/MCQSingle';
import MCQMultiple from '../../pages/MCQMultiple';
import TFSimple from '../../pages/TFSimple';
import FIBSingle from '../../pages/FIBSingle';
import FIBMultiple from '../../pages/FIBMultiple';
import MatchTermDef from '../../pages/MatchTermDef';
import ShortAnswerList from '../../pages/ShortAnswerList';
import ShortAnswerExplain from '../../pages/ShortAnswerExplain';
import LongAnswerExplain from '../../pages/LongAnswerExplain';
import ProblemSolving from '../../pages/ProblemSolving';
import SeqEvents from '../../pages/SeqEvents';
import { NavLink } from 'react-router-dom';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function WorkSheet({ BASE_URL }) {
    const navigate = useNavigate();
    const [selectedQuestionType, setSelectedQuestionType] = useState('');
    const [subOptions, setSubOptions] = useState([]);
    const [formData, setFormData] = useState({
        subject: '',
        grade: '',
        number: '',
        questionType: '',
        subQuestionType: '',
        topic: '',
        pdfFile: null,
    });
    const [apiResponse, setApiResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formVisible, setFormVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const subjects = [
        { value: "", label: "Choose a Subject" },
        { value: "english", label: "English" },
        { value: "Mathematics", label: "Mathematics" },
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

    const numbers = [
        { value: "", label: "Choose the Number of Questions" },
        { value: "5", label: "5" },
        { value: "10", label: "10" }
    ];

    const questionTypes = [
        { value: "", label: "Choose the Question Type" },
        { value: "MCQ", label: "MCQ" },
        { value: "TF_Simple", label: "True and False Statements" },
        { value: "Fill-in-the-Blanks", label: "Fill in the Blanks" },
        { value: "Match_Term_Def", label: "Matching Term and Definition" },
        { value: "Q&A", label: "Question and Answer" },
        { value: "Sequencing", label: "Sequencing" },
        { value: "Problem_Solving", label: "Problem Solving" }
    ];

    const subQuestionTypes = {
        MCQ: [
            { value: "", label: "Choose Sub Question Type" },
            { value: "MCQ_Single", label: "Single Correct Answer" },
            { value: "MCQ_Multiple", label: "Multiple Correct Answer" }
        ],
        "Fill-in-the-Blanks": [
            { value: "", label: "Choose the Sub Question Type" },
            { value: "FIB_Single", label: "Single Blank" },
            { value: "FIB_Multiple", label: "Multiple Blank" }
        ],
        "Q&A": [
            { value: "", label: "Choose the Sub Question Type" },
            { value: "Short_Answer_List", label: "Short Answer List" },
            { value: "Short_Answer_Explain", label: "Short Answer Brief Explanation" },
            { value: "Long_Answer_Explain", label: "Long Answer Brief Explanation" }
        ]
    };

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Assessment', active: true },
        { label: 'Worksheet', active: true }
    ];

    const handleQuestionTypeChange = (e) => {
        const selectedType = e.target.value;
        setSelectedQuestionType(selectedType);
        setSubOptions(subQuestionTypes[selectedType] || []);
        setFormData({
            ...formData,
            questionType: selectedType,
            subQuestionType: ''
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            pdfFile: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.subject) {
            toast.error('Please select a subject.');
            return;
        }
        if (!formData.grade) {
            toast.error('Please select a grade.');
            return;
        }
        if (!formData.number) {
            toast.error('Please select the number of questions.');
            return;
        }
        if (!formData.questionType) {
            toast.error('Please select a question type.');
            return;
        }
        if (subOptions.length > 0 && !formData.subQuestionType) {
            toast.error('Please select a sub-question type.');
            return;
        }
        if (!formData.topic) {
            toast.error('Please enter a topic.');
            return;
        }
        if (!formData.pdfFile) {
            toast.error('Please upload a PDF file.');
            return;
        }

        // Check the file size before generating the worksheet
        if (formData.pdfFile && formData.pdfFile.size > 500 * 1024) {
            toast.error('File size exceeds 500KB. Please upload a smaller file.');
            return;
        }

        // Retrieve cookies for headers
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        setLoading(true);
        setFormVisible(false);
        setApiResponse(null);
        setError(null);

        const formPayload = new FormData();
        formPayload.append('subject', formData.subject);
        formPayload.append('grade', formData.grade);
        formPayload.append('number', formData.number);
        formPayload.append('question-type', formData.questionType);
        formPayload.append('sub-question-type', formData.subQuestionType);
        formPayload.append('textarea', formData.topic);
        if (formData.pdfFile) {
            formPayload.append('pdf_file', formData.pdfFile);
        }

        try {
            const response = await axios.post(`${BASE_URL}/generate`, formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authToken}`,
                    'X-Site-Url': siteUrl
                },
            });
            setApiResponse(response.data);
            localStorage.setItem("worksheet", JSON.stringify(response.data));
            toast.success('Worksheet generated successfully!');
            setLoading(false);
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
                toast.error('Failed to generate worksheet!');
                setLoading(false);
                setFormVisible(true);
            }
        }
    };

    useEffect(() => {
        const savedWorksheet = localStorage.getItem("worksheet");
        if (savedWorksheet) {
            setApiResponse(JSON.parse(savedWorksheet));
        }
    }, []);

    const handleReset = () => {
        setFormData({
            subject: '',
            grade: '',
            number: '',
            questionType: '',
            subQuestionType: '',
            topic: '',
            pdfFile: null,
        });
        setSubOptions([]);
        setApiResponse(null);
        setError(null);
        setFormVisible(true);
        localStorage.removeItem("worksheet");
    };

    const generatePdf = (showAnswers, showHeader) => {
        const answerDivs = document.querySelectorAll('.answer');
        const headerContent = document.getElementById('headerContent');

        answerDivs.forEach(div => {
            div.style.display = showAnswers ? 'block' : 'none';
        });

        if (headerContent) {
            headerContent.style.display = showHeader ? 'none' : 'block';
        }

        window.print();

        answerDivs.forEach(div => {
            div.style.display = '';
        });

        if (headerContent) {
            headerContent.style.display = '';
        }
    };

    const handleEditButtonClick = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleUpdate = () => {
        localStorage.setItem("worksheet", JSON.stringify(apiResponse));
        toast.success('Worksheet updated successfully!');
        closeModal();
    };

    const pdfStyle = {
        backgroundColor: '#198754',
        color: 'white',
    }

    const btnStyle = {
        backgroundColor: '#FF683B',
        color: 'white'
    };

    const gapStyle = {
        marginBottom: '100px',
    };

    const cancelStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
    }

    const lineStyle = {
        display: "inline-block",
        width: "500px",
        height: "1px",
        backgroundColor: "black",
        borderBottom: "1px solid black",
    };

    const AdditionalStyle = {
        display: "inline-block",
        width: "570px",
        height: "1px",
        backgroundColor: "black",
        borderBottom: "1px solid black",
    };

    return (
        <>
            <NavBar />
            <div className="container-fluid">
                <div className="row justify-content-center mt-5 mb-4">
                    {loading ? (
                        <div className="col-md-5 text-center">
                            <Spinner />
                        </div>
                    ) : formVisible ? (
                        <>
                            <NavBreadcrumb items={breadcrumbItems} />
                            <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded">
                                <form onSubmit={handleSubmit}>
                                    <h4 className="text-center mb-3">Worksheet Planner</h4>
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
                                        >
                                            {grades.map((grade, index) => (
                                                <option key={index} value={grade.value}>
                                                    {grade.label}
                                                </option>
                                            ))}
                                        </select>

                                        <label htmlFor="number" className="form-label">
                                            Number of Questions <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <select
                                            className="form-select form-select-sm mb-3"
                                            id="number"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                        >
                                            {numbers.map((number, index) => (
                                                <option key={index} value={number.value}>
                                                    {number.label}
                                                </option>
                                            ))}
                                        </select>

                                        <label htmlFor="question-type" className="form-label">
                                            Question Type <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <select
                                            className="form-select form-select-sm mb-3"
                                            id="question-type"
                                            name="questionType"
                                            value={formData.questionType}
                                            onChange={handleQuestionTypeChange}
                                        >
                                            {questionTypes.map((element, index) => (
                                                <option key={index} value={element.value}>
                                                    {element.label}
                                                </option>
                                            ))}
                                        </select>

                                        {subOptions.length > 0 && (
                                            <>
                                                <label htmlFor="sub-question-type" className="form-label">
                                                    Sub Question Type <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <select
                                                    className="form-select form-select-sm mb-3"
                                                    id="sub-question-type"
                                                    name="subQuestionType"
                                                    value={formData.subQuestionType}
                                                    onChange={handleChange}
                                                >
                                                    {subOptions.map((element, index) => (
                                                        <option key={index} value={element.value}>
                                                            {element.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </>
                                        )}

                                        <label htmlFor="pdf_file" className="form-label">
                                            File Upload <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control form-control-sm mb-2"
                                            id="pdf_file"
                                            name="pdf_file"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                        />

                                        <label htmlFor="textarea" className="form-label">
                                            Topic <span style={{ color: 'red' }}>*</span>
                                        </label>
                                        <textarea
                                            type="text"
                                            className="form-control form-control-sm mb-2"
                                            placeholder="Briefly describe the file you are uploading (e.g. Arithmetic, History, or Ancient Egypt)"
                                            id="textarea"
                                            name="topic"
                                            value={formData.topic}
                                            onChange={handleChange}
                                        />

                                        <div className="mb-3">
                                            <small className="text-muted">
                                                <strong className='text-danger'>Note:</strong>
                                                <ul>
                                                    <li>For better results, Upload a <span style={{ color: 'red' }}>Workbook</span> PDF under 500KB.</li>
                                                    <li>To shorten a large PDF,<NavLink to="/pdf-splitter" target='_blank'>
                                                        <span style={{ fontWeight: 'bold' }}> Click here</span>
                                                    </NavLink></li>
                                                </ul>
                                            </small>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            style={cancelStyle}
                                            onClick={handleReset}
                                        >
                                            <FaEraser /> Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-sm"
                                            style={btnStyle}
                                            disabled={loading}
                                        >
                                            {loading ? 'Generating...' : 'Generate'} <FaArrowRight />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="container-fluid ps-4 pe-4">
                            <div id="headerContent" className='section'>
                                <div className="d-flex justify-content-between mt-5 mb-4">
                                    <h5>Name: <span style={{ display: "inline-block", width: "150px", height: "1px", backgroundColor: "black", borderBottom: "1px solid black" }}></span></h5>
                                    <h5>Date: <span style={{ display: "inline-block", width: "150px", height: "1px", backgroundColor: "black", borderBottom: "1px solid black" }}></span></h5>
                                </div>
                            </div>
                            {
                                apiResponse && apiResponse.worksheet && formData.questionType === 'MCQ' && formData.subQuestionType === 'MCQ_Single' && (
                                    <MCQSingle
                                        worksheet={apiResponse.worksheet}
                                        answers={apiResponse.answers}
                                        modalVisible={modalVisible}
                                        handleUpdate={handleUpdate}
                                        setApiResponse={setApiResponse}
                                        setModalVisible={setModalVisible}
                                    />
                                )
                            }
                            {
                                apiResponse && apiResponse.worksheet && formData.questionType === 'MCQ' && formData.subQuestionType === 'MCQ_Multiple' && (
                                    <MCQMultiple
                                        worksheet={apiResponse.worksheet}
                                        answers={apiResponse.answers}
                                        modalVisible={modalVisible}
                                        handleUpdate={handleUpdate}
                                        setApiResponse={setApiResponse}
                                        setModalVisible={setModalVisible}
                                    />
                                )
                            }
                            {
                                apiResponse && apiResponse.worksheet && formData.questionType === 'TF_Simple' && (
                                    <TFSimple
                                        worksheet={apiResponse.worksheet}
                                        answers={apiResponse.answers}
                                        modalVisible={modalVisible}
                                        handleUpdate={handleUpdate}
                                        setApiResponse={setApiResponse}
                                        setModalVisible={setModalVisible}
                                    />
                                )
                            }
                            {
                                apiResponse && apiResponse.worksheet && formData.questionType === 'Fill-in-the-Blanks' && formData.subQuestionType === 'FIB_Single' && (
                                    <FIBSingle
                                        worksheet={apiResponse.worksheet}
                                        answers={apiResponse.worksheet.answers}
                                        modalVisible={modalVisible}
                                        handleUpdate={handleUpdate}
                                        setApiResponse={setApiResponse}
                                        setModalVisible={setModalVisible}
                                    />
                                )
                            }
                            {
                                apiResponse && apiResponse.worksheet && formData.questionType === 'Fill-in-the-Blanks' && formData.subQuestionType === 'FIB_Multiple' && (
                                    <FIBMultiple
                                        worksheet={apiResponse.worksheet}
                                        answers={apiResponse.worksheet.answers}
                                        modalVisible={modalVisible}
                                        handleUpdate={handleUpdate}
                                        setApiResponse={setApiResponse}
                                        setModalVisible={setModalVisible}
                                    />
                                )
                            }
                            {
                                apiResponse && apiResponse.worksheet && formData.questionType === 'Match_Term_Def' && (
                                    <MatchTermDef
                                        worksheet={apiResponse.worksheet}
                                        answers={apiResponse.answers}
                                        modalVisible={modalVisible}
                                        handleUpdate={handleUpdate}
                                        setApiResponse={setApiResponse}
                                        setModalVisible={setModalVisible}
                                    />
                                )
                            }
                            {apiResponse && apiResponse.worksheet && formData.questionType === 'Q&A' && formData.subQuestionType === 'Short_Answer_List' && (
                                <ShortAnswerList
                                    worksheet={apiResponse.worksheet}
                                    answers={apiResponse.answers}
                                    lineStyle={lineStyle}
                                    AdditionalStyle={AdditionalStyle}
                                    setApiResponse={setApiResponse}
                                    handleUpdate={handleUpdate}
                                    modalVisible={modalVisible}
                                    setModalVisible={setModalVisible}
                                />
                            )}
                            {apiResponse && apiResponse.worksheet && formData.questionType === 'Q&A' && formData.subQuestionType === 'Short_Answer_Explain' && (
                                <ShortAnswerExplain
                                    worksheet={apiResponse.worksheet}
                                    answers={apiResponse.answers}
                                    lineStyle={lineStyle}
                                    AdditionalStyle={AdditionalStyle}
                                    setApiResponse={setApiResponse}
                                    handleUpdate={handleUpdate}
                                    modalVisible={modalVisible}
                                    setModalVisible={setModalVisible}
                                />
                            )}
                            {apiResponse && apiResponse.worksheet && formData.questionType === 'Q&A' && formData.subQuestionType === 'Long_Answer_Explain' && (
                                <LongAnswerExplain
                                    worksheet={apiResponse.worksheet}
                                    answers={apiResponse.answers}
                                    lineStyle={lineStyle}
                                    AdditionalStyle={AdditionalStyle}
                                    setApiResponse={setApiResponse}
                                    handleUpdate={handleUpdate}
                                    modalVisible={modalVisible}
                                    setModalVisible={setModalVisible}
                                />
                            )}
                            {apiResponse && apiResponse.worksheet && formData.questionType === 'Sequencing' && (
                                <SeqEvents
                                    worksheet={apiResponse.worksheet}
                                    answers={apiResponse.answers}
                                    setApiResponse={setApiResponse}
                                    handleUpdate={handleUpdate}
                                    modalVisible={modalVisible}
                                    setModalVisible={setModalVisible}
                                />
                            )}
                            {apiResponse && apiResponse.worksheet && formData.questionType === 'Problem_Solving' && (
                                <ProblemSolving
                                    worksheet={apiResponse.worksheet}
                                    answers={apiResponse.answers}
                                    gapStyle={gapStyle}
                                    setApiResponse={setApiResponse}
                                    handleUpdate={handleUpdate}
                                    modalVisible={modalVisible}
                                    setModalVisible={setModalVisible}
                                />
                            )}
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-sm me-3 mb-3 no-print"
                                    style={btnStyle}
                                    onClick={handleReset}>
                                    <FaArrowLeft /> Generate New Worksheet
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-warning me-3 mb-3 no-print"
                                    onClick={handleEditButtonClick}
                                >
                                    <FaEdit /> Edit WorkSheet
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-sm me-3 mb-3 no-print"
                                    style={pdfStyle}
                                    onClick={() => generatePdf(false, false)}
                                >
                                    <FaCloudDownloadAlt /> View Questions
                                </button>

                                {!(formData.subQuestionType === 'Short_Answer_List' ||
                                    formData.subQuestionType === 'Short_Answer_Explain' ||
                                    formData.subQuestionType === 'Long_Answer_Explain') && (
                                        <button
                                            type="button"
                                            className="btn btn-sm mb-3 no-print"
                                            style={pdfStyle}
                                            onClick={() => generatePdf(true, true)}
                                        >
                                            <FaFilePdf /> View Answers
                                        </button>
                                    )}
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}