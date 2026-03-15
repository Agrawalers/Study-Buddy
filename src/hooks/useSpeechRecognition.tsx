import { useState, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  lang?: string;
  interimResults?: boolean;
  continuous?: boolean;
}

const useSpeechRecognition = ({ lang = 'en-US', interimResults = true, continuous = true }: UseSpeechRecognitionOptions = {}) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = continuous;
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
  }, [lang, interimResults, continuous]);

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

  const reset = useCallback(() => {
    setTranscript('');
  }, []);

  return { listening, transcript, start, stop, reset, supported: !!recognition };
};

export default useSpeechRecognition;
