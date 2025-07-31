import React, { useEffect, useState } from "react";
import {
  getMascotas,
  crearMascota,
  getMascotasDisponibles,
  alimentarMascota,
  pasearMascota,
  personalizarMascota,
  enfermarMascota,
  curarMascota,
  revivirMascota,
  matarMascota,
  pocionVidaMascota,
  eliminarMascota
} from "../lib/mascotaApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Smile, Droplets, Utensils, Plus, PawPrint, User } from "lucide-react";
import AdvancedMusicPlayer from "./AdvancedMusicPlayer";

const API_URL = "https://superheroes-rxcu.onrender.com/api";

interface MascotasPanelProps {
  token: string;
}

// Función para obtener emoji según tipo de mascota
function getPetEmoji(tipo: string) {
  const map: Record<string, string> = {
    perro: "🐶",
    gato: "🐱",
    dragon: "🐲",
    lobo: "🐺",
    ave: "🦅",
    conejo: "🐰",
    tortuga: "🐢",
    pez: "🐟",
    zorro: "🦊",
    // Añade más tipos según tu juego
  };
  // Normaliza el tipo
  const key = tipo.trim().toLowerCase();
  return map[key] || "🐾";
}

// Función para color de fondo según estado o tipo
function getPetBgColor(mascota: any) {
  if (mascota.salud < 30) return "from-green-300 to-green-500";
  if (mascota.hambre < 20) return "from-yellow-200 to-yellow-400";
  if (mascota.felicidad < 30) return "from-gray-300 to-gray-500";
  // Por tipo
  const tipo = mascota.tipo?.toLowerCase() || "";
  if (tipo.includes("dragon")) return "from-purple-200 to-purple-400";
  if (tipo.includes("lobo")) return "from-gray-200 to-gray-400";
  if (tipo.includes("gato")) return "from-pink-200 to-pink-400";
  if (tipo.includes("perro")) return "from-yellow-200 to-yellow-400";
  if (tipo.includes("ave")) return "from-blue-100 to-blue-300";
  return "from-blue-100 to-purple-200";
}

// Función para mostrar accesorios como emojis
function renderAccessories(mascota: any) {
  if (!mascota.accesorios || mascota.accesorios.length === 0) return null;
  // Puedes mapear los accesorios a emojis si tienes esa info
  const accMap: Record<string, string> = {
    "cape": "🦸",
    "collar": "⭐",
    "hat": "🎩",
    "glasses": "🕶️",
    // ...otros
  };
  return (
    <div className="absolute -top-3 -right-3 flex flex-wrap gap-1">
      {mascota.accesorios.map((acc: string, i: number) => (
        <span key={i} className="text-2xl drop-shadow">{accMap[acc.toLowerCase()] || "✨"}</span>
      ))}
    </div>
  );
}

// SVGs realistas para mascotas con accesorios mejorados
function PetSVG({ tipo, accesorios = [] }: { tipo: string; accesorios?: string[] }) {
  // Normaliza el tipo y previene undefined/null
  const key = (typeof tipo === "string" ? tipo : "").trim().toLowerCase();
  
  // Debug: mostrar qué tipo se está procesando
  console.log("PetSVG - Tipo recibido:", tipo, "Key normalizada:", key, "Accesorios:", accesorios);
  
  // Colores y formas base por tipo
  if (key === "perro") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-bounce-slow hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="50" rx="28" ry="25" fill="#E2B07A" className="animate-pulse" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="32" rx="18" ry="16" fill="#E2B07A" className="animate-bounce-slow" />
          {/* Orejas con movimiento independiente */}
          <ellipse cx="22" cy="20" rx="6" ry="10" fill="#A67C52" className="animate-bounce-slow" style={{animationDelay: '0.5s'}} />
          <ellipse cx="58" cy="20" rx="6" ry="10" fill="#A67C52" className="animate-bounce-slow" style={{animationDelay: '0.7s'}} />
          {/* Ojos con parpadeo */}
          <ellipse cx="33" cy="32" rx="2.5" ry="3" fill="#222" className="animate-blink" />
          <ellipse cx="47" cy="32" rx="2.5" ry="3" fill="#222" className="animate-blink" style={{animationDelay: '0.3s'}} />
          {/* Nariz */}
          <ellipse cx="40" cy="38" rx="2.5" ry="1.5" fill="#333" />
          {/* Boca con sonrisa animada */}
          <path d="M37 42 Q40 45 43 42" stroke="#333" strokeWidth="1.5" fill="none" className="animate-pulse" />
          
          {/* Accesorios mejorados con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="44" rx="10" ry="3" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 60 Q40 75 52 60 Q40 65 28 60" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="10" ry="4" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="33" cy="32" rx="4" ry="3" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="47" cy="32" rx="4" ry="3" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="37" y1="32" x2="43" y2="32" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 45 L45 45 L40 50 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 42 Q40 48 50 42" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 45 Q40 50 45 45" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "gato") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-float hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="52" rx="25" ry="22" fill="#F5CBA7" className="animate-pulse" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="32" rx="16" ry="14" fill="#F5CBA7" className="animate-bounce-slow" />
          {/* Orejas con movimiento independiente */}
          <polygon points="28,18 36,10 32,26" fill="#F5CBA7" className="animate-wiggle" style={{animationDelay: '0.3s'}} />
          <polygon points="52,18 44,10 48,26" fill="#F5CBA7" className="animate-wiggle" style={{animationDelay: '0.6s'}} />
          {/* Ojos con parpadeo */}
          <ellipse cx="35" cy="32" rx="2" ry="2.5" fill="#222" className="animate-blink" />
          <ellipse cx="45" cy="32" rx="2" ry="2.5" fill="#222" className="animate-blink" style={{animationDelay: '0.4s'}} />
          {/* Nariz */}
          <ellipse cx="40" cy="37" rx="1.5" ry="1" fill="#C0392B" />
          {/* Boca con sonrisa animada */}
          <path d="M39 39 Q40 41 41 39" stroke="#333" strokeWidth="1" fill="none" className="animate-pulse" />
          
          {/* Accesorios mejorados con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="42" rx="8" ry="2.5" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 60 Q40 75 52 60 Q40 65 28 60" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="35" cy="32" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="45" cy="32" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="38.5" y1="32" x2="41.5" y2="32" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 47 L45 47 L40 52 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 44 Q40 50 50 44" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 47 Q40 52 45 47" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "dragon") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-glow hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="55" rx="26" ry="20" fill="#7ED957" className="animate-pulse" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="32" rx="15" ry="13" fill="#7ED957" className="animate-bounce-slow" />
          {/* Cuernos con movimiento independiente */}
          <rect x="28" y="13" width="4" height="10" fill="#B7E4C7" rx="2" className="animate-wiggle" style={{animationDelay: '0.2s'}} />
          <rect x="48" y="13" width="4" height="10" fill="#B7E4C7" rx="2" className="animate-wiggle" style={{animationDelay: '0.5s'}} />
          {/* Ojos con parpadeo */}
          <ellipse cx="36" cy="32" rx="2" ry="2.5" fill="#222" className="animate-blink" />
          <ellipse cx="44" cy="32" rx="2" ry="2.5" fill="#222" className="animate-blink" style={{animationDelay: '0.3s'}} />
          {/* Nariz */}
          <ellipse cx="40" cy="37" rx="2" ry="1" fill="#333" />
          {/* Boca con sonrisa animada */}
          <path d="M38 40 Q40 43 42 40" stroke="#333" strokeWidth="1.5" fill="none" className="animate-pulse" />
          
          {/* Accesorios mejorados con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="44" rx="9" ry="2.5" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 60 Q40 75 52 60 Q40 65 28 60" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="36" cy="32" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="44" cy="32" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="39.5" y1="32" x2="42.5" y2="32" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 47 L45 47 L40 52 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 44 Q40 50 50 44" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 47 Q40 52 45 47" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "conejo") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-bounce-slow hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="55" rx="22" ry="20" fill="#F8F9FA" className="animate-pulse" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="35" rx="15" ry="12" fill="#F8F9FA" className="animate-bounce-slow" />
          {/* Orejas largas con movimiento independiente */}
          <ellipse cx="32" cy="15" rx="4" ry="12" fill="#F8F9FA" className="animate-wiggle" style={{animationDelay: '0.4s'}} />
          <ellipse cx="48" cy="15" rx="4" ry="12" fill="#F8F9FA" className="animate-wiggle" style={{animationDelay: '0.8s'}} />
          {/* Ojos con parpadeo */}
          <ellipse cx="36" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" />
          <ellipse cx="44" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" style={{animationDelay: '0.2s'}} />
          {/* Nariz */}
          <ellipse cx="40" cy="40" rx="1.5" ry="1" fill="#FF69B4" />
          {/* Boca con sonrisa animada */}
          <path d="M39 42 Q40 44 41 42" stroke="#333" strokeWidth="1" fill="none" className="animate-pulse" />
          
          {/* Accesorios con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="47" rx="8" ry="2.5" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 65 Q40 80 52 65 Q40 70 28 65" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="10" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="36" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="44" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="39.5" y1="35" x2="42.5" y2="35" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 50 L45 50 L40 55 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 47 Q40 53 50 47" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 50 Q40 55 45 50" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 10 L35 5 L40 10 L45 5 L50 10 L50 13 L30 13 Z" fill="#FFD700" />
              <circle cx="35" cy="7" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="7" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="7" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "panda") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-float hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="55" rx="25" ry="22" fill="#FFFFFF" className="animate-pulse" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="35" rx="16" ry="14" fill="#FFFFFF" className="animate-bounce-slow" />
          {/* Orejas con movimiento independiente */}
          <ellipse cx="30" cy="20" rx="6" ry="8" fill="#000000" className="animate-wiggle" style={{animationDelay: '0.3s'}} />
          <ellipse cx="50" cy="20" rx="6" ry="8" fill="#000000" className="animate-wiggle" style={{animationDelay: '0.6s'}} />
          {/* Ojos con parches negros y parpadeo */}
          <ellipse cx="35" cy="32" rx="4" ry="5" fill="#000000" className="animate-blink" />
          <ellipse cx="45" cy="32" rx="4" ry="5" fill="#000000" className="animate-blink" style={{animationDelay: '0.4s'}} />
          <ellipse cx="36" cy="31" rx="1.5" ry="2" fill="#FFFFFF" />
          <ellipse cx="46" cy="31" rx="1.5" ry="2" fill="#FFFFFF" />
          {/* Nariz */}
          <ellipse cx="40" cy="38" rx="2" ry="1.5" fill="#000000" />
          {/* Boca con sonrisa animada */}
          <path d="M38 41 Q40 43 42 41" stroke="#000000" strokeWidth="1.5" fill="none" className="animate-pulse" />
          
          {/* Accesorios con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="47" rx="9" ry="2.5" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 65 Q40 80 52 65 Q40 70 28 65" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="35" cy="32" rx="5" ry="4" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="45" cy="32" rx="5" ry="4" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="40" y1="32" x2="40" y2="32" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 50 L45 50 L40 55 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 47 Q40 53 50 47" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 50 Q40 55 45 50" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "unicornio") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-glow hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="55" rx="24" ry="20" fill="#FFB6C1" className="animate-pulse" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="35" rx="14" ry="12" fill="#FFB6C1" className="animate-bounce-slow" />
          {/* Cuerno mágico con brillo */}
          <path d="M40 20 L42 10 L40 8 L38 10 Z" fill="#FFD700" className="animate-glow" />
          {/* Melena arcoíris con movimiento */}
          <path d="M30 25 Q25 15 30 5" stroke="#FF6B6B" strokeWidth="3" fill="none" className="animate-wave" style={{animationDelay: '0.1s'}} />
          <path d="M35 25 Q30 15 35 5" stroke="#4ECDC4" strokeWidth="3" fill="none" className="animate-wave" style={{animationDelay: '0.2s'}} />
          <path d="M40 25 Q35 15 40 5" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" style={{animationDelay: '0.3s'}} />
          <path d="M45 25 Q40 15 45 5" stroke="#FF6B6B" strokeWidth="3" fill="none" className="animate-wave" style={{animationDelay: '0.4s'}} />
          <path d="M50 25 Q45 15 50 5" stroke="#4ECDC4" strokeWidth="3" fill="none" className="animate-wave" style={{animationDelay: '0.5s'}} />
          {/* Ojos con parpadeo */}
          <ellipse cx="37" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" />
          <ellipse cx="43" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" style={{animationDelay: '0.3s'}} />
          {/* Nariz */}
          <ellipse cx="40" cy="40" rx="1.5" ry="1" fill="#FF69B4" />
          {/* Boca con sonrisa animada */}
          <path d="M39 42 Q40 44 41 42" stroke="#333" strokeWidth="1" fill="none" className="animate-pulse" />
          {/* Alas con movimiento */}
          <path d="M20 35 Q15 25 20 15" fill="#FFB6C1" opacity="0.8" className="animate-flap" />
          <path d="M60 35 Q65 25 60 15" fill="#FFB6C1" opacity="0.8" className="animate-flap" style={{animationDelay: '0.5s'}} />
          
          {/* Accesorios con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="47" rx="8" ry="2.5" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 65 Q40 80 52 65 Q40 70 28 65" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="37" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="43" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="40.5" y1="35" x2="43.5" y2="35" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 50 L45 50 L40 55 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 47 Q40 53 50 47" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 50 Q40 55 45 50" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "lobo") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-bounce-slow hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="55" rx="24" ry="20" fill="#8B8B8B" className="animate-pulse" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="35" rx="15" ry="12" fill="#8B8B8B" className="animate-bounce-slow" />
          {/* Orejas puntiagudas con movimiento independiente */}
          <path d="M30 20 L32 10 L35 20 Z" fill="#8B8B8B" className="animate-wiggle" style={{animationDelay: '0.2s'}} />
          <path d="M50 20 L48 10 L45 20 Z" fill="#8B8B8B" className="animate-wiggle" style={{animationDelay: '0.5s'}} />
          {/* Hocico */}
          <ellipse cx="40" cy="42" rx="6" ry="4" fill="#666" />
          {/* Ojos con parpadeo */}
          <ellipse cx="36" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" />
          <ellipse cx="44" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" style={{animationDelay: '0.3s'}} />
          {/* Nariz */}
          <ellipse cx="40" cy="40" rx="1.5" ry="1" fill="#000" />
          {/* Boca con sonrisa animada */}
          <path d="M38 42 Q40 44 42 42" stroke="#333" strokeWidth="1" fill="none" className="animate-pulse" />
          
          {/* Accesorios con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="47" rx="8" ry="2.5" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 65 Q40 80 52 65 Q40 70 28 65" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="36" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="44" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="39.5" y1="35" x2="42.5" y2="35" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 50 L45 50 L40 55 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 47 Q40 53 50 47" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 50 Q40 55 45 50" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "tigre") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-bounce-slow hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="55" rx="25" ry="22" fill="#FFA500" className="animate-pulse" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="35" rx="16" ry="14" fill="#FFA500" className="animate-bounce-slow" />
          {/* Orejas con movimiento independiente */}
          <ellipse cx="30" cy="20" rx="5" ry="7" fill="#FFA500" className="animate-wiggle" style={{animationDelay: '0.3s'}} />
          <ellipse cx="50" cy="20" rx="5" ry="7" fill="#FFA500" className="animate-wiggle" style={{animationDelay: '0.6s'}} />
          {/* Rayas con movimiento sutil */}
          <path d="M25 45 L35 45" stroke="#000" strokeWidth="2" className="animate-pulse" />
          <path d="M45 45 L55 45" stroke="#000" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.2s'}} />
          <path d="M30 50 L40 50" stroke="#000" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.4s'}} />
          <path d="M40 50 L50 50" stroke="#000" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.6s'}} />
          <path d="M35 55 L45 55" stroke="#000" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.8s'}} />
          {/* Ojos con parpadeo */}
          <ellipse cx="36" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" />
          <ellipse cx="44" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" style={{animationDelay: '0.3s'}} />
          {/* Nariz */}
          <ellipse cx="40" cy="40" rx="1.5" ry="1" fill="#000" />
          {/* Boca con sonrisa animada */}
          <path d="M38 42 Q40 44 42 42" stroke="#333" strokeWidth="1" fill="none" className="animate-pulse" />
          
          {/* Accesorios con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="47" rx="9" ry="2.5" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 65 Q40 80 52 65 Q40 70 28 65" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="36" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="44" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="39.5" y1="35" x2="42.5" y2="35" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 50 L45 50 L40 55 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 47 Q40 53 50 47" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 50 Q40 55 45 50" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "elefante") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-float hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="55" rx="26" ry="22" fill="#C0C0C0" className="animate-pulse" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="35" rx="18" ry="15" fill="#C0C0C0" className="animate-bounce-slow" />
          {/* Trompa con movimiento */}
          <ellipse cx="40" cy="45" rx="4" ry="8" fill="#C0C0C0" className="animate-wiggle" />
          {/* Orejas grandes con movimiento independiente */}
          <ellipse cx="25" cy="25" rx="8" ry="12" fill="#C0C0C0" className="animate-wave" style={{animationDelay: '0.3s'}} />
          <ellipse cx="55" cy="25" rx="8" ry="12" fill="#C0C0C0" className="animate-wave" style={{animationDelay: '0.6s'}} />
          {/* Ojos con parpadeo */}
          <ellipse cx="36" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" />
          <ellipse cx="44" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" style={{animationDelay: '0.4s'}} />
          {/* Colmillos con brillo */}
          <path d="M35 42 L32 38" stroke="#FFF" strokeWidth="2" className="animate-glow" />
          <path d="M45 42 L48 38" stroke="#FFF" strokeWidth="2" className="animate-glow" style={{animationDelay: '0.5s'}} />
          
          {/* Accesorios con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="47" rx="9" ry="2.5" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 65 Q40 80 52 65 Q40 70 28 65" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="36" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="44" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="39.5" y1="35" x2="42.5" y2="35" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 50 L45 50 L40 55 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 47 Q40 53 50 47" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 50 Q40 55 45 50" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "delfin") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-float hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="50" rx="28" ry="18" fill="#87CEEB" className="animate-pulse" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="35" rx="12" ry="10" fill="#87CEEB" className="animate-bounce-slow" />
          {/* Hocico */}
          <ellipse cx="40" cy="30" rx="6" ry="4" fill="#87CEEB" />
          {/* Ojos con parpadeo */}
          <ellipse cx="36" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" />
          <ellipse cx="44" cy="35" rx="2" ry="2.5" fill="#222" className="animate-blink" style={{animationDelay: '0.3s'}} />
          {/* Aleta dorsal con movimiento */}
          <path d="M40 25 L45 15 L40 20 Z" fill="#87CEEB" className="animate-wave" />
          {/* Aletas laterales con movimiento independiente */}
          <path d="M25 45 L15 40 L25 35 Z" fill="#87CEEB" className="animate-flap" style={{animationDelay: '0.2s'}} />
          <path d="M55 45 L65 40 L55 35 Z" fill="#87CEEB" className="animate-flap" style={{animationDelay: '0.5s'}} />
          {/* Cola con movimiento */}
          <path d="M60 50 L70 45 L70 55 Z" fill="#87CEEB" className="animate-wave" style={{animationDelay: '0.3s'}} />
          
          {/* Accesorios con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="42" rx="8" ry="2.5" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 65 Q40 80 52 65 Q40 70 28 65" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="36" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="44" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="39.5" y1="35" x2="42.5" y2="35" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 45 L45 45 L40 50 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 42 Q40 48 50 42" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 45 Q40 50 45 45" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "pinguino") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-bounce-slow hover:animate-pulse">
          {/* Cuerpo con animación de respiración */}
          <ellipse cx="40" cy="55" rx="22" ry="25" fill="#000000" className="animate-pulse" />
          {/* Panza blanca */}
          <ellipse cx="40" cy="55" rx="15" ry="18" fill="#FFFFFF" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="35" rx="14" ry="12" fill="#000000" className="animate-bounce-slow" />
          {/* Pico */}
          <path d="M40 30 L45 25 L40 20 L35 25 Z" fill="#FFA500" />
          {/* Ojos con parpadeo */}
          <ellipse cx="36" cy="35" rx="2" ry="2.5" fill="#FFFFFF" className="animate-blink" />
          <ellipse cx="44" cy="35" rx="2" ry="2.5" fill="#FFFFFF" className="animate-blink" style={{animationDelay: '0.3s'}} />
          <ellipse cx="36" cy="35" rx="1" ry="1.5" fill="#000000" />
          <ellipse cx="44" cy="35" rx="1" ry="1.5" fill="#000000" />
          {/* Alas con movimiento independiente */}
          <ellipse cx="25" cy="50" rx="8" ry="12" fill="#000000" className="animate-wiggle" style={{animationDelay: '0.2s'}} />
          <ellipse cx="55" cy="50" rx="8" ry="12" fill="#000000" className="animate-wiggle" style={{animationDelay: '0.5s'}} />
          {/* Patas con movimiento */}
          <ellipse cx="35" cy="75" rx="3" ry="5" fill="#FFA500" className="animate-pulse" />
          <ellipse cx="45" cy="75" rx="3" ry="5" fill="#FFA500" className="animate-pulse" style={{animationDelay: '0.3s'}} />
          
          {/* Accesorios con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="47" rx="8" ry="2.5" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 65 Q40 80 52 65 Q40 70 28 65" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="36" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="44" cy="35" rx="3.5" ry="2.5" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="39.5" y1="35" x2="42.5" y2="35" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 50 L45 50 L40 55 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 47 Q40 53 50 47" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 50 Q40 55 45 50" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  if (key === "tortuga") {
    return (
      <div className="relative group">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-float hover:animate-pulse">
          {/* Caparazón con animación de respiración */}
          <ellipse cx="40" cy="50" rx="25" ry="20" fill="#90EE90" className="animate-pulse" />
          <ellipse cx="40" cy="50" rx="20" ry="15" fill="#228B22" />
          {/* Cabeza con movimiento sutil */}
          <ellipse cx="40" cy="35" rx="8" ry="6" fill="#90EE90" className="animate-bounce-slow" />
          {/* Ojos con parpadeo */}
          <ellipse cx="37" cy="35" rx="1.5" ry="2" fill="#222" className="animate-blink" />
          <ellipse cx="43" cy="35" rx="1.5" ry="2" fill="#222" className="animate-blink" style={{animationDelay: '0.4s'}} />
          {/* Nariz */}
          <ellipse cx="40" cy="38" rx="1" ry="0.5" fill="#000" />
          {/* Patas con movimiento independiente */}
          <ellipse cx="25" cy="55" rx="4" ry="6" fill="#90EE90" className="animate-wiggle" style={{animationDelay: '0.1s'}} />
          <ellipse cx="55" cy="55" rx="4" ry="6" fill="#90EE90" className="animate-wiggle" style={{animationDelay: '0.3s'}} />
          <ellipse cx="25" cy="45" rx="4" ry="6" fill="#90EE90" className="animate-wiggle" style={{animationDelay: '0.5s'}} />
          <ellipse cx="55" cy="45" rx="4" ry="6" fill="#90EE90" className="animate-wiggle" style={{animationDelay: '0.7s'}} />
          {/* Cola con movimiento */}
          <ellipse cx="40" cy="65" rx="3" ry="5" fill="#90EE90" className="animate-wave" />
          
          {/* Accesorios con animaciones */}
          {accesorios.includes("collar") && (
            <ellipse cx="40" cy="42" rx="6" ry="2" fill="#2D9CDB" className="animate-pulse" />
          )}
          {accesorios.includes("cape") && (
            <path d="M28 65 Q40 80 52 65 Q40 70 28 65" fill="#E63946" className="animate-wave" />
          )}
          {accesorios.includes("hat") && (
            <ellipse cx="40" cy="15" rx="8" ry="3" fill="#333" className="animate-bounce-slow" />
          )}
          {accesorios.includes("glasses") && (
            <g className="animate-pulse">
              <ellipse cx="37" cy="35" rx="2.5" ry="2" fill="none" stroke="#555" strokeWidth="1.5" />
              <ellipse cx="43" cy="35" rx="2.5" ry="2" fill="none" stroke="#555" strokeWidth="1.5" />
              <line x1="39.5" y1="35" x2="42.5" y2="35" stroke="#555" strokeWidth="1.5" />
            </g>
          )}
          {accesorios.includes("bowtie") && (
            <path d="M35 45 L45 45 L40 50 Z" fill="#FF6B6B" className="animate-pulse" />
          )}
          {accesorios.includes("bandana") && (
            <path d="M30 42 Q40 48 50 42" stroke="#FFD93D" strokeWidth="3" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("scarf") && (
            <path d="M35 45 Q40 50 45 45" stroke="#A8E6CF" strokeWidth="4" fill="none" className="animate-wave" />
          )}
          {accesorios.includes("crown") && (
            <g className="animate-bounce-slow">
              <path d="M30 15 L35 10 L40 15 L45 10 L50 15 L50 18 L30 18 Z" fill="#FFD700" />
              <circle cx="35" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" />
              <circle cx="40" cy="12" r="1" fill="#4ECDC4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <circle cx="45" cy="12" r="1" fill="#FF6B6B" className="animate-pulse" style={{animationDelay: '1s'}} />
            </g>
          )}
          {accesorios.includes("wings") && (
            <g className="animate-flap">
              <path d="M15 35 Q25 25 15 15" fill="#FFB6C1" opacity="0.8" />
              <path d="M65 35 Q55 25 65 15" fill="#FFB6C1" opacity="0.8" />
            </g>
          )}
        </svg>
        {/* Efecto de brillo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
    );
  }
  // Default: círculo con carita
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <ellipse cx="40" cy="50" rx="28" ry="25" fill="#BFD7ED" />
      <ellipse cx="40" cy="32" rx="18" ry="16" fill="#BFD7ED" />
      <ellipse cx="33" cy="32" rx="2.5" ry="3" fill="#222" />
      <ellipse cx="47" cy="32" rx="2.5" ry="3" fill="#222" />
      <ellipse cx="40" cy="38" rx="2.5" ry="1.5" fill="#333" />
      <path d="M37 42 Q40 45 43 42" stroke="#333" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// Unifica accesorios de accesorios y itemsCustom
function getAllAccessories(mascota: any, localAccessories: {[key: string]: string[]} = {}) {
  const mascotaId = mascota._id || mascota.id;
  
  // Accesorios del backend
  const acc = Array.isArray(mascota.accesorios) ? mascota.accesorios : [];
  const items = Array.isArray(mascota.itemsCustom) ? mascota.itemsCustom.map((i: any) => (i.nombre || i)) : [];
  
  // Accesorios locales - buscar por ID exacto
  const local = localAccessories[mascotaId] || [];
  
  // Combinar todos los accesorios y eliminar duplicados
  const allAccessories = [...acc, ...items, ...local];
  const uniqueAccessories = [...new Set(allAccessories)];
  
  console.log(`=== getAllAccessories para ${mascota.nombre} ===`);
  console.log("Mascota ID:", mascotaId);
  console.log("Accesorios backend:", acc);
  console.log("ItemsCustom:", items);
  console.log("Accesorios locales:", local);
  console.log("localAccessories keys disponibles:", Object.keys(localAccessories));
  console.log("¿Existe este ID en localAccessories?", mascotaId in localAccessories);
  console.log("Todos los accesorios:", allAccessories);
  console.log("localAccessories keys disponibles:", Object.keys(localAccessories));
  console.log("¿Existe este ID en localAccessories?", mascotaId in localAccessories);
  console.log("Accesorios únicos finales:", uniqueAccessories);
  
  return uniqueAccessories;
}

// Obtiene el tipo de mascota (backend o local)
function getPetType(mascota: any, localPetTypes: {[key: string]: string} = {}) {
  // Primero intentar obtener del backend
  if (mascota.tipo && mascota.tipo !== "undefined") {
    return mascota.tipo;
  }
  
  // Si no está en el backend, buscar en almacenamiento local
  const mascotaId = mascota._id || mascota.id;
  const localType = localPetTypes[mascotaId];
  
  if (localType) {
    return localType;
  }
  
  // Si no hay tipo guardado, intentar inferir del nombre
  const nombre = mascota.nombre?.toLowerCase() || "";
  
  // Mapeo de nombres a tipos (para mascotas existentes)
  if (nombre.includes("tigre") || nombre.includes("tiger")) return "tigre";
  if (nombre.includes("perro") || nombre.includes("dog")) return "perro";
  if (nombre.includes("gato") || nombre.includes("cat")) return "gato";
  if (nombre.includes("dragon")) return "dragon";
  if (nombre.includes("conejo") || nombre.includes("rabbit")) return "conejo";
  if (nombre.includes("panda")) return "panda";
  if (nombre.includes("unicornio") || nombre.includes("unicorn")) return "unicornio";
  if (nombre.includes("lobo") || nombre.includes("wolf")) return "lobo";
  if (nombre.includes("elefante") || nombre.includes("elephant")) return "elefante";
  if (nombre.includes("delfin") || nombre.includes("dolphin")) return "delfin";
  if (nombre.includes("pinguino") || nombre.includes("penguin")) return "pinguino";
  if (nombre.includes("tortuga") || nombre.includes("turtle")) return "tortuga";
  
  // Default: perro
  return "perro";
}

export default function MascotasPanel({ token }: MascotasPanelProps) {
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accion, setAccion] = useState("");
  const [showCrear, setShowCrear] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newTipo, setNewTipo] = useState("");

  const [showPersonalizar, setShowPersonalizar] = useState(false);
  const [mascotaPersonalizar, setMascotaPersonalizar] = useState<any>(null);
  const [itemSeleccionado, setItemSeleccionado] = useState("");
  const [localAccessories, setLocalAccessories] = useState<{[key: string]: string[]}>(() => {
    // Cargar accesorios guardados en localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('localAccessories');
      const parsed = saved ? JSON.parse(saved) : {};
      console.log("=== CARGA INICIAL DE ACCESORIOS ===");
      console.log("localStorage raw:", saved);
      console.log("localAccessories cargado:", parsed);
      return parsed;
    }
    return {};
  });
  const [localPetTypes, setLocalPetTypes] = useState<{[key: string]: string}>(() => {
    // Cargar tipos guardados en localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('localPetTypes');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Lista de tipos de mascotas disponibles
  const tiposMascotas = [
    { id: "perro", nombre: "Perro", emoji: "🐕", color: "#E2B07A" },
    { id: "gato", nombre: "Gato", emoji: "🐱", color: "#F5CBA7" },
    { id: "dragon", nombre: "Dragón", emoji: "🐲", color: "#7ED957" },
    { id: "conejo", nombre: "Conejo", emoji: "🐰", color: "#F8F9FA" },
    { id: "panda", nombre: "Panda", emoji: "🐼", color: "#FFFFFF" },
    { id: "unicornio", nombre: "Unicornio", emoji: "🦄", color: "#FFB6C1" },
    { id: "lobo", nombre: "Lobo", emoji: "🐺", color: "#8B8B8B" },
    { id: "tigre", nombre: "Tigre", emoji: "🐯", color: "#FFA500" },
    { id: "elefante", nombre: "Elefante", emoji: "🐘", color: "#C0C0C0" },
    { id: "delfin", nombre: "Delfín", emoji: "🐬", color: "#87CEEB" },
    { id: "pinguino", nombre: "Pingüino", emoji: "🐧", color: "#000000" },
    { id: "tortuga", nombre: "Tortuga", emoji: "🐢", color: "#90EE90" },
  ];

  // Lista de accesorios disponibles
  const accesoriosDisponibles = [
    { id: "collar", nombre: "Collar", emoji: "🦮" },
    { id: "cape", nombre: "Capa", emoji: "🦸" },
    { id: "hat", nombre: "Sombrero", emoji: "🎩" },
    { id: "glasses", nombre: "Lentes", emoji: "🕶️" },
    { id: "bowtie", nombre: "Corbata", emoji: "🎀" },
    { id: "bandana", nombre: "Bandana", emoji: "🧣" },
    { id: "scarf", nombre: "Bufanda", emoji: "🧣" },
    { id: "crown", nombre: "Corona", emoji: "👑" },
    { id: "wings", nombre: "Alas", emoji: "🦋" },
  ];

  const cargarMascotas = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await getMascotas(token);
      console.log("Mascotas cargadas:", data); // Debug log
      data.forEach((mascota: any) => {
        console.log(`Mascota: ${mascota.nombre}, Tipo: "${mascota.tipo}"`); // Debug log detallado
      });
      setMascotas(data);
    } catch {
      setError("No se pudieron cargar las mascotas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
    cargarMascotas();
    }
  }, [token]);

  // Acciones
  // Modificar handleAccion para mostrar mensaje del backend si existe
  const handleAccion = async (fn: Function, id: string, extra?: any) => {
    setAccion("Procesando...");
    try {
      console.log("Token actual:", token?.substring(0, 20) + "...");
      const result = await fn(id, ...(extra ? [extra, token] : [token]));
      await cargarMascotas();
      // Si el backend devuelve un mensaje, mostrarlo
      if (result && result.mensaje) {
        setAccion(result.mensaje);
      } else {
      setAccion("¡Acción exitosa!");
      }
    } catch (error) {
      console.error("Error en acción:", error);
      setAccion("Error al ejecutar la acción");
    } finally {
      setTimeout(() => setAccion(""), 2000);
    }
  };

  // Función específica para eliminar mascota
  const handleEliminar = async (mascotaId: string, mascotaNombre: string) => {
    setAccion("Eliminando mascota...");
    try {
      await eliminarMascota(mascotaId, token);
      await cargarMascotas();
      setAccion(`¡${mascotaNombre} ha sido eliminado!`);
      
      // Limpiar datos locales de la mascota eliminada
      const newLocalPetTypes = { ...localPetTypes };
      const newLocalAccessories = { ...localAccessories };
      delete newLocalPetTypes[mascotaId];
      delete newLocalAccessories[mascotaId];
      
      setLocalPetTypes(newLocalPetTypes);
      setLocalAccessories(newLocalAccessories);
      localStorage.setItem('localPetTypes', JSON.stringify(newLocalPetTypes));
      localStorage.setItem('localAccessories', JSON.stringify(newLocalAccessories));
      
    } catch (error) {
      console.error("Error al eliminar mascota:", error);
      setAccion("Error al eliminar la mascota");
    } finally {
      setTimeout(() => setAccion(""), 3000);
    }
  };

  // Al abrir el formulario de crear mascota
  const handleShowCrear = async () => {
    setShowCrear(!showCrear);
  };

  // Crear mascota
  const handleCrearMascota = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creando mascota con tipo:", newTipo); // Debug log
    setAccion("Creando mascota...");
    try {
      const result = await crearMascota({ nombre: newNombre, tipo: newTipo, heroe: "1" }, token);
      console.log("Mascota creada exitosamente con tipo:", newTipo); // Debug log
      
      // Guardar el tipo localmente ya que el backend no lo devuelve
      const mascotaId = result._id || result.id;
      if (mascotaId) {
        const newLocalPetTypes = {
          ...localPetTypes,
          [mascotaId]: newTipo
        };
        setLocalPetTypes(newLocalPetTypes);
        localStorage.setItem('localPetTypes', JSON.stringify(newLocalPetTypes));
        console.log("Tipo guardado localmente:", mascotaId, "->", newTipo);
      }
      
      setShowCrear(false);
      setNewNombre("");
      setNewTipo("");
      await cargarMascotas();
      setAccion("¡Mascota creada!");
    } catch {
      setAccion("Error al crear mascota");
    } finally {
      setTimeout(() => setAccion(""), 1500);
    }
  };



  // Personalizar mascota
  const handleShowPersonalizar = (mascota: any) => {
    console.log("=== ABRIENDO PERSONALIZACIÓN ===");
    console.log("Mascota seleccionada:", mascota.nombre, "ID:", mascota._id || mascota.id);
    console.log("Accesorios actuales de la mascota:", getAllAccessories(mascota, localAccessories));
    
    setMascotaPersonalizar(mascota);
    setItemSeleccionado("");
    setShowPersonalizar(true);
    
    console.log("Diálogo abierto para:", mascota.nombre);
  };

  const handlePersonalizar = async () => {
    console.log("=== INICIANDO PERSONALIZACIÓN ===");
    console.log("itemSeleccionado:", itemSeleccionado);
    console.log("mascotaPersonalizar:", mascotaPersonalizar);
    
    if (!itemSeleccionado || !mascotaPersonalizar) {
      console.log("❌ FALLA: itemSeleccionado o mascotaPersonalizar es null/undefined");
      console.log("itemSeleccionado:", itemSeleccionado);
      console.log("mascotaPersonalizar:", mascotaPersonalizar);
      return;
    }
    
    setAccion("Personalizando mascota...");
    try {
      console.log("Personalizando mascota:", mascotaPersonalizar.nombre, "con item:", itemSeleccionado);
      
      // Intentar con el backend primero
      try {
        console.log("🔄 Intentando con backend...");
        const result = await personalizarMascota(mascotaPersonalizar.id || mascotaPersonalizar._id, itemSeleccionado, token);
        console.log("✅ Resultado de personalización (backend):", result);
        
        // Explicitly check backend message for "Item no válido."
        if (result.mensaje === "Item no válido.") {
          console.log("❌ Backend reportó 'Item no válido.', usando almacenamiento local.");
          throw new Error("Backend invalid item"); // Force fallback
        }
        
      await cargarMascotas();
      } catch (backendError) {
        console.log("❌ Backend falló, usando almacenamiento local:", backendError);
        
        // Si el backend falla, usar almacenamiento local
        const mascotaId = mascotaPersonalizar._id || mascotaPersonalizar.id;
        const currentAccessories = localAccessories[mascotaId] || [];
        const newAccessories = [...currentAccessories, itemSeleccionado];
        
        const newLocalAccessories = {
          ...localAccessories,
          [mascotaId]: newAccessories
        };
        
        console.log("=== GUARDANDO ACCESORIOS LOCALMENTE ===");
        console.log("Mascota ID:", mascotaId);
        console.log("Accesorios actuales:", currentAccessories);
        console.log("Nuevo accesorio:", itemSeleccionado);
        console.log("Accesorios nuevos:", newAccessories);
        console.log("localAccessories antes:", localAccessories);
        console.log("localAccessories después:", newLocalAccessories);
        
        setLocalAccessories(newLocalAccessories);
        localStorage.setItem('localAccessories', JSON.stringify(newLocalAccessories));
        
        console.log("✅ Accesorios guardados localmente:", newAccessories);
        
        // Forzar re-renderizado de la vista principal
        setTimeout(() => {
          console.log("🔄 Forzando re-renderizado después de guardar accesorios");
          setMascotas([...mascotas]); // Esto fuerza un re-renderizado
        }, 100);
      }
      
      setShowPersonalizar(false);
      setAccion("¡Mascota personalizada!");
      console.log("✅ Personalización completada exitosamente");
    } catch (error) {
      console.error("❌ Error al personalizar:", error);
      setAccion("Error al personalizar mascota");
    } finally {
      setTimeout(() => setAccion(""), 1500);
    }
  };

  // Si no hay token, mostrar loading
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center min-h-[40vh] text-lg">Cargando mascotas...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-8 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2"><PawPrint className="w-7 h-7 text-blue-500" />Tus Mascotas</h2>
          <div className="flex gap-2">
            <Button onClick={handleShowCrear} className="bg-green-600 text-white" size="sm">
              <Plus className="w-4 h-4 mr-1" />{showCrear ? "Cancelar" : "Crear Mascota"}
            </Button>

            <Button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }} 
              className="bg-red-600 text-white" 
              size="sm"
              title="Refrescar token si hay problemas de autenticación"
            >
              🔄 Refrescar
            </Button>
            <Button
              onClick={() => {
                console.log("=== PRUEBA DE SVGs ===");
                tiposMascotas.forEach(tipo => {
                  console.log(`Probando tipo: "${tipo.id}"`);
                });
              }}
              className="bg-purple-600 text-white" 
              size="sm"
              title="Probar SVGs"
            >
              🧪 Probar SVGs
            </Button>
            <Button
              onClick={() => {
                console.log("=== PRUEBA DE ACCESORIOS ===");
                console.log("localAccessories actual:", localAccessories);
                console.log("localStorage raw:", localStorage.getItem('localAccessories'));
                console.log("localStorage parsed:", JSON.parse(localStorage.getItem('localAccessories') || '{}'));
                
                // Probar agregar un accesorio de prueba
                const testId = "test-mascota-123";
                const testAccessories = ["collar", "hat"];
                const newLocalAccessories = {
                  ...localAccessories,
                  [testId]: testAccessories
                };
                setLocalAccessories(newLocalAccessories);
                localStorage.setItem('localAccessories', JSON.stringify(newLocalAccessories));
                console.log("Accesorios de prueba agregados:", testAccessories);
              }}
              className="bg-orange-600 text-white" 
              size="sm"
              title="Probar Accesorios"
            >
              🧪 Probar Accesorios
            </Button>


      </div>
      </div>
        {accion && <div className="mb-4 text-blue-600 text-center font-medium">{accion}</div>}
      {showCrear && (
          <Card className="mb-8 bg-white/90 shadow-lg">
            <CardHeader>
              <CardTitle>Crear Mascota</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCrearMascota} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de la mascota"
              value={newNombre}
              onChange={e => setNewNombre(e.target.value)}
                  className="border px-2 py-2 rounded w-full"
              required
            />
            <div>
              <label className="mr-2 font-medium">Tipo de mascota:</label>
              <select 
              value={newTipo}
              onChange={e => setNewTipo(e.target.value)}
                className="border px-2 py-2 rounded w-full" 
              required
              >
                <option value="">Selecciona un tipo</option>
                {tiposMascotas.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.emoji} {tipo.nombre}
                  </option>
                ))}
              </select>
          </div>
            {newTipo && (
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="mb-2 text-sm text-gray-600">Vista previa:</div>
                  <div className="flex justify-center">
                    <PetSVG tipo={newTipo} />
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-800">
                    {tiposMascotas.find(t => t.id === newTipo)?.nombre}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Tipo seleccionado: "{newTipo}"
                  </div>
                </div>
              </div>
            )}

                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">Crear</Button>
        </form>
            </CardContent>
          </Card>
      )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mascotas.length === 0 && <div className="col-span-2 text-center text-gray-500">No tienes mascotas aún.</div>}
          {mascotas.map((mascota) => {
            const accesorios = getAllAccessories(mascota, localAccessories);
            const petType = getPetType(mascota, localPetTypes);
            const mascotaId = mascota._id || mascota.id;
            console.log("=== MASCOTA EN VISTA PRINCIPAL ===");
            console.log("Nombre:", mascota.nombre);
            console.log("ID:", mascotaId);
            console.log("Tipo backend:", `"${mascota.tipo}"`);
            console.log("Tipo final:", `"${petType}"`);
            console.log("Accesorios backend:", mascota.accesorios);
            console.log("ItemsCustom:", mascota.itemsCustom);
            console.log("Accesorios locales:", localAccessories[mascotaId]);
            console.log("Accesorios finales:", accesorios);
            console.log("localAccessories completo:", localAccessories);
            console.log("=== VERIFICACIÓN FINAL ===");
            console.log("¿Se van a renderizar accesorios?", accesorios.length > 0 ? "SÍ" : "NO");
            console.log("Accesorios que se van a renderizar:", accesorios);
            const isDead = mascota.vida !== undefined && mascota.vida <= 0;
            return (
              <Card key={mascota.id || mascota._id} className="bg-white/90 shadow-xl flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="relative flex-shrink-0 w-20 h-20 flex items-center justify-center">
                    <PetSVG tipo={petType} accesorios={accesorios} />
        </div>
                                      <div>
                      <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">{mascota.nombre} <Badge variant="secondary" className="ml-2">{petType}</Badge></CardTitle>
                      <div className="text-sm text-gray-500 flex items-center gap-2"><User className="w-4 h-4" /> {mascota.heroe || "Sin héroe"}</div>
                      {accesorios.length > 0 && (
                        <div className="mt-1">
                          <div className="text-xs text-gray-600 mb-1">Accesorios:</div>
                          <div className="flex flex-wrap gap-1">
                            {accesorios.map((accesorio, index) => (
                              <span key={index} className="px-1 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                                {accesorio}
                              </span>
                            ))}
          </div>
                        </div>
                      )}
                      {isDead && (
                        <div className="text-red-600 font-bold mt-1">¡Mascota muerta! {mascota.causaMuerte && <span className="text-xs">({mascota.causaMuerte})</span>}</div>
                      )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-sm"><Smile className="w-4 h-4 text-yellow-400" /> Felicidad</div>
                      <Progress value={mascota.felicidad || 100} className="h-2" />
                      <span className="text-xs text-gray-500">{mascota.felicidad || 100}%</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm"><Utensils className="w-4 h-4 text-green-400" /> Hambre</div>
                      <Progress value={mascota.hambre || 100} className="h-2" />
                      <span className="text-xs text-gray-500">{mascota.hambre || 100}%</span>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm"><Heart className="w-4 h-4 text-pink-600" /> Vida</div>
                      <Progress value={mascota.vida !== undefined ? mascota.vida : 100} className="h-2" />
                      <span className="text-xs text-gray-500">{mascota.vida !== undefined ? mascota.vida : 100}/100</span>
                    </div>
            </div>
                  {Array.isArray(mascota.enfermedades) && mascota.enfermedades.length > 0 && (
                    <div className="mt-2">
                      <span className="font-semibold text-yellow-700">Enfermedades:</span>
                      <ul className="list-disc ml-5 text-sm text-yellow-800">
                        {mascota.enfermedades.map((e: string, i: number) => (
                          <li key={i} className="flex items-center gap-2">
                            {e}
                            <Button onClick={() => handleAccion(curarMascota, mascota.id || mascota._id, e)} className="bg-pink-500 hover:bg-pink-600 text-white" size="sm">Curar</Button>
              </li>
            ))}
          </ul>
        </div>
      )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button onClick={() => handleAccion(alimentarMascota, mascota.id || mascota._id)} className="bg-green-500 hover:bg-green-600 text-white" size="sm" disabled={mascota.felicidad >= 100}>Alimentar</Button>
                    <Button onClick={() => handleAccion(pasearMascota, mascota.id || mascota._id)} className="bg-blue-500 hover:bg-blue-600 text-white" size="sm">Pasear</Button>
                    <Button onClick={() => handleShowPersonalizar(mascota)} className="bg-purple-500 hover:bg-purple-600 text-white" size="sm">Personalizar</Button>
                    <Button onClick={() => handleAccion(enfermarMascota, mascota.id || mascota._id, prompt('Enfermedad:') || "")} className="bg-yellow-500 hover:bg-yellow-600 text-white" size="sm">Enfermar</Button>
                    <Button onClick={() => handleAccion(revivirMascota, mascota.id || mascota._id)} className="bg-gray-700 hover:bg-gray-800 text-white" size="sm">Revivir</Button>
                    <Button onClick={() => handleAccion(matarMascota, mascota.id || mascota._id, prompt('Causa de muerte:') || "")} className="bg-red-700 hover:bg-red-800 text-white" size="sm">Matar</Button>
                    <Button 
                      onClick={() => {
                        if (confirm(`¿Estás seguro de que quieres eliminar a ${mascota.nombre}? Esta acción no se puede deshacer.`)) {
                          handleEliminar(mascota.id || mascota._id, mascota.nombre);
                        }
                      }} 
                      className="bg-red-500 hover:bg-red-600 text-white" 
                      size="sm"
                      title="Eliminar mascota permanentemente"
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Diálogo de Personalización */}
      {showPersonalizar && mascotaPersonalizar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Personalizar {mascotaPersonalizar.nombre}</h3>
            
            {/* Vista previa de la mascota */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {(() => {
                  const petType = getPetType(mascotaPersonalizar, localPetTypes);
                  const currentAccessories = getAllAccessories(mascotaPersonalizar, localAccessories);
                  const previewAccessories = [...currentAccessories, ...(itemSeleccionado ? [itemSeleccionado] : [])];
                  
                  console.log("=== VISTA PREVIA PERSONALIZACIÓN ===");
                  console.log("Tipo de mascota:", petType);
                  console.log("Accesorios actuales:", currentAccessories);
                  console.log("Item seleccionado:", itemSeleccionado);
                  console.log("Accesorios para vista previa:", previewAccessories);
                  
                  return (
                    <>
                      <PetSVG 
                        tipo={petType} 
                        accesorios={previewAccessories} 
                      />
                      <div className="text-center mt-2 text-sm text-gray-600">
                        Vista previa {itemSeleccionado && `(+ ${itemSeleccionado})`}
                      </div>
                      <div className="text-center mt-1 text-xs text-gray-500">
                        Accesorios: {previewAccessories.join(", ") || "ninguno"}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Accesorios actuales */}
            {getAllAccessories(mascotaPersonalizar, localAccessories).length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Accesorios actuales:</label>
                <div className="flex flex-wrap gap-2">
                  {getAllAccessories(mascotaPersonalizar, localAccessories).map((accesorio, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {accesorio}
                      </span>
                      <button
                        onClick={() => {
                          const mascotaId = mascotaPersonalizar._id || mascotaPersonalizar.id;
                          const currentAccessories = localAccessories[mascotaId] || [];
                          const newAccessories = currentAccessories.filter(a => a !== accesorio);
                          
                          const newLocalAccessories = {
                            ...localAccessories,
                            [mascotaId]: newAccessories
                          };
                          
                          setLocalAccessories(newLocalAccessories);
                          localStorage.setItem('localAccessories', JSON.stringify(newLocalAccessories));
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                        title="Quitar accesorio"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de accesorios disponibles */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Selecciona un accesorio:</label>
              <div className="grid grid-cols-3 gap-2">
                {accesoriosDisponibles.map((accesorio) => (
                  <button
                    key={accesorio.id}
                    onClick={() => {
                      console.log("=== SELECCIONANDO ACCESORIO ===");
                      console.log("Accesorio seleccionado:", accesorio.id);
                      console.log("Accesorio nombre:", accesorio.nombre);
                      setItemSeleccionado(accesorio.id);
                      console.log("itemSeleccionado actualizado a:", accesorio.id);
                    }}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      itemSeleccionado === accesorio.id
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{accesorio.emoji}</div>
                    <div className="text-xs">{accesorio.nombre}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Debug info */}
            <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
              <div>Item seleccionado: <strong>{itemSeleccionado || "ninguno"}</strong></div>
              <div>Mascota: <strong>{mascotaPersonalizar?.nombre}</strong></div>
              <div>ID: <strong>{mascotaPersonalizar?._id || mascotaPersonalizar?.id}</strong></div>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  console.log("🖱️ Botón 'Agregar Accesorio' clickeado");
                  console.log("itemSeleccionado en el botón:", itemSeleccionado);
                  console.log("mascotaPersonalizar en el botón:", mascotaPersonalizar?.nombre);
                  handlePersonalizar();
                }}
                disabled={!itemSeleccionado}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
              >
                Agregar Accesorio
              </Button>

              <Button
                onClick={() => setShowPersonalizar(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reproductor de música */}
      <AdvancedMusicPlayer />
    </div>
  );
} 