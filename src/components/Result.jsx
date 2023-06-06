export default function Result({ questions, result }) {
  return (
    <div className="result">
      <h3>Result</h3>
      <p>
        Total Question: <span>{questions.length}</span>
      </p>
      <p>
        Total Score:<span> {result.score}</span>
      </p>
    </div>
  );
}
