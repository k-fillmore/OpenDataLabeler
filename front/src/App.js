import logo from "./logo.svg";
import "./App.css";
import BootstrapNavbar from "./components/BootstrapNavbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DatasetCreate from "./components/DatasetCreate";
import DatasetView from "./components/DatasetView"

function App() {
  return (
    <>
      <div className="App">
        <BootstrapNavbar></BootstrapNavbar>
      </div>
      {/* Primary Router */}
      <Router>
        <Switch>
          <Route path="/Home">
            <div>home</div>
          </Route>
          <Route path="Datasets/View">
            <div>datasets</div>
          </Route>
          <Route path="/QuickLabeler">
            <div>QuickLabeler</div>
          </Route>

          {/* Dataset Router */}
          <Router basename="Datasets">
            <Switch>
              <Route path="/View">
                <div>View</div>
              </Route>
              <Route path="/Create">
                <div className="PrimaryComponent">
                <DatasetCreate></DatasetCreate>
                </div>
              </Route>
              <Route path="/DetailedView">
                <div className="PrimaryComponent">
                <DatasetView></DatasetView>
                </div>
              </Route>
            </Switch>
          </Router>

        </Switch>
      </Router>
    </>
  );
}

export default App;
