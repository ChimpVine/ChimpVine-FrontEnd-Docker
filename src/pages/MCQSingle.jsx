import React, { useState } from 'react';
import { FaCheck } from "react-icons/fa";

const MCQSingle = ({ worksheet, answers, modalVisible, handleUpdate, setApiResponse, setModalVisible }) => {
  const [errors, setErrors] = useState({});

  const handleQuestionChange = (index, newQuestion) => {
    const updatedWorksheet = [...worksheet];
    updatedWorksheet[index].question = newQuestion;
    setApiResponse((prevState) => ({
      ...prevState,
      worksheet: updatedWorksheet,
    }));
  };

  const handleOptionChange = (index, optionKey, newOptionValue) => {
    const updatedWorksheet = [...worksheet];
    updatedWorksheet[index].options[optionKey] = newOptionValue;
    setApiResponse((prevState) => ({
      ...prevState,
      worksheet: updatedWorksheet,
    }));
  };

  const handleAnswerChange = (index, selectedAnswer) => {
    const updatedAnswers = { ...answers };
    updatedAnswers[index + 1] = selectedAnswer;
    setApiResponse((prevState) => ({
      ...prevState,
      answers: updatedAnswers,
    }));
  };

  const validateWorksheet = () => {
    const newErrors = {};
    worksheet.forEach((item, index) => {
      if (!item.question.trim()) {
        newErrors[index] = newErrors[index] || {};
        newErrors[index].question = "Question cannot be empty.";
      }
      Object.keys(item.options).forEach((optionKey) => {
        if (!item.options[optionKey].trim()) {
          newErrors[index] = newErrors[index] || {};
          newErrors[index].options = newErrors[index].options || {};
          newErrors[index].options[optionKey] = "Option cannot be empty.";
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = () => {
    if (validateWorksheet()) {
      handleUpdate(); // Call the parent-provided update handler
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  

  return (
    <>
      <h5 className='mb-4'>
        <strong>[ <FaCheck /> ] Tick the correct answer corresponding to the questions provided.</strong>
      </h5>
      {worksheet.map((item, index) => (
        <div className='mb-2' key={index}>
          <p><strong>Question {index + 1}:</strong> {item.question}</p>
          <div className='options'>
            {Object.keys(item.options).map((optionKey) => (
              <div key={optionKey}>
                <input
                  className="form-check-input me-2"
                  type="checkbox"
                  disabled
                />
                {optionKey}. {item.options[optionKey]}
              </div>
            ))}
          </div>
          <div className='answer mt-3'>
            <strong>Correct Answer: </strong> {answers[index + 1]}
          </div>
        </div>
      ))}

      {modalVisible && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" role="dialog" tabIndex="-1">
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Worksheet</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {worksheet.map((item, index) => (
                    <div key={index} className="mb-3">
                      <label className="form-label fw-bold">Question {index + 1}</label>
                      <input
                        type="text"
                        className={`form-control ${errors[index]?.question ? 'is-invalid' : ''}`}
                        value={item.question}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                      />
                      {errors[index]?.question && (
                        <div className="invalid-feedback">
                          {errors[index].question}
                        </div>
                      )}

                      {item.options && (
                        <>
                          <label className="form-label mt-2 fw-bold">Options</label>
                          {Object.keys(item.options).map((optionKey) => (
                            <div key={optionKey}>
                              <input
                                type="text"
                                className={`form-control mb-1 ${
                                  errors[index]?.options?.[optionKey] ? 'is-invalid' : ''
                                }`}
                                value={item.options[optionKey]}
                                onChange={(e) =>
                                  handleOptionChange(index, optionKey, e.target.value)
                                }
                              />
                              {errors[index]?.options?.[optionKey] && (
                                <div className="invalid-feedback">
                                  {errors[index].options[optionKey]}
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      )}

                      <label className="form-label mt-2 fw-bold">Select Correct Answer</label>
                      <div>
                        {Object.keys(item.options).map((optionKey) => (
                          <div key={optionKey} className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`correctAnswer${index}`}
                              value={optionKey}
                              checked={answers[index + 1] === optionKey}
                              onChange={() => handleAnswerChange(index, optionKey)}
                            />
                            <label className="form-check-label">
                              {optionKey}. {item.options[optionKey]}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" onClick={handleSaveChanges}>
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

export default MCQSingle;
