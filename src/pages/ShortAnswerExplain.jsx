// import React from 'react';

// const ShortAnswerExplain = ({ 
//     worksheet, 
//     lineStyle, 
//     AdditionalStyle, 
//     handleUpdate, 
//     setApiResponse, 
//     modalVisible }) => {

//     const handleQuestionChange = (index, newQuestion) => {
//         const updatedWorksheet = [...worksheet];
//         updatedWorksheet[index].question = newQuestion;
//         setApiResponse((prevState) => ({
//           ...prevState,
//           worksheet: updatedWorksheet,
//         }));
//       };

//   return (
//     <div>
//     <h4 className='mb-5'><strong>Short Answer Explaination</strong></h4>
//         {worksheet.map((item, index) => (
//         <div className='mb-4' key={index}>
//             <p className='mb-5'><strong>Question {index + 1}:</strong> {item.question}</p>
//             <div className='short-answers'>
//                 <label className='mb-5'>
//                     <strong>
//                         Answer:
//                         <span className="ms-2" style={lineStyle}></span>
//                     </strong>
//                 </label>
//             </div>
//             <div className='short-answers-second mb-5'>
//                 <span style={AdditionalStyle}></span>
//             </div>
//             <div className='short-answers-third mb-5'>
//                 <span style={AdditionalStyle}></span>
//             </div>
//             <div className='short-answers-fourth mb-5'>
//                 <span style={AdditionalStyle}></span>
//             </div>
//         </div>
//       ))}
//         {modalVisible && (
//         <>
//           <div className="modal-backdrop fade show"></div>
//           <div className="modal fade show d-block" role="dialog" tabIndex="-1">
//             <div className="modal-dialog modal-dialog-scrollable" style={{ maxWidth: '70%' }}>
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Edit Short Answer Explain Worksheet</h5>
//                 </div>
//                 <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
//                   {worksheet.map((item, index) => (
//                     <div key={index} className="mb-3">
//                       <label className="form-label fw-bold">Question {index + 1}</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={item.question}
//                         onChange={(e) => handleQuestionChange(index, e.target.value)}
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 <div className="modal-footer">
//                   <button className="btn btn-success" onClick={handleUpdate}>
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ShortAnswerExplain;

import React, { useState } from 'react';

const ShortAnswerExplain = ({ 
    worksheet, 
    lineStyle, 
    AdditionalStyle, 
    handleUpdate, 
    setApiResponse, 
    modalVisible 
}) => {
    const [errors, setErrors] = useState({}); // State to store validation errors

    // Validation function to check for empty questions
    const validateWorksheet = () => {
        const newErrors = {};

        worksheet.forEach((item, index) => {
            if (!item.question.trim()) {
                newErrors[index] = "Question cannot be empty.";
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

    // Handle question text change
    const handleQuestionChange = (index, newQuestion) => {
        const updatedWorksheet = [...worksheet];
        updatedWorksheet[index].question = newQuestion;
        setApiResponse((prevState) => ({
            ...prevState,
            worksheet: updatedWorksheet,
        }));

        // Clear the error for the question if it was resolved
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            if (updatedErrors[index]) {
                delete updatedErrors[index];
            }
            return updatedErrors;
        });
    };

    return (
        <div>
            <h4 className="mb-5"><strong>Short Answer Explanation</strong></h4>
            {worksheet.map((item, index) => (
                <div className="mb-4" key={index}>
                    <p className="mb-5"><strong>Question {index + 1}:</strong> {item.question}</p>
                    <div className="short-answers">
                        <label className="mb-5">
                            <strong>
                                Answer:
                                <span className="ms-2" style={lineStyle}></span>
                            </strong>
                        </label>
                    </div>
                    <div className="short-answers-second mb-5">
                        <span style={AdditionalStyle}></span>
                    </div>
                    <div className="short-answers-third mb-5">
                        <span style={AdditionalStyle}></span>
                    </div>
                    <div className="short-answers-fourth mb-5">
                        <span style={AdditionalStyle}></span>
                    </div>
                </div>
            ))}
            {modalVisible && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" role="dialog" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-scrollable" style={{ maxWidth: '70%' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Short Answer Explanation Worksheet</h5>
                                </div>
                                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    {worksheet.map((item, index) => (
                                        <div key={index} className="mb-3">
                                            <label className="form-label fw-bold">Question {index + 1}</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors[index] ? "is-invalid" : ""}`}
                                                value={item.question}
                                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                            />
                                            {errors[index] && (
                                                <div className="invalid-feedback">{errors[index]}</div>
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

export default ShortAnswerExplain;
