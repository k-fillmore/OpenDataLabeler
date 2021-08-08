import { React, useState, useEffect, Image } from "react";
import "./DatasetView.css";
import { useLocation } from "react-router-dom";
import request from "superagent";
import { Button, Modal,Form } from "react-bootstrap";

function DatasetView() {
  const location = useLocation();
  let dataset = location.state.dataset;
  const [datasetName, setDatasetName] = useState(dataset.name);
  const [datasetId, setDatasetId] = useState(dataset.id);
  const [datasetKind, setDatasetKind] = useState(dataset.kind);
  const [datasetProblem, setDatasetProblem] = useState(dataset.problem);
  const [datasetFiles, setDatasetFiles] = useState([]);
  const [datasetLabels, setDatasetLabels] = useState(dataset.label);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchDatasetFiles(datasetId, "original").then((files) => {
      setDatasetFiles(files);
    });
    fetchDataset(datasetId);
  }, []);

  function fetchDataset(datasetId) {
    return new Promise((resolve, reject) => {
      request
        .get(`http://localhost:8000/api/dataset/`)
        .query({ dataset_id: datasetId })
        .end((err, res) => {
          if (err) {
            reject(err);
            console.log(err);
          } else {
            resolve(res.body);
            dataset = res.body;
            setDatasetName(dataset.name);
            setDatasetId(dataset.id);
            setDatasetKind(dataset.kind);
            setDatasetProblem(dataset.problem);
            setDatasetLabels(dataset.label);
          }
        });
    });
  }

  function fetchDatasetFiles(datasetId, directory) {
    return new Promise((resolve, reject) => {
      request
        .get("http://localhost:8000/api/dataset/listdirectory")
        .query("dataset_id=" + datasetId + "&directory=" + directory)
        .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.body);
          }
        });
    });
  }

  function getImageToLabel(file) {
    if (file == null) {
      return null;
    }
    const uri = "http://localhost:8000/api/dataset/fetchExample?file=" + file;
    return uri;
  }

  function labelbuttons() {
    if (datasetLabels.length > 0) {
      console.log(datasetLabels);
      return datasetLabels.map((item) => {
        return <Button variant="dark">{item}</Button>;
      });
    } else{
      return <Button variant="dark" onClick={() => handleShow()}>Press to Add Label</Button>
    }
  }
  function managelabels() {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>Labels</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {datasetLabels.map((item) => {
              return (
                <div key={item}>
                  {item} 
                  <Button variant="dark" key={item}>Remove</Button>
                </div>
                );
            })}
          </Modal.Body>

          <Modal.Footer>
            <Form>
            <Form.Control type="text" placeholder="Enter Label" />
            </Form>
            <Button variant="dark">Add Label</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    );
  }

  console.log(datasetLabels);

  //console.log(dataset);
  return (
    <div>
      <div className="DatasetDetails">
        <div>ID: {datasetId}</div>
        <div>Name: {datasetName}</div>
        <div>Type: {datasetKind}</div>
        <div>Problem: {datasetProblem}</div>
      </div>
      <img src={getImageToLabel(datasetFiles[0])}></img>
      <div>{labelbuttons()}</div>
      <div>
        {managelabels()}
        <Button variant="dark" onClick={() => handleShow()}>
          Manage Labels
        </Button>
      </div>
    </div>
  );
}

export default DatasetView;
