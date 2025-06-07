FROM python:3.12
WORKDIR /app

# Install the application dependencies
COPY . .
RUN pip install --no-cache-dir -r requirements.txt

CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5000"]
EXPOSE 5000