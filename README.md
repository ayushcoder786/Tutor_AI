# TutorAI 🎓

**An AI-Powered Personalized Tutoring Platform**

TutorAI is an intelligent learning platform designed to make education more interactive and accessible. It integrates Google's Gemini AI to help students understand concepts, ask questions, and receive AI-generated explanations in their preferred language.

The platform combines a React-based frontend with a FastAPI backend and MongoDB database to provide a smooth and scalable learning experience.

## ✨ Features

- **AI-Powered Tutor:** Get answers and explanations using Google's Gemini AI.
- **Multilingual Learning:** Request AI-generated responses in your preferred language.
- **Real-Time AI Streaming:** Backend support for streaming AI-generated responses.
- **User Authentication:** Secure signup and login using JWT authentication.
- **Role-Based Access Control (RBAC):** Manage access to application menus based on user roles.
- **Dashboard:** Access the learning platform through a centralized dashboard.
- **Course Management:** Access course-related functionality.
- **User Profile:** Manage your personal profile.
- **Responsive Interface:** Interact with the platform through a modern web interface.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Backend | Python, FastAPI |
| Database | MongoDB Atlas |
| AI Integration | Google Gemini API |
| Authentication | JWT |
| API Documentation | Swagger UI |

## 📁 Project Structure

```text
TutorAI/
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── service/
│   ├── main.py
│   ├── run.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   └── pages/
    ├── package.json
    └── vite.config.js
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ayushcoder786/TutorAI.git
cd TutorAI
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory using `.env.example` as a reference.

Configure the following variables:

```env
MONGODB_URL=your_mongodb_connection_string
MONGODB_DBNAME=your_database_name
JWT_SECRETKEY=your_jwt_secret
FRONTEND_URL=http://localhost:5173
GEMINI_APIKEY=your_gemini_api_key
GEMINI_MODEL=your_gemini_model
```

**Important:** Never upload your `.env` file or expose API keys, database credentials, or JWT secrets publicly.

### 4. Run the Backend

```bash
py run.py
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API Documentation:

```text
http://127.0.0.1:8000/docs
```

### 5. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the frontend API URL in its `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## 🔗 Main API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Authenticate a user |
| GET | `/auth/rbac` | Retrieve user role and menus |
| POST | `/gemini/ai` | Generate an AI response |
| POST | `/gemini/stream/ai` | Stream AI-generated responses |

Protected AI endpoints require a valid JWT authorization token.

## 🤖 AI Integration

TutorAI uses Google's Gemini API to generate intelligent responses to student queries.

Users can provide:
- A question or topic.
- Their preferred response language.

The backend processes the request and communicates with the Gemini model to generate an appropriate response.

## 🔐 Security

- JWT-based authentication.
- Protected API endpoints.
- Role-based access control.
- Environment variables for sensitive credentials.
- Git exclusion of private configuration files.

## 🚀 Future Enhancements

- Personalized learning recommendations.
- AI-generated quizzes and assessments.
- Learning progress tracking.
- Chat history and conversation management.
- Course-specific AI assistance.
- Improved real-time streaming experience.

## 👨‍💻 Author

**Ayush Kumar**

- GitHub: [@ayushcoder786](https://github.com/ayushcoder786)

---

⭐ If you find this project interesting, consider giving it a star on GitHub!

**TutorAI — Learn Smarter. Learn Faster.**