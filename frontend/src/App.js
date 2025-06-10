import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import your CSS file for styling

function App() {
  
  const [role, setRole] = useState(null); // "admin" lub "user"
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuizName, setNewQuizName] = useState("");
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "",
  });
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [userQuizStarted, setUserQuizStarted] = useState(false);
  const [currentUserQuestionIndex, setCurrentUserQuestionIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/quizzes");
      setQuizzes(res.data);
    } catch (error) {
      console.error("Błąd pobierania quizów:", error);
    }
  };

  const fetchQuestions = async (quizId) => {
    try {
      const res = await axios.get(`http://localhost:5000/quizzes/${quizId}/questions`);
      setQuestions(res.data);
    } catch (error) {
      console.error("Błąd pobierania pytań:", error);
    }
  };

  const handleAddQuiz = async () => {
    if (!newQuizName) return alert("Wpisz nazwę quizu");
    try {
      await axios.post("http://localhost:5000/quizzes", { name: newQuizName });
      setNewQuizName("");
      fetchQuizzes();
    } catch (error) {
      console.error("Błąd dodawania quizu:", error);
    }
  };

  const handleAddQuestion = async () => {
    if (
      !newQuestion.question ||
      !newQuestion.option_a ||
      !newQuestion.option_b ||
      !newQuestion.option_c ||
      !newQuestion.option_d ||
      !newQuestion.correct_option
    ) {
      return alert("Wypełnij wszystkie pola pytania i odpowiedzi");
    }
    try {
      await axios.post(
        `http://localhost:5000/quizzes/${selectedQuiz.id}/questions`,
        newQuestion
      );
      setNewQuestion({
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "",
      });
      fetchQuestions(selectedQuiz.id);
    } catch (error) {
      console.error("Błąd dodawania pytania:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5000/questions/${questionId}`);
      fetchQuestions(selectedQuiz.id);
    } catch (error) {
      console.error("Błąd usuwania pytania:", error); 
    }
  };

  const handleUpdateQuestion = async (questionId, updatedQuestion) => {
    if (
      !updatedQuestion.question ||
      !updatedQuestion.option_a ||
      !updatedQuestion.option_b ||
      !updatedQuestion.option_c ||
      !updatedQuestion.option_d ||
      !updatedQuestion.correct_option
    ) {
      return alert("Wypełnij wszystkie pola pytania i odpowiedzi");
    }
    try {
      await axios.put(`http://localhost:5000/questions/${questionId}`, updatedQuestion);
      setEditingQuestionId(null);
      fetchQuestions(selectedQuiz.id);
    } catch (error) {
      console.error("Błąd aktualizacji pytania:", error);
    }
  };

  const handleUserAnswer = (selectedOption) => {
    const currentQuestion = questions[currentUserQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correct_option;
    if (isCorrect) setUserScore(userScore + 1);

    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: selectedOption,
    });

    if (currentUserQuestionIndex + 1 < questions.length) {
      setCurrentUserQuestionIndex(currentUserQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const startUserQuiz = () => {
    if (!selectedQuiz) return alert("Wybierz quiz");
    fetchQuestions(selectedQuiz.id);
    setUserQuizStarted(true);
    setCurrentUserQuestionIndex(0);
    setUserAnswers({});
    setUserScore(0);
    setQuizFinished(false);
  };

  const resetRole = () => {
    setRole(null);
    setSelectedQuiz(null);
    setQuestions([]);
    setUserQuizStarted(false);
    setQuizFinished(false);
  };

  return (
    
    

    
    <div className="quiz-container" style={{ padding: 20, fontFamily: "Arial" }}>
      <div className="background-svg">
  <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
    <circle cx="200" cy="300" r="100" fill="#61dafb" opacity="0.2">
      <animate attributeName="cy" values="300;350;300" dur="10s" repeatCount="indefinite" />
    </circle>
    <rect x="500" y="100" width="150" height="150" fill="#fcb69f" opacity="0.2">
      <animate attributeName="y" values="100;150;100" dur="12s" repeatCount="indefinite" />
    </rect>
    <polygon points="400,50 450,150 350,150" fill="#ff9a9e" opacity="0.2">
      <animateTransform attributeName="transform" attributeType="XML"
        type="rotate"
        from="0 400 100"
        to="360 400 100"
        dur="20s"
        repeatCount="indefinite"/>
    </polygon>
  </svg>
</div>

      {!role && (
        <>
          <h2>Wybierz rolę</h2>
          <button onClick={() => setRole("admin")}>Zaloguj jako Admin</button>
          <button onClick={() => setRole("user")}>Zaloguj jako Użytkownik</button>
        </>
      )}

      {role === "admin" && (
        <>
          <button onClick={resetRole}>Wyloguj się</button>
          <h2>Panel Admina - Quizy</h2>

          <div>
            <input
              type="text"
              placeholder="Nazwa nowego quizu"
              value={newQuizName}
              onChange={(e) => setNewQuizName(e.target.value)}
            />
            <button onClick={handleAddQuiz}>Dodaj quiz</button>
          </div>

          <div>
            <h3>Lista quizów</h3>
            <ul>
              {quizzes.map((quiz) => (
                <li key={quiz.id}>
                  <button
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      fetchQuestions(quiz.id);
                      setEditingQuestionId(null);
                    }}
                    style={{
                      fontWeight: selectedQuiz?.id === quiz.id ? "bold" : "normal",
                    }}
                  >
                    {quiz.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selectedQuiz && (
            <div>
              <h3>Quiz: {selectedQuiz.name}</h3>

              <h4>Dodaj pytanie</h4>
              <input
                type="text"
                placeholder="Treść pytania"
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, question: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Opcja A"
                value={newQuestion.option_a}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, option_a: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Opcja B"
                value={newQuestion.option_b}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, option_b: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Opcja C"
                value={newQuestion.option_c}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, option_c: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Opcja D"
                value={newQuestion.option_d}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, option_d: e.target.value })
                }
              />
              <select
                value={newQuestion.correct_option}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, correct_option: e.target.value })
                }
              >
                <option value="">Wybierz poprawną odpowiedź</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <button onClick={handleAddQuestion}>Dodaj pytanie</button>

              <h4>Pytania</h4>
              <ul>
                {questions.map((q) => (
                  <li key={q.id} style={{ marginBottom: 15 }}>
                    {editingQuestionId === q.id ? (
                      <>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => {
                            const updated = { ...q, question: e.target.value };
                            setQuestions(
                              questions.map((quest) =>
                                quest.id === q.id ? updated : quest
                              )
                            );
                          }}
                          placeholder="Treść pytania"
                        />
                        <input
                          type="text"
                          value={q.option_a}
                          onChange={(e) => {
                            const updated = { ...q, option_a: e.target.value };
                            setQuestions(
                              questions.map((quest) =>
                                quest.id === q.id ? updated : quest
                              )
                            );
                          }}
                          placeholder="Opcja A"
                        />
                        <input
                          type="text"
                          value={q.option_b}
                          onChange={(e) => {
                            const updated = { ...q, option_b: e.target.value };
                            setQuestions(
                              questions.map((quest) =>
                                quest.id === q.id ? updated : quest
                              )
                            );
                          }}
                          placeholder="Opcja B"
                        />
                        <input
                          type="text"
                          value={q.option_c}
                          onChange={(e) => {
                            const updated = { ...q, option_c: e.target.value };
                            setQuestions(
                              questions.map((quest) =>
                                quest.id === q.id ? updated : quest
                              )
                            );
                          }}
                          placeholder="Opcja C"
                        />
                        <input
                          type="text"
                          value={q.option_d}
                          onChange={(e) => {
                            const updated = { ...q, option_d: e.target.value };
                            setQuestions(
                              questions.map((quest) =>
                                quest.id === q.id ? updated : quest
                              )
                            );
                          }}
                          placeholder="Opcja D"
                        />
                        <select
                          value={q.correct_option}
                          onChange={(e) => {
                            const updated = { ...q, correct_option: e.target.value };
                            setQuestions(
                              questions.map((quest) =>
                                quest.id === q.id ? updated : quest
                              )
                            );
                          }}
                        >
                          <option value="">Wybierz poprawną odpowiedź</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                        <button onClick={() => handleUpdateQuestion(q.id, q)}>
                          Zatwierdź
                        </button>
                        <button onClick={() => setEditingQuestionId(null)}>
                          Anuluj
                        </button>
                      </>
                    ) : (
                      <>
                        <strong>{q.question}</strong> (Poprawna: {q.correct_option})
                        <ul>
                          <li>A: {q.option_a}</li>
                          <li>B: {q.option_b}</li>
                          <li>C: {q.option_c}</li>
                          <li>D: {q.option_d}</li>
                        </ul>
                        <button onClick={() => setEditingQuestionId(q.id)}>Edytuj</button>
                        <button onClick={() => handleDeleteQuestion(q.id)}>Usuń</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {role === "user" && (
        <>
          <button onClick={resetRole}>Wyloguj się</button>
          <h2>Quizy do gry</h2>
          <ul>
            {quizzes.map((quiz) => (
              <li key={quiz.id}>
                <button
                  onClick={() => {
                    setSelectedQuiz(quiz);
                    setUserQuizStarted(false);
                    setQuizFinished(false);
                  }}
                  style={{
                    fontWeight: selectedQuiz?.id === quiz.id ? "bold" : "normal",
                  }}
                >
                  {quiz.name}
                </button>
              </li>
            ))}
          </ul>

          {selectedQuiz && !userQuizStarted && !quizFinished && (
            <>
              <h3>Wybrany quiz: {selectedQuiz.name}</h3>
              <button onClick={startUserQuiz}>Start</button>
            </>
          )}

          {userQuizStarted && !quizFinished && questions.length > 0 && (
            <>
              <h3>
                Pytanie {currentUserQuestionIndex + 1} / {questions.length}
              </h3>
              <p>{questions[currentUserQuestionIndex].question}</p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {["option_a", "option_b", "option_c", "option_d"].map((optKey, idx) => (
                  <li key={optKey} style={{ marginBottom: 10 }}>
                    <button
                      onClick={() =>
                        handleUserAnswer(
                          ["A", "B", "C", "D"][idx]
                        )
                      }
                    >
                      {["A", "B", "C", "D"][idx]}: {questions[currentUserQuestionIndex][optKey]}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {quizFinished && (
            <>
              <h3>Koniec quizu!</h3>
              <p>
                Twój wynik: {userScore} / {questions.length}
              </p>
              <button
                onClick={() => {
                  setUserQuizStarted(false);
                  setQuizFinished(false);
                  setCurrentUserQuestionIndex(0);
                  setUserAnswers({});
                  setUserScore(0);
                }}
              >
                Zagraj ponownie
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
