import React, { useState } from 'react';

const FIBSingle = ({ worksheet, answers, modalVisible, handleUpdate, setApiResponse, setModalVisible }) => {
  const [errors, setErrors] = useState({}); // State to store validation errors

  // Validation function to ensure no question or answer is empty
  const validateWorksheet = () => {
    const newErrors = {};

    // Validate questions
    worksheet.question.forEach((question, index) => {
      if (!question.trim()) {
        newErrors[index] = newErrors[index] || {};
        newErrors[index].question = "Question cannot be empty.";
      }
    });

    // Validate answers
    Object.keys(answers).forEach((key) => {
      if (!answers[key]?.trim()) {
        const index = key - 1; // Adjust index since answers are 1-based
        newErrors[index] = newErrors[index] || {};
        newErrors[index].answer = "Answer cannot be empty.";
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

  const handleQuestionChange = (index, newQuestion) => {
    const updatedWorksheet = { ...worksheet };
    updatedWorksheet.question[index] = newQuestion;
    setApiResponse((prevState) => ({
      ...prevState,
      worksheet: updatedWorksheet,
    }));

    // Clear the error for the question if it was resolved
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors[index]?.question) {
        delete updatedErrors[index].question;
        if (Object.keys(updatedErrors[index]).length === 0) {
          delete updatedErrors[index];
        }
      }
      return updatedErrors;
    });
  };

  const handleAnswerChange = (index, newAnswer) => {
    const updatedAnswers = { ...answers };
    updatedAnswers[index + 1] = newAnswer;
    setApiResponse((prevState) => ({
      ...prevState,
      worksheet: {
        ...prevState.worksheet,
        answers: updatedAnswers,
      },
    }));

    // Clear the error for the answer if it was resolved
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors[index]?.answer) {
        delete updatedErrors[index].answer;
        if (Object.keys(updatedErrors[index]).length === 0) {
          delete updatedErrors[index];
        }
      }
      return updatedErrors;
    });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div>
        <h4 className="mb-3">
          <strong>Fill in the Blanks</strong>
        </h4>
        {worksheet.question && worksheet.question.length > 0 && (
          worksheet.question.map((question, index) => (
            <div className="mb-4" key={index}>
              <p>Question {question}</p>
              <p className="answer mt-3">
                <strong>Correct Answer:</strong> {answers[index + 1]}
              </p>
            </div>
          ))
        )}
      </div>

      {modalVisible && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" role="dialog" tabIndex="-1">
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Fill-in-the-Blanks Worksheet</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  {worksheet.question && worksheet.question.length > 0 && (
                    worksheet.question.map((question, index) => (
                      <div key={index} className="mb-3">
                        <label className="form-label fw-bold">Question {index + 1}</label>
                        <input
                          type="text"
                          className={`form-control ${errors[index]?.question ? 'is-invalid' : ''}`}
                          value={question}
                          onChange={(e) => handleQuestionChange(index, e.target.value)}
                        />
                        {errors[index]?.question && (
                          <div className="invalid-feedback">{errors[index].question}</div>
                        )}

                        <label className="form-label mt-2 fw-bold">Correct Answer</label>
                        <input
                          type="text"
                          className={`form-control ${errors[index]?.answer ? 'is-invalid' : ''}`}
                          value={answers[index + 1]}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                        />
                        {errors[index]?.answer && (
                          <div className="invalid-feedback">{errors[index].answer}</div>
                        )}
                      </div>
                    ))
                  )}
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

export default FIBSingle;

