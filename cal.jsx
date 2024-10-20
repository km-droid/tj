// src/components/CalendarView.jsx
import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

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

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate(); // Get total days in the month
  };

  const getStartDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay(); // Get the starting day of the month (0=Sunday, 1=Monday, etc.)
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11); // December
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0); // January
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getPnlForDay = (day) => {
    const dayKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return initialPnlData[dayKey] || null;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = getStartDayOfMonth(currentMonth, currentYear); // 0 = Sunday, we need 1 for Monday start

  return (
    <div className="p-6 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">P&L Calendar</h2>
        <div className="flex items-center space-x-2">
          <button className="bg-gray-700 px-3 py-1 rounded">Month</button>
          <button className="bg-gray-700 px-3 py-1 rounded">Year</button>
          <div className="relative">
            <button
              className="px-3 py-1 rounded bg-gray-800 flex items-center"
              onClick={handlePrevMonth}
            >
              <ChevronLeft size={16} className="text-gray-400" />
            </button>
            <span className="mx-2 text-lg">
              {currentYear}-{String(currentMonth + 1).padStart(2, '0')}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-800 flex items-center"
              onClick={handleNextMonth}
            >
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-gray-400">
            {day}
          </div>
        ))}

        {/* Empty slots for days before the first day of the month */}
        {[...Array(startDay === 0 ? 6 : startDay - 1)].map((_, index) => (
          <div key={index}></div>
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
            <Tooltip
              key={day}
              title={pnl !== null ? `$${pnl.toFixed(2)}` : 'No data'}
              arrow
              placement="top"
            >
              <div
                className={`p-2 text-center rounded ${bgColor} ${textColor}`}
              >
                <div className="text-sm font-bold">{day}</div>
                {pnl !== null && (
                  <div className="text-xs font-semibold">
                    {pnl > 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2)}
                  </div>
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
