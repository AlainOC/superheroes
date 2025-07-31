"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface Song {
  id: string;
  name: string;
  emoji: string;
  type: 'relaxing' | 'fun' | 'epic';
  createSound: (audioContext: AudioContext, gainNode: GainNode) => () => void;
}

export default function AdvancedMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Definir las canciones
  const songs: Song[] = [
    {
      id: 'mario-bros',
      name: 'Mario Bros',
      emoji: '🍄',
      type: 'fun',
      createSound: (audioContext, gainNode) => {
        // Tema principal de Mario Bros
        const notes = [
          { freq: 523, duration: 0.2 }, // C5
          { freq: 659, duration: 0.2 }, // E5
          { freq: 784, duration: 0.2 }, // G5
          { freq: 1047, duration: 0.4 }, // C6
          { freq: 784, duration: 0.2 }, // G5
          { freq: 659, duration: 0.2 }, // E5
          { freq: 523, duration: 0.2 }, // C5
          { freq: 784, duration: 0.4 }, // G5
        ];
        
        let noteIndex = 0;
        
        const playNote = () => {
          const note = notes[noteIndex];
          const oscillator = audioContext.createOscillator();
          const noteGain = audioContext.createGain();
          
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
          noteGain.gain.setValueAtTime(0.3, audioContext.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);
          
          oscillator.connect(noteGain);
          noteGain.connect(gainNode);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + note.duration);
          
          noteIndex = (noteIndex + 1) % notes.length;
        };
        
        const interval = setInterval(playNote, 200);
        
        return () => {
          clearInterval(interval);
        };
      }
    },
    {
      id: 'super-mario',
      name: 'Super Mario',
      emoji: '⭐',
      type: 'fun',
      createSound: (audioContext, gainNode) => {
        // Tema de Super Mario World
        const notes = [
          { freq: 659, duration: 0.15 }, // E5
          { freq: 784, duration: 0.15 }, // G5
          { freq: 880, duration: 0.15 }, // A5
          { freq: 1047, duration: 0.3 }, // C6
          { freq: 880, duration: 0.15 }, // A5
          { freq: 784, duration: 0.15 }, // G5
          { freq: 659, duration: 0.15 }, // E5
          { freq: 523, duration: 0.3 }, // C5
          { freq: 659, duration: 0.15 }, // E5
          { freq: 784, duration: 0.15 }, // G5
          { freq: 880, duration: 0.15 }, // A5
          { freq: 1047, duration: 0.3 }, // C6
        ];
        
        let noteIndex = 0;
        
        const playNote = () => {
          const note = notes[noteIndex];
          const oscillator = audioContext.createOscillator();
          const noteGain = audioContext.createGain();
          
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
          noteGain.gain.setValueAtTime(0.25, audioContext.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);
          
          oscillator.connect(noteGain);
          noteGain.connect(gainNode);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + note.duration);
          
          noteIndex = (noteIndex + 1) % notes.length;
        };
        
        const interval = setInterval(playNote, 150);
        
        return () => {
          clearInterval(interval);
        };
      }
    },
    {
      id: 'mario-kart',
      name: 'Mario Kart',
      emoji: '🏎️',
      type: 'fun',
      createSound: (audioContext, gainNode) => {
        // Tema de Mario Kart
        const notes = [
          { freq: 523, duration: 0.1 }, // C5
          { freq: 659, duration: 0.1 }, // E5
          { freq: 784, duration: 0.1 }, // G5
          { freq: 1047, duration: 0.2 }, // C6
          { freq: 784, duration: 0.1 }, // G5
          { freq: 659, duration: 0.1 }, // E5
          { freq: 523, duration: 0.1 }, // C5
          { freq: 784, duration: 0.2 }, // G5
          { freq: 659, duration: 0.1 }, // E5
          { freq: 784, duration: 0.1 }, // G5
          { freq: 1047, duration: 0.1 }, // C6
          { freq: 1319, duration: 0.3 }, // E6
        ];
        
        let noteIndex = 0;
        
        const playNote = () => {
          const note = notes[noteIndex];
          const oscillator = audioContext.createOscillator();
          const noteGain = audioContext.createGain();
          
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
          noteGain.gain.setValueAtTime(0.3, audioContext.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);
          
          oscillator.connect(noteGain);
          noteGain.connect(gainNode);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + note.duration);
          
          noteIndex = (noteIndex + 1) % notes.length;
        };
        
        const interval = setInterval(playNote, 100);
        
        return () => {
          clearInterval(interval);
        };
      }
    },
    {
      id: 'pou-game',
      name: 'Pou Game',
      emoji: '👾',
      type: 'fun',
      createSound: (audioContext, gainNode) => {
        // Tema de Pou con sonidos divertidos
        const notes = [
          { freq: 440, duration: 0.2 }, // A4
          { freq: 494, duration: 0.2 }, // B4
          { freq: 523, duration: 0.2 }, // C5
          { freq: 587, duration: 0.4 }, // D5
          { freq: 523, duration: 0.2 }, // C5
          { freq: 494, duration: 0.2 }, // B4
          { freq: 440, duration: 0.2 }, // A4
          { freq: 392, duration: 0.4 }, // G4
          { freq: 440, duration: 0.2 }, // A4
          { freq: 494, duration: 0.2 }, // B4
          { freq: 523, duration: 0.2 }, // C5
          { freq: 659, duration: 0.4 }, // E5
        ];
        
        let noteIndex = 0;
        
        const playNote = () => {
          const note = notes[noteIndex];
          const oscillator = audioContext.createOscillator();
          const noteGain = audioContext.createGain();
          
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
          noteGain.gain.setValueAtTime(0.2, audioContext.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);
          
          oscillator.connect(noteGain);
          noteGain.connect(gainNode);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + note.duration);
          
          noteIndex = (noteIndex + 1) % notes.length;
        };
        
        const interval = setInterval(playNote, 200);
        
        return () => {
          clearInterval(interval);
        };
      }
    },
    {
      id: 'tetris-theme',
      name: 'Tetris Theme',
      emoji: '🧩',
      type: 'fun',
      createSound: (audioContext, gainNode) => {
        // Tema clásico de Tetris
        const notes = [
          { freq: 659, duration: 0.2 }, // E5
          { freq: 494, duration: 0.2 }, // B4
          { freq: 523, duration: 0.2 }, // C5
          { freq: 587, duration: 0.2 }, // D5
          { freq: 659, duration: 0.2 }, // E5
          { freq: 494, duration: 0.2 }, // B4
          { freq: 523, duration: 0.2 }, // C5
          { freq: 587, duration: 0.2 }, // D5
          { freq: 659, duration: 0.2 }, // E5
          { freq: 523, duration: 0.2 }, // C5
          { freq: 587, duration: 0.2 }, // D5
          { freq: 659, duration: 0.4 }, // E5
        ];
        
        let noteIndex = 0;
        
        const playNote = () => {
          const note = notes[noteIndex];
          const oscillator = audioContext.createOscillator();
          const noteGain = audioContext.createGain();
          
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
          noteGain.gain.setValueAtTime(0.25, audioContext.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);
          
          oscillator.connect(noteGain);
          noteGain.connect(gainNode);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + note.duration);
          
          noteIndex = (noteIndex + 1) % notes.length;
        };
        
        const interval = setInterval(playNote, 200);
        
        return () => {
          clearInterval(interval);
        };
      }
    },
    {
      id: 'pacman-theme',
      name: 'Pac-Man Theme',
      emoji: '👻',
      type: 'fun',
      createSound: (audioContext, gainNode) => {
        // Tema de Pac-Man
        const notes = [
          { freq: 523, duration: 0.15 }, // C5
          { freq: 659, duration: 0.15 }, // E5
          { freq: 784, duration: 0.15 }, // G5
          { freq: 1047, duration: 0.3 }, // C6
          { freq: 784, duration: 0.15 }, // G5
          { freq: 659, duration: 0.15 }, // E5
          { freq: 523, duration: 0.15 }, // C5
          { freq: 784, duration: 0.3 }, // G5
          { freq: 659, duration: 0.15 }, // E5
          { freq: 784, duration: 0.15 }, // G5
          { freq: 1047, duration: 0.15 }, // C6
          { freq: 1319, duration: 0.4 }, // E6
        ];
        
        let noteIndex = 0;
        
        const playNote = () => {
          const note = notes[noteIndex];
          const oscillator = audioContext.createOscillator();
          const noteGain = audioContext.createGain();
          
          oscillator.type = 'square';
          oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
          noteGain.gain.setValueAtTime(0.3, audioContext.currentTime);
          noteGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.duration);
          
          oscillator.connect(noteGain);
          noteGain.connect(gainNode);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + note.duration);
          
          noteIndex = (noteIndex + 1) % notes.length;
        };
        
        const interval = setInterval(playNote, 150);
        
        return () => {
          clearInterval(interval);
        };
      }
    }
  ];

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = volume * (isMuted ? 0 : 1);

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume * (isMuted ? 0 : 1);
    }
  }, [volume, isMuted]);

  const playCurrentSong = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    
    // Limpiar canción anterior
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    
    const currentSong = songs[currentSongIndex];
    cleanupRef.current = currentSong.createSound(audioContextRef.current, gainNodeRef.current);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      setIsPlaying(false);
    } else {
      playCurrentSong();
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    if (isPlaying) {
      setTimeout(playCurrentSong, 100);
    }
  };

  const prevSong = () => {
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    if (isPlaying) {
      setTimeout(playCurrentSong, 100);
    }
  };

  const selectSong = (index: number) => {
    if (cleanupRef.current) {
      cleanupRef.current();
    }
    setCurrentSongIndex(index);
    if (isPlaying) {
      setTimeout(playCurrentSong, 100);
    }
    setShowPlaylist(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const currentSong = songs[currentSongIndex];

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 z-40">
      <div className="flex items-center gap-3">
        {/* Botón Play/Pause */}
        <Button
          onClick={togglePlay}
          size="sm"
          variant="outline"
          className="w-10 h-10 p-0"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        {/* Controles de navegación */}
        <Button
          onClick={prevSong}
          size="sm"
          variant="ghost"
          className="w-8 h-8 p-0"
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          onClick={nextSong}
          size="sm"
          variant="ghost"
          className="w-8 h-8 p-0"
        >
          <SkipForward className="w-4 h-4" />
        </Button>

        {/* Control de volumen */}
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleMute}
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Información de la canción */}
        <div className="text-xs text-gray-600 min-w-[80px]">
          <div className="flex items-center gap-1">
            <span>{currentSong.emoji}</span>
            <span className="truncate">{currentSong.name}</span>
          </div>
        </div>

        {/* Botón de playlist */}
        <Button
          onClick={() => setShowPlaylist(!showPlaylist)}
          size="sm"
          variant="ghost"
          className="w-8 h-8 p-0"
        >
          📋
        </Button>
      </div>

      {/* Playlist desplegable */}
      {showPlaylist && (
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg p-3 min-w-[200px]">
          <div className="text-sm font-medium mb-2">🎵 Playlist</div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {songs.map((song, index) => (
              <button
                key={song.id}
                onClick={() => selectSong(index)}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  index === currentSongIndex
                    ? 'bg-purple-100 text-purple-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{song.emoji}</span>
                  <span className="truncate">{song.name}</span>
                  <span className={`text-xs px-1 rounded ${
                    song.type === 'relaxing' ? 'bg-blue-100 text-blue-800' :
                    song.type === 'fun' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {song.type === 'relaxing' ? 'Relajante' :
                     song.type === 'fun' ? 'Divertida' : 'Épica'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 