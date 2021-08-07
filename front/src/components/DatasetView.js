import { React, useState, useEffect } from "react";
import "./DatasetView.css"
import { useLocation } from "react-router-dom";

function DatasetView() {
  const location = useLocation();
  const dataset = location.state.dataset;
  const [datasetName, setDatasetName] = useState(dataset.name);
  const [datasetId, setDatasetId] = useState(dataset.id);
  const [datasetKind, setDatasetKind] = useState(dataset.kind);
  const [datasetProblem, setDatasetProblem] = useState(dataset.problem);

  
  

  console.log(dataset); 
  return (
    <div>
      <div className="DatasetDetails">
        <div>ID: {datasetId}</div>
        <div>Name: {datasetName}</div>
        <div>Type: {datasetKind}</div>
        <div>Problem: {datasetProblem}</div>
      </div>
      <div>DatasetTableComponent</div>
    </div>
  );
}

export default DatasetView;
