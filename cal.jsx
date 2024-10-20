import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarView = () => {
  const [date, setDate] = useState(new Date());

  const onDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">P&L Calendar</h2>
        <div className="relative">
          <Calendar
            value={date}
            onChange={onDateChange}
            view="year"
            selectRange={false}
            className="bg-gray-800 text-white rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
