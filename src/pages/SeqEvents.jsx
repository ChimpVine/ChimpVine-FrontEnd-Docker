import React, { useState } from 'react';

const SeqEvents = ({ worksheet, answers, setApiResponse, handleUpdate, modalVisible, setModalVisible }) => {
    const [errors, setErrors] = useState({}); 


    const validateWorksheet = () => {
        const newErrors = {};

        worksheet.forEach((item, index) => {
           
            if (!item.question.trim()) {
                newErrors[index] = newErrors[index] || {};
                newErrors[index].question = "Question cannot be empty.";
            }

           
            Object.keys(item.options).forEach((optionKey) => {
                if (!item.options[optionKey].trim()) {
                    newErrors[index] = newErrors[index] || { options: {} };
                    newErrors[index].options[optionKey] = "Option cannot be empty.";
                }
            });

            
            if (!answers[index] || answers[index].length === 0 || answers[index].some(ans => !ans.trim())) {
                newErrors[index] = newErrors[index] || {};
                newErrors[index].answer = "Correct answer cannot be empty.";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

   
    const handleUpdateWithValidation = () => {
        if (validateWorksheet()) {
            handleUpdate(); 
        }
    };

    const handleQuestionChange = (index, newQuestion) => {
        const updatedWorksheet = [...worksheet];
        updatedWorksheet[index].question = newQuestion;
        setApiResponse((prevState) => ({
            ...prevState,
            worksheet: updatedWorksheet,
        }));

        
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

    const handleOptionChange = (questionIndex, optionKey, newOption) => {
        const updatedWorksheet = [...worksheet];
        updatedWorksheet[questionIndex].options[optionKey] = newOption;
        setApiResponse((prevState) => ({
            ...prevState,
            worksheet: updatedWorksheet,
        }));

      
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            if (updatedErrors[questionIndex]?.options?.[optionKey]) {
                delete updatedErrors[questionIndex].options[optionKey];
                if (Object.keys(updatedErrors[questionIndex].options).length === 0) {
                    delete updatedErrors[questionIndex].options;
                }
                if (Object.keys(updatedErrors[questionIndex]).length === 0) {
                    delete updatedErrors[questionIndex];
                }
            }
            return updatedErrors;
        });
    };

    const handleAnswerChange = (index, newAnswer) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = newAnswer.split(',').map((ans) => ans.trim());
        setApiResponse((prevState) => ({
            ...prevState,
            answers: updatedAnswers,
        }));

        
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
        <div>
            <h4 className="mb-5"><strong>Sequence Events Order</strong></h4>
            {worksheet.map((item, index) => (
                <div key={index} className="mb-5">
                    <p><strong>Question {index + 1}:</strong> {item.question}</p>
                    <div className="mb-5 options">
                        <p><strong>Options:</strong></p>
                        {Object.keys(item.options).map((optionKey) => (
                            <div key={optionKey}>
                                <span><strong>{optionKey}.</strong> {item.options[optionKey]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mb-5 answer">
                        <strong>Correct Answers:</strong> {answers[index].join(', ')}
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
                                    <h5 className="modal-title">Edit Sequence Events Order Worksheet</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    {worksheet.map((item, index) => (
                                        <div key={index} className="mb-3">
                                            <label className="form-label fw-bold">Question {index + 1}</label>
                                            <textarea
                                                type="text"
                                                className={`form-control ${errors[index]?.question ? "is-invalid" : ""}`}
                                                rows={3}
                                                value={item.question}
                                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                            />
                                            {errors[index]?.question && (
                                                <div className="invalid-feedback">{errors[index].question}</div>
                                            )}

                                            <label className="form-label fw-bold mt-3">Options</label>
                                            {Object.keys(item.options).map((optionKey) => (
                                                <div key={optionKey} className="input-group mb-2">
                                                    <span className="input-group-text">{optionKey}.</span>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${
                                                            errors[index]?.options?.[optionKey] ? "is-invalid" : ""
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

                                            <label className="form-label fw-bold mt-3">Correct Answers (Comma-separated)</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors[index]?.answer ? "is-invalid" : ""}`}
                                                value={answers[index].join(', ')}
                                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                            />
                                            {errors[index]?.answer && (
                                                <div className="invalid-feedback">{errors[index].answer}</div>
                                            )}
                                        </div>
                                    ))}
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
        </div>
    );
};

export default SeqEvents;
