import { useState, useEffect } from "react"
import './App.css'
import Quiz from "./components/quiz"

function App() {

  // Set quizRound to keep track of the new games
  const [quizRound, setQuizRound] = useState(0)

  // Beging the game
  function startQuiz() {
    setQuizRound(prevRound => (
      prevRound + 1
    ))
  }


  // Creating the welcome element
  const welcomeElements = (

    <div className="welcome-wrapper">
      <div className="align-middle text-center">
        <h1>HistoryQuiz!</h1>
        <p>Click the button to start a new quiz!</p>
        <button className="btn quiz-btn" onClick={startQuiz}>New Quiz</button>
      </div>
    </div>
  )



  return (
    <div className="App">
      <div className="container">
        <div className="row justify-content-center">
          <div className="app-wrapper col-md-10 mt-5">
            {quizRound === 0 ? welcomeElements :

              <Quiz
                quizRound={quizRound}
                startQuiz={() => startQuiz}
              />


            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
