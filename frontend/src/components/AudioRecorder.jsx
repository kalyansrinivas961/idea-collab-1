import React, { useState, useRef } from 'react';
import { Mic, StopCircle, Play, Pause, Trash2, Send } from 'lucide-react';

const AudioRecorder = ({ onSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRecording) {
          handleStopRecording();
        } else {
          handleStartRecording();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          noiseSuppression: true,
          echoCancellation: true
        }
      });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
        clearInterval(timerRef.current);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= 59) {
            handleStopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check your browser permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob);
      setAudioURL('');
      setAudioBlob(null);
      setDuration(0);
    }
  };

  const handleDiscard = () => {
    setAudioURL('');
    setAudioBlob(null);
    setDuration(0);
  };

  return (
    <div className="flex items-center p-2 bg-white dark:bg-slate-800 rounded-lg">
      {!audioURL ? (
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <StopCircle size={24} /> : <Mic size={24} />}
        </button>
      ) : (
        <div className="flex items-center gap-2 w-full">
          <button onClick={handleDiscard} className="p-2 text-red-500 hover:text-red-700" aria-label="Discard recording">
            <Trash2 size={20} />
          </button>
          <audio src={audioURL} controls />
          <button onClick={handleSend} className="p-2 text-green-500 hover:text-green-700" aria-label="Send recording">
            <Send size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
