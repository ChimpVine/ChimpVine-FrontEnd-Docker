import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import BasicEquation from "./BasicEquation";
import PlotEquation from "./PlotEquation";
import AddURL from "./AddURL";
import UploadProblem from "./UploadProblem";
import NavBar from "../NavBar";

const MathCal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFirstLogin, setIsFirstLogin] = useState(true); 

  const navLinks = useRef();

  const TABS = [
    { search: "basic-equation", title: "Basic Equation" },
    { search: "upload-problem", title: "Upload problem" },
    { search: "add-url", title: "Add URL" },
    { search: "plot-equation", title: "Plot equation" },
  ];

  
  React.useEffect(() => {
    if (isFirstLogin) {
      setSearchParams({ tool: "basic-equation" }); 
      setIsFirstLogin(false);
    }
  }, [isFirstLogin, setSearchParams]);

  return (
    <>
      <NavBar />
      <div className="mb-4">
        <div className="mb-4 w-100 mx-auto">
          <h3 className="text-center mt-5">
            One Stop Solution For Mathematics
            <span className="tampered ms-2 pb-2">Homework Help</span>
          </h3>
          <p className="text-center text-muted mt-3">
            Get step-by-step solutions for Math subject, exactly when you need
            them.
          </p>
        </div>
        <div>
          <ul
            className="nav nav-math-cal nav-pills justify-content-center"
            id="tabs"
            role="tablist"
          >
            {TABS.map((tab, index) => (
              <li key={index}>
                <Link
                  ref={navLinks}
                  to={{ search: `?tool=${tab.search}` }}
                  className={`nav-link nav-link-tools me-3 text-decoration-none ${
                    searchParams.get("tool") === tab.search ? "active" : ""
                  }`}
                >
                  {tab.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {searchParams.get("tool") === "upload-problem" ? (
        <UploadProblem />
      ) : searchParams.get("tool") === "add-url" ? (
        <AddURL />
      ) : searchParams.get("tool") === "plot-equation" ? (
        <PlotEquation />
      ) : (
        <BasicEquation />
      )}
    </>
  );
};

export default MathCal;
