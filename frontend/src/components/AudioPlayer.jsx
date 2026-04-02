import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const AudioPlayer = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
      };
    }
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-700 rounded-lg">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button onClick={togglePlayPause} className="p-2">
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
        <div
          className="h-full bg-indigo-600 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      <div className="text-xs font-mono">{formatTime(duration)}</div>
    </div>
  );
};

export default AudioPlayer;
