import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./Dropzone.css";

function Dropzone() {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="Dropzone">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="DropzoneText">Drop the files here ...</p>
        ) : (
          <p className="DropzoneText">Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
}

export default Dropzone;
