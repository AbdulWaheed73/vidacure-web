import { useState, useEffect } from 'react';

export type CountdownState = 'upcoming' | 'live' | 'ended';

export type CountdownResult = {
  state: CountdownState;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

const compute = (startMs: number, endMs: number | null): CountdownResult => {
  const empty = { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };

  if (isNaN(startMs)) {
    return { state: 'ended', ...empty };
  }

  const now = Date.now();

  if (now < startMs) {
    const diff = startMs - now;
    const totalSeconds = Math.floor(diff / 1000);
    return {
      state: 'upcoming',
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      totalMs: diff,
    };
  }

  // now >= start. Live only while we have an endTime and haven't passed it.
  const isLive = endMs !== null && now <= endMs;
  return { state: isLive ? 'live' : 'ended', ...empty };
};

/**
 * Live, second-by-second countdown to a meeting start time. Recomputes every
 * second from the local clock, so the remaining time is always relative to the
 * user's current time. Presentation-agnostic — returns parts, not a string.
 */
export const useCountdown = (
  startTime: string,
  endTime?: string | null,
): CountdownResult => {
  const startMs = new Date(startTime).getTime();
  const endMs = endTime ? new Date(endTime).getTime() : null;

  const [result, setResult] = useState<CountdownResult>(() => compute(startMs, endMs));

  useEffect(() => {
    // Re-sync immediately on prop change, then tick every second.
    setResult(compute(startMs, endMs));
    const id = setInterval(() => setResult(compute(startMs, endMs)), 1000);
    return () => clearInterval(id);
  }, [startMs, endMs]);

  return result;
};

export default useCountdown;
