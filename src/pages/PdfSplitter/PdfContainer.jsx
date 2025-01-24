import React, { useState } from "react";
import ModalPDFViewer from "./ModalPDFViewer";
import PDFViewer from "./PDFViewer";

const PdfContainer = ({ blob }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState();
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <PDFViewer
        blob={blob}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        setShowModal={setShowModal}
        numPages={numPages}
        setNumPages={setNumPages}
      />

      {showModal && (
        <ModalPDFViewer
          blob={blob}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          setShowModal={setShowModal}
          numPages={numPages}
          setNumPages={setNumPages}
        />
      )}
    </div>
  );
};

export default PdfContainer;
