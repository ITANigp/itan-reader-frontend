// components/TrialEndedNotification.js
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react"; // Assuming you have lucide-react or a similar icon library

export default function TrialEndedNotification({ onClose }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Timer to automatically close the toast after 5 seconds
    const autoCloseTimer = setTimeout(() => {
      onClose();
    }, 5000);

    // Interval to update the progress bar every 50 milliseconds
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prevProgress - 1; // Decrease progress
      });
    }, 50);

    // Cleanup function to clear timers and intervals on unmount
    return () => {
      clearTimeout(autoCloseTimer);
      clearInterval(progressInterval);
    };
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-5 right-5 z-50 text-white
        bg-gradient-to-r from-red-600 to-red-800 
        rounded-lg shadow-lg overflow-hidden
        max-w-72
        animate-slide-in
      `}
      style={{
        border: `3px solid`, // Placeholder for border animation
        borderColor: `transparent`,
        borderImageSlice: 1,
        animation: `border-burn 5s linear forwards`,
      }}
    >
      <div className="relative p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        <h3 className="font-bold text-lg mb-1">Your Free Trial Has Ended</h3>
        <p className="text-sm pr-4">
          Trial ended, but the adventure continues when you purchase! 🎉
        </p>
      </div>

      {/* Progress Bar "Burn" Effect */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-red-400"
        style={{
          width: `${progress}%`,
          transition: `width 0.05s linear`,
        }}
      ></div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
