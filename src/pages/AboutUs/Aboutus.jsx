import React from 'react'
import NavBar from '../../components/NavBar'
import logo from '../../assests/img/AI-Tools-Template.png'
import Footer from '../Footer';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaChalkboardTeacher, FaUserGraduate, FaBookOpen } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

export default function Aboutus() {

    const textStyle = {
        color: '#8F47D7'
    };

    const paraStyle = {
        textAlign: 'justify'
    };

    const desStyle = {
        color: '#8F47D7',
        fontWeight: '600'

    };

    const iconStyle = {
        fontSize: '1.5rem',
        color: '#6c757d'
    };

    const btnStyle = {
        backgroundColor: '#FF683B',
        color: 'white',
    };

    const pointerStyle = {
        cursor: 'default'
    };

    const goals = [
        {
            title: 'Enhance Teaching Efficiency',
            description: 'Develop AI-powered tools that streamline lesson planning and assessment, reducing teachers\' administrative workload.',
            icon: <FaChalkboardTeacher className='me-3' style={iconStyle} />
        },
        {
            title: 'Boost Class Engagement',
            description: 'Enable teachers to create interactive and effective learning experiences that captivate and inspire students.',
            icon: <FaUserGraduate className='me-3' style={iconStyle} />
        },
        {
            title: 'Personalized Education',
            description: 'Provide flexible solutions that allow educators to focus on individual student needs, fostering deeper connections.',
            icon: <FaBookOpen className='me-3' style={iconStyle} />
        }
    ];

    const features = [
        {
            title: 'Effortless Customization',
            description: 'Easily customize content to suit your classroom’s unique needs. With our intuitive AI-powered tools, you can generate, edit, and print tailored resources with just a few clicks. Spend less time on prep work and more on impactful teaching.',
        },
        {
            title: 'Comprehensive AI Toolkit',
            description: 'We offer a wide range of tools to meet every classroom need, from quizzes and group activities to lesson planning and grading rubrics. Our all-in-one toolkit for teachers is designed to support K-12 education, making it a versatile resource for any teaching environment.',
        },
        {
            title: 'Accessible and User-Friendly',
            description: 'Our platform is accessible anytime, anywhere, making it easy to access your tools whenever you need them. We provide straightforward, user-friendly tools that require minimal setup, allowing you to dive right into enhancing your teaching.',
        }
    ];


    return (
        <>
            <NavBar />
            <div className="container mt-5">
                <div className="row align-items-center">
                    <div className="col-md-5 mt-4">
                        <header className="header">
                            <h5 className="mb-2 fw-bold" style={textStyle}>How it Started</h5>
                            <h2 className="fw-bold">AI Driven Tools for Inspired Teaching and Learning</h2>
                        </header>
                        <p className="mt-3 text-muted" style={paraStyle}>
                            At ChimpVine AI, we believe that teaching should be inspiring, not overwhelming. We harness the power of AI to create intuitive tools that simplify lesson planning, assessment, and classroom engagement. Our mission is to empower
                            educators and enrich student experiences by providing a seamless, innovative teaching toolkit designed for today's classrooms. Unlock your potential with ChimpVine AI where teaching meets technology.
                        </p>
                        <NavLink to="/ai-tools-for-teachers">
                            <button className='btn btn-md mt-3 me-2' style={btnStyle}>Go to AI Tools</button>
                        </NavLink>
                    </div>
                    <div className="col-md-7 mt-4 d-flex justify-content-center">
                        <img src={logo} alt="AI Tools" className='img-fluid w-75' />
                    </div>
                </div>
            </div>
            <Container className="text-center my-5">
                <h2 className="mb-4 fw-bold">Our Goals</h2>
                <Row className="justify-content-center" style={pointerStyle}>
                    {goals.map((goal, index) => (
                        <Col key={index} md={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>
                                        {goal.icon}
                                        <label style={desStyle}>{goal.title}</label>
                                    </Card.Title>
                                    <Card.Text className="text-muted mt-3">{goal.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Container fluid style={{ backgroundColor: '#E9E7FC', padding: '40px' }}>
                <Row className="justify-content-center" style={pointerStyle}>
                    <Col md={4} className="d-flex flex-column justify-content-center">
                        <h2 className="fw-bold" style={{ fontSize: '2rem' }}>
                            Why <span style={{ color: '#8F47D7' }}>Us</span>
                        </h2>
                        <hr style={{ border: '2px solid #8F47D7', width: '75px' }} />
                        <p>
                            We’re here to make teaching simpler and more efficient, empowering you to focus on what truly matters: connecting with your students and enhancing their learning experience. Here’s why educators choose us:
                        </p>
                    </Col>
                    <Col md={8}>
                        <Row className="justify-content-center">
                            {features.map((feature, index) => (
                                <Col md={4} key={index} className="mb-4">
                                    <Card className="h-100 shadow-sm">
                                        <Card.Body>
                                            <Card.Title className="fw-bold">{feature.title}</Card.Title>
                                            <Card.Text>{feature.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
            <div className="container d-flex flex-column align-items-center justify-content-center text-center mt-5" style={{ height: '50vh' }}>
                <div className="mb-2" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    We’re ready, are you?
                </div>
                <div className="mb-3" style={{ fontSize: '1.25rem', color: '#555' }}>
                    Let’s chat about your goals and get started !
                </div>
                <NavLink to="/contact-us">
                    <button className='btn btn-outline-dark btn-lg mt-3 me-2'>Contact Us</button>
                </NavLink>
            </div>
            <Footer />

        </>
    )
}
