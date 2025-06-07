from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///logs.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Log Entry Model
class LogEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, nullable=False)
    level = db.Column(db.String(20))
    message = db.Column(db.Text, nullable=False)
    source = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Create tables
with app.app_context():
    db.create_all()

@app.route('/api/upload', methods=['POST'])
def upload_log():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Simple log parsing (can be enhanced based on log format)
        content = file.read().decode('utf-8')
        lines = content.split('\n')
        
        for line in lines:
            if not line.strip():
                continue
                
            # Basic parsing - this is a simple example
            # You'll need to adjust this based on your log format
            parts = line.split(' ', 3)
            if len(parts) >= 4:
                timestamp_str = ' '.join(parts[:2])
                level = parts[2].strip('[]')
                message = parts[3]
                
                try:
                    timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S,%f')
                except ValueError:
                    timestamp = datetime.utcnow()
                
                log_entry = LogEntry(
                    timestamp=timestamp,
                    level=level,
                    message=message,
                    source=file.filename
                )
                db.session.add(log_entry)
        
        db.session.commit()
        return jsonify({'message': 'Log file processed successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    level = request.args.get('level')
    source = request.args.get('source')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = LogEntry.query
    
    if level:
        query = query.filter_by(level=level.upper())
    if source:
        query = query.filter_by(source=source)
    if start_date:
        try:
            start = datetime.strptime(start_date, '%Y-%m-%d')
            query = query.filter(LogEntry.timestamp >= start)
        except ValueError:
            pass
    if end_date:
        try:
            end = datetime.strptime(end_date + ' 23:59:59', '%Y-%m-%d %H:%M:%S')
            query = query.filter(LogEntry.timestamp <= end)
        except ValueError:
            pass
    
    logs = query.order_by(LogEntry.timestamp.desc()).limit(1000).all()
    
    return jsonify([{
        'id': log.id,
        'timestamp': log.timestamp.isoformat(),
        'level': log.level,
        'message': log.message,
        'source': log.source,
        'created_at': log.created_at.isoformat()
    } for log in logs])

@app.route('/api/stats', methods=['GET'])
def get_stats():
    # Get log levels distribution
    levels = db.session.query(
        LogEntry.level,
        db.func.count(LogEntry.id)
    ).group_by(LogEntry.level).all()
    
    # Get logs per source
    sources = db.session.query(
        LogEntry.source,
        db.func.count(LogEntry.id)
    ).group_by(LogEntry.source).all()
    
    return jsonify({
        'levels': [{'name': level, 'count': count} for level, count in levels],
        'sources': [{'name': source, 'count': count} for source, count in sources]
    })

if __name__ == '__main__':
    app.run(debug=True)
