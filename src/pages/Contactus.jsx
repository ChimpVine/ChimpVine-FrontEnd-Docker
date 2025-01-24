import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import NavBar from "../components/NavBar";
import { FaArrowRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../spinner/Spinner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

function ContactUs({ BASE_URL }) {
  const btnStyle = {
    backgroundColor: '#FF683B',
    color: 'white',
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
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
  const [wordCount, setWordCount] = useState(0); // State to track word count
  const { executeRecaptcha } = useGoogleReCaptcha();

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length; // Count non-empty words
  };

  const description = watch("description") || ""; // Watch the description field to dynamically update word count

  // Update word count whenever the description changes
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setWordCount(countWords(value));
  };

  const onSubmit = async (data) => {
    const { full_name, email, description } = data;

    if (!executeRecaptcha) {
      toast.error("Failed to load reCAPTCHA.");
      return;
    }

    // Ensure word count does not exceed 50 words
    if (wordCount > 50) {
      toast.warn("Your message must not exceed 50 words.");
      return;
    }

    try {
      setIsLoading(true);

      // Execute reCAPTCHA
      const token = await executeRecaptcha("submit");

      // Prepare data for API
      const dataToSend = {
        full_name,
        email,
        description,
        recaptchaToken: token,
      };

      await axios.post(`${BASE_URL}/google_sheet`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Form submitted successfully!");
      reset(); // Reset the form after successful submission
      setWordCount(0); // Reset word count
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar id="main-nav" />
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="container-fluid">
        <div className="row justify-content-center mt-5">
          {isLoading ? (
            <div className="col-md-5 text-center">
              <Spinner />
            </div>
          ) : (
            <div className="col-md-5 border border-4 rounded-3 pt-4 pb-3 ps-5 pe-5 shadow p-3 bg-body rounded no-print mt-5">
              <form onSubmit={handleSubmit(onSubmit)}>
                <h4 className="text-center mb-3">Contact Us</h4>

                {/* Full Name */}
                <div className="mb-2">
                  <label htmlFor="full_name" className="form-label">
                    Full Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    className={`form-control form-control-sm ${errors.full_name ? "is-invalid" : ""
                      }`}
                    placeholder="e.g., Alex John Doe"
                    disabled={isLoading}
                    {...register("full_name", {
                      required: "Full Name is required.",
                      pattern: {
                        value: /^[a-zA-Z.\s]+$/,
                        message:
                          "Full Name must contain only letters, spaces, or periods.",
                      },
                      maxLength: {
                        value: 50,
                        message: "Full Name must be 50 characters or fewer.",
                      },
                    })}
                  />
                  {errors.full_name && (
                    <div className="invalid-feedback">{errors.full_name.message}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-2">
                  <label htmlFor="email" className="form-label">
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""
                      }`}
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
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-2">
                  <label htmlFor="description" className="form-label">
                    Message <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    id="description"
                    className={`form-control form-control-sm ${errors.description || wordCount > 50 ? "is-invalid" : ""
                      }`}
                    placeholder="e.g., Your Message Over Here"
                    disabled={isLoading}
                    {...register("description", {
                      required: "Description is required.",
                    })}
                    onChange={(e) => {
                      handleDescriptionChange(e);
                      setValue("description", e.target.value);
                    }}
                  ></textarea>
                  <small
                    className={`d-flex justify-content-end ${wordCount > 50 ? "text-danger" : "text-muted"
                      }`}
                  >
                    Word count: {wordCount}/50
                  </small>
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description.message}</div>
                  )}
                  {wordCount > 50 && (
                    <div className="invalid-feedback">
                      Your message must not exceed 50 words.
                    </div>
                  )}
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
    </>
  );
}

export default ContactUs;
