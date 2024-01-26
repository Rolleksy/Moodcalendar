import React, { useState, useEffect } from 'react';
import './moodcalendar.css';

const Moodcalendar = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [moodEntries, setMoodEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [currentYear, setCurrentYear] = useState(selectedYear);
  const [currentMonth, setCurrentMonth] = useState(selectedMonth);

  useEffect(() => {
    // Załaduj dane nastrojów po zmianie roku lub miesiąca
    loadMoodEntries();
  }, [selectedYear, selectedMonth]);

  const loadMoodEntries = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/getMoods?year=${selectedYear}&month=${selectedMonth + 1}`);

      if (response.ok) {
        const entries = await response.json();
        setMoodEntries(entries);
      } else {
        console.error('Error loading mood entries:', response.statusText);
        // Dodaj kod obsługi błędu
      }
    } catch (error) {
      console.error('Error:', error);
      // Dodaj kod obsługi błędu sieciowego
    }
  };

  const calculateAverageMood = (moodEntriesForDay) => {
    if (!moodEntriesForDay || moodEntriesForDay.length === 0) {
      return null;
    }
    // JESLI BEDZIE NOWA BAZA Z INTEM TO USUNĄĆ, A JEŚLI NADAL BEDZIE JAKO STRING TO ---->
    const moodValues = {
      '6': 6,
      '5': 5,
      '4': 4,
      '3': 3,
      '2': 2,
      '1': 1,
      '0': 0,
    };
    // ----> TO CASTOWAĆ MOODVALUES NA INTA!!!!!!!!
    const sum = moodEntriesForDay.reduce((acc, entry) => acc + parseInt(entry.mood), 0);
    const average = sum / moodEntriesForDay.length;
    return average;
  };

  const renderCalendar = (year, month) => {
    const calendar = [];
    const calendarDays = [];
    const calendarWeekdays = [];

    // Render days of the week
    const weekDays = daysOfWeek.map((day) => (
      <div key={day} className="calendar-day">{day}</div>
    ));

    calendarWeekdays.push(<div key="weekdays" className="calendar-weekdays">{weekDays}</div>);
    calendar.push(calendarWeekdays);

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Render empty cells for the first week
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(
        <div className='calendar-days'>
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        </div>
      );
    }

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Render days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const moodEntriesForDay = moodEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === year && entryDate.getMonth() === month && entryDate.getDate() === day;
      });

      const averageMood = calculateAverageMood(moodEntriesForDay);
      const backgroundColor = averageMood !== null ? `rgba(0, 255, 0, ${averageMood / 6})` : 'transparent';

      calendarDays.push(
        <div className='calendar-days' >
          <div key={day} className="calendar-day" style={{ backgroundColor }} >
            {`${day}: ${averageMood !== null ? averageMood.toFixed(2) : '-'}`}
          </div>
        </div>
      );
    }

    calendar.push(<div className='days-num'>{calendarDays}</div>);
    return calendar;
  };

  const handleMonthChange = (event) => {
    const newMonth = parseInt(event.target.value, 10);
    setSelectedMonth(newMonth);
    setCurrentMonth(newMonth);
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    setSelectedYear(newYear);
    setCurrentYear(newYear);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 30; year <= currentYear + 30; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="calendar-month">
          <select value={selectedMonth} onChange={handleMonthChange}>
            <option value={0}>January</option>
            <option value={1}>February</option>
            <option value={2}>March</option>
            <option value={3}>April</option>
            <option value={4}>May</option>
            <option value={5}>June</option>
            <option value={6}>July</option>
            <option value={7}>August</option>
            <option value={8}>September</option>
            <option value={9}>October</option>
            <option value={10}>November</option>
            <option value={11}>December</option>
          </select>
        </div>
        <div className="calendar-year">
          <select value={selectedYear} onChange={handleYearChange}>
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="calendar-days-container">
        {renderCalendar(currentYear, currentMonth)}
      </div>
    </div>
  );
};

export default Moodcalendar;
