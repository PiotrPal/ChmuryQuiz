from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:5432/quizdb'
db = SQLAlchemy(app)

# MODELE
class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    questions = db.relationship('Question', backref='quiz', cascade="all, delete-orphan", lazy=True)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    question = db.Column(db.String(255), nullable=False)
    option_a = db.Column(db.String(255), nullable=False)
    option_b = db.Column(db.String(255), nullable=False)
    option_c = db.Column(db.String(255), nullable=False)
    option_d = db.Column(db.String(255), nullable=False)
    correct_option = db.Column(db.String(1), nullable=False)  # 'A', 'B', 'C', 'D' 

# ROUTY
@app.route("/")
def home():
    return jsonify({"message": "Witaj w API Quiz!"})

@app.route("/quizzes", methods=["GET", "POST"])
def quizzes():
    if request.method == "GET":
        quizzes = Quiz.query.all()
        return jsonify([{"id": q.id, "name": q.name} for q in quizzes])
    elif request.method == "POST":
        data = request.json
        new_quiz = Quiz(name=data["name"])
        db.session.add(new_quiz)
        db.session.commit()
        return jsonify({"id": new_quiz.id, "name": new_quiz.name})

@app.route("/quizzes/<int:quiz_id>/questions", methods=["GET", "POST"])
def quiz_questions(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    if request.method == "GET":
        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        return jsonify([
            {
                "id": q.id,
                "question": q.question,
                "option_a": q.option_a,
                "option_b": q.option_b,
                "option_c": q.option_c,
                "option_d": q.option_d,
                "correct_option": q.correct_option
            } for q in questions
        ])
    elif request.method == "POST":
        data = request.json
        new_question = Question(
            quiz_id=quiz_id,
            question=data["question"],
            option_a=data["option_a"],
            option_b=data["option_b"],
            option_c=data["option_c"],
            option_d=data["option_d"],
            correct_option=data["correct_option"]
        )
        db.session.add(new_question)
        db.session.commit()
        return jsonify({"id": new_question.id, "question": new_question.question})

@app.route("/questions/<int:question_id>", methods=["PUT", "DELETE"])
def edit_delete_question(question_id):
    question = Question.query.get_or_404(question_id)
    if request.method == "PUT":
        data = request.json
        question.question = data["question"]
        question.option_a = data["option_a"]
        question.option_b = data["option_b"]
        question.option_c = data["option_c"]
        question.option_d = data["option_d"]
        question.correct_option = data["correct_option"]
        db.session.commit()
        return jsonify({"message": "Question updated"})
    elif request.method == "DELETE":
        db.session.delete(question)
        db.session.commit()
        return jsonify({"message": "Question deleted"})

@app.route("/play/<int:quiz_id>", methods=["POST"])
def play_quiz(quiz_id):
    data = request.json
    question = Question.query.get(data["question_id"])
    if question and question.correct_option.lower() == data["selected_option"].lower():
        return jsonify({"correct": True})
    return jsonify({"correct": False})

@app.route("/reset_database", methods=["POST"])
def reset_database():
    db.drop_all()
    db.create_all()
    return jsonify({"message": "Database has been reset"})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)
