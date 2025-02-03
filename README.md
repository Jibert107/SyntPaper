# Music App

This is a web application that allows playing sounds by pressing keyboard keys and dynamically displays the played notes on a music sheet.

## Project Structure

```
music-app/
│── frontend/   # React + Tone.js + VexFlow
│── backend/    # Node.js + Express
│── docker-compose.yml  # Docker Configuration
```

## How to Launch the App

1. Clone the repository:
   ```bash
   git clone https://github.com/Jibert107/SyntPaper.git
   cd SyntPaper/music-app
   ```

2. Start the Docker containers:
   ```bash
   docker-compose up --build
   ```

3. Open your browser and navigate to `http://localhost:3000` to access the frontend.
4. The backend server will be running on `http://localhost:3001`.

## Frontend

The frontend is built using React, Tone.js, and VexFlow. It handles the user interface, keyboard input, sound generation, and dynamic music sheet display.

## Backend

The backend is built using Node.js and Express. It handles server-side logic, such as saving and retrieving user sessions or compositions.

## Docker

The Docker configuration ensures that both the frontend and backend services are fully functional in a Docker environment.
