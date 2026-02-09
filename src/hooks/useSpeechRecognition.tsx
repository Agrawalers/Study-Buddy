import { useState, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  lang?: string;
  interimResults?: boolean;
}

const useSpeechRecognition = ({ lang = 'en-US', interimResults = true }: UseSpeechRecognitionOptions = {}) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = interimResults;
    recognitionInstance.lang = lang;

    recognitionInstance.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
    };

    recognitionInstance.onerror = () => {
      setListening(false);
    };

    recognitionInstance.onend = () => {
      setListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [lang, interimResults]);

  const start = useCallback(() => {
    if (recognition && !listening) {
      setTranscript('');
      recognition.start();
      setListening(true);
    }
  }, [recognition, listening]);

  const stop = useCallback(() => {
    if (recognition && listening) {
      recognition.stop();
      setListening(false);
    }
  }, [recognition, listening]);

  return { listening, transcript, start, stop, supported: !!recognition };
};

export default useSpeechRecognition;
