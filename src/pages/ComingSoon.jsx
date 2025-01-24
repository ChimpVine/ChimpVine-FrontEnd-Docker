import React from 'react'
import NavBar from '../components/NavBar'
import { NavLink } from 'react-router-dom'

export default function Error404Page() {

  const btnStyle = {
    backgroundColor: '#FF683B',
    color: 'white',
  };

  return (
    <>
      <NavBar />
      <div className="d-flex align-items-center justify-content-center mt-5">
        <div className="text-center">
          <h1 className="display-1 fw-bold">Coming Soon</h1>
          <NavLink to="/ai-tools-for-teachers">
            <button className='btn btn-lg mt-4 mb-5' style={btnStyle}>Go to AI Tools</button>
          </NavLink>
          <p className="lead">
            We are working hard to bring something amazing. Check back soon for updates!
          </p>
        </div>
      </div>
    </>
  )
}
