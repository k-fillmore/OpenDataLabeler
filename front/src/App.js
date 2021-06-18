import logo from "./logo.svg";
import "./App.css";
import BootstrapNavbar from "./components/BootstrapNavbar";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="App">
        <BootstrapNavbar></BootstrapNavbar>
      </div>
      <Router>
        <Switch>
          <Route path="/Home">
            <div>home</div>
          </Route>
          <Route path="/Datasets">
            <div>datasets</div>
          </Route>
          <Route path="/QuickLabeler">
            <div>QuickLabeler</div>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
