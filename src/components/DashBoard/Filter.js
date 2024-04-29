import React, { useState, useEffect } from 'react';
import './Filter.css'; // Import CSS file for styling

const YearMonthPicker = ({ onChange }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Adding 1 because months are zero-based

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    onChange(selectedYear, selectedMonth); // Call onChange when month or year changes
  }, [selectedMonth, selectedYear, onChange]);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // Generate an array of years from 2018 to 2080
  const years = Array.from({ length: 2080 - 2018 + 1 }, (_, i) => 2018 + i);

  return (
    <div className="year-month-picker">
      <select value={selectedMonth} onChange={handleMonthChange}>
        {[...Array(12).keys()].map((month) => (
          <option key={month + 1} value={month + 1}>{new Date(currentYear, month, 1).toLocaleDateString('en-US', { month: 'long' })}</option>
        ))}
      </select>
      <select value={selectedYear} onChange={handleYearChange}>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default YearMonthPicker;
