import { useCallback, useEffect, useState } from 'react';

/**
 * Formats remaining cooldown for UI labels.
 * Examples: `5s`, `45s`, `1 min`, `1 min 30s`, `2 min`.
 */
export function formatCountdownLabel(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (remainder === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remainder}s`;
}

/**
 * Simple countdown used for recovery-code resend cooldown.
 * Call `start` only from event handlers (not during render/effects).
 * Decrements every second so the UI updates live.
 */
export function useCountdownSeconds(initialSeconds = 0) {
  const [secondsLeft, setSecondsLeft] = useState(
    initialSeconds > 0 ? Math.floor(initialSeconds) : 0,
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [secondsLeft]);

  const start = useCallback((seconds: number | null | undefined) => {
    if (!seconds || seconds <= 0) {
      setSecondsLeft(0);
      return;
    }
    setSecondsLeft(Math.floor(seconds));
  }, []);

  return {
    secondsLeft,
    label: formatCountdownLabel(secondsLeft),
    start,
  };
}
