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
- npm (do zarządzania frontendem)
- Docker ( Postgres)

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

    W konsoli (PowerShell, CMD lub terminalu):
bash
 4. **Baza**
```bash
    docker run --name quiz-postgres -e POSTGRES_USER=quizuser -e POSTGRES_PASSWORD=quizpass -e POSTGRES_DB=quizdb -p 5432:5432 -d postgres  
 ```  

•	Ta komenda uruchomi kontener z PostgreSQL, dostępny na porcie 5432.  
•	Użytkownik: quizuser  
•	Hasło: quizpass  
•	Baza: quizdb  
