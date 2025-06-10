# ChmuryQuiz

Prosta aplikacja quizowa umożliwiająca tworzenie quizów (jako administrator) i rozwiązywanie ich (jako użytkownik).

## 📂 Struktura katalogów
    Quiz
    │
    ├── backend
    │
    └── frontend

## 🖥️ Wymagania wstępne

- Python 3.10+ (dla backendu)
- Node.js (najlepiej 18+)
- npm lub yarn (do zarządzania frontendem)
- Docker (opcjonalnie, np. do bazy danych Postgres)

---

## 🔧 Instalacja krok po kroku

1. **Sklonuj lub pobierz projekt** 
   
   Umieść projekt w katalogu, np.:

   ```bash
   C:\Users\TwojeImie\Quiz

    cd backend

    python -m venv venv

    .\venv\Scripts\activate

2. **Backend**
    ```
    pip install -r requirements.txt

Upewnij się, że baza danych (np. Postgres) działa.

    
    python app.py


3. **Frontend**
cd ../frontend
    ```bash
    npm install

    npm start