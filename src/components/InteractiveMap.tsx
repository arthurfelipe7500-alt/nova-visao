import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, School, Pill, Plane, Train, ShoppingCart, Landmark, ArrowRight, Compass, ShieldAlert, Navigation } from "lucide-react";
import { Property } from "../types";

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onFilterCountry: (country: string) => void;
  selectedCountry: string;
}

export default function InteractiveMap({
  properties,
  selectedProperty,
  onSelectProperty,
  onFilterCountry,
  selectedCountry
}: InteractiveMapProps) {
  const [activeTab, setActiveTab] = useState<"WORLD" | "LOCAL">("WORLD");
  const [radarPing, setRadarPing] = useState(true);
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);

  // Automatically switch tab when property is selected
  useEffect(() => {
    if (selectedProperty) {
      setActiveTab("LOCAL");
      setSelectedAmenity("schools"); // default selected
    } else {
      setActiveTab("WORLD");
    }
  }, [selectedProperty]);

  // World map markers based on coordinates scaled to SVG dimensions (800 x 400)
  // latitude: 90 to -90, longitude: -180 to 180
  const getXY = (lat: number, lng: number) => {
    const x = ((lng + 180) * 800) / 360;
    const y = (((90 - lat) * 400) / 180) + 30; // offset slightly
    return { x, y };
  };

  // Seed coordinates of countries for continent clicking
  const countryAreas = [
    { name: "Portugal", x: 380, y: 145, r: 18, lat: 38.7994, lng: -9.3872 },
    { name: "Brasil", x: 285, y: 245, r: 24, lat: -22.9836, lng: -43.2065 },
    { name: "EUA", x: 195, y: 135, r: 26, lat: 40.7580, lng: -73.9855 },
    { name: "Japão", x: 675, y: 150, r: 16, lat: 35.0116, lng: 135.7681 },
    { name: "Emirados Árabes", x: 485, y: 172, r: 15, lat: 25.0805, lng: 55.1403 },
    { name: "Suíça", x: 402, y: 132, r: 14, lat: 46.4908, lng: 9.8355 }
  ];

  const amenityIcons: Record<string, any> = {
    schools: { icon: School, label: "Escolas", color: "from-blue-500 to-cyan-400" },
    pharmacies: { icon: Pill, label: "Farmácias", color: "from-red-500 to-rose-400" },
    airports: { icon: Plane, label: "Aeroportos", color: "from-amber-500 to-yellow-400" },
    metro: { icon: Train, label: "Estações de Metrô", color: "from-purple-500 to-indigo-400" },
    supermarket: { icon: ShoppingCart, label: "Supermercados", color: "from-green-500 to-emerald-400" },
    hospital: { icon: Landmark, label: "Hospitais", color: "from-teal-500 to-emerald-400" }
  };

  return (
    <div className="w-full relative rounded-2xl overflow-hidden premium-gradient flex flex-col min-h-[500px]">
      {/* Header controls for Map */}
      <div className="flex justify-between items-center bg-[#012720] border-b border-gold-premium/15 px-6 py-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-gold-premium animate-spin-slow" />
          <h3 className="font-display font-semibold text-white tracking-wide">
            {activeTab === "WORLD" ? "Navegador de Destinos Globais" : "Radar de Geolocalização de Luxo"}
          </h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("WORLD")}
            className={`px-3 py-1 text-xs font-mono font-medium rounded-full border transition-all ${
              activeTab === "WORLD"
                ? "bg-gold-premium text-emerald-darkest border-gold-premium shadow-[0_0_10px_rgba(226,184,60,0.3)]"
                : "bg-transparent text-gray-400 border-gray-700 hover:text-white"
            }`}
          >
            MUNDI GLOBAL
          </button>
          <button
            disabled={!selectedProperty}
            onClick={() => setActiveTab("LOCAL")}
            className={`px-3 py-1 text-xs font-mono font-medium rounded-full border transition-all ${
              !selectedProperty ? "opacity-40 cursor-not-allowed" : ""
            } ${
              activeTab === "LOCAL"
                ? "bg-gold-premium text-emerald-darkest border-gold-premium shadow-[0_0_10px_rgba(226,184,60,0.3)]"
                : "bg-transparent text-gray-400 border-gray-700 hover:text-white"
            }`}
          >
            RADAR LOCAL PROXIMIDADE
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[380px] bg-[#011d17] flex items-center justify-center p-4 relative">
        {/* WORLD MAP VIEW */}
        {activeTab === "WORLD" && (
          <div className="w-full h-full max-w-4xl aspect-[2/1] relative overflow-hidden flex items-center justify-center">
            {/* Background Map SVG in Emerald and Gold */}
            <svg
              viewBox="0 0 800 400"
              className="w-full h-full select-none"
              style={{ filter: "drop-shadow(0 0 15px rgba(2,44,34,0.8))" }}
            >
              {/* Ocean grid lines in dark green */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="0.5" />
                </pattern>
                <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#064e3b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#011d17" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <circle cx="400" cy="200" r="300" fill="url(#map-glow)" />

              {/* Vector representations of World Continents styled in Emerald Green and Gold */}
              {/* North America */}
              <path
                d="M 100 100 L 150 90 L 220 100 L 250 140 L 190 170 L 150 150 L 130 180 L 110 180 Z"
                fill="#022c22"
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.85"
                className="transition-colors hover:fill-[#043e30]"
              />
              {/* South America */}
              <path
                d="M 230 190 L 270 210 L 300 240 L 310 280 L 290 340 L 250 350 L 240 300 L 220 220 Z"
                fill="#022c22"
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.85"
                className="transition-colors hover:fill-[#043e30]"
              />
              {/* Eurasia / Europe / Asia */}
              <path
                d="M 330 80 L 400 80 L 470 70 L 580 80 L 700 90 L 750 130 L 710 180 L 680 210 L 590 220 L 530 200 L 490 220 L 430 180 L 370 180 Z"
                fill="#022c22"
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.85"
                className="transition-colors hover:fill-[#043e30]"
              />
              {/* Africa */}
              <path
                d="M 360 200 L 420 190 L 460 210 L 480 240 L 460 300 L 430 330 L 410 290 L 370 250 Z"
                fill="#022c22"
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.85"
                className="transition-colors hover:fill-[#043e30]"
              />
              {/* Australia */}
              <path
                d="M 640 260 L 700 250 L 730 280 L 700 320 L 650 310 Z"
                fill="#022c22"
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.85"
                className="transition-colors hover:fill-[#043e30]"
              />

              {/* Country clickable hot areas colored dynamically with Gold glow */}
              {countryAreas.map((area) => {
                const isActive = selectedCountry === area.name;
                return (
                  <g key={area.name} className="cursor-pointer" onClick={() => onFilterCountry(area.name)}>
                    <circle
                      cx={area.x}
                      cy={area.y}
                      r={area.r}
                      fill={isActive ? "rgba(226, 184, 60, 0.2)" : "rgba(16, 185, 129, 0.05)"}
                      stroke={isActive ? "#fbbf24" : "rgba(226, 184, 60, 0.2)"}
                      strokeWidth={isActive ? "2" : "1"}
                      className="transition-all hover:stroke-[#fbbf24] hover:fill-emerald-500/10"
                    />
                    <circle cx={area.x} cy={area.y} r="3" fill="#e2b83c" />
                    {isActive && (
                      <circle
                        cx={area.x}
                        cy={area.y}
                        r="12"
                        stroke="#fbbf24"
                        strokeWidth="1"
                        fill="none"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}

              {/* Property pins */}
              {properties.map((prop) => {
                const isSelected = selectedProperty?.id === prop.id;
                // Calculate pseudo map positions for visual demo
                let mapX = 400;
                let mapY = 200;

                if (prop.country === "Portugal") { mapX = 370; mapY = 145; }
                else if (prop.country === "Brasil") { mapX = 285; mapY = 250; }
                else if (prop.country === "EUA") { mapX = 180; mapY = 135; }
                else if (prop.country === "Japão") { mapX = 680; mapY = 140; }
                else if (prop.country === "Emirados Árabes") { mapX = 490; mapY = 175; }
                else if (prop.country === "Suíça") { mapX = 405; mapY = 130; }

                // Jitter properties slightly if multiple in same country
                if (prop.id === "prop-6") { mapX += 12; mapY -= 8; }

                return (
                  <g key={prop.id} className="cursor-pointer" onClick={() => onSelectProperty(prop)}>
                    {/* Glowing golden beacon for property */}
                    <circle
                      cx={mapX}
                      cy={mapY}
                      r={isSelected ? "14" : "8"}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth={isSelected ? "2" : "1"}
                      className="animate-pulse"
                    />
                    <circle
                      cx={mapX}
                      cy={mapY}
                      r="4"
                      fill={isSelected ? "#ffffff" : "#fbbf24"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Float HUD Information overlay for World map */}
            <div className="absolute bottom-4 left-4 bg-emerald-darkest/90 border border-gold-premium/20 rounded-lg p-3 max-w-xs text-xs shadow-2xl backdrop-blur">
              <span className="font-mono text-gold-premium font-semibold block mb-1">Dica de Navegação</span>
              <p className="text-gray-300">
                Selecione as esferas douradas no mapa para filtrar propriedades por país. Clique nos pins ativos para abrir os detalhes das mansões.
              </p>
            </div>

            <div className="absolute top-4 right-4 flex flex-col gap-1 bg-[#011d17]/80 border border-emerald-accent/20 rounded-md px-3 py-2 text-[10px] font-mono text-emerald-accent">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#fbbf24] rounded-full animate-ping" />
                <span>COBERTURA SATELLITE: ONLINE</span>
              </div>
              <div>COORDENADAS: LAT 23°S / LNG 46°W</div>
            </div>
          </div>
        )}

        {/* LOCAL AMENITIES RADAR VIEW */}
        {activeTab === "LOCAL" && selectedProperty && (
          <div className="w-full max-w-xl aspect-square md:aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden py-4">
            
            {/* Concentric Sonar Background Grid */}
            <div className="absolute w-[280px] h-[280px] border border-emerald-accent/20 rounded-full flex items-center justify-center animate-spin-slow">
              <div className="w-[200px] h-[200px] border border-emerald-accent/15 rounded-full flex items-center justify-center">
                <div className="w-[120px] h-[120px] border border-emerald-accent/10 rounded-full" />
              </div>
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-emerald-accent/10" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-emerald-accent/10" />
            </div>

            {/* Radar scanner line simulation */}
            {radarPing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="absolute w-[280px] h-[280px] rounded-full pointer-events-none origin-center"
                style={{
                  background: "conic-gradient(from 0deg, rgba(16, 185, 129, 0.15) 0deg, rgba(16, 185, 129, 0) 90deg)"
                }}
              />
            )}

            {/* Center Node - The Selected Property */}
            <div className="absolute z-10 flex flex-col items-center justify-center">
              <div className="w-10 h-10 bg-gold-premium text-emerald-darkest rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(226,184,60,0.6)] border-2 border-white">
                <MapPin className="w-5 h-5 fill-emerald-darkest" />
              </div>
              <span className="text-[10px] font-display font-semibold mt-1.5 px-2 py-0.5 bg-emerald-darkest/95 border border-gold-premium text-white rounded shadow-lg max-w-[140px] truncate text-center">
                {selectedProperty.city}
              </span>
            </div>

            {/* Floating Amenities Nodes arranged orbitally */}
            {Object.keys(amenityIcons).map((key, idx) => {
              const info = amenityIcons[key];
              const angle = (idx * Math.PI * 2) / 6;
              const radius = 110; // orbit radius
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isSelected = selectedAmenity === key;

              const IconC = info.icon;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedAmenity(key)}
                  className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-300`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`
                  }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    isSelected 
                      ? "bg-[#fbbf24] border-[#fbbf24] text-emerald-darkest shadow-[0_0_15px_rgba(251,191,36,0.6)] scale-110" 
                      : "bg-[#022c22] border-emerald-accent/30 text-emerald-accent hover:border-[#fbbf24] hover:text-white"
                  }`}>
                    <IconC className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono mt-1 text-gray-400 group-hover:text-white transition-colors bg-[#011d17]/80 px-1 rounded">
                    {info.label}
                  </span>
                </button>
              );
            })}

            {/* Display line linking property center and selected amenity */}
            {selectedAmenity && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {(() => {
                  const idx = Object.keys(amenityIcons).indexOf(selectedAmenity);
                  const angle = (idx * Math.PI * 2) / 6;
                  const radius = 110;
                  const x = 50 + (Math.cos(angle) * radius * 100) / (200); // normalized coordinates
                  return (
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`calc(50% + ${Math.cos(angle) * radius}px)`}
                      y2={`calc(50% + ${Math.sin(angle) * radius}px)`}
                      stroke="#fbbf24"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-pulse"
                    />
                  );
                })()}
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Bottom info panel */}
      {selectedProperty && (
        <div className="bg-[#022c22] border-t border-gold-premium/15 p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={selectedProperty.images[0]}
              alt={selectedProperty.title}
              className="w-14 h-14 rounded-lg object-cover border border-gold-premium/30"
            />
            <div>
              <span className="text-[10px] bg-gold-premium/20 text-gold-premium border border-gold-premium/30 px-2 py-0.5 rounded-full font-mono">
                {selectedProperty.type} • {selectedProperty.country}
              </span>
              <h4 className="font-display font-bold text-white text-sm mt-1">{selectedProperty.title}</h4>
              <p className="text-xs text-gray-400">
                {selectedProperty.city} • {selectedProperty.area}m² • {selectedProperty.price.toLocaleString()} {selectedProperty.currency}
              </p>
            </div>
          </div>

          {/* Quick distance calculation HUD */}
          {selectedAmenity && (
            <div className="flex items-center gap-3 bg-[#011d17] border border-gold-premium/10 rounded-xl px-4 py-2 text-xs">
              <div className="p-1.5 bg-gold-premium/10 rounded-lg text-gold-premium">
                {(() => {
                  const Icon = amenityIcons[selectedAmenity]?.icon || School;
                  return <Icon className="w-4 h-4" />;
                })()}
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">
                  Distância para {amenityIcons[selectedAmenity]?.label}
                </span>
                <span className="text-white font-mono font-medium block">
                  {/* Pull dynamically from selectedProperty amenities */}
                  {(selectedProperty.amenities as any)[selectedAmenity] || "Calcular rota..."}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab(activeTab === "WORLD" ? "LOCAL" : "WORLD");
                if (activeTab === "WORLD") setSelectedAmenity("schools");
              }}
              className="bg-[#011d17] hover:bg-[#01241e] border border-gold-premium/30 text-gold-premium text-xs font-mono font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow"
            >
              <Navigation className="w-3.5 h-3.5" />
              {activeTab === "WORLD" ? "GEOLOCALIZAÇÃO" : "VER MAPA MUNDI"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
