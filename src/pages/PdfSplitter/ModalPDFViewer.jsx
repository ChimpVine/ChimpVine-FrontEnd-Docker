import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import * as bootstrap from "bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const LoadingBlock = () => {
  return (
    <div className="pdf-document-page-loading pdf-modal">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

const ModalPDFViewer = ({
  blob,
  pageNumber,
  setPageNumber,
  setShowModal,
  numPages,
  setNumPages,
}) => {
  const modal = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const prevPdf = (event) => {
    event.preventDefault();
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const nextPdf = (event) => {
    event.preventDefault();
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  useEffect(() => {
    const pdfModal = new bootstrap.Modal(modal.current);

    pdfModal.show();

    modal.current.addEventListener("hidden.bs.modal", function (event) {
      setShowModal(false);
    });
  }, []);

  return (
    <div className="modal fade pdfModal" tabIndex="-1" ref={modal}>
      <div className="modal-dialog mx-0" style={{ maxWidth: "none" }}>
        <div
          className="modal-content mx-auto bg-transparent border-0"
          style={{ width: "fit-content" }}
        >
          <Document
            className={"pdf-document pdf-modal"}
            file={blob}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<LoadingBlock />}
          >
            <Page
              className={"bg-transparent pdf-page pdf-modal"}
              pageNumber={pageNumber}
              loading={<LoadingBlock />}
            />
          </Document>
          <div
            className="text-center text-light my-1"
            style={{ fontSize: "0.9rem" }}
          >
            Page {pageNumber} of {numPages || "Loading..."}
          </div>
          <div className="d-flex justify-content-center gap-2 mx-auto w-100">
            <button
              className="btn btn-sm bg-light border border-dark-subtle"
              onClick={prevPdf}
              disabled={pageNumber <= 1}
            >
              <AiOutlineLeft />
            </button>
            <button
              className="btn btn-sm bg-light border border-dark-subtle"
              onClick={nextPdf}
              disabled={pageNumber >= numPages}
            >
              <AiOutlineRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPDFViewer;
