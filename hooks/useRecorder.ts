import { useCallback, useEffect, useRef, useState } from 'react';

import {
  startRecording,
  stopRecording,
  type RecordingResult,
  type RecordingSession,
} from '@/lib/api';

export type RecorderState = 'idle' | 'recording' | 'transcribing' | 'done';

interface UseMockRecorderOptions {
  /** Auto-stops once the timer reaches this many seconds. */
  maxSeconds?: number;
  /** True when this recording adds to an answer she already gave. */
  continuing?: boolean;
  onResult?: (result: RecordingResult) => void;
}

/**
 * Visual-only recorder. The real capture lives behind
 * api.startRecording / api.stopRecording, so swapping in a voice SDK later
 * means touching those two functions, not this hook.
 */
export function useMockRecorder(promptId: string, options: UseMockRecorderOptions = {}) {
  const { maxSeconds, continuing = false, onResult } = options;
  const [state, setState] = useState<RecorderState>('idle');
  const [seconds, setSeconds] = useState(0);
  const sessionRef = useRef<RecordingSession | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const busyRef = useRef(false);
  const onResultRef = useRef(onResult);
  const continuingRef = useRef(continuing);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    continuingRef.current = continuing;
  }, [continuing]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const stop = useCallback(async () => {
    const session = sessionRef.current;
    if (!session || busyRef.current) return;
    busyRef.current = true;
    clearTimer();
    setState('transcribing');
    try {
      const result = await stopRecording(session);
      sessionRef.current = null;
      setState('done');
      onResultRef.current?.(result);
    } finally {
      busyRef.current = false;
    }
  }, [clearTimer]);

  const start = useCallback(async () => {
    if (busyRef.current || sessionRef.current) return;
    busyRef.current = true;
    try {
      const session = await startRecording(promptId, { continuing: continuingRef.current });
      sessionRef.current = session;
      setSeconds(0);
      setState('recording');
      clearTimer();
      intervalRef.current = setInterval(() => {
        setSeconds((current) => current + 1);
      }, 1000);
    } finally {
      busyRef.current = false;
    }
  }, [clearTimer, promptId]);

  useEffect(() => {
    if (state !== 'recording' || maxSeconds === undefined) return;
    if (seconds >= maxSeconds) {
      void stop();
    }
  }, [maxSeconds, seconds, state, stop]);

  const toggle = useCallback(() => {
    if (state === 'recording') {
      void stop();
      return;
    }
    if (state === 'idle' || state === 'done') {
      void start();
    }
  }, [start, state, stop]);

  const reset = useCallback(() => {
    clearTimer();
    sessionRef.current = null;
    setSeconds(0);
    setState('idle');
  }, [clearTimer]);

  return { state, seconds, start, stop, toggle, reset };
}
