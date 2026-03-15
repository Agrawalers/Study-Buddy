import { useState, useCallback, useEffect } from 'react';

interface UseSpeechSynthesisOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  voiceGender?: 'female' | 'male' | 'any';
}

const useSpeechSynthesis = ({ lang = 'en-US', rate = 1, pitch = 1, voiceGender = 'any' }: UseSpeechSynthesisOptions = {}) => {
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

    const langCode = lang.split('-')[0];
    
    // Filter voices by gender preference
    let filteredVoices = voices.filter(v => v.lang.startsWith(langCode));
    
    if (voiceGender === 'female') {
      filteredVoices = filteredVoices.filter(v => 
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('karen') ||
        v.name.toLowerCase().includes('moira') ||
        v.name.toLowerCase().includes('tessa') ||
        v.name.toLowerCase().includes('fiona') ||
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('susan') ||
        !v.name.toLowerCase().includes('male')
      );
    } else if (voiceGender === 'male') {
      filteredVoices = filteredVoices.filter(v => 
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('alex')
      );
    }

    // Select best quality voice
    const preferredVoice = filteredVoices.find(v => 
      !v.localService && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Enhanced'))
    ) || filteredVoices.find(v => !v.localService) || filteredVoices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [lang, rate, pitch, voiceGender, supported]);

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  return { speaking, speak, stop, supported };
};

export default useSpeechSynthesis;
