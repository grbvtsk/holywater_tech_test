'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechRecognitionCtor = new () => SpeechRecognition;

function createRecognition(): SpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  const Ctor = win.SpeechRecognition ?? win.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

export function useSpeechRecognition() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setSupported(createRecognition() !== null);
    return () => recognitionRef.current?.abort();
  }, []);

  const start = useCallback(() => {
    const recognition = createRecognition();
    if (!recognition) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    setError(null);
    setTranscript('');

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text.trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const message =
        event.error === 'not-allowed'
          ? 'Microphone access denied.'
          : event.error === 'no-speech'
            ? 'No speech detected. Try again.'
            : `Speech error: ${event.error}`;
      setError(message);
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    recognitionRef.current?.abort();
    setListening(false);
    setTranscript('');
    setError(null);
  }, []);

  return {
    supported,
    listening,
    transcript,
    error,
    start,
    stop,
    reset,
    setTranscript,
  };
}
