import React from "react"

export default function Start(props) {

  return (
    <div className="app">
      <h1 className="quizzial-text">Quizzial Text</h1>

      <p>This is a paragraph that appears when you click the button.</p>
      
      <button  onClick={props.onClick} className="start-quiz-button">Start Quiz</button>
    </div>
  );
}
