const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');

const app = express();
const port = 5000;

// Ścieżka do bazy danych
databasePath = path.join(__dirname, 'moodCalendar.db');

if (!fs.existsSync(databasePath)) {
    // Utwórz nową bazę danych, jeśli nie istnieje
    const db = new sqlite3.Database(databasePath);
    
    
    
    
    // ZMIENIĆ NA INT W MOOD !!!! <-----------------
    // ZMIENIĆ NA INT W MOOD !!!! <-----------------
    // ZMIENIĆ NA INT W MOOD !!!! <-----------------
    // Utwórz tabelę nastrojów, jeśli nie istnieje
    db.run(`
      CREATE TABLE IF NOT EXISTS moods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        mood TEXT
      )
    `);
  
    // Zamknij bazę danych po utworzeniu tabeli
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database created successfully');
      }
    });
  } else {
    console.log('Database already exists');
  }


app.use(cors());
app.use(bodyParser.json());

// Dodaj nagłówek Content-Security-Policy
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 'default-src *; style-src * \'unsafe-inline\'; script-src * \'unsafe-inline\'; img-src * data:; font-src * data:');
    next();
});

// Endpoint do dostarczania favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// Endpoint do dostarczania pliku index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Konfiguracja Swagger JSDoc
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mood Calendar API',
            version: '1.0.0',
        },
    },
    apis: ['route.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// Dodaj endpoint dla Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Dodaj endpointy z pliku routes.js
const moodRoutes = require('./route.js');
app.use('/api', moodRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
