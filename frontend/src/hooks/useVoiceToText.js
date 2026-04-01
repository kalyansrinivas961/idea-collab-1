import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useVoiceToText = (onTranscript) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        if (event.results[0].isFinal) {
          onTranscript(transcript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error('Microphone permission denied');
        } else if (event.error === 'no-speech') {
          // Ignore no speech error as it's common
        } else {
          toast.error(`Voice recognition error: ${event.error}`);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      toast.error('Voice recognition is not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        recognition.stop();
      }
    }
  }, [isListening, recognition]);

  return { isListening, toggleListening, isSupported: !!recognition };
};
