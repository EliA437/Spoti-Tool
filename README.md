# Spotify-WebApp

# Spotify WebApp

A simple full-stack web application that connects to the Spotify API to display a user’s top tracks.

## 📂 Project Structure

Spotify-WebApp/
├── backend/
│ ├── app.py # FastAPI backend entry point
│ ├── spotify/ # Spotify API client logic
│ ├── venv/ # Python virtual environment (not committed)
│ └── .env # Environment variables
└── frontend/ # React/Vite frontend

bash
Copy code

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/EliA437/Spotify-WebApp
cd Spotify-WebApp
2. Backend Setup
Go into the backend folder and create/activate a virtual environment:

bash
Copy code
cd backend
python -m venv venv
# Windows PowerShell
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Create a .env file in backend with your Spotify credentials:

ini
Copy code
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
Run the FastAPI server:

bash
Copy code
python app.py  # or: uvicorn app:app --reload
The backend runs at http://127.0.0.1:8000.

3. Frontend Setup
Open a new terminal:

bash
Copy code
cd frontend
npm install
npm run dev
