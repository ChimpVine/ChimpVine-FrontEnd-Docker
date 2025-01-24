import React, { useState } from 'react';

const MatchTermDef = ({ worksheet, answers, modalVisible, handleUpdate, setApiResponse }) => {
  const [errors, setErrors] = useState({}); // State to store validation errors

  // Validation function to ensure no question, options, or answers are empty
  const validateWorksheet = () => {
    const newErrors = {};

    // Validate the question
    if (!worksheet.question.trim()) {
      newErrors.question = "Question cannot be empty.";
    }

    // Validate options A
    worksheet.options.A.forEach((option, index) => {
      if (!option.trim()) {
        newErrors.options = newErrors.options || { A: {}, B: {} };
        newErrors.options.A[index] = "Option A cannot be empty.";
      }
    });

    // Validate options B
    worksheet.options.B.forEach((option, index) => {
      if (!option.trim()) {
        newErrors.options = newErrors.options || { A: {}, B: {} };
        newErrors.options.B[index] = "Option B cannot be empty.";
      }
    });

    // Validate answers
    answers.forEach((answer, index) => {
      if (!answer.trim()) {
        newErrors.answers = newErrors.answers || {};
        newErrors.answers[index] = "Answer cannot be empty.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced handleUpdate function with validation
  const handleUpdateWithValidation = () => {
    if (validateWorksheet()) {
      handleUpdate(); // Proceed to save changes if validation passes
    }
  };

  const handleOptionChange = (column, index, newOption) => {
    const updatedWorksheet = { ...worksheet };
    updatedWorksheet.options[column][index] = newOption; // Update the specific option
    setApiResponse((prevState) => ({
      ...prevState,
      worksheet: updatedWorksheet,
    }));

    // Clear the error for the option if it was resolved
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors.options?.[column]?.[index]) {
        delete updatedErrors.options[column][index];
        if (Object.keys(updatedErrors.options[column]).length === 0) {
          delete updatedErrors.options[column];
        }
        if (Object.keys(updatedErrors.options).length === 0) {
          delete updatedErrors.options;
        }
      }
      return updatedErrors;
    });
  };

  const handleAnswerChange = (index, newAnswer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = newAnswer;
    setApiResponse((prevState) => ({
      ...prevState,
      answers: updatedAnswers,
    }));

    // Clear the error for the answer if it was resolved
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors.answers?.[index]) {
        delete updatedErrors.answers[index];
        if (Object.keys(updatedErrors.answers).length === 0) {
          delete updatedErrors.answers;
        }
      }
      return updatedErrors;
    });
  };

  const handleQuestionChange = (newQuestion) => {
    const updatedWorksheet = { ...worksheet };
    updatedWorksheet.question = newQuestion;
    setApiResponse((prevState) => ({
      ...prevState,
      worksheet: updatedWorksheet,
    }));

    // Clear the error for the question if it was resolved
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors.question) {
        delete updatedErrors.question;
      }
      return updatedErrors;
    });
  };

  return (
    <>
      <div className="mb-5">
        <h4 className="mb-5">
          <strong>{worksheet.question}</strong>
        </h4>
        <div className="row">
          <div className="col-md-6">
            <p><strong>Options A</strong></p>
            {worksheet.options.A.map((option, index) => (
              <div key={index}>
                <strong>{index + 1}.</strong> {option}
              </div>
            ))}
          </div>
          <div className="col-md-6">
            <p><strong>Options B</strong></p>
            {worksheet.options.B.map((option, index) => (
              <div key={index}>
                <strong>{index + 1}.</strong> {option}
              </div>
            ))}
          </div>
          <div className="answer mt-5">
            <strong>Correct Answers: </strong>
            {answers.map((answer, index) => (
              <div key={index}>{answer}</div>
            ))}
          </div>
        </div>
      </div>

      {modalVisible && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" role="dialog" tabIndex="-1">
            <div className="modal-dialog modal-dialog-scrollable" style={{ maxWidth: "80%" }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Match Term & Definition Worksheet</h5>
                </div>
                <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Question</label>
                    <input
                      type="text"
                      className={`form-control ${errors.question ? "is-invalid" : ""}`}
                      value={worksheet.question}
                      onChange={(e) => handleQuestionChange(e.target.value)}
                    />
                    {errors.question && (
                      <div className="invalid-feedback">{errors.question}</div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Edit Options A</strong></p>
                      {worksheet.options.A.map((option, index) => (
                        <div key={index} className="input-group mb-2">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.options?.A?.[index] ? "is-invalid" : ""
                            }`}
                            value={option}
                            onChange={(e) => handleOptionChange("A", index, e.target.value)}
                          />
                          {errors.options?.A?.[index] && (
                            <div className="invalid-feedback">{errors.options.A[index]}</div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="col-md-6">
                      <p><strong>Edit Options B</strong></p>
                      {worksheet.options.B.map((option, index) => (
                        <div key={index} className="input-group mb-2">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.options?.B?.[index] ? "is-invalid" : ""
                            }`}
                            value={option}
                            onChange={(e) => handleOptionChange("B", index, e.target.value)}
                          />
                          {errors.options?.B?.[index] && (
                            <div className="invalid-feedback">{errors.options.B[index]}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="form-label fw-bold">Correct Answers</label>
                    {answers.map((answer, index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.answers?.[index] ? "is-invalid" : ""
                          }`}
                          value={answer}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                        />
                        {errors.answers?.[index] && (
                          <div className="invalid-feedback">{errors.answers[index]}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" onClick={handleUpdateWithValidation}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MatchTermDef;
