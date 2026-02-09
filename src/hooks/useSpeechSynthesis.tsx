import { useState, useCallback, useEffect } from 'react';

interface UseSpeechSynthesisOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
}

const useSpeechSynthesis = ({ lang = 'en-US', rate = 1, pitch = 1 }: UseSpeechSynthesisOptions = {}) => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported || !text) return;

    window.speechSynthesis.cancel();
    
    // Wait for voices to load
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speak(text);
      };
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    // Select best quality voice based on language
    const langCode = lang.split('-')[0];
    const preferredVoice = voices.find(v => 
      v.lang.startsWith(langCode) && 
      !v.localService && // Prefer online voices
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
    ) || voices.find(v => 
      v.lang.startsWith(langCode) && !v.localService
    ) || voices.find(v => 
      v.lang.startsWith(langCode)
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [lang, rate, pitch, supported]);

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  return { speaking, speak, stop, supported };
};

export default useSpeechSynthesis;
