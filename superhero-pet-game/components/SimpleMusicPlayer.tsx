"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function SimpleMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Crear contexto de audio
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

  const createRelaxingSound = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Crear oscilador principal (nota base)
    const oscillator = audioContextRef.current.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime); // Nota A3
    
    // Crear oscilador secundario (armónicos)
    const oscillator2 = audioContextRef.current.createOscillator();
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(440, audioContextRef.current.currentTime); // Nota A4

    // Crear filtro para suavizar el sonido
    const filter = audioContextRef.current.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
    filter.Q.setValueAtTime(0.5, audioContextRef.current.currentTime);

    // Conectar nodos
    oscillator.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNodeRef.current);

    // Modulación de frecuencia para crear un efecto más relajante
    const lfo = audioContextRef.current.createOscillator();
    lfo.frequency.setValueAtTime(0.1, audioContextRef.current.currentTime); // Muy lento
    const lfoGain = audioContextRef.current.createGain();
    lfoGain.gain.setValueAtTime(2, audioContextRef.current.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);

    // Iniciar osciladores
    oscillator.start();
    oscillator2.start();
    lfo.start();

    oscillatorRef.current = oscillator;

    // Cambiar notas suavemente cada 4 segundos
    const interval = setInterval(() => {
      if (oscillator && oscillator.frequency) {
        const notes = [220, 196, 174, 196]; // A3, G3, F3, G3
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        oscillator.frequency.setValueAtTime(randomNote, audioContextRef.current!.currentTime);
        oscillator2.frequency.setValueAtTime(randomNote * 2, audioContextRef.current!.currentTime);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      if (oscillator) {
        oscillator.stop();
      }
      if (oscillator2) {
        oscillator2.stop();
      }
      if (lfo) {
        lfo.stop();
      }
    };
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
    } else {
      const cleanup = createRelaxingSound();
      setIsPlaying(true);
      
      // Limpiar después de 30 segundos para evitar sobrecarga
      setTimeout(() => {
        if (isPlaying) {
          if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current = null;
          }
          setIsPlaying(false);
        }
      }, 30000);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

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

        {/* Indicador de estado */}
        <div className="text-xs text-gray-600">
          {isPlaying ? '🎵' : '🔇'}
        </div>
      </div>
    </div>
  );
} 