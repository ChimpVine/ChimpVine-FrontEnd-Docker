import React, { useState, useRef } from 'react';
import axios from 'axios';
import pptxgen from "pptxgenjs";
import { FaArrowRight, FaEraser, FaArrowLeft, FaEdit, FaTrashAlt, FaFilePowerpoint } from "react-icons/fa";
import { toast } from 'react-toastify';
import NavBar from '../NavBar';
import Spinner from '../../spinner/Spinner';
import { Modal, Button, Form } from 'react-bootstrap';
import NavBreadcrumb from '../../pages/BreadCrumb/BreadCrumb';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const slideNumbers = [
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" }
];

const grades = [
    { value: "", label: "Choose a Grade" },
    { value: "k", label: "Kindergarten" },
    { value: "1", label: "1st Grade" },
    { value: "2", label: "2nd Grade" },
    { value: "3", label: "3rd Grade" },
    { value: "4", label: "4th Grade" },
    { value: "5", label: "5th Grade" },
    { value: "6", label: "6th Grade" },
    { value: "7", label: "7th Grade" },
    { value: "8", label: "8th Grade" },
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" }
];

export default function SlideGenerator({ BASE_URL }) {
    const navigate = useNavigate();
    const btnStyle = {
        backgroundColor: '#FF683B',
        color: 'white',
    };

    const cancelStyle = {
        backgroundColor: '#dc3545',
        color: 'white',
    };

    const editStyle = {
        color: '#0dcaf0'
    }

    const delStyle = {
        color: '#dc3545'
    }


    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Planner', active: true },
        { label: 'Slide Generator', active: true }
    ];


    const [formData, setFormData] = useState({
        grade: '',
        title: '',
        objective: '',
        slide_number: '',
    });

    const [apiResponse, setApiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPptx, setIsLoadingPptx] = useState(false); // Track PPTX generation state
    const contentRef = useRef();

    const [showModal, setShowModal] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        objective: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { grade, title, objective, slide_number } = formData;

        if (!grade || !title || !objective || !slide_number) {
            toast.error('Please fill in all fields.');
            return;
        }

        const formDataToSend = {
            grade: grade,
            topic: title,
            learning_objectives: objective,
            number_of_slides: slide_number
        };

        // Retrieve cookies for headers
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        setIsLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/slide_one`, formDataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                    'X-Site-Url': siteUrl
                },
            });
            setApiResponse(response.data);

            setFormData({
                grade: '',
                title: '',
                objective: '',
                slide_number: ''
            });
            toast.success('Slide generated successfully!');
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
                toast.error('Failed to generate the Slides. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (slide, index) => {
        setCurrentSlide(index);
        setEditFormData({
            title: slide.title,
            objective: slide.objective,
        });
        setShowModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        if (!editFormData.title || !editFormData.objective) {
            toast.error('Please fill in all fields.');
            return;
        }

        const updatedSlides = [...apiResponse.slides];
        updatedSlides[currentSlide] = {
            ...updatedSlides[currentSlide],
            title: editFormData.title,
            objective: editFormData.objective,
        };

        setApiResponse({
            ...apiResponse,
            slides: updatedSlides,
        });

        toast.success('Slide updated successfully!');
        setShowModal(false);
    };

    const handleDeleteSlide = (index) => {
        const updatedSlides = [...apiResponse.slides];
        updatedSlides.splice(index, 1);
        setApiResponse({
            ...apiResponse,
            slides: updatedSlides,
        });
        toast.error('Slide deleted successfully!');
    };

    const handleGenerateAnotherLesson = () => {
        setApiResponse(null);
    };

    const handleGeneratePptx = async () => {
        if (!apiResponse) {
            toast.error('No data available to generate PowerPoint.');
            return;
        }

        // Retrieve cookies for headers
        const authToken = Cookies.get('authToken');
        const siteUrl = Cookies.get('site_url');

        setIsLoadingPptx(true); // Start spinner for PPTX generation

        try {
            const response = await axios.post(`${BASE_URL}/slide_two`, apiResponse, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                    'X-Site-Url': siteUrl
                },
            });

            const pptx = new pptxgen();

            response.data.slides.forEach((slideData) => {
                let slide = pptx.addSlide();
                slide.addText(slideData.title, {
                    x: 0.5,
                    y: 0.5,
                    fontSize: 24,
                    bold: true,
                    color: '363636',
                });
                slide.addText(`Objective: ${slideData.objective}`, {
                    x: 0.5,
                    y: 1.5,
                    fontSize: 18,
                    color: '000000',
                });
                slide.addText(slideData.slide_content, {
                    x: 0.5,
                    y: 2.5,
                    fontSize: 18,
                    color: '000000',
                    wrap: true,
                    valign: 'top',
                    lineSpacingMultiple: 1.2,
                });
            });

            await pptx.writeFile({ fileName: 'GeneratedSlides.pptx' });

            toast.success('PowerPoint generated and downloaded successfully!');

            // Reset the form and API response after the PPTX is generated
            setApiResponse(null); // Reset state
            setFormData({
                grade: '',
                title: '',
                objective: '',
                slide_number: ''
            });

        } catch (error) {
            console.error('Error generating PPTX:', error);
            toast.error('Failed to generate the PowerPoint. Please try again.');
        } finally {
            setIsLoadingPptx(false); // Stop spinner after PPTX generation
        }
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
                    ) : isLoadingPptx ? (  // Spinner during PPTX generation
                        <div className="col-md-5 text-center">
                            <Spinner />
                        </div>
                    ) : (
                        !apiResponse ? (
                            <>
                                <NavBreadcrumb items={breadcrumbItems} />
                                <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded no-print">
                                    <form onSubmit={handleSubmit}>
                                        <h4 className="text-center mb-3">Slide Generator</h4>
                                        <div className="mb-2">
                                            <label htmlFor="grade" className="form-label">
                                                Grade <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className="form-select form-select-sm mb-3"
                                                id="grade"
                                                name="grade"
                                                value={formData.grade}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            >
                                                {grades.map((grade, index) => (
                                                    <option key={index} value={grade.value}>
                                                        {grade.label}
                                                    </option>
                                                ))}
                                            </select>

                                            <label htmlFor="title" className="form-label">
                                                Title <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm mb-3"
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="For eg. The Wildlife of the United States"
                                            />

                                            <label htmlFor="objective" className="form-label">
                                                Objective <span style={{ color: 'red' }}>*</span><br />
                                                <small className="text-muted">
                                                    Add objectives as bullet points or a paragraph
                                                </small>
                                            </label>
                                            <textarea
                                                className="form-control form-control-sm mb-3"
                                                id="objective"
                                                name="objective"
                                                value={formData.objective}
                                                onChange={handleChange}
                                                rows={4}
                                                placeholder="For eg. Discover the diverse wildlife found in different regions of America. Learn about animals like the American bison, bald eagle, and grizzly bear. Explore the importance of preserving habitats and biodiversity."
                                            />

                                            <label htmlFor="slide_number" className="form-label">
                                                Number of Slides <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <select
                                                className="form-select form-select-sm mb-3"
                                                id="slide_number"
                                                name="slide_number"
                                                value={formData.slide_number}
                                                onChange={handleChange}
                                            >
                                                <option value="">Choose the Number of Slides</option>
                                                {slideNumbers.map((slide, index) => (
                                                    <option key={index} value={slide.value}>
                                                        {slide.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="mb-3">
                                                <small className="text-muted">
                                                    <strong className='text-danger'>Note:</strong>
                                                    <ul>
                                                        <li>Please ensure that the objectives are concise and do not exceed 250 words.</li>
                                                    </ul>
                                                </small>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-sm"
                                                style={cancelStyle}
                                                onClick={() => setFormData({
                                                    grade: '',
                                                    title: '',
                                                    objective: '',
                                                    slide_number: ''
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
                                <h3 className='text-center mb-4'>Generated Slides</h3>
                                <div className="row justify-content-center">
                                    {apiResponse.slides.map((slide, index) => (
                                        <div key={index} className="col-md-10">
                                            <div className="card shadow-sm border rounded mb-5 p-0">
                                                <div className="card-body d-flex justify-content-between align-items-center">
                                                    <div className="d-flex align-items-center">
                                                        <FaFilePowerpoint size={50} className="me-3" style={{ color: '#8172DB' }} />
                                                        <div>
                                                            <h5>Title: {slide.title}</h5>
                                                            <p>
                                                                <strong>Objective: </strong>{slide.objective}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm p-3 m-2 rounded-pill"
                                                            onClick={() => handleEditClick(slide, index)}
                                                            data-bs-toggle="tooltip"
                                                            data-bs-placement="top"
                                                            title="Edit"
                                                            style={editStyle}
                                                        >
                                                            <FaEdit size={22} />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm p-3 m-2 rounded-pill"
                                                            onClick={() => handleDeleteSlide(index)}
                                                            data-bs-toggle="tooltip"
                                                            data-bs-placement="top"
                                                            title="Delete"
                                                            style={delStyle}
                                                        >
                                                            <FaTrashAlt size={22} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center">
                                    <button
                                        className="btn btn-sm mt-4 mb-3 me-2 no-print"
                                        style={btnStyle}
                                        onClick={handleGenerateAnotherLesson}
                                    >
                                        <FaArrowLeft /> Generate Another Lesson
                                    </button>
                                    <button
                                        className="btn btn-sm mt-4 mb-3 me-2 no-print btn-success"
                                        onClick={handleGeneratePptx}
                                        disabled={isLoadingPptx}
                                    >
                                        {isLoadingPptx ? <Spinner /> : 'Generate PowerPoint'} <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>


            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Form onSubmit={handleEditSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Slide</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" id="editTitle">
                            <Form.Label>Title <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={editFormData.title}
                                onChange={handleEditChange}
                                placeholder="Enter slide title"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" id="editObjective">
                            <Form.Label>Objective <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="objective"
                                id="edit-objective"
                                value={editFormData.objective}
                                onChange={handleEditChange}
                                placeholder="Enter slide objective"
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
