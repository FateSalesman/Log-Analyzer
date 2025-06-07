# Log Analyzer

A web-based log analysis tool that helps you upload, parse, and analyze log files with an intuitive user interface made with Windsurf.

## Features

- **Log Upload**: Easily upload log files through a drag-and-drop interface
- **Log Viewing**: View logs in a searchable and sortable table
- **Filtering**: Filter logs by level, source, and date range
- **Statistics**: Visualize log data with interactive charts
- **Responsive Design**: Works on both desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for UI components
- Chart.js for data visualization
- Axios for API requests

### Backend
- Python with Flask
- SQLite for data storage
- SQLAlchemy as ORM

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (3.8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd log-analyzer
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Recommended**
   ```docker compose up```

   The backend and frontend will be available at 'http://localhost:5000' and 'http://localhost:3000' respectively

1. **Start the backend server**
   ```bash
   cd backend
   python app.py
   ```
   The backend will be available at `http://localhost:5000`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## Usage

1. **Upload Logs**
   - Click on the "Upload" tab
   - Drag and drop a log file or click to browse
   - The system will automatically parse and store the logs

2. **View Logs**
   - Navigate to the "Logs" tab
   - Use the filters to narrow down the logs by level, source, or date range
   - Search through log messages using the search bar

3. **View Statistics**
   - Go to the "Statistics" tab
   - View interactive charts showing log distribution by level and source
   - Hover over chart elements to see detailed information

## Project Structure

```
log-analyzer/
├── backend/               # Flask backend
│   ├── app.py            # Main application file
│   ├── requirements.txt  # Python dependencies
│   └── instance/         # Database and instance files
├── frontend/             # React frontend
│   ├── public/           # Static files
│   └── src/              # Source code
│       ├── components/   # React components
│       ├── services/     # API services
│       ├── types/        # TypeScript type definitions
│       └── App.tsx       # Main App component
└── README.md            # This file
```

## Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- UI components from [Material-UI](https://mui.com/)
- Charts by [Chart.js](https://www.chartjs.org/)
- Backend powered by [Flask](https://flask.palletsprojects.com/)
