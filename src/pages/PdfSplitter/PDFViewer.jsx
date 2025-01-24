import React, { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import { FaMagnifyingGlass } from "react-icons/fa6";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const LoadingBlock = () => {
  return (
    <div className="pdf-container-loading">
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

const PDFViewer = ({
  blob,
  pageNumber,
  setPageNumber,
  setShowModal,
  numPages,
  setNumPages,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoaded(true);
  }

  const prevPdf = (event) => {
    event.preventDefault();
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const nextPdf = (event) => {
    event.preventDefault();
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  return (
    <div>
      <div
        className="btn-pdf-modal position-relative mx-auto rounded-2 border border-secondary-emphasis p-1 shadow-sm"
        style={{ width: "fit-content" }}
        onClick={() => setShowModal(true)}
      >
        {isLoaded && (
          <div className="hover-overlay">
            <FaMagnifyingGlass className="text-white" />
          </div>
        )}

        <Document
         
          file={blob}
          className={"pdf-document pdf-viewer"}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<LoadingBlock />}
        >
          <Page
            pageNumber={pageNumber}
            className={"bg-transparent pdf-page pdf-viewer"}
            loading={<LoadingBlock />}
          />
        </Document>
      </div>
      <div
        className="text-center text-secondary-emphasis my-1"
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
  );
};

export default PDFViewer;
