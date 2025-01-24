import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "mathlive";
import "mathlive/static.css";
import "mathlive/fonts.css";
import axios from "axios";

import { convertLatexToMarkup } from "mathlive";

const PlotEquation = () => {
  const schema = yup.object({
    equation: yup.string().required("Required field"),
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
      const res = await axios({
        method: "POST",
        url: "https://chatbot.chimpvine.com/plot",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      });
    

      setResult({
        image: URL.createObjectURL(res.data),
        problem: mainForm.watch("equation"),
      });
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
                name="equation"
                placeholder="f(x)="
                onInput={(event) =>
                  mainForm.setValue("equation", event.target.value)
                }
              >
                {mainForm.watch("equation")}
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
              {mainForm.formState.errors.equation?.message}
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
                    <p
                      className="card-text"
                      dangerouslySetInnerHTML={{
                        __html: convertLatexToMarkup(
                          result?.problem.replace(/\ /g, "~")
                        ),
                      }}
                    />
                    <hr />

                    <h5 className="card-title">Plot</h5>
                    <div className="w-100">
                      <img src={result.image} className="w-100" />
                    </div>
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

export default PlotEquation;
