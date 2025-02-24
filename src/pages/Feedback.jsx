import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import NavBar from "../components/NavBar";
import { FaArrowRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../spinner/Spinner";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactUs({ BASE_URL, SITE_KEY1 }) {
  const btnStyle = {
    backgroundColor: '#FF683B',
    color: 'white',
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      description: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState(null); // Store the reCAPTCHA token

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setWordCount(countWords(value));
  };

  // Handle reCAPTCHA token generation
  const handleRecaptchaChange = (value) => {
    setRecaptchaToken(value);
  };

  const onSubmit = async (data) => {
    const { full_name, email, description } = data;

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA.");
      return;
    }

    if (wordCount > 50) {
      toast.warn("Your message must not exceed 50 words.");
      return;
    }

    try {
      setIsLoading(true);

      const dataToSend = {
        full_name,
        email,
        description,
        recaptchaToken, // Send the reCAPTCHA token to the server
      };

      await axios.post(`${BASE_URL}/google_sheet`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Form submitted successfully!");
      reset();
      setWordCount(0);
      setRecaptchaToken(null); // Reset reCAPTCHA token after successful submission
    } catch (error) {
      if (error.response) {
        // Log the entire response for debugging
        console.log("Error response:", error.response);
    
        // Extract and log the specific error message
        const errorMessage = error.response.data.error || "An error occurred.";
        console.error("Error message from API:", errorMessage);
    
        // Optionally display the error message in the toast
        toast.error(errorMessage);
      } else if (error.request) {
        // If no response is received from the server
        console.error("No response received from server:", error.request);
        toast.error("No response from the server. Please try again later.");
      } else {
        // Any other errors
        console.error("Error submitting form:", error.message);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavBar id="main-nav" />
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="container-fluid">
        <div className="row justify-content-center mt-4">
          {isLoading ? (
            <div className="col-md-5 text-center">
              <Spinner />
            </div>
          ) : (
            <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded no-print mt-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                <h4 className="text-center mb-3">Feedback Form</h4>

                {/* Full Name */}
                <div className="mb-2">
                  <label htmlFor="full_name" className="form-label">
                    Full Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    className={`form-control form-control-sm ${errors.full_name ? "is-invalid" : ""}`}
                    placeholder="e.g., Alex John Doe"
                    disabled={isLoading}
                    {...register("full_name", {
                      required: "Full Name is required.",
                      pattern: {
                        value: /^[a-zA-Z.\s]+$/,
                        message: "Full Name must contain only letters, spaces, or periods.",
                      },
                      maxLength: {
                        value: 50,
                        message: "Full Name must be 50 characters or fewer.",
                      },
                    })}
                  />
                  {errors.full_name && <div className="invalid-feedback">{errors.full_name.message}</div>}
                </div>

                {/* Email */}
                <div className="mb-2">
                  <label htmlFor="email" className="form-label">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""}`}
                    placeholder="e.g., example@mail.com"
                    disabled={isLoading}
                    {...register("email", {
                      required: "Email is required.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address.",
                      },
                    })}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                {/* Description */}
                <div className="mb-2">
                  <label htmlFor="description" className="form-label">
                    Message <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    id="description"
                    className={`form-control form-control-sm ${errors.description || wordCount > 50 ? "is-invalid" : ""}`}
                    placeholder="e.g., Your Message Over Here"
                    disabled={isLoading}
                    {...register("description", { required: "Description is required." })}
                    onChange={(e) => {
                      handleDescriptionChange(e);
                      setValue("description", e.target.value);
                    }}
                  ></textarea>
                  <small className={`d-flex justify-content-end ${wordCount > 50 ? "text-danger" : "text-muted"}`}>
                    Word count: {wordCount}/50
                  </small>
                  {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
                  {wordCount > 50 && <div className="invalid-feedback">Your message must not exceed 50 words.</div>}
                </div>

                {/* reCAPTCHA */}
                <div className="mb-3">
                  <ReCAPTCHA
                    sitekey={SITE_KEY1} 
                    onChange={handleRecaptchaChange}
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-sm"
                    style={btnStyle}
                    disabled={isLoading}
                  >
                    Submit <FaArrowRight />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
