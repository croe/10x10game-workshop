import React, { useState, useCallback } from "react";
import { useHistory } from 'react-router-dom'
import { useList } from "react-firebase-hooks/database";
import TutorialDataService from "../services/TutorialService";
import QuestionDataService from "../services/QuestionService";
import P5Wrapper from 'react-p5-wrapper'
import sketch from './Sketch';

const TutorialsList = () => {
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [state, setState] = useState({ rotation: 160, sketch });
  const history = useHistory();

  /* use react-firebase-hooks */
  const [tutorials, loading, error] = useList(TutorialDataService.getAll());
  const [question, loading1, error1] = useList(QuestionDataService.getAll());

  const refreshList = () => {
    setCurrentTutorial(null);
    setCurrentIndex(-1);
  };

  const setActiveTutorial = (tutorial, index) => {
    const { name, color, x, y } = tutorial.val();

    setCurrentTutorial({
      key: tutorial.key,
      name,
      color,
      x,
      y,
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

  const addPlayer = () => {
    history.push('/add')
  }

  const calculateGame = useCallback(() => {
    if (question) {
      const qArr = question.map(q => q)[0];
      const goalArray = qArr.val().row.map(r => qArr.val().col.map(c => r + c))
      console.log(JSON.stringify(goalArray.flat()), JSON.stringify(qArr.val().answer.flat()))
      if(JSON.stringify(goalArray.flat()) === JSON.stringify(qArr.val().answer.flat())) {
        window.alert('正解です！！')
      } else {
        window.alert('間違いがあります！')
      }
    }
  }, [question])

  const newGame = () => {
    let data = {
      row: [...Array(10)].map(() => Math.floor(Math.random() * 10)),
      col: [...Array(10)].map(() => Math.floor(Math.random() * 10)),
      answer: [...Array(10)].map(() => [...Array(10)].map(() => 0))
    };
    const gameKey = question.map(q => q.key)[0];
    QuestionDataService.update(gameKey, data)
      .then(() => console.log('new game'))
      .catch(e => console.log(e))
  };

  const handleUpdatePlayer = (data) => {
    TutorialDataService.update(currentTutorial.key, data)
      .then(() => setCurrentTutorial({ ...currentTutorial, data}))
      .catch((e) => console.log(e))
  }

  const handleUpdateQuest = (data) => {
    const gameKey = question.map(q => q.key)[0];
    QuestionDataService.update(gameKey, data)
      .then(() => console.log('new game'))
      .catch(e => console.log(e))
  }

  return (
    <div>
      <div className="p-4">
        <P5Wrapper
          sketch={state.sketch}
          players={tutorials}
          selected={currentTutorial}
          question={question}
          updatePlayer={handleUpdatePlayer}
          updateQuest={handleUpdateQuest}
        />
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
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{
                display: 'inline-block',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                margin: '0 4px 0 0',
                background: tutorial ? tutorial.val().color : '#000'}
              } />
              {tutorial.val().name},
              {tutorial.val().x},
              {tutorial.val().y}
            </li>
          ))}
        </ul>

        <button
          className="my-3 mr-3 btn btn-sm btn-danger"
          onClick={removeAllTutorials}
        >
          Remove All
        </button>
        <button
          className="my-3 mr-3 btn btn-sm btn-success"
          onClick={addPlayer}
        >
          Add Player
        </button>
        <button
          className="my-3 mr-3 btn btn-sm btn-info"
          onClick={newGame}
        >
          New Game
        </button>
        <button
          className="my-3 mr-3 btn btn-sm btn-warning"
          onClick={calculateGame}
        >
          Calculate!
        </button>
      </div>
    </div>
  );
};

export default TutorialsList;
