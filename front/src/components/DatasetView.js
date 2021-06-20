import { React, useState, useEffect } from "react";
import "./DatasetView.css"

function DatasetView() {
  const [datasetId, setDatasetId] = useState(0);
  const [datasetName, setDatasetName] = useState("");
  const [datasetType, setDatasetType] = useState("");
  const [datasetSubtype, setDatasetSubtype] = useState("");
  const [datasetItems, setDatasetItems] = [];

  useEffect(() => {
    loadData();
  }, []);
  function loadData() {
    setDatasetId(0);
    setDatasetName("TESTNAME");
    setDatasetType("Image");
    setDatasetSubtype("Clasification");
  }

  return (
    <div>
      <div className="DatasetDetails">
        <div>ID: {datasetId}</div>
        <div>Name: {datasetName}</div>
        <div>Type: {datasetType}</div>
        <div>Problem: {datasetSubtype}</div>
      </div>
      <div>DatasetTableComponent</div>
    </div>
  );
}

export default DatasetView;
