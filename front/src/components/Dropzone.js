import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./Dropzone.css";
import request from 'superagent';



function Dropzone(props) {
  let datasetName = props.dName;
  
    
  const onDrop = useCallback((acceptedFiles) => {
    console.log(datasetName);
    const res = request.post('http://localhost:8000/api/upload/images/'+"?datasetName="+datasetName)
    acceptedFiles.forEach((file) => {
      res.attach("images", file).then(res => {console.log("meep")});
      
    });
    
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop} );

  return (
    <div className="Dropzone">
      <div {...getRootProps()}>
        <input {...getInputProps()}/>
        {isDragActive ? (
          <p className="DropzoneText">Drop the files here ...</p>
        ) : (
          <p className="DropzoneText">Drop Files Here or Click Here</p>
        )}
      </div>
    </div>
  );
}

export default Dropzone;
