import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import NavBar from '../../NavBar';
import {
    FaBookReader,
    FaPenAlt,
    FaTeamspeak 
} from "react-icons/fa";
import { MdHearing } from "react-icons/md";
import NavBreadcrumb from '../../../pages/BreadCrumb/BreadCrumb';

export default function Comprehension() {
    const location = useLocation();
    const isChildRoute = location.pathname !== '/comprehension';

    const cards = [
        {
            id: 1,
            icon: <FaBookReader size={50} style={{ color: "#198754" }} />,
            title: 'Reading',
            description: 'Plan and organize your lessons effectively with our easy-to-use Lesson Planner.',
            link: '/comprehension/reading',
            btnColor: 'success',
        },
        {
            id: 2,
            icon: <FaPenAlt size={50} />,
            title: 'Writing',
            description: 'Design comprehensive workbooks for your students with our Workbook Planner.',
            link: '/comprehension/writing',
            btnColor: 'dark',
        },
        {
            id: 3,
            icon: (
                <div className="position-relative">
                    <MdHearing size={50} style={{ color: "#dc3545" }} />
                    <span
                        className="badge rounded-pill bg-danger small-badge position-absolute top-0 end-0">
                        Coming Soon
                    </span>
                </div>
            ),
            title: 'Listening',
            description: 'Easily create and customize worksheets for your students with our Worksheet Planner.',
            link: '/comingsoon',
            btnColor: 'danger',
        },
        {
            id: 4,
            icon: (
                <div className="position-relative">
                    <FaTeamspeak size={50} />
                    <span
                        className="badge rounded-pill bg-danger small-badge position-absolute top-0 end-0">
                        Coming Soon
                    </span>
                </div>
            ),
            title: 'Speaking',
            description: 'Create intriguing mystery cases that captivate and challenge your investigative skills.',
            link: '/comingsoon',
            btnColor: 'dark',
        },
    ];

    const breadcrumbItems = [
        { label: 'Main Panel', href: '/ai-tools-for-teachers', active: false },
        { label: 'Comprehension', active: true },
    ];

    return (
        <>
            <NavBar />
            <div className="container py-5">
                {!isChildRoute && (
                    <>
                        <NavBreadcrumb items={breadcrumbItems} />
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 py-5">
                            {cards.map((card) => (
                                <div className="col" key={card.id}>
                                    <div className="d-flex">
                                        <div className="card">
                                            <div className="card-body text-center">
                                                {card.icon}
                                                <h5 className="fw-bold mt-3 mb-3">{card.title}</h5>
                                                <p className="mb-2">{card.description}</p>
                                                <hr />
                                                <NavLink
                                                    className={`btn btn-outline-${card.btnColor}`}
                                                    to={card.link}>
                                                    Go to {card.title}
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <Outlet />
            </div>
        </>
    );
}
