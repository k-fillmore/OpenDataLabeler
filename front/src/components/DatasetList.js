import { React, useState, useEffect } from "react";

import { Card, Button } from "react-bootstrap";
import "./DatasetList.css";
import { useHistory } from "react-router-dom";
import request from "superagent"

function DatasetList() {
  let [datasets, setDatasets] = useState([]);
  const history  = useHistory()
  useEffect(
    () =>
      request.get("http://localhost:8000/api/allDatasets").then((data) => {
        setDatasets(data.body);
        console.log(data.body);
      }),
    []
  );
  function handleClick(dataset) {
    history.push('/DetailedView',{dataset})
        
  }
  function generateCards() {
    return datasets.map((dataset) => {
      return (
        <Card key={dataset.id} style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>{dataset.name}</Card.Title>
            <Card.Text>
              {dataset.kind + " " + dataset.problem}
            </Card.Text>
            <Button variant="dark" onClick={() => handleClick(dataset)}>Label Data</Button>
          </Card.Body>
        </Card>
      );
    });
  }
  return (
    <div className="datasetcards">
      {generateCards()}
    </div>
  );
}

export default DatasetList;
