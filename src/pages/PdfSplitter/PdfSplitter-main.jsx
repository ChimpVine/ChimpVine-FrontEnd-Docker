import React, { useState } from "react";
import {
    AiOutlineUpload,
    AiOutlineScissor,
    AiOutlinePlus,
    AiOutlineMinus,
    AiOutlineDownload,
} from "react-icons/ai";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import { PDFDocument } from "pdf-lib";
import PdfContainer from "./PdfContainer";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from '../../components/NavBar'
import "../../../src/assests/css/style.css"

function App() {
    const labelStyle = { fontSize: "0.85rem" };
    const errorMessageStyle = {
        top: "5.5em",
        fontSize: "0.7rem",
    };


    const [pdf, setPdf] = useState(null);


    const [splitPdfs, setSplitPdfs] = useState([]);


    const pdfSchema = yup.object({
        uploadedFile: yup.mixed().test({
            name: "error",
            test: (file_list, ctx) => {

                if (!file_list || file_list.length === 0) {
                    return ctx.createError({ message: "Required." });
                }
                const allowedMimeTypes = ["application/pdf"];

                if (!allowedMimeTypes.includes(file_list[0].type)) {
                    return ctx.createError({ message: "Only PDF" });
                }
                return true;
            },
        }),
    });

    const rangesSchema = yup.object({
        ranges: yup
            .array()
            .of(
                yup.object({
                    fromPage: yup
                        .number()
                        .required()
                        .typeError("Required")
                        .positive("Must be greater than 0")
                        .integer()
                        .test({
                            name: "fromPageTest",
                            test: (val, ctx) => {
                                if (val > pdf.getPageCount()) {
                                    return ctx.createError({
                                        type: "totalPageTest",
                                        message: "Must be less than total page",
                                    });
                                }

                                return true;
                            },
                        }),
                    toPage: yup
                        .number()
                        .required()
                        .typeError("Required")
                        .positive("Must be greater than 0")
                        .integer()
                        .test({
                            name: "toPageTest",
                            test: (val, ctx) => {
                                if (val > pdf.getPageCount()) {
                                    return ctx.createError({
                                        type: "totalPageTest",
                                        message: "Must be less than total page",
                                    });
                                }
                                if (val < ctx.parent.fromPage) {
                                    return ctx.createError({
                                        type: "fromVToTest",
                                        message: "Must be greater than fromPage",
                                    });
                                }

                                return true;
                            },
                        }),
                })
            )
            .test({
                name: "ranges",
                test: (value, ctx) => {
                    const sortedRanges = value
                        .map((r) => ({
                            from: parseInt(r.fromPage, 10),
                            to: parseInt(r.toPage, 10),
                        }))
                        .sort((a, b) => a.from - b.from);

                    for (let i = 1; i < sortedRanges.length; i++) {
                        if (sortedRanges[i].from <= sortedRanges[i - 1].to) {
                            return false;
                        }
                    }

                    return true;
                },
                message: "Overlapped",
            }),
    });

    const pdfForm = useForm({
        resolver: yupResolver(pdfSchema),
        mode: "onChange",
    });

    const rangesForm = useForm({
        resolver: yupResolver(rangesSchema),
        mode: "onChange",
        defaultValues: {
            ranges: [{ fromPage: "", toPage: "" }],
        },
    });



    const { fields, append, remove } = useFieldArray({
        control: rangesForm.control,
        name: "ranges",
    });


    const pdfOnChange = async (event) => {
        if (pdfForm.watch("uploadedFile")[0]) {
            const arrayBuffer = await pdfForm.watch("uploadedFile")[0].arrayBuffer();
            const pdfDoc = await PDFDocument.load(new Uint8Array(arrayBuffer));

            setPdf(pdfDoc);
        }
    };


    const onSplitSubmit = (data) => {
        splitPDF(data.ranges);
    };


    const splitPDF = async (ranges_) => {
        let newSplitPdfs = [];

        try {

            for (let i = 0; i < ranges_.length; i++) {
                const { fromPage, toPage } = ranges_[i];
                const from = parseInt(fromPage, 10);
                const to = parseInt(toPage, 10);
                const newPdf = await PDFDocument.create();
                const copiedPages = await newPdf.copyPages(
                    pdf,

                    Array.from({ length: to - from + 1 }, (_, idx) => from - 1 + idx)
                );


                copiedPages.forEach((page) => newPdf.addPage(page));

                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);

                newSplitPdfs.push({
                    url,
                    blob,
                    id: i,
                    fromPage: from,
                    toPage: to,
                    name: `split_${from}-${to}.pdf`,
                });
            }
            setSplitPdfs(newSplitPdfs);
        } catch (error) {
            rangesForm.setError("ranges", "Error occured");
        }
    };

    const onChangeFromPage = (event, index) => {
        const toPage = +rangesForm.watch(`ranges.${index}.toPage`);
        const fromPage = +event.target.value;
        if (toPage) {
            if (
                rangesForm.formState.errors.ranges?.[index]?.toPage?.type ===
                "totalPageTest"
            ) {
                return;
            }

            if (fromPage > toPage) {
                rangesForm.setError(`ranges.${index}.toPage`, {
                    type: "fromVToTest",
                    message: "Must be greater than toPage",
                });
            } else {
                rangesForm.clearErrors(`ranges.${index}.toPage`);
            }
        }
    };

    const resetForms = () => {
        rangesForm.reset();
        pdfForm.reset();
        setSplitPdfs([]);
    };

    return (
        <>
            <Navbar/>
            <div className="container-md">
                <div className="row">
                    <div className="text-center mt-3">
                        <h4 className="display-5 fw-bold">Split Your PDFs with Ease</h4>
                        <p className="lead text-muted">Quickly split PDF files for seamless management and sharing.</p>
                    </div>                
                    <div className="col-12 col-lg-7 mx-auto">
                        <div className="card-body">
                            {rangesForm.formState.isSubmitSuccessful ? (
                                <div id="output-section">
                                    <button className="btn btn-sm" onClick={resetForms}>
                                        <FaArrowLeft /> Go back
                                    </button>
                                    <div className="row">
                                        {splitPdfs.map((pdf) => (
                                            <div key={pdf.id} className="mb-4 col-12 col-md-6">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className="text-center">
                                                            Pages {pdf.fromPage} - {pdf.toPage}
                                                        </h5>
                                                        <PdfContainer blob={pdf} />

                                                        <div className="text-center mt-3">
                                                            <a
                                                                href={pdf.url}
                                                                download={pdf.name}
                                                                className="btn btn-sm btn-danger"
                                                            >
                                                                <AiOutlineDownload /> Download PDF
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <form>
                                        <div className="text-center">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                accept="application/pdf"
                                                hidden
                                                {...pdfForm.register("uploadedFile", {
                                                    onChange: pdfForm.handleSubmit(pdfOnChange),
                                                })}
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="btn btn-danger mb-2"
                                            >
                                                <AiOutlineUpload /> Upload PDF
                                            </label>
                                        </div>
                                        <div
                                            className="w-100 text-danger text-center"
                                            style={errorMessageStyle}
                                        >
                                            {pdfForm.formState.errors.uploadedFile?.message}
                                        </div>
                                        {pdfForm.formState.dirtyFields.uploadedFile &&
                                            !pdfForm.formState.errors.uploadedFile && (
                                                <PdfContainer
                                                    blob={pdfForm.watch("uploadedFile")[0]}
                                                />
                                            )}
                                    </form>
                                    {pdfForm.formState.dirtyFields.uploadedFile &&
                                        !pdfForm.formState.errors.uploadedFile && (
                                            <div id="range-container" className="mt-4">
                                                <div className="fw-bold">Specify ranges</div>
                                                <form>
                                                    {fields.map((range, index) => (
                                                        <div className="row range-group" key={index}>
                                                            <div className="col-4 col-md-5">
                                                                <div className="form-group position-relative pb-4">
                                                                    <label className="label" style={labelStyle}>
                                                                        From Page
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        {...rangesForm.register(
                                                                            `ranges.${index}.fromPage`,
                                                                            {
                                                                                onChange: (event) =>
                                                                                    onChangeFromPage(event, index),
                                                                            }
                                                                        )}
                                                                    />
                                                                    {rangesForm.formState.errors.ranges && (
                                                                        <div
                                                                            className="position-absolute start-0 w-100 text-danger"
                                                                            style={errorMessageStyle}
                                                                        >
                                                                            {
                                                                                rangesForm.formState.errors.ranges[
                                                                                    index
                                                                                ]?.fromPage?.message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-4 col-md-5">
                                                                <div className="form-group position-relative pb-2">
                                                                    <label className="label" style={labelStyle}>
                                                                        To Page
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        {...rangesForm.register(
                                                                            `ranges.${index}.toPage`
                                                                        )}
                                                                    />
                                                                    {rangesForm.formState.errors.ranges && (
                                                                        <div
                                                                            className="position-absolute start-0 w-100 text-danger"
                                                                            style={errorMessageStyle}
                                                                        >
                                                                            {
                                                                                rangesForm.formState.errors.ranges[
                                                                                    index
                                                                                ]?.toPage?.message
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-4 col-md-2">
                                                                {index === 0 ? (
                                                                    <button
                                                                        className="btn btn-sm btn-success btn-icon gap-1 mt-4 w-100"
                                                                        onClick={(event) => {
                                                                            event.preventDefault();
                                                                            append({ fromPage: "", toPage: "" });
                                                                        }}
                                                                    >
                                                                        <AiOutlinePlus /> Add
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-sm btn-danger btn-icon gap-1 mt-4 w-100"
                                                                        onClick={(event) => {
                                                                            event.preventDefault();
                                                                            fields.length > 0 && remove(index);
                                                                        }}
                                                                    >
                                                                        <AiOutlineMinus /> Remove
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div
                                                        className="text-danger my-2"
                                                        style={{ fontSize: "0.9rem" }}
                                                    >
                                                        {
                                                            rangesForm.formState.errors.ranges?.root
                                                                ?.message
                                                        }
                                                    </div>
                                                    <div className="w-100 text-center">
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={rangesForm.handleSubmit(onSplitSubmit)}
                                                        >
                                                            <AiOutlineScissor /> Split PDF
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
