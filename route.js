const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3');

// Połączenie z bazą danych SQLite (utworzenie pliku bazy danych moodcalendar.db)
const db = new sqlite3.Database('moodcalendar.db');

/**
 * @swagger
 * /api/addMood:
 *   post:
 *     summary: Add a new mood entry
 *     tags: [Moods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               mood:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mood entry added successfully
 *       500:
 *         description: Internal Server Error
 */
router.post('/addMood', (req, res) => {
    const { date, mood } = req.body;

    // Sprawdź, czy data i nastroj są przesłane
    if (!date || !mood) {
        return res.status(400).send('Date and mood are required');
    }

    // Wykonaj zapytanie do bazy danych
    db.run('INSERT INTO moods (date, mood) VALUES (?, ?)', [date, mood], (error) => {
        if (error) {
            console.error('Error adding mood entry:', error);
            return res.status(500).send('Internal Server Error');
        } else {
            return res.status(200).send('Mood entry added successfully');
        }
    });
});

/**
 * @swagger
 * /api/getMoods:
 *   get:
 *     summary: Get all mood entries
 *     tags: [Moods]
 *     responses:
 *       200:
 *         description: List of mood entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   mood:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */
router.get('/getMoods', (req, res) => {
    // Wykonaj zapytanie do bazy danych w celu pobrania wszystkich nastrojów
    db.all('SELECT * FROM moods', (error, rows) => {
        if (error) {
            console.error('Error getting mood entries:', error);
            return res.status(500).send('Internal Server Error');
        } else {
            return res.status(200).json(rows);
        }
    });
});


/**
 * @swagger
 * /api/deleteMood/{id}:
 *  delete:
 *   summary: Delete a mood entry
 *   tags: [Moods]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: integer
 *      required: true
 *   responses:
 *    200:
 *     description: Mood entry deleted successfully
 *    500:
 *     description: Internal Server Error
 */

router.delete('/deleteMood/:id', (req, res) => {
    const id = req.params.id;

    // Sprawdź, czy id jest przesłane
    if (!id) {
        return res.status(400).send('ID is required');
    }

    // Wykonaj zapytanie do bazy danych
    db.run('DELETE FROM moods WHERE id = ?', id, (error) => {
        if (error) {
            console.error('Error deleting mood entry:', error);
            return res.status(500).send('Internal Server Error');
        } else {
            return res.status(200).send('Mood entry deleted successfully');
        }
    });
});


module.exports = router;
