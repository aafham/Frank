"use client";

import { useEffect, useMemo, useState } from "react";

const launchDate = new Date("2026-08-28T20:00:00+08:00").getTime();

function getTimeLeft() {
  const distance = Math.max(0, launchDate - Date.now());

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export function DropCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const units = useMemo(
    () => [
      ["Days", timeLeft.days],
      ["Hours", timeLeft.hours],
      ["Minutes", timeLeft.minutes],
      ["Seconds", timeLeft.seconds],
    ],
    [timeLeft],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="border-y border-white/10 bg-[#090604] px-5 py-8 text-white sm:px-8 sm:py-12 lg:px-10">
      <div className="mx-auto grid max-w-[1680px] gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--frnk-tan)]">Drop opens soon</p>
          <h2 className="mt-3 text-4xl font-semibold leading-[0.88] sm:mt-4 sm:text-7xl">Pre-launch mode.</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:col-span-6 lg:col-start-7">
          {units.map(([label, value]) => (
            <div key={label} className="border border-white/12 bg-white/[0.04] p-3 sm:p-4">
              <p className="text-3xl font-semibold leading-none sm:text-5xl">{String(value).padStart(2, "0")}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-white/42 sm:mt-3 sm:text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
