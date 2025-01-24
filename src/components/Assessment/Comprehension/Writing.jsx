import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaArrowRight, FaEraser, FaArrowLeft,FaCloudDownloadAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../../../spinner/Spinner";
import NavBreadcrumb from "../../../pages/BreadCrumb/BreadCrumb";

export default function Writing({BASE_URL}) {
    const btnStyle = { backgroundColor: "#FF683B", color: "white" };
    const cancelStyle = { backgroundColor: "#dc3545", color: "white" };
    const pdfStyle = { backgroundColor: '#198754', color: 'white' };

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedQuestions, setGeneratedQuestions] = useState(null);

    const questionTypes = [
        { value: "", label: "Select Question Type" },
        { value: "essay", label: "Essay" },
        { value: "letter", label: "Letter" },
        { value: "data_interpretation", label: "Data Interpretation" },
        { value: "image_difference", label: "Image Difference" },
        { value: "story_telling", label: "Story Telling" },
    ];

    const difficulties = [
        { value: "", label: "Select Difficulty" },
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" },
    ];

    const numberOfQuestions = [
        { value: "", label: "Select Number of Questions" },
        { value: 5, label: "5" },
        { value: 10, label: "10" },
    ];

    const selectedQuestionType = watch("question_type");

    const breadcrumbItems = [
        { label: "Main Panel", href: "/ai-tools-for-teachers", active: false },
        { label: "Comprehension", href: "/comprehension", active: false },
        { label: "Writing", active: true },
    ];

    const onSubmit = async (formData) => {
        const payload = {
            topic: formData.topic,
            difficulty: formData.difficulty,
            type: formData.question_type,
            number_of_questions: parseInt(formData.number_of_questions) || null,
        };

        setIsLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/generate_writing`, payload);
            if (response.status === 200 && response.data.writing) {
                const writingData = response.data.writing;
                setGeneratedQuestions({
                    topic: writingData.topic,
                    difficulty: writingData.difficulty,
                    questions: writingData.questions.map((q) => q.question),
                });
                toast.success("Writing task generated successfully!");
            } else {
                toast.error("Failed to generate the writing task. Please try again.");
            }

        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to process the request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        const currentQuestionType = watch("question_type"); 
        reset(); 
        setValue("question_type", currentQuestionType); 
        setGeneratedQuestions(null); 
    };
    

    const generatePdf = () => {
        window.print();
      };

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                {isLoading ? (
                    <div className="col-md-5 text-center">
                        <Spinner />
                    </div>
                ) : generatedQuestions ? (
                    <div>
                        <h5 className="text-center mb-3">Generated Writing Task</h5>
                        <div>
                            <p><strong>Topic:</strong> {generatedQuestions.topic}</p>
                            <p><strong>Difficulty:</strong> {generatedQuestions.difficulty}</p>
                            <h6>Questions:</h6>
                            <ol>
                                {generatedQuestions.questions.map((q, index) => (
                                    <li key={index}>{q}</li>
                                ))}
                            </ol>
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm mt-2 mb-3 me-2 no-print" style={btnStyle}
                            onClick={handleReset}
                        >
                            <FaArrowLeft /> Generate Another
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm mt-2 mb-3 me-2 no-print"
                            style={pdfStyle}
                            onClick={generatePdf}
                        >
                            <FaCloudDownloadAlt /> View PDF
                        </button>
                    </div>
                ) : (
                    <>
                        <NavBreadcrumb items={breadcrumbItems} />
                        <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <h5 className="text-center mb-3">Writing Comprehension</h5>

                               
                                <label className="form-label">Question Type *</label>
                                <select
                                    className={`form-select form-select-sm ${errors.question_type ? "is-invalid" : ""}`}
                                    {...register("question_type", { required: "Question type is required" })}
                                >
                                    {questionTypes.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                {errors.question_type && <div className="invalid-feedback">{errors.question_type.message}</div>}

                               
                                {["essay", "letter"].includes(selectedQuestionType) && (
                                    <>
                                        <label className="form-label mt-2">Topic *</label>
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm ${errors.topic ? "is-invalid" : ""}`}
                                            placeholder="Enter Topic"
                                            {...register("topic", { required: "Topic is required" })}
                                        />
                                        {errors.topic && <div className="invalid-feedback">{errors.topic.message}</div>}
                                    </>
                                )}

                               
                                {selectedQuestionType && (
                                    <>
                                        <label className="form-label mt-2">Difficulty *</label>
                                        <select
                                            className={`form-select form-select-sm ${errors.difficulty ? "is-invalid" : ""}`}
                                            {...register("difficulty", { required: "Difficulty is required" })}
                                        >
                                            {difficulties.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        {errors.difficulty && <div className="invalid-feedback">{errors.difficulty.message}</div>}
                                    </>
                                )}

                                {["essay", "letter"].includes(selectedQuestionType) && (
                                    <>
                                        <label className="form-label mt-2">Number of Questions *</label>
                                        <select
                                            className={`form-select form-select-sm ${errors.number_of_questions ? "is-invalid" : ""}`}
                                            {...register("number_of_questions", { required: "Number of questions is required" })}
                                        >
                                            {numberOfQuestions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        {errors.number_of_questions && <div className="invalid-feedback">{errors.number_of_questions.message}</div>}
                                    </>
                                )}

                               
                                <div className="d-flex justify-content-between mt-3">
                                    <button type="button" className="btn btn-sm" style={cancelStyle} onClick={handleReset}>
                                        <FaEraser /> Reset
                                    </button>
                                    <button type="submit" className="btn btn-sm" style={btnStyle}>
                                        Generate <FaArrowRight />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

