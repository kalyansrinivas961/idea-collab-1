import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceToText } from '../hooks/useVoiceToText';

const VoiceInput = ({ onTranscript, className = "" }) => {
  const { isListening, toggleListening, isSupported } = useVoiceToText(onTranscript);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2 rounded-lg transition-all relative ${
        isListening 
          ? "bg-red-100 text-red-600 animate-pulse" 
          : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
      } ${className}`}
      title={isListening ? "Stop listening" : "Start voice-to-text"}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      {isListening && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </button>
  );
};

export default VoiceInput;
