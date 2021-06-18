import { React, useState } from "react";
import { InputGroup, Button } from "react-bootstrap";

function DatasetCreate() {
  const [datasetId, setDatasetId] = useState(0);
  const [datasetName, setDatasetName] = useState("");
  const [datsetType, setDatasetType] = useState("");
  const [datsetLabels, setDatasetLabels] = useState([]);
  const [datasetItems, setDatasetItems] = useState([]);

  function inputGroup() {
    return (
      <div>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Name"
            aria-label="Name"
            aria-describedby="basic-addon1"
          />
        </InputGroup>

        <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup id="basic-addon1">Type:
                <Button variant="outline-secondary">Image</Button>
                <Button variant="outline-secondary">Text</Button>
                <Button variant="outline-secondary">Audio</Button>
                <Button variant="outline-secondary">Video</Button>
                </InputGroup>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Name"
                aria-label="Name"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
      </div>
    );
  }

  return (
      {inputGroup()}
  );
}

export default DatasetCreate;
