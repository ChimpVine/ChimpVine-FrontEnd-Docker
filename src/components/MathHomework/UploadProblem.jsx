import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import "mathlive";
import "mathlive/static.css";
import "mathlive/fonts.css";
import axios from "axios";
import { FaXmark } from "react-icons/fa6";

import { convertLatexToMarkup } from "mathlive";

const UploadProblem = () => {
  const schema = yup.object({
    user_question: yup.string(),
    image: yup
      .mixed()
      .test({
        name: "fileLengthTest",
        test: (file_list) => {
         

          return file_list && file_list.length != 0;
        },
        message: "Required",
      })
      .test({
        name: "fileTypeTest",
        test: (file_list) => {
         
          const allowedMimeTypes = [
            "image/gif",
            "image/jpe",
            "image/jpg",
            "image/jpeg",
            "image/png",
          ];

          return (
            file_list &&
            file_list.length !== 0 &&
            allowedMimeTypes.includes(file_list[0].type)
          );
        },
        message: "Inappropriate image type. Allowed: .gif, .png, .jpg",
      }),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [result, setResult] = useState(null);

  const [previewImage, setPreviewImage] = useState(null);

  const mainForm = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (payload) => {
    try {
      setResult(null);
      setError(null);
      setLoading(true);

      const formData = new FormData();

      formData.append("image", payload.image[0]);
      formData.append("user_question", payload.user_question);

      const { data } = await axios({
        method: "POST",
        url: "https://chatbot.chimpvine.com/solve_image_upload",
        data: formData,
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
        <div className="col-12 col-lg-6 mx-auto">
          <div className="card my-4 shadow rounded-3">
            <div className="card-body">
              <form
                className="text-center d-flex flex-column justify-content-center align-items-center w-75 mx-auto"
                onSubmit={mainForm.handleSubmit(onSubmit)}
              >
                <input
                  type="file"
                  id="fileInput"
                  accept="image/png, image/gif, image/jpeg"
                  className="d-none"
                  {...mainForm.register("image", {
                    onChange: (event) => {
                      setPreviewImage(
                        URL.createObjectURL(event.target.files[0])
                      );
                    },
                  })}
                />
                <p className="text-muted">Upload Image</p>
                <label
                  htmlFor="fileInput"
                  className="btn btn-success mb-3"
                  style={{ width: "fit-content" }}
                >
                  Choose File
                </label>
                <span
                  className="text-danger font-italic"
                  style={{ fontSize: "0.75rem" }}
                >
                  {mainForm.formState.errors.image?.message}
                </span>
                {previewImage && (
                  <div id="dropArea" className="drop-area">
                    <div
                      id="previewContainer"
                      className="preview-container position-relative"
                    >
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          mainForm.resetField("image");
                          setPreviewImage(null);
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
                      <img src={previewImage} className="w-75" />
                    </div>
                  </div>
                )}

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
                  <>
                    <ul className="list-group my-4">
                      <li className="list-group-item">
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
                          {result?.common_mistakes_and_tips.map(
                            (item, index) => (
                              <li className="list-group-item" key={index}>
                                {item}
                              </li>
                            )
                          )}
                        </ul>
                      </li>
                    </ul>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UploadProblem;
