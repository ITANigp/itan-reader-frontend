"use client";

import React, { useState, useEffect, Fragment } from "react";

export default function FreeTrialTimer({ initialDays = 13, initialHours = 59, initialMinutes = 40, initialSeconds = 3 }) {
  const [timeLeft, setTimeLeft] = useState({
    days: initialDays,
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds
  });

  const timeUnits = [
    { label: "Days", key: "days" },
    { label: "Hours", key: "hours" },
    { label: "Minutes", key: "minutes" },
    { label: "Seconds", key: "seconds" }
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        } else {
          // Timer has reached zero
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="flex items-center space-x-4 text-sm mt-2">
      {/* Label */}
      <span className="text-black font-medium">Free trial:</span>

      {/* Timer */}
      <div className="flex items-end space-x-4">
        {timeUnits.map(({ label, key }, i) => (
          <Fragment key={label}>
            <div className="flex flex-col items-center">
              {/* Gradient border */}
              <div className="p-[3px] rounded-full bg-gradient-to-br from-red-600 to-red-900">
                <div className="w-10 h-10 bg-white text-red-700 rounded-full flex items-center justify-center font-bold text-base">
                  {formatNumber(timeLeft[key])}
                </div>
              </div>
              <span className="text-black text-xs font-normal mt-1">{label}</span>
            </div>

            {/* Colons */}
            {i < timeUnits.length - 1 && (
              <span className="text-red-700 font-bold text-lg pb-4">:</span>
            )}
          </Fragment>
        ))}
      </div>
    </div>



  );
}