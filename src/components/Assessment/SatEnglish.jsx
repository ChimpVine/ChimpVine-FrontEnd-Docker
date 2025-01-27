// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import NavBar from "../NavBar";
// import { FaArrowRight, FaEraser } from "react-icons/fa";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import Spinner from "../../spinner/Spinner";
// import NavBreadcrumb from "../../pages/BreadCrumb/BreadCrumb";
// import { useNavigate } from "react-router-dom";

// const questionTypes = [
//     { id: "Passage Reading", label: "Passage Reading" },
//     { id: "Data Interpretation", label: "Data Interpretation" },
//     { id: "Sentence Completion", label: "Sentence Completion" },
//     { id: "Writing & Language", label: "Writing & Language" },
// ];

// export default function SatEnglish() {
//     const navigate = useNavigate();
//     const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
//     const [isLoading, setIsLoading] = useState(false);
//     const [apiResponse, setApiResponse] = useState(null);
//     const [showAnswers, setShowAnswers] = useState(false);
//     const selectedTypes = watch("questionTypes") || [];

//     const btnStyle = { backgroundColor: "#FF683B", color: "white" };
//     const cancelStyle = { backgroundColor: "#dc3545", color: "white" };
//     const displayStyle = { display: "flex", gap: "15px", flexWrap: "wrap" };

//     useEffect(() => {
//         questionTypes.forEach((type) => {
//             if (!selectedTypes.includes(type.id)) {
//                 setValue(type.id, "");
//             }
//         });
//     }, [selectedTypes, setValue]);

//     const onSubmit = async (data) => {
//         setIsLoading(true);
//         setApiResponse(null);

//         const payload = { selected_types: data.questionTypes || [] };

//         try {
//             const response = await axios.post("http://127.0.0.1:5000/generate/english", payload);
//             console.log("API Response:", response.data); // Debugging
//             setApiResponse(response.data);
//             toast.success("SAT English generated successfully!");
//         } catch (error) {
//             console.error("Error:", error); // Debugging
//             toast.error("Failed to generate SAT English questions. Please try again.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const renderResponse = () => {
//         if (!apiResponse) return null;

//         const { main } = apiResponse;
//         if (!main) return <p>No data available.</p>;

//         const { passage_result, data_result, sentence_result, writing_result } = main;

//         return (
//             <div className="col-md-10 mt-2">
//                 {selectedTypes.includes("Passage Reading") && passage_result?.passage && (
//                     <>
//                         <h5 className="fw-bold">Passage Reading</h5>
//                         <p>{passage_result.passage.text}</p>
//                         {passage_result.questions.map((q, idx) => (
//                             <div key={idx} className="mb-3">
//                                 <p>
//                                     <strong>Q{idx + 1}:</strong> {q.question}
//                                 </p>
//                                 <div style={displayStyle}>
//                                     {Object.entries(q.options).map(([key, value]) => (
//                                         <div key={key}>
//                                             {key}: {value}
//                                         </div>
//                                     ))}
//                                 </div>
//                                 {showAnswers && <p><strong>Answer:</strong> {q.correct_answer}</p>}
//                             </div>
//                         ))}
//                     </>
//                 )}

//                 {selectedTypes.includes("Data Interpretation") && data_result?.data_table && (
//                     <>
//                         <h5 className="fw-bold">Data Interpretation</h5>
//                         <table className="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th>Month</th>
//                                     <th>Sales</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {data_result.data_table.sales_data.map((data, index) => (
//                                     <tr key={index}>
//                                         <td>{data.month}</td>
//                                         <td>{data.sales}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         {data_result.questions.map((q, idx) => (
//                             <div key={idx} className="mb-3">
//                                 <p>
//                                     <strong>Q{idx + 1}:</strong> {q.question}
//                                 </p>
//                                 <div style={displayStyle}>
//                                     {Object.entries(q.options).map(([key, value]) => (
//                                         <div key={key}>
//                                             {key}: {value}
//                                         </div>
//                                     ))}
//                                 </div>
//                                 {showAnswers && <p><strong>Answer:</strong> {q.correct_answer}</p>}
//                             </div>
//                         ))}
//                     </>
//                 )}

//                 {selectedTypes.includes("Sentence Completion") && sentence_result?.sentence_completion && (
//                     <>
//                         <h5 className="fw-bold">Sentence Completion</h5>
//                         <p>{sentence_result.sentence_completion.sentence}</p>
//                         <div style={displayStyle}>
//                             {Object.entries(sentence_result.sentence_completion.options).map(([key, value]) => (
//                                 <div key={key}>
//                                     {key}: {value}
//                                 </div>
//                             ))}
//                         </div>
//                         {showAnswers && (
//                             <p><strong>Answer:</strong> {sentence_result.sentence_completion.correct_answer}</p>
//                         )}
//                     </>
//                 )}

//                 {selectedTypes.includes("Writing & Language") && writing_result && (
//                     <>
//                         <h5 className="fw-bold">Writing & Language</h5>
//                         <p>{writing_result.sentence}</p>
//                         <p>{writing_result.question}</p>
//                         <div style={displayStyle}>
//                             {Object.entries(writing_result.options).map(([key, value]) => (
//                                 <div key={key}>
//                                     {key}: {value}
//                                 </div>
//                             ))}
//                         </div>
//                         {showAnswers && <p><strong>Answer:</strong> {writing_result.correct_answer}</p>}
//                     </>
//                 )}
//             </div>
//         );
//     };

//     const breadcrumbItems = [
//         { label: "Main Panel", href: "/ai-tools-for-teachers", active: false },
//         { label: "Assessment", active: true },
//         { label: "SAT English", active: true },
//     ];

//     return (
//         <>
//             <NavBar id="main-nav" />
//             <div className="container-fluid">
//                 <div className="row justify-content-center mt-5 mb-4">
//                     {isLoading ? (
//                         <div className="col-md-5 text-center">
//                             <Spinner />
//                         </div>
//                     ) : !apiResponse ? (
//                         <>
//                             <NavBreadcrumb items={breadcrumbItems} />
//                             <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded no-print">
//                                 <form onSubmit={handleSubmit(onSubmit)}>
//                                     <h4 className="text-center mb-3">SAT English Generator</h4>
//                                     <div className="mb-2">
//                                         <label className="form-label">
//                                             Question Types <span className="text-danger">*</span>
//                                         </label>
//                                         {questionTypes.map((type) => (
//                                             <div key={type.id} className="form-check">
//                                                 <input
//                                                     type="checkbox"
//                                                     className="form-check-input"
//                                                     id={type.id}
//                                                     value={type.id}
//                                                     {...register("questionTypes", {
//                                                         validate: (value) =>
//                                                             value.length > 0 || "At least one question type is required",
//                                                     })}
//                                                 />
//                                                 <label className="form-check-label" htmlFor={type.id}>
//                                                     {type.label}
//                                                 </label>
//                                             </div>
//                                         ))}
//                                         {errors.questionTypes && (
//                                             <div className="invalid-feedback d-block">
//                                                 {errors.questionTypes.message}
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="d-flex justify-content-between mt-3">
//                                         <button
//                                             type="button"
//                                             className="btn btn-sm"
//                                             style={cancelStyle}
//                                             onClick={() => reset()}
//                                             disabled={isLoading}
//                                         >
//                                             <FaEraser /> Reset
//                                         </button>
//                                         <button
//                                             type="submit"
//                                             className="btn btn-sm"
//                                             style={btnStyle}
//                                             disabled={isLoading}
//                                         >
//                                             Generate <FaArrowRight />
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </>
//                     ) : (
//                         renderResponse()
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../NavBar";
import { FaArrowRight, FaEraser, FaArrowLeft, FaCloudDownloadAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Spinner from "../../spinner/Spinner";
import NavBreadcrumb from "../../pages/BreadCrumb/BreadCrumb";
import { useNavigate } from "react-router-dom";

const questionTypes = [
    { id: "Passage Reading", label: "Passage Reading" },
    { id: "Data Interpretation", label: "Data Interpretation" },
    { id: "Sentence Completion", label: "Sentence Completion" },
    { id: "Writing & Language", label: "Writing & Language" },
];

export default function SatEnglish() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [showAnswers, setShowAnswers] = useState(false);
    const selectedTypes = watch("questionTypes") || [];

    const btnStyle = { backgroundColor: "#FF683B", color: "white" };
    const cancelStyle = { backgroundColor: "#dc3545", color: "white" };
    const pdfStyle = { backgroundColor: "#17a2b8", color: "white" };
    const displayStyle = { display: "flex", gap: "15px", flexWrap: "wrap" };

    useEffect(() => {
        questionTypes.forEach((type) => {
            if (!selectedTypes.includes(type.id)) {
                setValue(type.id, "");
            }
        });
    }, [selectedTypes, setValue]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiResponse(null);

        const payload = { selected_types: data.questionTypes || [] };

        try {
            const response = await axios.post("http://127.0.0.1:5000/generate/english", payload);
            console.log("API Response:", response.data); 
            setApiResponse(response.data);
            toast.success("SAT English generated successfully!");
        } catch (error) {
            console.error("Error:", error); 
            toast.error("Failed to generate SAT English questions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadQuestions = () => {

        toast.info("Download functionality is not yet implemented.");
    };

    const toggleAnswers = () => {
        setShowAnswers((prev) => !prev);
    };

    const renderResponse = () => {
        if (!apiResponse) return null;

        const { main } = apiResponse;
        if (!main) return <p>No data available.</p>;

        const { passage_result, data_result, sentence_result, writing_result } = main;

        return (
            <div className="col-md-10 mt-2">
                 <h4 className="text-center">SAT English</h4>
                {selectedTypes.includes("Passage Reading") && passage_result?.passage && (
                    <>
                        <h5 className="fw-bold">Passage Reading</h5>
                        <p>{passage_result.passage.text}</p>
                        {passage_result.questions.map((q, idx) => (
                            <div key={idx} className="mb-3">
                                <p>
                                    <strong>Q{idx + 1}:</strong> {q.question}
                                </p>
                                <div style={displayStyle}>
                                    {Object.entries(q.options).map(([key, value]) => (
                                        <div key={key}>
                                            {key}: {value}
                                        </div>
                                    ))}
                                </div>
                                {showAnswers && (
                                    <p className="mt-4">
                                        <strong>Answer: {q.correct_answer}</strong>
                                    </p>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {selectedTypes.includes("Data Interpretation") && data_result?.data_table && (
                    <>
                        <h5 className="fw-bold">Data Interpretation</h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th>Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data_result.data_table.sales_data.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.month}</td>
                                        <td>{data.sales}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {data_result.questions.map((q, idx) => (
                            <div key={idx} className="mb-3">
                                <p>
                                    <strong>Q{idx + 1}:</strong> {q.question}
                                </p>
                                <div style={displayStyle}>
                                    {Object.entries(q.options).map(([key, value]) => (
                                        <div key={key}>
                                            {key}: {value}
                                        </div>
                                    ))}
                                </div>
                                {showAnswers && (
                                    <p className="mt-4">
                                        <strong>Answer: {q.correct_answer}</strong>
                                    </p>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {selectedTypes.includes("Sentence Completion") && sentence_result?.sentence_completion && (
                    <>
                        <h5 className="fw-bold">Sentence Completion</h5>
                        <p>{sentence_result.sentence_completion.sentence}</p>
                        <div style={displayStyle}>
                            {Object.entries(sentence_result.sentence_completion.options).map(([key, value]) => (
                                <div key={key}>
                                    {key}: {value}
                                </div>
                            ))}
                        </div>
                        {showAnswers && (
                            <p className="mt-4">
                                <strong>Answer: {sentence_result.sentence_completion.correct_answer}</strong>
                            </p>
                        )}
                    </>
                )}

                {selectedTypes.includes("Writing & Language") && writing_result && (
                    <>
                        <h5 className="fw-bold">Writing & Language</h5>
                        <p>{writing_result.sentence}</p>
                        <p>{writing_result.question}</p>
                        <div style={displayStyle}>
                            {Object.entries(writing_result.options).map(([key, value]) => (
                                <div key={key}>
                                    {key}: {value}
                                </div>
                            ))}
                        </div>
                        {showAnswers && (
                            <p className="mt-4">
                                <strong>Answer: {writing_result.correct_answer}</strong>
                            </p>
                        )}
                    </>
                )}
                <div className="text-center mt-4">
                    <button
                        className="btn btn-sm me-2 mt-2 no-print"
                        style={btnStyle}
                        onClick={() => setApiResponse(null)}
                    >
                        <FaArrowLeft /> Generate Another SAT English
                    </button>
                    <button
                        className="btn btn-sm me-2 mt-2 no-print"
                        style={pdfStyle}
                        onClick={handleDownloadQuestions}
                    >
                        <FaCloudDownloadAlt /> Download Questions
                    </button>
                    <button
                        className="btn btn-warning btn-sm mt-2 no-print"
                        onClick={toggleAnswers}
                    >
                        <FaCloudDownloadAlt /> {showAnswers ? 'Hide Answers' : 'Show Answers'}
                    </button>
                </div>
            </div>
        );
    };

    const breadcrumbItems = [
        { label: "Main Panel", href: "/ai-tools-for-teachers", active: false },
        { label: "Assessment", active: true },
        { label: "SAT English", active: true },
    ];

    return (
        <>
            <NavBar id="main-nav" />
            <div className="container-fluid">
                <div className="row justify-content-center mt-5 mb-4">
                    {isLoading ? (
                        <div className="col-md-5 text-center">
                            <Spinner />
                        </div>
                    ) : !apiResponse ? (
                        <>
                            <NavBreadcrumb items={breadcrumbItems} />
                            <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded no-print">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h4 className="text-center mb-3">SAT English Generator</h4>
                                    <div className="mb-2">
                                        <label className="form-label">
                                            Question Types <span className="text-danger">*</span>
                                        </label>
                                        {questionTypes.map((type) => (
                                            <div key={type.id} className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={type.id}
                                                    value={type.id}
                                                    {...register("questionTypes", {
                                                        validate: (value) =>
                                                            value.length > 0 || "At least one question type is required",
                                                    })}
                                                />
                                                <label className="form-check-label" htmlFor={type.id}>
                                                    {type.label}
                                                </label>
                                            </div>
                                        ))}
                                        {errors.questionTypes && (
                                            <div className="invalid-feedback d-block">
                                                {errors.questionTypes.message}
                                            </div>
                                        )}
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
                        renderResponse()
                    )}
                </div>
            </div>
        </>
    );
}

