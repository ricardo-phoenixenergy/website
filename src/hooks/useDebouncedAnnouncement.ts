'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Text for a polite live region that only updates once input settles, so a
 * slider dragged through twenty values is announced once, not twenty times.
 */
export function useDebouncedAnnouncement(delayMs = 700) {
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback(
    (text: string) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(text), delayMs);
    },
    [delayMs],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { message, announce };
}
