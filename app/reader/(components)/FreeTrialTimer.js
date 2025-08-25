"use client";

import React, { useState, useEffect, Fragment } from "react";

export default function FreeTrialTimer({ trial_start, trial_end }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const timeUnits = [
    { label: "Days", key: "days" },
    { label: "Hours", key: "hours" },
    { label: "Minutes", key: "minutes" },
    { label: "Seconds", key: "seconds" },
  ];

  useEffect(() => {
    console.log("FreeTrialTimer trial_start:", trial_start);
    console.log("FreeTrialTimer trial_end:", trial_end);
    if (!trial_end) return;
    const endTime = new Date(trial_end).getTime();
    console.log("Parsed endTime (ms):", endTime);

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTime - now;
      console.log("Timer update - now:", now, "diff:", diff);

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);

      console.log("Time left:", { days, hours, minutes, seconds });
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [trial_end]);

  const formatNumber = (num) => num.toString().padStart(2, "0");

  return (
    <div className="flex items-center space-x-4 text-sm mt-2">
      <span className="text-black font-medium">Free trial:</span>
      <div className="flex items-end space-x-4">
        {timeUnits.map(({ label, key }, i) => (
          <Fragment key={label}>
            <div className="flex flex-col items-center">
              <div className="p-[3px] rounded-full bg-gradient-to-br from-red-600 to-red-900">
                <div className="w-10 h-10 bg-white text-red-700 rounded-full flex items-center justify-center font-bold text-base">
                  {formatNumber(timeLeft[key])}
                </div>
              </div>
              <span className="text-black text-xs font-normal mt-1">
                {label}
              </span>
            </div>
            {i < timeUnits.length - 1 && (
              <span className="text-red-700 font-bold text-lg pb-4">:</span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
