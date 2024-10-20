// src/components/CalendarView.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ChevronDown } from 'lucide-react';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const initialPnlData = {
  '2023-11-01': 27.41,
  '2023-11-02': -4.18,
  '2023-11-03': 32.91,
  '2023-11-04': 51.96,
  '2023-11-07': 1173.67,
  '2023-11-08': 0.0,
  // Add more test data as needed...
};

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2023);

  // Handler for changing month/year with react-datepicker
  const handleMonthChange = (date) => {
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate(); // Get total days in the month
  };

  const getStartDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay(); // Get the starting day of the month (0=Sunday, 6=Saturday)
  };

  const getPnlForDay = (day) => {
    const dayKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return initialPnlData[dayKey] || null;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = getStartDayOfMonth(currentMonth, currentYear);

  return (
    <div className="p-6 bg-gray-900 text-white">
      {/* P&L Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">P&L Calendar</h2>
        <div className="relative">
          <DatePicker
            selected={new Date(currentYear, currentMonth)}
            onChange={handleMonthChange}
            dateFormat="yyyy-MM"
            showMonthYearPicker
            showFullMonthYearPicker
            className="bg-gray-800 text-white px-3 py-2 rounded focus:outline-none"
            wrapperClassName="inline-flex items-center"
            customInput={
              <button className="px-3 py-1 rounded bg-gray-800 flex items-center">
                {currentYear}-{String(currentMonth + 1).padStart(2, '0')}
                <ChevronDown size={16} className="ml-2 text-gray-400" />
              </button>
            }
          />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-gray-400">
            {day}
          </div>
        ))}

        {/* Empty slots for days before the first day of the month */}
        {[...Array(startDay === 0 ? 6 : startDay - 1)].map((_, index) => (
          <div key={index} className="h-12"></div>
        ))}

        {/* Days in the month */}
        {[...Array(daysInMonth)].map((_, dayIndex) => {
          const day = dayIndex + 1;
          const pnl = getPnlForDay(day);

          const bgColor =
            pnl > 0
              ? 'bg-green-600'
              : pnl < 0
              ? 'bg-red-600'
              : 'bg-gray-800'; // Default if no P&L
          const textColor = pnl !== null ? 'text-white' : 'text-gray-400';

          return (
            <div
              key={day}
              className={`p-2 text-center rounded ${bgColor} ${textColor} h-12 flex flex-col justify-center`}
            >
              <div className="text-sm font-bold">{day}</div>
              {pnl !== null && (
                <div className="text-xs font-semibold">
                  {pnl > 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
