import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "mathlive";
import "mathlive/static.css";
import "mathlive/fonts.css";
import axios from "axios";
import TextWithInlineMath from "./TextWithInlineMath";

const BasicEquation = (backgroundStyle) => {
  const schema = yup.object({
    user_input: yup.string().required("Required field"),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [result, setResult] = useState(null);

  const mainForm = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (payload) => {
    try {
      setResult(null);
      setError(null);
      setLoading(true);
      const { data } = await axios({
        method: "POST",
        url: "https://chatbot.chimpvine.com/solve_text",
        data: {
          user_input:
            payload.user_input +
            ". Math syntax must be in the inline math mode format including correct escape sequences.",
        },
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
        <div className="col-12 col-lg-6 mx-auto">
          <form
            method="POST"
            className="row gy-2 align-items-center"
            onSubmit={mainForm.handleSubmit(onSubmit)}
          >
            <div className="col-sm-10 col-12">
              <math-field
                class="d-block ps-4 py-2 rounded-pill"
                name="user_input"
                placeholder="f(x)="
                onInput={(event) =>
                  mainForm.setValue("user_input", event.target.value)
                }
              >
                {mainForm.watch("user_input")}
              </math-field>
            </div>

            <div className="col-sm-2 col-12">
              <input
                type="submit"
                className="btn btn-md btn-success text-white h-100 w-100 h-auto"
                value="Solve"
                disabled={loading}
              />
            </div>
            <span
              className="text-danger font-italic"
              style={{ fontSize: "0.75rem" }}
            >
              {mainForm.formState.errors.user_input?.message}
            </span>
          </form>
        </div>
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
                    <p className="card-text">
                      <TextWithInlineMath text={result?.problem} />
                    </p>
                    <hr />

                    <h5 className="card-title">Concept</h5>
                    <p className="card-text">
                      <TextWithInlineMath text={result?.concept} />
                    </p>
                    <hr />
                    <h5 className="card-title">Step-by-Step Solution</h5>
                    <ul className="list-group">
                      {result?.steps.map((step, index) => (
                        <li className="list-group-item" key={index}>
                          <p>
                            <strong>Step {step.step_number}:</strong>
                            &nbsp;&nbsp;
                            <TextWithInlineMath text={step.description} />
                          </p>
                          <p>
                            <strong>Explanation:</strong>&nbsp;&nbsp;
                            <TextWithInlineMath text={step.explanation} />
                          </p>
                          <p>
                            <strong>Calculation:</strong>&nbsp;&nbsp;
                            <TextWithInlineMath text={step.calculation} />
                          </p>
                        </li>
                      ))}
                    </ul>
                    <hr />
                    <h5 className="card-title">Final Answer</h5>
                    <p>
                      <TextWithInlineMath text={result?.final_answer} />
                    </p>
                    <hr />
                    <h5 className="card-title">Common Mistakes and Tips</h5>
                    <ul className="list-group">
                      {result?.common_mistakes_and_tips.map((item, index) => (
                        <li className="list-group-item" key={index}>
                          <TextWithInlineMath text={item} />
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

export default BasicEquation;
