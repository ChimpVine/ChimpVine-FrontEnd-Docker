import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PopupWidget  } from "react-calendly";
import {
    FaQuestionCircle,
    FaBookReader,
    FaReadme,
    FaReceipt,
    FaBook,
    FaGrinTongueSquint,
    FaPuzzlePiece,
    FaTasks,
    FaBookOpen,
    FaYoutubeSquare,
    FaUsers,
    FaTenge,
    FaFilePdf,
    FaThLarge,
    FaQuestion,
    FaRegSmileBeam,
    FaFilePowerpoint,
} from "react-icons/fa";
import { FaRegFaceLaughSquint } from "react-icons/fa6";
import { TbMathSymbols, TbZoomQuestion } from "react-icons/tb";
import { GiPuzzle } from "react-icons/gi";
import { PiCirclesFourFill , PiMathOperationsFill  } from "react-icons/pi";
import NavBar from './NavBar';
import ReactGA from 'react-ga4';

export default function MainPlanner() {
    const [activeTab, setActiveTab] = useState('All'); 

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }, []);

    const trackButtonClick = (label) => {
        ReactGA.event({
            category: 'Button Click',
            action: 'Click on Planner',
            label: label
        });
    };

    // Function to handle tab click
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const cards = [
        {
            id: 1,
            category: 'Planner',
            icon: <FaBookOpen  size={50} style={{ color: "#198754" }} />,
            title: 'Lesson Planner',
            description: 'Plan and organize your lessons effectively with our easy-to-use Lesson Planner.',
            link: '/lesson-planner',
            btnColor: 'success'
        },
        {
            id: 2,
            category: 'Assessment',
            icon: <FaReadme size={50} />,
            title: 'Workbook Planner',
            description: 'Design comprehensive workbooks for your students with our Workbook Planner.',
            link: '/workbook-planner',
            btnColor: 'dark'
        },
        {
            id: 3,
            category: 'Assessment',
            icon: (
                <div className="position-relative">
                    <FaReceipt size={50} style={{ color: "#dc3545" }} />
                    <span className="badge rounded-pill bg-success position-absolute top-0 end-0">Popular</span>
                </div>
            ),
            title: 'Worksheet Planner',
            description: 'Easily create and customize worksheets for your students with our Worksheet Planner.',
            link: '/worksheet-planner',
            btnColor: 'danger'
        },
        {
            id: 4,
            category: 'Learning',
            icon: <FaBook size={50} style={{ color: "#6c757d" }} />,
            title: 'Vocabulary Builder',
            description: 'Easily craft personalized and dynamic vocabulary lists with our intuitive Vocabulary Builder.',
            link: '/vocabulary-planner',
            btnColor: 'secondary'
        },
        {
            id: 5,
            category: 'Gamification',
            icon: (
                <div className="position-relative">
                    <FaGrinTongueSquint size={50} style={{ color: "#0d6efd" }} />
                    <span className="badge rounded-pill bg-success position-absolute top-0 end-0">Popular</span>
                </div>
            ),
            title: 'Tongue Twister',
            description: 'Easily craft personalized and challenging tongue twisters with our intuitive Tongue Twister.',
            link: '/tongue-twister',
            btnColor: 'primary'
        },
        {
            id: 6,
            category: 'Gamification',
            icon: (
                <div className="position-relative">
                    <FaPuzzlePiece size={50} />
                    <span className="badge rounded-pill bg-success position-absolute top-0 end-0">Popular</span>
                </div>
            ),
            title: 'Word Puzzle',
            description: 'Easily create engaging and interactive word puzzles with our intuitive Word Puzzle.',
            link: '/word-puzzle',
            btnColor: 'dark'
        },
        {
            id: 7,
            category: 'Planner',
            icon: (
                <div className="position-relative">
                   <FaFilePowerpoint  size={50} style={{ color: "#dc3545" }}/>
                    <span className="badge rounded-pill bg-success position-absolute top-0 end-0">Popular</span>
                </div>
            ),
            title: 'Slide Generator',
            description: 'Create stunning, engaging slides that captivate and deliver your message clearly.',
            link: '/slide-generator',
            btnColor: 'danger'
        },
        {
            id: 8,
            category: 'Assessment',
            icon: <FaUsers size={50} style={{ color: "#6c757d" }} />,
            title: 'Group Work',
            description: 'Effortlessly collaborate and manage tasks with ease using our Group Work Organizer.',
            link: '/group-work',
            btnColor: 'secondary'
        },
        {
            id: 9,
            category: 'Assessment',
            icon: <FaQuestionCircle size={50} style={{ color: "#0d6efd" }} />,
            title: 'Quiz Generator',
            description: 'Effortlessly create customized and interactive quizzes with our easy-to-use Quiz Generator.',
            link: '/quiz-generator',
            btnColor: 'primary'
        },
        {
            id: 10,
            category: 'Specialneeds',
            icon: <FaBook size={50} style={{ color: "#198754" }} />,
            title: 'Social Story',
            description: 'Create engaging, personalized stories for “special” students with our intuitive tool.',
            link: '/social-story',
            btnColor: 'success'
        },
        {
            id: 11,
            category: 'Summarizer',
            icon: (
                <div className="position-relative">
                    <FaTenge size={50} />
                    <span className="badge rounded-pill bg-success position-absolute top-0 end-0">Popular</span>
                </div>
            ),
            title: 'Text Summarizer',
            description: 'Effortlessly produce clear and concise text summaries with our Text Summarizer.',
            link: '/text-summarizer',
            btnColor: 'dark'
        },
        {
            id: 12,
            category: 'Planner',
            icon: (
                <div className="position-relative">
                    <FaRegSmileBeam  size={50} style={{ color: "#0d6efd" }}/>
                    <span className="badge rounded-pill bg-success position-absolute top-0 end-0">Popular</span>
                </div>
            ),
            title: 'SEL Generator',
            description: 'Masterfully curate holistic and engaging SEL content for deep, meaningful learning.',
            link: '/sel-generator',
            btnColor: 'primary'
        },
        {
            id: 13,
            category: 'Gamification',
            icon: (
                <div className="position-relative">
                    <FaThLarge size={50} style={{ color: "#6c757d" }} />
                    <span className="badge rounded-pill bg-primary position-absolute top-0 end-0">New</span>
                </div>
            ),
            title: 'Make the Word',
            description: 'Quickly create fun and interactive challenges with our Make the Word Generator.',
            link: '/make-the-word',
            btnColor: 'secondary'
        },
        {
            id: 14,
            category: 'Assessment',
            icon: (
                <div className="position-relative">
                   <TbMathSymbols size={50} />
                    <span className="badge rounded-pill bg-primary position-absolute top-0 end-0">New</span>
                </div>
            ),
            title: 'SAT Maths',
            description: 'Master math concepts with clear, engaging lessons to boost your SAT score.',
            link: '/sat-maths',
            btnColor: 'dark'
        },
        {
            id: 15,
            category: 'Summarizer',
            icon: (
                <div className="position-relative">
                    <FaYoutubeSquare size={50} style={{ color: "#dc3545" }} />
                    <span className="badge rounded-pill bg-primary position-absolute top-0 end-0">New</span>
                </div>
            ),
            title: 'YouTube Summarizer',
            description: 'Effortlessly create clear and concise video summaries with our YouTube Summarizer.',
            link: '/yt-summarizer',
            btnColor: 'danger'
        },
        {
            id: 16,
            category: 'Gamification',
            icon: (
                <div className="position-relative">
                    <PiMathOperationsFill  size={50} style={{ color: "#6c757d" }} />
                    <span className="badge rounded-pill bg-primary position-absolute top-0 end-0">New</span>
                </div>
            ),
            title: 'Fun Math',
            description: 'Create fun, engaging math activities that captivate and simplify complex concepts.',
            link: '/fun-maths',
            btnColor: 'secondary'
        },
        {
            id: 17,
            category: 'Gamification',
            icon: (
                <div className="position-relative">
                    <FaQuestion size={50} style={{ color: "#dc3545" }} />
                    <span className="badge rounded-pill bg-primary position-absolute top-0 end-0">New</span>
                </div>
            ),
            title: 'Bingo Card',
            description: 'Effortlessly design fun and interactive custom games with our Bingo Card Generator.',
            link: '/bingo-generator',
            btnColor: 'danger'
        },
        {
            id: 18,
            category: 'Gamification',
            icon: (
                <div className="position-relative">
                   <TbZoomQuestion size={50}/>
                    <span className="badge rounded-pill bg-danger small-badge position-absolute top-0 end-0">Coming Soon</span>
                </div>
            ),
            title: 'Mystery Case',
            description: 'Create intriguing mystery cases that captivate and challenge your investigative skills.',
            link: '/comingsoon',
            btnColor: 'dark'
        },
        {
            id: 19,
            category: 'Gamification',
            icon: (
                <div className="position-relative">
                    <FaRegFaceLaughSquint size={50} style={{ color: "#0d6efd" }}/>
                    <span className="badge rounded-pill bg-danger small-badge position-absolute top-0 end-0">Coming Soon</span>
                </div>
            ),
            title: 'Teacher Joke',
            description: 'Effortlessly craft teacher jokes that spark laughter and make learning fun.',
            link: '/comingsoon',
            btnColor: 'primary'
        },
        {
            id: 20,
            category: 'Planner',
            icon: (
                <div className="position-relative">
                   <FaTasks size={50} style={{ color: "#dc3545" }}/>
                    <span className="badge rounded-pill bg-danger small-badge position-absolute top-0 end-0">Coming Soon</span>
                </div>
            ),
            title: 'Rubric Generator',
            description: 'Easily design personalized and detailed rubrics with our intuitive Rubric Generator.',
            link: '/comingsoon',
            btnColor: 'danger'
        },
        {
            id: 21,
            category: 'Assessment',
            icon: (
                <div className="position-relative">
                    <FaBookReader size={50}  style={{ color: "#198754" }}/>
                    <span className="badge rounded-pill bg-danger small-badge position-absolute top-0 end-0">Coming Soon</span>
                </div>
            ),
            title: 'Comprehension',
            description: 'Easily design personalized and detailed assessments with our intuitive Comprehension.',
            link: '/comingsoon',
            btnColor: 'success'
        },
        {
            id: 22,
            category: 'Gamification',
            icon: (
                <div className="position-relative">
                   <GiPuzzle  size={50} style={{ color: "#198754" }}/>
                    <span className="badge rounded-pill bg-danger small-badge position-absolute top-0 end-0">Coming Soon</span>
                </div>
            ),
            title: 'Cross Word Puzzle',
            description: 'Create engaging crossword puzzles that challenge and sharpen your mind.',
            link: '/comingsoon',
            btnColor: 'success'
        },
        {
            id: 23,
            category: 'Assessment',
            icon: (
                <div className="position-relative">
                   <PiCirclesFourFill size={50} style={{ color: "#0d6efd" }} />
                    <span className="badge rounded-pill bg-danger small-badge position-absolute top-0 end-0">Coming Soon</span>
                </div>
            ),
            title: 'SAT English',
            description: 'Create clear, engaging SAT English lessons that captivate and boost performance.',
            link: '/comingsoon',
            btnColor: 'primary'
        },
        {
            id: 24,
            category: 'Summarizer',
            icon: (
                <div className="position-relative">
                    <FaYoutubeSquare size={50} style={{ color: "#dc3545" }} />
                    <span className="badge rounded-pill bg-danger small-badge position-absolute top-0 end-0">Coming Soon</span>
                </div>
            ),
            title: 'YouTube Q&A',
            description: 'Effortlessly craft dynamic and custom assessments with our YouTube Q&A Generator.',
            link: '/comingsoon',
            btnColor: 'danger'
        },
        {
            id: 25,
            category: 'Summarizer',
            icon: (
                <div className="position-relative">
                     <FaFilePdf size={50} style={{ color: "#6c757d" }} />
                    <span className="badge rounded-pill bg-danger small-badge position-absolute top-0 end-0">Coming Soon</span>
                </div>
            ),
            title: 'PDF Summarizer',
            description: 'Effortlessly create clear and concise document summaries with our PDF Summarizer.',
            link: '/comingsoon',
            btnColor: 'secondary'
        },
    ];

    const filteredCards = cards.filter(card => activeTab === 'All' || card.category === activeTab);

    return (
        <div>
            <PopupWidget
                url="https://calendly.com/vj--npe0/15min/?month=2024-09"
                rootElement={document.getElementById("root")}
                text="Make an appointment"
                textColor="#ffffff"
                color="#FF683B"
            />
            <NavBar />
            <div className="container py-5">
                <div className="d-flex justify-content-center">
                    <ul className="nav nav-pills nav-fill">
                        <li className="nav-item me-2">
                            <button
                                className={`nav-link ${activeTab === 'All' ? 'active' : ''}`}
                                onClick={() => handleTabClick('All')}
                            >
                                All
                            </button>
                        </li>
                        <li className="nav-item me-2">
                            <button
                                className={`nav-link ${activeTab === 'Assessment' ? 'active' : ''}`}
                                onClick={() => handleTabClick('Assessment')}
                            >
                                Assessment
                            </button>
                        </li>
                        <li className="nav-item me-2">
                            <button
                                className={`nav-link ${activeTab === 'Summarizer' ? 'active' : ''}`}
                                onClick={() => handleTabClick('Summarizer')}
                            >
                                Summarizer
                            </button>
                        </li>
                        <li className="nav-item me-2">
                            <button
                                className={`nav-link ${activeTab === 'Gamification' ? 'active' : ''}`}
                                onClick={() => handleTabClick('Gamification')}
                            >
                                Gamification
                            </button>
                        </li>
                        <li className="nav-item me-2">
                            <button
                                className={`nav-link ${activeTab === 'Planner' ? 'active' : ''}`}
                                onClick={() => handleTabClick('Planner')}
                            >
                                Planner
                            </button>
                        </li>
                        <li className="nav-item me-2">
                            <button
                                className={`nav-link ${activeTab === 'Learning' ? 'active' : ''}`}
                                onClick={() => handleTabClick('Learning')}
                            >
                                Learning
                            </button>
                        </li> <li className="nav-item me-2">
                            <button
                                className={`nav-link ${activeTab === 'Specialneeds' ? 'active' : ''}`}
                                onClick={() => handleTabClick('Specialneeds')}
                            >
                                Special needs
                            </button>
                        </li>
                    </ul>
                </div>
                <hr />
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 py-5">
                    {filteredCards.map((card) => (
                        <div className="col" key={card.id}>
                            <div className="d-flex">
                                <div className='card card-hover'>
                                    <div className="card-body text-center">
                                        {card.icon}
                                        <h5 className="fw-bold mt-3 mb-3">{card.title}</h5>
                                        <p className='mb-2'>{card.description}</p>
                                        <hr />
                                        <NavLink className={`btn btn-outline-${card.btnColor}`} to={card.link} onClick={() => trackButtonClick(card.title)}>
                                            Go to {card.title}
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
