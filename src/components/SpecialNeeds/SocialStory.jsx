import React, { useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { FaArrowRight, FaEraser, FaArrowLeft, FaRegFilePdf } from "react-icons/fa";
import { toast } from 'react-toastify';
import Spinner from '../../spinner/Spinner';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// Special needs options
const needs = [
    { value: "", label: "Choose your needs" },
    { value: "ASD", label: "ASD (Autism spectrum disorder)" },
    { value: "ADHD", label: "ADHD (Attention deficit hyperactivity disorder)" }
];

const breadcrumbItems = [
    { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
    { label: 'Special needs', active: true },
    { label: 'Social Story', active: true }
];


export default function SocialStory({ BASE_URL }) {
    const navigate = useNavigate();
    const btnStyle = { backgroundColor: '#FF683B', color: 'white' };
    const cancelStyle = { backgroundColor: '#dc3545', color: 'white' };
    const pdfStyle = { backgroundColor: '#198754', color: 'white' };

    const [formData, setFormData] = useState({
        child_name: '',
        child_age: '',
        needs: '',
        scenario: '',
        behavior_challenge: '',
        ideal_behavior: ''
    });

    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const contentRef = useRef();

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { child_name, child_age, scenario, behavior_challenge, ideal_behavior } = formData;

        // Check if all required fields are filled
        if (!child_name || !child_age || !scenario || !behavior_challenge || !ideal_behavior) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const formDataToSend = {
            child_name,
            child_age,
            scenario,
            behavior_challenge,
            ideal_behavior
        };

        // Retrieve cookies for headers
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        setIsLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/Social_stories`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                        'X-Site-Url': siteUrl
                    }
                }
            );
            setApiResponse(response.data);
            setFormData({
                child_name: '',
                child_age: '',
                needs: '',
                scenario: '',
                behavior_challenge: '',
                ideal_behavior: ''
            });
            toast.success('Social story generated successfully!');
        } catch (error) {
            if (
                error.response.status === 401 
            ) {
                // console.error('Error: Invalid token.');
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
                // console.error('Error:', error);
                toast.error('Failed to generate the social story. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle print action
    const handlePrint = () => {
        window.print();
    };

    const renderSocialStory = (storyData) => {

        const nameStyle = {
            display: "inline-block",
            width: "200px",
            height: "1px",
            backgroundColor: "black",
            borderBottom: "1px solid black",
        };

        const dateStyle = {
            display: "inline-block",
            width: "100px",
            height: "1px",
            backgroundColor: "black",
            borderBottom: "1px solid black",
        };

        return (
            <div className="container-fluid mt-3 mb-3 ps-5 pe-5 print-content">
                <div className="mt-4">
                    <div className="d-flex justify-content-center mt-3">
                        <h2 className='mb-5'>Your High School Name</h2>
                    </div>
                    <div className="d-flex justify-content-between mt-5 mb-5">
                        <h5>Name : <span style={nameStyle}></span></h5>
                        <h5 className='me-3'>Date :  <span style={dateStyle}></span></h5>
                    </div>
                    <h4>Summary :</h4>
                    <p>{storyData.story.introduction}</p>
                    {storyData.story.steps.map((step, index) => (
                        <div key={index} className="mb-2">
                            <h5>{step.step_title}</h5>
                            <p>{step.description}</p>
                        </div>
                    ))}
                    <h5>Conclusion :</h5>
                    <p>{storyData.story.conclusion}</p>
                </div>
            </div>
        );
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
                                    <form onSubmit={handleSubmit}>
                                        <h4 className="text-center mb-3">Social Story Generator</h4>
                                        <div className="mb-2">
                                            <label htmlFor="child_name" className="form-label">
                                                Child's Name <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mb-2"
                                                id="child_name"
                                                name="child_name"
                                                value={formData.child_name}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                placeholder="Eg. Alex"
                                            />

                                            <label htmlFor="child_age" className="form-label">
                                                Child's Age <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mb-2"
                                                id="child_age"
                                                name="child_age"
                                                value={formData.child_age}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                placeholder="Eg. 7"
                                            />

                                            <label htmlFor="needs" className="form-label">
                                                Special Needs <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className="form-select form-select-sm mb-3"
                                                id="needs"
                                                name="needs"
                                                value={formData.needs}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            >
                                                {needs.map((needs, index) => (
                                                    <option key={index} value={needs.value}>
                                                        {needs.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <label htmlFor="scenario" className="form-label">
                                                Scenario <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mb-2"
                                                id="scenario"
                                                name="scenario"
                                                value={formData.scenario}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                placeholder="For eg. Playing in the park"
                                            />

                                            <label htmlFor="behavior_challenge" className="form-label">
                                                Behavior Challenge <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mb-2"
                                                id="behavior_challenge"
                                                name="behavior_challenge"
                                                value={formData.behavior_challenge}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                placeholder="For eg. Finding it hard to wait for a turn"
                                            />

                                            <label htmlFor="ideal_behavior" className="form-label">
                                                Ideal Behavior <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mb-2"
                                                id="ideal_behavior"
                                                name="ideal_behavior"
                                                value={formData.ideal_behavior}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                                placeholder="For eg. Waiting patiently and taking turns"
                                            />
                                        </div>

                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-sm"
                                                style={cancelStyle}
                                                onClick={() => setFormData({
                                                    child_name: '',
                                                    child_age: '',
                                                    needs: '',
                                                    scenario: '',
                                                    behavior_challenge: '',
                                                    ideal_behavior: ''
                                                })}
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
                            <div className="mt-3" ref={contentRef} id="main-btn">
                                {renderSocialStory(apiResponse)}
                                <div className='d-flex justify-content-center'>
                                    <button className="btn btn-sm mt-2 mb-3 me-2 no-print" style={btnStyle} onClick={() => setApiResponse(null)}>
                                        <FaArrowLeft /> Generate Another Social Story
                                    </button>
                                    <button className="btn btn-sm mt-2 mb-3 no-print" style={pdfStyle} onClick={handlePrint}>
                                        <FaRegFilePdf /> View PDF
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

