import { decode } from 'html-entities'
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';


export default function Quiz(props) {

    //To keep the fetched data
    const [quizData, setQuizData] = useState()

    // To keep track of new games and when to fetch new questions
    const currentRound = props.quizRound

    // To wait for the first fetch
    const [loading, setLoading] = useState(true)

    // if true, the game has ended
    const [showResults, setShowResults] = useState(false)

    // Score-counter
    const [score, setScore] = useState(0)

    // Fuction to shuffle quiz-options
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
            return array
        }
    }



    useEffect(() => {
        getQuizData()
    }
        , [currentRound]
    )

    // Fetching data and manipulating "options" to array of objects. Giving extra properties for end-game display
    function getQuizData() {

        fetch("https://opentdb.com/api.php?amount=5&category=23&&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                setQuizData(prevQuizData => {
                    return data.results.map(question => {
                        const incorrectAnswers = question.incorrect_answers.map(answer => {
                            return {
                                value: answer,
                                id: nanoid(),
                                isHeld: false,
                                isCorrect: false,
                                bgColor: "",
                                txtColor: ""
                            }
                        })
                        const correctAnswer = {
                            value: question.correct_answer,
                            id: nanoid(),
                            isHeld: false,
                            isCorrect: true,
                            bgColor: "",
                            txtColor: ""
                        }
                        const options = [...incorrectAnswers]
                        options.push(correctAnswer)
                        const shuffledOptions = shuffleArray(options)

                        return { ...question, options: shuffledOptions, id: nanoid() }

                    })
                })
                setLoading(false)
                setShowResults(false)
                setScore(0)
            }
            )


    }

    // While fetching the first set of questions this will show 
    if (loading) {
        return (<div className="d-flex justify-content-center loading-data"> <h1> Preparing your quiz...</h1></div>)
    }

    // Toggle selected options
    function toggleHeld(qId, oId) {
        setQuizData(prevQuizData => {
            return prevQuizData.map(question => {
                if (qId === question.id) {
                    const newOptions = question.options.map(option => {
                        return oId === option.id ?
                            { ...option, isHeld: !option.isHeld } :
                            { ...option, isHeld: false }
                    })
                    return { ...question, options: newOptions }
                }
                else {
                    return question
                }

            })
        }
        )
    }

    // "End Game" function that sets the score and reveals correct answers.
    function checkAnswers() {
        setShowResults(true)
        setQuizData(prevQuizData => {
            return prevQuizData.map(question => {

                const checkedAnswers = question.options.map(option => {
                    if (!option.isCorrect && option.isHeld) {
                        return { ...option, bgColor: "#f88a99", txtColor: "white" }
                    }
                    else if (option.isCorrect && option.isHeld) {
                        setScore(x => x + 1)
                        return { ...option, bgColor: "#09e349" }

                    }
                    else if (option.isCorrect && !option.isHeld) {
                        return { ...option, bgColor: "#80B38F" }
                    }
                    else {
                        return { ...option, bgColor: "darkgray", txtColor: "gray" }
                    }

                })
                return { ...question, options: checkedAnswers }
            })
        })
    }

    // Creating HTML-elements for quiz and setting conditional class for selected options
    let quizElements =
        quizData.map(question => (
            <div key={nanoid()} className="question-wrapper ">
                <h3 className="question-title">{decode(question.question)}</h3>
                <div className="question-options-wrapper justify-content-center align-items-center">
                    <div className="row">
                        {question.options.map(option => (
                            <h4 key={nanoid()}
                                className=
                                {!option.isHeld ? "col-md question-option btn" : "col-md question-option option-selected btn"}
                                style={{
                                    backgroundColor: option.bgColor,
                                    color: option.txtColor
                                }}
                                onClick={() => toggleHeld(question.id, option.id)}
                            >
                                {decode(option.value)}
                            </h4>
                        ))}
                    </div>
                </div>
                <hr />
            </div>))


    // Creating the element for button to end the game
    const checkBtn =
        (<button className="btn quiz-btn check-btn" onClick={checkAnswers}>
            Check answers
        </button>)

    // Creating the element for score and new game button
    const newQuiz =
        (<div>
            <h2 className="score-output">Your score: {score} / {quizData.length}</h2>

            <button className="btn quiz-btn" onClick={props.startQuiz()}>
                New Quiz
            </button>
        </div>)

    // Return quiz

    return (
        <div>

            <div>
                <h1 className="main-title">HistoryQuiz!</h1>
                <hr />
                {quizElements}
                <div className="quizfooter text-end">
                    {showResults ? newQuiz : checkBtn}
                </div>
            </div>
        </div>

    )

}

