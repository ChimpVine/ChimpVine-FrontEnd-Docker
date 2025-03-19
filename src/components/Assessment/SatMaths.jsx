import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../NavBar";
import { FaArrowRight, FaEraser, FaArrowLeft, FaCloudDownloadAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Spinner from "../../spinner/Spinner";
import NavBreadcrumb from "../../pages/BreadCrumb/BreadCrumb";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const difficulties = [
  { value: "", label: "Choose a Difficulty" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const questionTypes = [
  { id: "No-Calculator Multiple Choice", label: "No-Calculator Multiple Choice" },
  { id: "No-Calculator Open Response", label: "No-Calculator Open Response" },
  { id: "Calculator Multiple Choice", label: "Calculator Multiple Choice" },
  { id: "Calculator Open Response", label: "Calculator Open Response" },
];

export default function SatMath({ BASE_URL }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const selectedTypes = watch("questionTypes") || [];
  const btnStyle = { backgroundColor: "#FF683B", color: "white" };
  const cancelStyle = { backgroundColor: "#dc3545", color: "white" };
  const pdfStyle = { backgroundColor: "#198754", color: "white" };
  const displayStyle = { display: "flex", gap: "15px", flexWrap: "wrap" };

  useEffect(() => {
    questionTypes.forEach((type) => {
      if (!selectedTypes.includes(type.id)) {
        setValue(type.id, "");
      }
    });
  }, [selectedTypes, setValue]);

  const onSubmit = async (data) => {
    const authToken = Cookies.get('authToken');
    const siteUrl = Cookies.get('site_url');

    setIsLoading(true);
    setApiResponse(null);

    const payload = {
      topic: data.topic,
      difficulty: data.difficulty,
      "No-Calculator Multiple Choice": data["No-Calculator Multiple Choice"] || 0,
      "No-Calculator Open Response": data["No-Calculator Open Response"] || 0,
      "Calculator Multiple Choice": data["Calculator Multiple Choice"] || 0,
      "Calculator Open Response": data["Calculator Open Response"] || 0,
    };

    try {
      const response = await axios.post(`${BASE_URL}/SAT_maths`, payload, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authToken}`,
          'X-Site-Url': siteUrl
        },
      });
      setApiResponse(response.data.exam);
      toast.success("SAT Maths generated successfully!");
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
        toast.error('Failed to generate, Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generatePdf = () => window.print();

  const handleDownloadQuestions = () => {
    setShowAnswers(false);
    generatePdf();
  };

  const toggleAnswers = () => setShowAnswers(!showAnswers);

  const breadcrumbItems = [
    { label: "Main Panel", href: "/ai-tools-for-teachers", active: false },
    { label: "Assessment", active: true },
    { label: "SAT Maths", active: true },
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
                  <h4 className="text-center mb-3">SAT Maths Generator</h4>
                  <div className="mb-2">
                    <label htmlFor="topic" className="form-label">
                      Topic <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm mb-2 ${errors.topic ? "is-invalid" : ""}`}
                      id="topic"
                      placeholder="Enter your topic"
                      {...register("topic", { required: "Topic is required" })}
                    />
                    {errors.topic && <div className="invalid-feedback">{errors.topic.message}</div>}
                  </div>


                  <div className="mb-2">
                    <label htmlFor="difficulty" className="form-label">
                      Difficulty <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select form-select-sm mb-2 ${errors.difficulty ? "is-invalid" : ""}`}
                      id="difficulty"
                      {...register("difficulty", { required: "Difficulty is required" })}
                    >
                      {difficulties.map((diff) => (
                        <option key={diff.value} value={diff.value}>
                          {diff.label}
                        </option>
                      ))}
                    </select>
                    {errors.difficulty && <div className="invalid-feedback">{errors.difficulty.message}</div>}
                  </div>


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
                            validate: (value) => value.length > 0 || "At least one question type is required",
                          })}
                        />
                        <label className="form-check-label" htmlFor={type.id}>
                          {type.label}
                        </label>
                      </div>
                    ))}
                    {errors.questionTypes && (
                      <div className="invalid-feedback d-block">{errors.questionTypes.message}</div>
                    )}
                  </div>


                  {selectedTypes.map((type) => (
                    <div key={type} className="mb-2">
                      <label htmlFor={`numQuestions_${type}`} className="form-label">
                        Number of Questions for {questionTypes.find((q) => q.id === type)?.label}
                      </label>
                      <select
                        className={`form-select form-select-sm ${errors[type] ? "is-invalid" : ""}`}
                        id={`numQuestions_${type}`}
                        {...register(type, {
                          required: `Number of questions is required for ${type}`,
                        })}
                      >
                        <option value="">Select Number</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      {errors[type] && (
                        <div className="invalid-feedback">{errors[type]?.message}</div>
                      )}
                    </div>
                  ))}


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
            <div className="col-md-10 mt-2">
              <h4 className="text-center">{apiResponse.title}</h4>
              {apiResponse.sections.map((section, index) => (
                <div key={index} className="mt-4">
                  <h5 className="fw-bold">{section.section}</h5>
                  {section.questions.map((question) => (
                    <div key={question.question_number} className="mb-2">
                      <p>
                        <strong>Q{question.question_number}:</strong> {question.question}
                      </p>
                      {question.options && (
                        <div style={displayStyle}>
                          {question.options.map((option, idx) => (
                            <div key={idx}>{option}</div>
                          ))}
                        </div>
                      )}
                      {showAnswers && (
                        <p className="mt-4">
                          <strong>Answer:{showAnswers ? question.correct_answer : ''}</strong>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <div className="text-center mt-4">
                <button className="btn btn-sm mt-2 me-2 no-print"
                  style={btnStyle}
                  onClick={() => {
                    setApiResponse(null);
                    setShowAnswers(false);
                  }}>
                  <FaArrowLeft /> Generate Another SAT Maths
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
          )}
        </div>
      </div>
    </>
  );
}
