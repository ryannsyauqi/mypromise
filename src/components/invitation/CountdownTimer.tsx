"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsPast(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isPast) {
    return (
      <div className="text-center">
        <p className="text-white/90 text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
          Alhamdulillah, kami telah menikah 🤍
        </p>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: "Hari" },
    { value: timeLeft.hours, label: "Jam" },
    { value: timeLeft.minutes, label: "Menit" },
    { value: timeLeft.seconds, label: "Detik" },
  ];

  return (
    <div className="flex justify-center gap-3 sm:gap-5">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-white/70 text-xs mt-2 uppercase tracking-wider">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
