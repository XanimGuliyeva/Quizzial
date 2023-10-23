import React, { useState, useEffect } from 'react';

function Questions() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameInProgress, setGameInProgress] = useState(true);

  useEffect(() => {
    // Fetch questions when the component mounts
    fetchQuestions();
  }, []);

  // Function to fetch questions
  const fetchQuestions = () => {
    fetch('https://opentdb.com/api.php?amount=2')
      .then((response) => response.json())
      .then((data) => {
        // Modify the API response to insert the correct answer into the incorrect answers array
        const modifiedQuestions = data.results.map((question) => {
          const incorrectAnswers = question.incorrect_answers;
          // Combine the correct and incorrect answers into a single array
          const allAnswers = [question.correct_answer, ...incorrectAnswers];
          // Shuffle the combined array to place the correct answer randomly
          const shuffledAnswers = shuffleArray(allAnswers);
          return { ...question, answers: shuffledAnswers };
        });

        setQuestions(modifiedQuestions);
        // Reset game state when new questions are fetched
        setSelectedAnswers({});
        setCorrectCount(0);
        setGameInProgress(true);
      });
  };

  // Shuffle an array using the Fisher-Yates algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleAnswerChange = (questionIndex, answerIndex) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answerIndex,
    }));
  };

  const checkAnswers = () => {
    // Calculate the number of correct answers and update the label background color accordingly
    const updatedQuestions = questions.map((question, questionIndex) => {
      const isCorrect = selectedAnswers[questionIndex] === 0; // 0 represents the index of the correct answer
      return {
        ...question,
        isCorrect,
      };
    });

    const countCorrect = updatedQuestions.filter((question) => question.isCorrect).length;
    setCorrectCount(countCorrect);
    setQuestions(updatedQuestions);
    setGameInProgress(false); // Disable the game after checking answers
  };

  const startNewGame = () => {
    // Reset the game state to start a new game
    fetchQuestions()
    setSelectedAnswers({});
    setCorrectCount(0);
    setGameInProgress(true);
  };

  return (
    <div>
      <h2>Quiz Questions</h2>
      <form>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <p>{question.question}</p>
            <div className="datas">
              {question.answers.map((answer, answerIndex) => (
                <label
                  className={`answer-label ${
                    selectedAnswers[questionIndex] === answerIndex ? 'selected' : ''
                  } ${
                    selectedAnswers[questionIndex] === answerIndex && question.isCorrect
                      ? 'correct'
                      : selectedAnswers[questionIndex] === answerIndex &&
                        question.isCorrect === false
                      ? 'incorrect'
                      : ''
                  }`}
                  key={answerIndex}
                >
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    value={answerIndex}
                    checked={selectedAnswers[questionIndex] === answerIndex}
                    onChange={() => handleAnswerChange(questionIndex, answerIndex)}
                    disabled={!gameInProgress} // Disable labels when the game is not in progress
                  />
                  {answer}
                </label>
              ))}
            </div>
          </div>
        ))}
      </form>
      <button className="start-quiz-button" onClick={gameInProgress ? checkAnswers : startNewGame}>
        {gameInProgress ? 'Check Answers' : 'New Game'}
      </button>
      <p>{correctCount}/{questions.length} correct answers</p>
    </div>
  );
}

export default Questions;
