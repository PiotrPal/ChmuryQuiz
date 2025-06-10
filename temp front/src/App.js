import React, { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  const handleSubmit = (id) => {
    fetch("/api/answer", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, answer: answers[id] })
    })
    .then(res => res.json())
    .then(data => setResults(prev => ({ ...prev, [id]: data.correct })));
  };

  return (
    <div>
      <h1>Quiz</h1>
      {questions.map(q => (
        <div key={q.id}>
          <p>{q.question}</p>
          <input
            type="text"
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
          />
          <button onClick={() => handleSubmit(q.id)}>Submit</button>
          {results[q.id] != null && (
            <p>{results[q.id] ? "Correct!" : "Wrong!"}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
