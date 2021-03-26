import React from "react";
import { Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddTutorial from "./components/AddTutorial";
import TutorialsList from "./components/TutorialsList";

function App() {
  return (
    <div className="fixed_window">
      <Switch>
        <Route exact path="/" component={TutorialsList} />
        <Route exact path="/add" component={AddTutorial} />
      </Switch>
    </div>
  );
}

export default App;
