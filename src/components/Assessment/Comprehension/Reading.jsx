import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaArrowRight, FaEraser, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../../../spinner/Spinner";
import NavBreadcrumb from "../../../pages/BreadCrumb/BreadCrumb";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Reading({BASE_URL}) {
    const navigate = useNavigate();
    const btnStyle = { backgroundColor: "#FF683B", color: "white" };
    const cancelStyle = { backgroundColor: "#dc3545", color: "white" };

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const questionTypes = [
        { value: "true_false", label: "True/False" },
        { value: "mcq", label: "Multiple Choice Questions" },
        { value: "fill_in_the_blanks", label: "Fill in the Blanks" },
        { value: "question_answer", label: "Question & Answer" },
    ];

    const questionsPerTypeOptions = [5, 10, 15, 20];

    const [apiResponse, setApiResponse] = useState(null);
    const [questionsResponse, setQuestionsResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isQuestionLoading, setIsQuestionLoading] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState({});
    const [numQuestions, setNumQuestions] = useState(5);

    const breadcrumbItems = [
        { label: "Main Panel", href: "/ai-tools-for-teachers", active: false },
        { label: "Comprehension", href: "/comprehension", active: false },
        { label: "Reading", active: true },
    ];

    const handleCheckboxChange = (type) => {
        setSelectedQuestions((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleNumQuestionsChange = (value) => {
        setNumQuestions(parseInt(value, 10));
    };

    const onSubmit = async (formData) => {
        const { topic, difficulty, number_of_words } = formData;
        const payload = { topic, difficulty, no_of_words: parseInt(number_of_words) };
        const authToken = Cookies.get("authToken");
        const siteUrl = Cookies.get("site_url");

        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/generate_passage`, payload, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "X-Site-Url": siteUrl,
                    "Content-Type": "application/json",
                },
            });
            setApiResponse(response.data);
            reset();
            toast.success("Reading Passage generated successfully!");
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onGenerateQuestions = async () => {
        const checkedTypes = Object.keys(selectedQuestions).filter((key) => selectedQuestions[key]);

        if (checkedTypes.length === 0) {
            toast.error("Please select at least one question type.");
            return;
        }

        // Map frontend keys to backend labels
        const questionTypeMapping = {
            true_false: "True/False",
            mcq: "MCQs",
            fill_in_the_blanks: "Fill in the Blanks",
            question_answer: "Question/Answer",
        };

        const mappedTypes = checkedTypes.map((type) => questionTypeMapping[type]);

        const payload = {
            passage: apiResponse.passage.reading.main.passage,
            selected_questions: mappedTypes,
            questions_per_type: numQuestions,
        };

        setIsQuestionLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/generate_question`, payload);
            setQuestionsResponse(response.data);
            toast.success("Questions generated successfully!");
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsQuestionLoading(false);
        }
    };

    const handleApiError = (error) => {
        if (error.response?.status === 401) {
            toast.warning("Session expired. Please login again.");
            Cookies.remove("authToken");
            navigate("/login");
            window.location.reload();
        } else {
            toast.error("Failed to process the request. Please try again.");
        }
    };

    const renderQuestions = (type, questions) => {
        if (type === "true_false") {
            return passage.questions.map((q, index) => (
                <div key={index} className="mb-3">
                    <p><strong>Q{index + 1}: {q.passage.question}</strong></p>
                    <p><strong>Answer:</strong> {q.passage.answer}</p>
                    <p><em>{q.explanation}</em></p>
                </div>
            ));
        }

        if (type === "mcq") {
            return questions.map((q, index) => (
                <div key={index} className="mb-3">
                    <p><strong>Q{index + 1}: {q.passage.question}</strong></p>
                    <ul>
                        {q.options.map((option, i) => (
                            <li key={i}>{option}</li>
                        ))}
                    </ul>
                    <p><strong>Answer:</strong> {q.passage.answer}</p>
                </div>
            ));
        }

        if (type === "fill_in_the_blanks") {
            return questions.map((q, index) => (
                <div key={index} className="mb-3">
                    <p><strong>Q{index + 1}: {q.passage.question}</strong></p>
                    <p><strong>Answer:</strong> {q.passage.answer}</p>
                </div>
            ));
        }

        if (type === "question_answer") {
            return questions.map((q, index) => (
                <div key={index} className="mb-3">
                    <p><strong>Q{index + 1}: {q.passage.question}</strong></p>
                    <p><strong>Answer:</strong> {q.passage.answer}</p>
                </div>
            ));
        }

        return null;
    };

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                {isLoading || isQuestionLoading ? (
                    <div className="col-md-5 text-center"><Spinner /></div>
                ) : !apiResponse ? (
                    <>
                        <NavBreadcrumb items={breadcrumbItems} />
                        <div className="col-md-5 border rounded-3 p-4 shadow no-print">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <h5 className="text-center mb-3">Reading Comprehension</h5>
                                <label className="form-label">Topic *</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.topic ? "is-invalid" : ""}`}
                                    placeholder="Enter Topic"
                                    {...register("topic", { required: "Topic is required" })}
                                />
                                {errors.topic && <div className="invalid-feedback">{errors.topic.message}</div>}

                                <label className="form-label mt-2">Difficulty *</label>
                                <select
                                    className={`form-select form-select-sm ${errors.difficulty ? "is-invalid" : ""}`}
                                    {...register("difficulty", { required: "Difficulty is required" })}
                                >
                                    <option value="">Select Difficulty</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                                {errors.difficulty && <div className="invalid-feedback">{errors.difficulty.message}</div>}

                                <label className="form-label mt-2">Number of Words *</label>
                                <select
                                    className={`form-select form-select-sm ${errors.number_of_words ? "is-invalid" : ""}`}
                                    {...register("number_of_words", { required: "Select number of words" })}
                                >
                                    <option value="">Select Number of Words</option>
                                    <option value="500">500</option>
                                    <option value="600">600</option>
                                    <option value="700">700</option>
                                    <option value="800">800</option>
                                    <option value="900">900</option>
                                    <option value="1000">1000</option>
                                </select>
                                {errors.number_of_words && <div className="invalid-feedback">{errors.number_of_words.message}</div>}

                                <div className="d-flex justify-content-between mt-3">
                                    <button type="button" className="btn btn-sm" style={cancelStyle} onClick={() => reset()}>
                                        <FaEraser /> Reset
                                    </button>
                                    <button type="submit" className="btn btn-sm" style={btnStyle}>
                                        Generate <FaArrowRight />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : !questionsResponse ? (
                    <div className="mt-3">
                        <p><strong>Difficulty:</strong> {apiResponse.passage.reading.difficulty}</p>
                        <p><strong>Topic:</strong> {apiResponse.passage.reading.topic}</p>
                        <p><strong>Number of Words:</strong> {apiResponse.passage.reading.no_of_words}</p>
                        <h5>Passage Details:</h5>
                        <p>{apiResponse.passage.reading.main.passage}</p>
                        <div className="border rounded-3 p-4 mb-4">
                            <form onSubmit={handleSubmit(onGenerateQuestions)}>
                                <h5>Select Question Types:</h5>
                                <div className="d-flex flex-wrap gap-3">
                                    {questionTypes.map(({ value, label }) => (
                                        <div key={value} className="form-check form-check-inline">
                                            <input
                                                type="checkbox"
                                                id={value}
                                                checked={selectedQuestions[value] || false}
                                                onChange={() => handleCheckboxChange(value)}
                                                className="form-check-input"
                                            />
                                            <label htmlFor={value} className="form-check-label">{label}</label>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2">
                                    <label>Number of Questions:</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={numQuestions}
                                        onChange={(e) => handleNumQuestionsChange(e.target.value)}
                                    >
                                        <option value="">Select Number of Questions</option>
                                        {questionsPerTypeOptions.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="text-center mt-3">
                            <button className="btn btn-sm me-2" style={btnStyle} onClick={() => setApiResponse(null)}>
                                <FaArrowLeft /> Back
                            </button>
                            <button className="btn btn-sm" style={btnStyle} type="submit"  onClick={onGenerateQuestions}>
                                Generate Questions <FaArrowRight />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-3">
                        {Object.entries(questionsResponse).map(([type, questions]) => (
                            <div key={type} className="mb-4">
                                <h5>{type.replace(/_/g, " ")}</h5>
                                {renderQuestions(type, questions)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


