import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, RotateCw, RotateCcw, Volume2, VolumeX, Eye, ArrowLeftRight, Minimize2, Move } from "lucide-react";

interface Tour3DProps {
  propertyTitle: string;
  rooms: string[];
  onClose: () => void;
}

// Visual simulation imagery mapping to simulate different high-end environments
const roomImages: Record<string, string> = {
  "Hall Imperial": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
  "Salão Nobre": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
  "Adega Privativa": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200",
  "Terraço dos Mouros": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
  "Terraço de Vidro": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
  "Living Integrado": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
  "Cozinha Gourmet": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200",
  "Suíte Master": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200",
  "Skyline Living": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
  "Cozinha Chef": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1200",
  "Quarto Panorâmico": "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200",
  "Jardim de contemplação": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1200",
  "Sala de Chá": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200",
  "Onsen Termal": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
  "Living Principal": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
  "Varanda Panorâmica": "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&q=80&w=1200",
  "Cinema Privativo": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200",
  "Salão da Lareira": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200",
  "Piscina Coberta": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200",
  "Suíte Presidencial": "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1200",
  "Adega de Vidro": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200",
};

export default function Tour3D({ propertyTitle, rooms, onClose }: Tour3DProps) {
  const [currentRoom, setCurrentRoom] = useState(rooms[0] || "Living Principal");
  const [panAngle, setPanAngle] = useState(0); // simulated camera pan angle
  const [soundActive, setSoundActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePan = (direction: "LEFT" | "RIGHT") => {
    setPanAngle((prev) => (direction === "LEFT" ? prev - 15 : prev + 15));
  };

  const changeRoom = (room: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentRoom(room);
      setIsTransitioning(false);
    }, 450);
  };

  const activeImage = roomImages[currentRoom] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="fixed inset-0 bg-[#001410]/95 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden border border-gold-premium/30 bg-[#012720] shadow-[0_0_50px_rgba(226,184,60,0.25)] flex flex-col md:flex-row h-[85vh]">
        
        {/* Main 3D Panoramic screen */}
        <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center group">
          
          {/* Panoramic Image with Simulated Pan transformation */}
          <div className="absolute inset-0 w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRoom}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full relative"
              >
                <img
                  src={activeImage}
                  alt={currentRoom}
                  className="w-[120%] max-w-none h-full object-cover transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateX(calc(-8% + ${panAngle}px)) scale(1.05)`,
                    filter: isTransitioning ? "blur(8px) brightness(0.5)" : "none"
                  }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* Shading overlay for luxury contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/40 pointer-events-none" />
          </div>

          {/* Compass / Pan HUD overlay */}
          <div className="absolute top-4 left-4 bg-emerald-darkest/80 border border-gold-premium/30 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs backdrop-blur font-mono">
            <Compass className="w-4 h-4 text-gold-premium animate-spin-slow" />
            <span className="text-white font-medium uppercase tracking-wider">{currentRoom}</span>
            <span className="text-gold-premium text-[10px] ml-1">PAN: {panAngle % 360}°</span>
          </div>

          {/* Golden Interactive Portal Hotspots in the room */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {rooms.map((room, i) => {
              if (room === currentRoom) return null;
              // Distribute hotspots
              const leftOffset = 25 + i * 20; 
              const topOffset = 45 + (i % 2) * 15;

              return (
                <motion.button
                  key={room}
                  onClick={() => changeRoom(room)}
                  className="absolute pointer-events-auto flex flex-col items-center group cursor-pointer"
                  style={{ left: `${leftOffset}%`, top: `${topOffset}%` }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-10 h-10 bg-gold-premium/85 border border-white text-emerald-darkest rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(226,184,60,0.6)] animate-bounce">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] bg-emerald-darkest text-white px-2 py-0.5 rounded border border-gold-premium/30 mt-1 shadow-md font-mono whitespace-nowrap">
                    Entrar em: {room}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Drag to rotate HUD guidance */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 border border-white/10 rounded-full px-4 py-1 flex items-center gap-2 text-[11px] text-gray-300 pointer-events-none">
            <Move className="w-3.5 h-3.5 text-gold-premium" />
            <span>Use os controles laterais para girar em 360°</span>
          </div>

          {/* Interactive controls */}
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button
              onClick={() => handlePan("LEFT")}
              className="p-2.5 bg-emerald-darkest/90 border border-gold-premium/30 text-gold-premium hover:bg-[#fbbf24] hover:text-emerald-darkest rounded-full transition-all backdrop-blur"
              title="Girar para Esquerda"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePan("RIGHT")}
              className="p-2.5 bg-emerald-darkest/90 border border-gold-premium/30 text-gold-premium hover:bg-[#fbbf24] hover:text-emerald-darkest rounded-full transition-all backdrop-blur"
              title="Girar para Direita"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Sound / Atmosphere controller */}
          <button
            onClick={() => setSoundActive(!soundActive)}
            className="absolute right-4 top-4 p-2 bg-emerald-darkest/80 border border-gold-premium/30 text-gold-premium hover:bg-[#fbbf24] hover:text-emerald-darkest rounded-full transition-all backdrop-blur"
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar for Tour info / Room selection */}
        <div className="w-full md:w-80 bg-[#01241e] border-t md:border-t-0 md:border-l border-gold-premium/20 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-mono text-gold-premium uppercase tracking-widest block">TOUR INTERATIVO 3D</span>
                <h3 className="font-display font-bold text-white text-lg tracking-tight mt-1">{propertyTitle}</h3>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Explore cada cômodo desta obra-prima da engenharia. Clique nos pontos de interesse do visor ou use os botões da lista abaixo para alternar de ambiente.
            </p>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-accent uppercase tracking-wider block mb-2">Comodidades Disponíveis</span>
              {rooms.map((room) => {
                const isSelected = room === currentRoom;
                return (
                  <button
                    key={room}
                    onClick={() => changeRoom(room)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-gold-premium text-emerald-darkest border-gold-premium font-bold shadow-[0_0_15px_rgba(226,184,60,0.2)]"
                        : "bg-[#011d17] border-emerald-accent/10 text-gray-300 hover:border-gold-premium/40 hover:text-white"
                    }`}
                  >
                    <span>{room}</span>
                    <ArrowLeftRight className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-darkest" : "text-emerald-accent"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-gold-premium/15 mt-6 flex flex-col gap-3">
            {soundActive && (
              <div className="bg-emerald-darkest/60 border border-emerald-accent/20 rounded-lg p-2.5 flex items-center gap-2.5 text-[10px] text-emerald-accent font-mono">
                <span className="w-1.5 h-1.5 bg-emerald-accent rounded-full animate-ping" />
                <span>SONOPLASTIA AMBIENTE TOCANDO</span>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="w-full bg-[#7f1d1d] hover:bg-red-700 text-white border border-red-500/20 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow"
            >
              <Minimize2 className="w-4 h-4" />
              FECHAR VISUALIZADOR
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
