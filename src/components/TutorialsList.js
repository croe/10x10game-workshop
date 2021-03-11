import React, { useState } from "react";
import { useList } from "react-firebase-hooks/database";
import TutorialDataService from "../services/TutorialService";
import Tutorial from "./Tutorial";
import P5Wrapper from 'react-p5-wrapper'
import sketch from './Sketch';

const TutorialsList = () => {
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [state, setState] = useState({ rotation: 160, sketch });

  /* use react-firebase-hooks */
  const [tutorials, loading, error] = useList(TutorialDataService.getAll());

  const refreshList = () => {
    setCurrentTutorial(null);
    setCurrentIndex(-1);
  };

  const setActiveTutorial = (tutorial, index) => {
    const { title, description, published } = tutorial.val();

    setCurrentTutorial({
      key: tutorial.key,
      title,
      description,
      published,
    });

    setCurrentIndex(index);
  };

  const removeAllTutorials = () => {
    TutorialDataService.removeAll()
      .then(() => {
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="list row">
      <div className="col-md-6">
        <P5Wrapper sketch={state.sketch} rotation={state.rotation} />
        <input
          type="range"
          defaultValue={state.rotation}
          min="0"
          max="360"
          step="1"
          onChange={event => setState({ ...state, rotation: event.target.value })}
        />
        <h4>Tutorials List</h4>

        {error && <strong>Error: {error}</strong>}
        {loading && <span>Loading...</span>}
        <ul className="list-group">
          {!loading &&
          tutorials &&
          tutorials.map((tutorial, index) => (
            <li
              className={"list-group-item " + (index === currentIndex ? "active" : "")}
              onClick={() => setActiveTutorial(tutorial, index)}
              key={index}
            >
              {tutorial.val().title}
            </li>
          ))}
        </ul>

        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={removeAllTutorials}
        >
          Remove All
        </button>
      </div>
      <div className="col-md-6">
        {currentTutorial ? (
          <Tutorial tutorial={currentTutorial} refreshList={refreshList} />
        ) : (
          <div>
            <br />
            <p>Please click on a Tutorial...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialsList;
