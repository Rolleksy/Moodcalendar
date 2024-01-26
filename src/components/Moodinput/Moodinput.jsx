import React, { useState } from 'react';
import './moodinput.css';

const Moodinput = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const selectedMood = useState('')[0];

  const addMoodEntry = async (mood) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Dodaj zero z przodu, jeśli miesiąc jest jednocyfrowy
    const day = today.getDate().toString().padStart(2, '0'); // Dodaj zero z przodu, jeśli dzień jest jednocyfrowy

    const formattedDate = `${year}-${month}-${day}`;
    
    try {
        const response = await fetch('http://localhost:5000/api/addMood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: formattedDate, mood }), // Poprawiony klucz na 'date'
        });

        if (response.ok) {
            console.log('Mood entry added successfully');
            // Dodaj kod obsługi po udanym dodaniu nastroju
        } else {
            console.error('Error adding mood entry:', response.statusText);
            // Dodaj kod obsługi błędu
        }
    } catch (error) {
        console.error('Error:', error);
        // Dodaj kod obsługi błędu sieciowego
    }
};


  return (
    <div className="moodinput-container">
      <h1>How are you feeling today?</h1>
      <div className="moodinput-buttons">
        <button onClick={() => addMoodEntry('6')} className="moodinput-button">Great</button>
        <button onClick={() => addMoodEntry('5')} className="moodinput-button">Very good</button>
        <button onClick={() => addMoodEntry('4')} className="moodinput-button">Good</button>
        <button onClick={() => addMoodEntry('3')} className="moodinput-button">Okay</button>
        <button onClick={() => addMoodEntry('2')} className="moodinput-button">Bad</button>
        <button onClick={() => addMoodEntry('1')} className="moodinput-button">Very bad</button>
        <button onClick={() => addMoodEntry('0')} className="moodinput-button">Miserable</button>
      </div>
    </div>
  );
};

export default Moodinput;
