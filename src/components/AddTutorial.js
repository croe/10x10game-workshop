import React, { useState } from 'react';
import DatabaseService from '../services/TutorialService'
import { CirclePicker } from 'react-color'
import { Link } from 'react-router-dom'

const AddTutorial = () => {
  const initialTutorialState = {
    name: "",
    color: "",
    x: 0,
    y: 0,
  };
  const [tutorial, setTutorial] = useState(initialTutorialState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setTutorial({ ...tutorial, [name]: value });
  };

  const saveTutorial = () => {
    let data = {
      name: tutorial.name,
      color: tutorial.color,
      x: 1,
      y: 1,
    };

    DatabaseService.create(data)
      .then(() => {
        setSubmitted(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newTutorial = () => {
    setTutorial(initialTutorialState);
    setSubmitted(false);
  };

  const handleChange = (color, event) => {
    console.log(color, tutorial)
    setTutorial({...tutorial, color: color.hex})
  }

  return (
    <div className="submit-form pt-4">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newTutorial}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="name">Player name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              required
              value={tutorial.name}
              onChange={handleInputChange}
              name="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <CirclePicker onChange={handleChange} />
          </div>

          <button onClick={saveTutorial} className="btn btn-success">
            Submit
          </button>
          <div className="mt-2">
            <Link to="/">戻る</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTutorial;
