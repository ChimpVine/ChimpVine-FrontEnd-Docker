import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { FaArrowRight, FaEraser, FaArrowLeft, FaCloudDownloadAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import Spinner from '../../spinner/Spinner';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function TextSummarizer({ BASE_URL }) {
    const navigate = useNavigate();
    const btnStyle = { backgroundColor: '#FF683B', color: 'white' };
    const cancelStyle = { backgroundColor: '#dc3545', color: 'white' };
    const pdfStyle = { backgroundColor: '#198754', color: 'white' };

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const textValue = watch("text", "");  // Watch the value of the text input

    // Update word count when textValue changes
    useEffect(() => {
        const count = textValue.trim() ? textValue.trim().split(/\s+/).length : 0;
        setWordCount(count);
    }, [textValue]);

    const handlePrint = () => window.print();

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Summarizer', active: true },
        { label: 'Text Summarizer', active: true }
    ];

    const onSubmit = async (data) => {
        const { text, summary_format } = data;

        // Retrieve cookies for headers
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        setIsLoading(true);

        try {
            const { data: response } = await axios.post(
                `${BASE_URL}/text_summarizer`,
                { text, summary_format },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                        'X-Site-Url': siteUrl
                    }
                }
            );
            setApiResponse(response);
            reset();
            toast.success('Summary generated successfully!');
        } catch (error) {
            if (
                error.response.status === 401 
            ) {
                console.error('Error: Invalid token.');
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
                toast.warning(`${error.response.data.error}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const validateWordCount = (text) => {
        const count = text.trim().split(/\s+/).length;
        return count <= 1000 || `Your Text exceeds the 1000-word limit.`;
    };

    return (
        <>
            <NavBar id="main-nav" />
            <div className="container-fluid">
                <div className="row justify-content-center mt-5 mb-4">

                    {isLoading ? (
                        <div className="col-md-5 text-center">
                            <Spinner />
                        </div>
                    ) : (
                        !apiResponse ? (
                            <>
                                <NavBreadcrumb items={breadcrumbItems} />
                                <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded no-print">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <h4 className="text-center mb-3">Text Summarizer</h4>
                                        <div className="mb-3">
                                            <label htmlFor="text" className="form-label-sm">Text Input<span style={{ color: 'red' }}>*</span></label>
                                            <textarea
                                                className={`form-control form-control-sm resizeStyle ${errors.text ? 'is-invalid' : ''}`}
                                                id="text"
                                                name="text"
                                                rows="10"
                                                placeholder="Enter the text you want to summarize (e.g. On a misty morning, the purple sky reflected a thousand shimmering stars, though the sun was only moments away from rising. The forest below buzzed with life, and the distant call of a bird echoed across the valley. Amidst the tall trees, an old stone path led to a forgotten garden, overgrown with ivy and wildflowers. The scent of rain lingered in the air, mixing with the earthy fragrance of the moss-covered stones. A single leaf fluttered down, landing softly on the surface of a quiet, hidden pond.)"
                                                disabled={isLoading}
                                                {...register('text', {
                                                    required: 'Text is required',
                                                    validate: validateWordCount
                                                })}
                                            ></textarea>
                                            {errors.text && <div className="invalid-feedback">{errors.text.message}</div>}

                                            {/* Word count aligned to the right side */}
                                            <div className="d-flex justify-content-end mt-1">
                                                <small className={`${wordCount > 1000 ? 'text-danger' : 'text-muted'}`}>
                                                    Word count: {wordCount}/1000
                                                </small>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="summary_format" className="form-label-sm">Text Format <span style={{ color: 'red' }}>*</span></label>
                                            <select
                                                className={`form-select form-select-sm mb-3 ${errors.summary_format ? 'is-invalid' : ''}`}
                                                id="summary_format"
                                                name="summary_format"
                                                disabled={isLoading}
                                                {...register('summary_format', { required: 'Please select a summary format' })}
                                            >
                                                <option value="">Select Format</option>
                                                <option value="Point">Point</option>
                                                <option value="Paragraph">Paragraph</option>
                                            </select>
                                            {errors.summary_format && <div className="invalid-feedback">{errors.summary_format.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <small className="text-muted">
                                                <strong className='text-danger'>Note:</strong>
                                                <ul>
                                                    <li> Please ensure that the text input are concise and under 1000 words.</li>
                                                </ul>
                                            </small>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-sm"
                                                style={cancelStyle}
                                                onClick={() => {
                                                    reset({ text: '', summary_format: '' });
                                                    setWordCount(0);
                                                }}
                                                disabled={isLoading}
                                            >
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
                            <div className="mt-3" id="main-btn">
                                {renderTextSummarizer(apiResponse)}
                                <button className="btn btn-sm mt-2 mb-3 me-2 no-print" style={btnStyle} onClick={() => setApiResponse(null)}>
                                    <FaArrowLeft /> Generate Another Summary
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm mt-2 mb-3 me-2 no-print"
                                    style={pdfStyle}
                                    onClick={handlePrint}
                                >
                                    <FaCloudDownloadAlt /> View Summary
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

const renderTextSummarizer = (apiResponse) => {
    try {
        const { text_title, summary } = apiResponse; 
        return (
            <div>
                <h4>Title: {text_title}</h4>
                <h3>Summary Result</h3>
                {Array.isArray(summary) ? (
                    <ul>
                        {summary.map((point, index) => <li key={index}>{point}</li>)}
                    </ul>
                ) : (
                    <p>{summary}</p>
                )}
            </div>
        );
    } catch (error) {
        toast.warning("An error occurred while rendering the summary.");
    }
};

