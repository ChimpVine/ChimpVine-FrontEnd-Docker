import React, { useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FaXmark } from "react-icons/fa6";
import * as yup from "yup";
import "mathlive";
import "mathlive/static.css";
import "mathlive/fonts.css";
import axios from "axios";
import { convertLatexToMarkup } from "mathlive";

const AddURL = () => {
  const [showPreviewImage, setShowPreviewImage] = useState(false);
  const validateImage = async () => {
    return new Promise((resolve) => {
      const imageUrl = mainForm.watch("image_url");
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        setShowPreviewImage(true);
        mainForm.clearErrors("image_url");

        previewImage.current.src = imageUrl;

        resolve(true);
      };

      image.onerror = () => {
        setShowPreviewImage(false);
        mainForm.setError("image_url", { message: "Invalid image!" });
        resolve(false);
      };
    });
  };

  const schema = yup.object({
    user_question: yup.string(),
    image_url: yup
      .string()
      .required("Required field")
      .test({
        name: "UrlPattern",
        test: (value) => {
          return /^https?:\/\//.test(value);
        },
        message: "Invalid URL",
      })
      .test({
        name: "InvalidImage",
        test: showPreviewImage
          ? validateImage
          : (_, ctx) =>
              ctx.createError({
                message: "Click on Get button before submitting the form.",
              }),
      }),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [result, setResult] = useState(null);

  const mainForm = useForm({
    resolver: yupResolver(schema),
  });

  const previewImage = useRef(null);

  const onSubmit = async (payload) => {
    try {
      setResult(null);
      setError(null);
      setLoading(true);
      const { data } = await axios({
        method: "POST",
        url: "https://chatbot.chimpvine.com/solve_image_url",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResult(data);
    } catch ({ response }) {
      setError(response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-md">
      <div className="row">
        <form
          className="text-center col-lg-6 col-12 mx-auto"
          onSubmit={mainForm.handleSubmit(onSubmit)}
        >
          <div className="row gy-2">
            <div className="col-md-10 col-12">
              <input
                type="text"
                className="form-control w-100"
                placeholder="https://"
                {...mainForm.register("image_url")}
              />
            </div>
            <div className="col-md-2 col-12">
              <button
                className="btn btn-success w-100"
                onClick={(event) => {
                  event.preventDefault();
                  validateImage();
                }}
              >
                Get
              </button>
            </div>
          </div>

          {
            <div
              id="previewContainer"
              className="preview-container position-relative my-2"
              style={{
                display: showPreviewImage ? "block" : "none",
              }}
            >
              <button
                onClick={(event) => {
                  event.preventDefault();
                  mainForm.resetField("image_url");
                  setShowPreviewImage(false);
                }}
                className="btn btn-sm btn-danger rounded-circle position-absolute"
                style={{
                  padding: "0.3em",
                  lineHeight: "0rem",
                  fontSize: "0.75rem",
                  top: "0.25em",
                  right: "0.25em",
                }}
              >
                <FaXmark />
              </button>

              <img src={""} className="w-75" ref={previewImage} />
            </div>
          }

          <span
            className="text-danger font-italic"
            style={{ fontSize: "0.75rem" }}
          >
            {mainForm.formState.errors.image_url?.message}
          </span>

          <textarea
            className="form-control mt-3"
            rows="4"
            placeholder="Describe the problem (optional)"
            {...mainForm.register("user_question")}
            style={{ resize: "none" }}
          />
          <span
            className="text-danger font-italic"
            style={{ fontSize: "0.75rem" }}
          >
            {mainForm.formState.errors.user_question?.message}
          </span>
          <button className="btn btn-success mt-3" disabled={loading}>
            Solve
          </button>
        </form>
      </div>
      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div
          className="alert alert-danger w-50 mx-auto text-center my-4"
          role="alert"
        >
          {error}
        </div>
      ) : (
        mainForm.formState.isSubmitSuccessful && (
          <div className="row">
            <div className="col-12 col-lg-8 mx-auto">
              <div className="card my-4 shadow rounded-3">
                <div className="card-body">
                  <div className="border border-emphasis rounded-3 p-4">
                    <h5 className="card-title">Problem</h5>
                    <p
                      className="card-text"
                      dangerouslySetInnerHTML={{
                        __html: convertLatexToMarkup(
                          result?.problem.replace(/\ /g, "~")
                        ),
                      }}
                    />
                    <hr />

                    <h5 className="card-title">Concept</h5>
                    <p className="card-text">{result?.concept}</p>
                    <hr />
                    <h5 className="card-title">Step-by-Step Solution</h5>
                    <ul className="list-group">
                      {result?.steps.map((step, index) => (
                        <li className="list-group-item" key={index}>
                          <p>
                            <strong>Step {step.step_number}:</strong>
                            &nbsp;&nbsp;
                            {step.description}
                          </p>
                          <p>
                            <strong>Explanation:</strong>&nbsp;&nbsp;
                            {step.explanation}
                          </p>
                          <p>
                            <strong>Calculation:</strong>&nbsp;&nbsp;
                            <span
                              dangerouslySetInnerHTML={{
                                __html: convertLatexToMarkup(
                                  step.calculation.replace(/\ /g, "~")
                                ),
                              }}
                            />
                          </p>
                        </li>
                      ))}
                    </ul>
                    <hr />
                    <h5 className="card-title">Final Answer</h5>
                    <p
                      className="card-text"
                      dangerouslySetInnerHTML={{
                        __html: convertLatexToMarkup(
                          result?.final_answer.replace(/\ /g, "~")
                        ),
                      }}
                    />
                    <hr />
                    <h5 className="card-title">Common Mistakes and Tips</h5>
                    <ul className="list-group">
                      {result?.common_mistakes_and_tips.map((item, index) => (
                        <li className="list-group-item" key={index}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </main>
  );
};

export default AddURL;
