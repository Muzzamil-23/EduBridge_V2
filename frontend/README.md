# EduBridge - AI-Powered University Recommendation System

EduBridge is a comprehensive platform designed to help students find the best universities and programs based on their academic preferences, budget, and other requirements. It combines a modern, interactive frontend with a powerful AI-driven backend to deliver personalized recommendations.

## 🚀 Features

- **AI-Powered Recommendations**: Uses Cosine Similarity to match student preferences with university programs.
- **Smart Filtering**: Filter by budget, location, program group, and facilities (Hostel, Transport, etc.).
- **Interactive Dashboard**: Visualizes recommendations and university details.
- **Authentication**: Secure user signup and login via Supabase.
- **Profile Management**: Students can manage their academic profiles and preferences.
- **Responsive Design**: Built with a mobile-first approach using Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Framer Motion (for animations)
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **Data Processing**: Pandas, NumPy
- **Machine Learning**: Scikit-learn (Cosine Similarity)
- **Database**: Supabase (PostgreSQL)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Supabase Account** (for database and auth)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EduBridge
```

### 2. Frontend Setup
Navigate to the frontend directory (root of the repo):

```bash
# Install dependencies
npm install

# Create .env file
cp .env.sample .env
# Update .env with your Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_API_URL=http://localhost:8000

# Run the development server
npm run dev
```

### 3. Backend Setup
Navigate to the backend directory:

```bash
cd backend/fastapi_model

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Create a .env file in backend/fastapi_model with:
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_service_role_key
# ENV=development
# PORT=8000

# Run the FastAPI server
uvicorn main:app --reload
```

## 🌍 Environment Variables

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anonymous Key |
| `VITE_API_URL` | URL of the backend API (default: http://localhost:8000) |

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_KEY` | Your Supabase Service Role Key |
| `ENV` | Environment mode (development/production) |
| `PORT` | Port to run the server on |
| `FRONTEND_URL` | URL of the frontend application (default: http://localhost:5173) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

