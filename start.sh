#!/bin/bash

# Start the backend server
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# Start the backend in the background
python app.py &


# Start the frontend in a new terminal
cd ../frontend
npm install
npm start

# Kill background processes on script exit
trap "trap - SIGTERM && kill -- -$$"
