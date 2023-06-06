import { useState, useRef } from "react";
import { quiz } from "../utils/questions";
import Result from "./Result";
import { SwitchTransition, CSSTransition } from "react-transition-group";

export default function Quiz() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswerIsTrue, setSelectedAnswerIsTrue] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const nodeRef = useRef(null);

  const { questions } = quiz;
  const { question, choices, correctAnswer } = questions[activeQuestion];

  const onClickNext = () => {
    setResult((prev) =>
      selectedAnswerIsTrue
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    );
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setActiveQuestion(0);
      setShowResult(true);
    }
  };

  const onClickPrevious = () => {
    if (activeQuestion !== 0) {
      setActiveQuestion((prev) => prev - 1);
    }
  };

  const onAnswerSelected = (answer, index) => {
    if (selectedAnswers.length === 0) {
      setSelectedAnswers((prev) => [...prev, index]);
    } else {
      setSelectedAnswers((prev) =>
        prev[activeQuestion] === undefined
          ? [...prev, index]
          : prev.map((element, i) => {
              if (i === activeQuestion) {
                return index;
              }
              return element;
            })
      );
    }
    if (answer === correctAnswer) {
      setSelectedAnswerIsTrue(true);
    } else {
      setSelectedAnswerIsTrue(false);
    }
  };

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);
  return (
    <div className="quiz-container">
      {!showResult ? (
        <SwitchTransition mode={"out-in"}>
          <CSSTransition
            key={activeQuestion}
            nodeRef={nodeRef}
            addEndListener={(done) => {
              nodeRef.current.addEventListener("transitionend", done, false);
            }}
            classNames="fade"
          >
            <div ref={nodeRef}>
              <div>
                <span className="active-question-no">
                  {addLeadingZero(activeQuestion + 1)}
                </span>
                <span className="total-question">
                  /{addLeadingZero(questions.length)}
                </span>
              </div>
              <h2>{question}</h2>
              <ul>
                {choices.map((answer, index) => (
                  <li
                    onClick={() => onAnswerSelected(answer, index)}
                    key={answer}
                    className={
                      selectedAnswers[activeQuestion] === index
                        ? "selected-answer"
                        : null
                    }
                  >
                    {answer}
                  </li>
                ))}
              </ul>
              <div className="flex-right">
                {activeQuestion !== 0 && (
                  <button
                    onClick={onClickPrevious}
                    disabled={selectedAnswers.length === 0}
                  >
                    {"<"}
                  </button>
                )}
                <button
                  onClick={onClickNext}
                  disabled={!(selectedAnswers[activeQuestion] >= 0)}
                >
                  {activeQuestion === questions.length - 1 ? "Finish" : ">"}
                </button>
              </div>
            </div>
          </CSSTransition>
        </SwitchTransition>
      ) : (
        <Result result={result} questions={questions} />
      )}
    </div>
  );
}
