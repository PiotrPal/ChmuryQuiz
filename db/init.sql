CREATE TABLE IF NOT EXISTS question (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

INSERT INTO question (question, answer) VALUES
('What is the capital of France?', 'Paris'),
('2 + 2 = ?', '4'),
('Who wrote Hamlet?', 'Shakespeare');
