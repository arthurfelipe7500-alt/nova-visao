import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, MapPin, Heart, MessageSquare, ShieldAlert, Globe, Coins, User, 
  Sparkles, SlidersHorizontal, BedDouble, Bath, Maximize2, Star, 
  MapPinCheck, Compass, HelpCircle, Navigation, ChevronRight, Bell, Calendar,
  CheckCircle, RefreshCw, LogOut, Lock
} from "lucide-react";

// Component imports
import Logo from "./components/Logo";
import InteractiveMap from "./components/InteractiveMap";
import Tour3D from "./components/Tour3D";
import ChatIntegrated from "./components/ChatIntegrated";
import GatewayCheckout from "./components/GatewayCheckout";
import AdminPanel from "./components/AdminPanel";
import BrokerDashboard from "./components/BrokerDashboard";

// Background Assets
// @ts-ignore
import heroBg from "./assets/images/luxury_mansion_hero_bg_1784566359947.jpg";

// Types
import { Property, User as UserType, Chat, Notification, Review } from "./types";

// Translation dictionaries
const translations: Record<string, Record<string, string>> = {
  PT: {
    heroTitle: "Encontre o imóvel ideal em qualquer lugar do mundo",
    heroSubtitle: "Conectamos você às melhores oportunidades imobiliárias internacionais.",
    searchPlace: "Buscar por cidade, país ou condomínio...",
    filterCountry: "Filtrar por País",
    filterType: "Modalidade",
    filterPrice: "Preço Máximo",
    filterRooms: "Mínimo de Quartos",
    useLocation: "Buscar por Geoproximidade",
    all: "Todos",
    buy: "COMPRA",
    rent: "ALUGUEL",
    contactBroker: "Falar com Corretor",
    tourButton: "Entrar no Tour 3D",
    reserveButton: "Garantir Reserva de Sinal",
    favorites: "Favoritos",
    reviews: "Comentários & Avaliações",
    addReview: "Adicionar Comentário",
    adminTitle: "Painel de Governança",
    brokerTitle: "Painel de Performance",
    loginButton: "Área Restrita",
    logoutButton: "Sair",
    noFavs: "Você não possui imóveis favoritos salvos."
  },
  EN: {
    heroTitle: "Find the ideal property anywhere in the world",
    heroSubtitle: "We connect you to the finest international real estate opportunities.",
    searchPlace: "Search by city, country or condominium...",
    filterCountry: "Filter by Country",
    filterType: "Transaction",
    filterPrice: "Max Price",
    filterRooms: "Min Rooms",
    useLocation: "Search Nearby (Geoproximity)",
    all: "All",
    buy: "BUY",
    rent: "RENT",
    contactBroker: "Chat with Broker",
    tourButton: "Enter 3D Virtual Tour",
    reserveButton: "Secure Down Payment",
    favorites: "Favorites",
    reviews: "Reviews & Ratings",
    addReview: "Post Feedback",
    adminTitle: "Governance Board",
    brokerTitle: "Broker Performance",
    loginButton: "Restricted Area",
    logoutButton: "Logout",
    noFavs: "You don't have any saved favorite listings."
  },
  ES: {
    heroTitle: "Encuentre la propiedad ideal en cualquier lugar del mundo",
    heroSubtitle: "Le conectamos con las mejores oportunidades inmobiliarias internacionales.",
    searchPlace: "Buscar por ciudad, país o condominio...",
    filterCountry: "Filtrar por País",
    filterType: "Modalidad",
    filterPrice: "Precio Máximo",
    filterRooms: "Mínimo de Habitaciones",
    useLocation: "Buscar por Geoproximidad",
    all: "Todos",
    buy: "COMPRA",
    rent: "ALQUILER",
    contactBroker: "Hablar con Corredor",
    tourButton: "Iniciar Tour 3D",
    reserveButton: "Garantizar Depósito de Reserva",
    favorites: "Favoritos",
    reviews: "Reseñas y Calificaciones",
    addReview: "Publicar Comentario",
    adminTitle: "Tablero de Gobernanza",
    brokerTitle: "Tablero de Corredor",
    loginButton: "Área Restrita",
    logoutButton: "Cerrar Sesión",
    noFavs: "No tienes inmuebles favoritos guardados."
  }
};

// Currency Conversion Factors relative to EUR as base
const currencyRates: Record<string, { rate: number; symbol: string }> = {
  EUR: { rate: 1, symbol: "€" },
  BRL: { rate: 6.05, symbol: "R$" },
  USD: { rate: 1.09, symbol: "$" },
  GBP: { rate: 0.84, symbol: "£" },
  JPY: { rate: 171.4, symbol: "¥" },
  AED: { rate: 4.01, symbol: "AED" },
  CHF: { rate: 0.96, symbol: "CHF" }
};

export default function App() {
  const [lang, setLang] = useState<"PT" | "EN" | "ES">("PT");
  const [currency, setCurrency] = useState<string>("BRL");
  
  // Auth states
  const [currentUser, setCurrentUser] = useState<UserType | null>({
    id: "client-1",
    username: "user",
    name: "Arthur Felipe",
    role: "CLIENT",
    email: "arthurfelipe7500@gmail.com",
    isApproved: true,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [registerRole, setRegisterRole] = useState<"CLIENT" | "SELLER">("CLIENT");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Core Data States
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userFavorites, setUserFavorites] = useState<string[]>(["prop-1", "prop-2"]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allSellers, setAllSellers] = useState<UserType[]>([]);

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<"BROWSE" | "MAP" | "CHAT" | "FAVORITES" | "BROKER" | "ADMIN">("BROWSE");

  // Advanced Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Todos");
  const [selectedType, setSelectedType] = useState<"Todos" | "COMPRA" | "ALUGUEL">("Todos");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(0);
  const [minRoomsFilter, setMinRoomsFilter] = useState<number>(0);
  const [showFiltersHud, setShowFiltersHud] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Overlay Triggers
  const [activeTour, setActiveTour] = useState<{ propertyTitle: string; rooms: string[] } | null>(null);
  const [activeCheckout, setActiveCheckout] = useState<Property | null>(null);

  // Ratings form inside details
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState("");

  // Toast Push Alerts state
  const [toastAlert, setToastAlert] = useState<{ title: string; body: string } | null>(null);

  // Load properties and users at startup
  useEffect(() => {
    fetchProperties();
    if (currentUser) {
      fetchFavorites();
      fetchChats();
      fetchNotifications();
    }
    if (currentUser?.role === "ADMIN") {
      fetchSellers();
    }
  }, [currentUser]);

  const fetchProperties = async () => {
    try {
      const statusParam = currentUser?.role === "ADMIN" ? "status=PENDING" : "";
      const url = currentUser?.role === "ADMIN" 
        ? `/api/properties?status=PENDING` 
        : `/api/properties`;
      
      const res = await fetch("/api/properties");
      const list = await res.json();

      // If Admin, fetch all (including pending/rejected) for governance demonstration
      if (currentUser?.role === "ADMIN") {
        const adminRes = await fetch("/api/properties?status=PENDING");
        const pendingList = await adminRes.json();
        const approvedRes = await fetch("/api/properties");
        const approvedList = await approvedRes.json();
        
        // combine list
        const combined = [...approvedList, ...pendingList];
        // de-duplicate
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        setProperties(unique);
      } else {
        setProperties(list);
      }
    } catch (err) {
      console.error("Error fetching properties", err);
    }
  };

  const fetchFavorites = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.id}/favorites`);
      const favs = await res.json();
      setUserFavorites(favs.map((p: Property) => p.id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChats = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/chats?userId=${currentUser.id}&role=${currentUser.role}`);
      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/notifications?userId=${currentUser.id}`);
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSellers = async () => {
    try {
      const res = await fetch("/api/admin/sellers");
      const data = await res.json();
      setAllSellers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Dynamic Push Alert Banner on new notification
  const triggerPushAlert = (title: string, body: string) => {
    setToastAlert({ title, body });
    // Play subtle notification chime (synthesized)
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // ignore security sandboxes block
    }
    setTimeout(() => {
      setToastAlert(null);
    }, 4500);
  };

  // Convert native property price into selected view currency
  const convertPrice = (price: number, fromCurrency: string) => {
    const fromRate = currencyRates[fromCurrency]?.rate || 1;
    const toRate = currencyRates[currency]?.rate || 1;
    
    // Normalize to EUR first, then convert to target currency
    const inBaseEur = price / fromRate;
    const finalPrice = inBaseEur * toRate;

    const symbol = currencyRates[currency]?.symbol || "€";
    return `${symbol} ${Math.round(finalPrice).toLocaleString()}`;
  };

  // Geoproximity Calculator (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
  };

  // Request actual or mock geolocation for georadar filters
  const triggerLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          triggerPushAlert("Geolocalização Ativada", "Sua localização foi detectada com sucesso. Os imóveis mais próximos estão destacados!");
        },
        () => {
          // Fallback to mock Brazil coordinate if permission denied/failed
          setUserCoords({ lat: -22.9068, lng: -43.1729 });
          triggerPushAlert("Geolocalização Simulada", "Sua localização real não pôde ser lida. Simulando coordenadas no Rio de Janeiro.");
        }
      );
    }
  };

  // Toggle Favorites
  const toggleFavorite = async (propertyId: string) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch(`/api/properties/${propertyId}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id })
      });
      const data = await res.json();
      
      if (res.ok) {
        setUserFavorites(data.favorites);
        triggerPushAlert(
          data.isFavorite ? "Imóvel Favoritado" : "Removido dos Favoritos",
          data.isFavorite ? "Este imóvel de luxo foi salvo na sua lista de favoritos." : "O imóvel foi removido de seus salvos."
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger contact with broker / starts chat session
  const initiateChat = async (prop: Property) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: currentUser.id,
          clientName: currentUser.name,
          sellerId: prop.sellerId,
          sellerName: prop.sellerName,
          propertyId: prop.id,
          propertyTitle: prop.title
        })
      });

      const session = await res.json();
      if (res.ok) {
        setChats((prev) => {
          const exists = prev.some((c) => c.id === session.id);
          return exists ? prev : [session, ...prev];
        });
        setActiveChat(session);
        setActiveTab("CHAT");
        setSelectedProperty(null); // Close sidebar
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Post live messages
  const sendChatMessage = async (chatId: string, text: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          senderName: currentUser.name,
          text
        })
      });
      
      const updatedChat = await res.json();
      if (res.ok) {
        // Update local chats
        setChats((prev) => prev.map((c) => (c.id === chatId ? updatedChat : c)));
        setActiveChat(updatedChat);

        // Simulate typing and response sound after 1.5s
        if (currentUser.role === "CLIENT") {
          setTimeout(() => {
            fetchChats();
            // Re-fetch active chat session
            fetch(`/api/chats`)
              .then((r) => r.json())
              .then((list) => {
                const current = list.find((c: Chat) => c.id === chatId);
                if (current) {
                  setActiveChat(current);
                  triggerPushAlert(
                    `Mensagem de ${updatedChat.sellerName}`,
                    current.messages[current.messages.length - 1].text
                  );
                }
              });
          }, 1600);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit property review
  const postPropertyReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedProperty || !newComment) return;

    try {
      const res = await fetch(`/api/properties/${selectedProperty.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: currentUser.name,
          userRole: currentUser.role,
          rating: newRating,
          comment: newComment
        })
      });

      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => [data.review, ...prev]);
        setNewComment("");
        // Refresh property detail to see updated ratings count
        fetchProperties();
        triggerPushAlert("Avaliação Cadastrada", "Obrigado por nos ajudar a manter a qualidade máxima do ecossistema!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Broker submits new property listing
  const handleBrokerAddProperty = async (propertyData: any) => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...propertyData,
          sellerId: currentUser.id,
          sellerName: currentUser.name
        })
      });
      const data = await res.json();
      if (res.ok) {
        triggerPushAlert("Anúncio Enviado", data.message);
        fetchProperties();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin approves seller account
  const handleAdminApproveSeller = async (sellerId: string) => {
    try {
      const res = await fetch(`/api/admin/sellers/${sellerId}/approve`, {
        method: "PATCH"
      });
      const data = await res.json();
      if (res.ok) {
        triggerPushAlert("Vendedor Aprovado!", data.message);
        fetchSellers();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin approves/rejects property listing & prices
  const handleAdminApproveProperty = async (propertyId: string, status: "APPROVED" | "REJECTED", price?: number) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, price })
      });
      const data = await res.json();
      if (res.ok) {
        triggerPushAlert("Status Atualizado", data.message);
        fetchProperties();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Login Handler (including custom verification for sofialinda00 admin role)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser || !loginPass) return;

    // Check special admin validation constraint
    if (loginUser.toLowerCase() === "admin" && loginPass !== "sofialinda00") {
      alert("Senha de administrador incorreta.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });

      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setShowLoginModal(false);
        setLoginUser("");
        setLoginPass("");
        triggerPushAlert("Login Bem Sucedido", `Seja bem-vindo de volta, ${data.user.name}!`);
        
        // redirect based on role
        if (data.user.role === "ADMIN") {
          setActiveTab("ADMIN");
        } else if (data.user.role === "SELLER") {
          setActiveTab("BROKER");
        } else {
          setActiveTab("BROWSE");
        }
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Register Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser || !loginPass || !registerName || !registerEmail) return;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUser,
          password: loginPass,
          name: registerName,
          email: registerEmail,
          role: registerRole
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setIsRegisterMode(false);
        setLoginPass("");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("BROWSE");
    setSelectedProperty(null);
    triggerPushAlert("Sessão Encerrada", "Você saiu da área logada com segurança.");
  };

  // View property details
  const viewPropertyDetails = async (prop: Property) => {
    setSelectedProperty(prop);
    try {
      const res = await fetch(`/api/properties/${prop.id}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter listings based on criteria
  const filteredListings = properties.filter((p) => {
    if (selectedCountry !== "Todos" && p.country !== selectedCountry) return false;
    if (selectedType !== "Todos" && p.type !== selectedType) return false;
    
    // Convert to native first to comparison
    if (maxPriceFilter > 0) {
      const fromRate = currencyRates[p.currency]?.rate || 1;
      const eurVal = p.price / fromRate;
      const targetVal = eurVal * (currencyRates[currency]?.rate || 1);
      if (targetVal > maxPriceFilter) return false;
    }

    if (minRoomsFilter > 0 && p.rooms < minRoomsFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchDesc) return false;
    }

    return true;
  });

  // Sort listings if Geoproximity coordinates are active
  const sortedListings = userCoords 
    ? [...filteredListings].sort((a, b) => {
        const distA = calculateDistance(userCoords.lat, userCoords.lng, a.coordinates.lat, a.coordinates.lng);
        const distB = calculateDistance(userCoords.lat, userCoords.lng, b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
      })
    : filteredListings;

  const dictionary = translations[lang];

  return (
    <div className="min-h-screen flex flex-col relative pb-12">
      
      {/* BACKGROUND DECORATION - Luxury Mansion Background with Smooth Overlay & Fade */}
      <div className="absolute top-0 inset-x-0 h-[700px] pointer-events-none overflow-hidden -z-10">
        <img
          src={heroBg}
          alt="Luxury Mansion Background"
          className="w-full h-full object-cover opacity-45 object-center scale-105 filter brightness-75 contrast-105"
          referrerPolicy="no-referrer"
        />
        {/* Dark Emerald & Black Gradient Overlays to match user image & ensure premium contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#011d17]/80 via-[#011d17]/50 to-[#011d17]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#011d17]/30 via-transparent to-[#011d17]/30" />
        
        {/* Subtle decorative grid overlay from the previous design to maintain continuity */}
        <svg className="absolute inset-0 w-full h-full opacity-5 stroke-gold-premium" fill="none">
          <path d="M0 80h1600M0 240h1600M200 0v800M800 0v800" strokeWidth="0.5" strokeDasharray="5 5" />
        </svg>
      </div>

      {/* TOP GLOBAL HEADER */}
      <header className="sticky top-0 z-40 bg-emerald-darkest/85 backdrop-blur-md border-b border-gold-premium/15 px-4 md:px-8 py-3.5 flex items-center justify-between">
        
        {/* Custom Logo */}
        <Logo size="md" showSlogan={true} />

        {/* Action Controls & Authentication HUD */}
        <div className="flex items-center gap-4">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-[#011d17] border border-gold-premium/20 rounded-xl px-2.5 py-1.5">
            <Globe className="w-3.5 h-3.5 text-gold-premium" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as any)}
              className="bg-transparent text-[11px] text-white font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value="PT" className="bg-[#011d17]">PT-BR</option>
              <option value="EN" className="bg-[#011d17]">EN-US</option>
              <option value="ES" className="bg-[#011d17]">ES-ES</option>
            </select>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-1.5 bg-[#011d17] border border-gold-premium/20 rounded-xl px-2.5 py-1.5">
            <Coins className="w-3.5 h-3.5 text-gold-premium" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-[11px] text-white font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value="BRL" className="bg-[#011d17]">BRL (R$)</option>
              <option value="USD" className="bg-[#011d17]">USD ($)</option>
              <option value="EUR" className="bg-[#011d17]">EUR (€)</option>
              <option value="GBP" className="bg-[#011d17]">GBP (£)</option>
              <option value="JPY" className="bg-[#011d17]">JPY (¥)</option>
              <option value="AED" className="bg-[#011d17]">AED (dh)</option>
              <option value="CHF" className="bg-[#011d17]">CHF (fr)</option>
            </select>
          </div>

          {/* User Auth Info or login action */}
          {currentUser ? (
            <div className="flex items-center gap-3 bg-[#012720] border border-emerald-accent/25 px-3 py-1.5 rounded-xl">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-gold-premium/30"
              />
              <div className="hidden md:block text-left">
                <span className="text-[10px] font-bold text-white block leading-none">{currentUser.name}</span>
                <span className="text-[8px] font-mono text-gold-premium uppercase tracking-wider">{currentUser.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 p-1 transition-colors"
                title={dictionary.logoutButton}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsRegisterMode(false);
                setShowLoginModal(true);
              }}
              className="bg-[#d97706] hover:bg-gold-premium text-emerald-darkest font-mono font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_10px_rgba(217,119,6,0.2)]"
            >
              {dictionary.loginButton}
            </button>
          )}

        </div>
      </header>

      {/* CORE LIVE NOTIFICATION PUSH TOAST ALERTS */}
      <AnimatePresence>
        {toastAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#012720]/95 border-2 border-gold-premium text-white px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(226,184,60,0.3)] backdrop-blur max-w-sm flex gap-3.5 items-start"
          >
            <div className="p-1 bg-gold-premium/10 rounded-lg text-gold-premium shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold block text-white">{toastAlert.title}</span>
              <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">{toastAlert.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO HERO TITLE BOARD */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-6xl mx-auto py-12 px-4 md:px-8 relative z-10 animate-fade-in">
        
        {/* Left Column: Headlines */}
        <div className="md:col-span-7 text-left space-y-5 flex flex-col items-start justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gold-premium/10 border border-gold-premium/30 px-3.5 py-1 rounded-full text-[10px] text-gold-premium font-mono font-bold uppercase tracking-widest shadow"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>PORTFÓLIO GLOBAL ULTRA-EXCLUSIVE</span>
          </motion.div>

          <h1 className="font-display font-bold tracking-tight text-3xl md:text-5xl text-white leading-tight">
            {dictionary.heroTitle}
          </h1>
          <p className="text-sm md:text-base text-gray-300 font-light max-w-lg leading-relaxed">
            {dictionary.heroSubtitle}
          </p>

          {/* Saiba mais button as in user image */}
          <motion.button
            whileHover={{ scale: 1.03, x: 5 }}
            className="group flex items-center gap-2.5 border border-gold-premium/45 bg-[#011d17]/60 backdrop-blur hover:bg-gold-premium hover:text-[#011d17] px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-gold-premium transition-all shadow-[0_0_15px_rgba(226,184,60,0.1)]"
          >
            <span>SAIBA MAIS</span>
            <ChevronRight className="w-4 h-4 text-gold-premium group-hover:text-[#011d17] transition-colors" />
          </motion.button>
        </div>

        {/* Right Column: Giant Golden Eye/Globe brand symbol */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex flex-col items-center justify-center p-8 bg-[#011d17]/50 rounded-3xl border border-gold-premium/15 backdrop-blur-md shadow-2xl max-w-sm w-full group"
          >
            {/* Glowing background aura */}
            <div className="absolute inset-0 bg-gold-premium/5 rounded-3xl blur-2xl group-hover:bg-gold-premium/10 transition-all duration-500" />
            
            {/* Elegant SVG Eye symbol */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_0_20px_rgba(226,184,60,0.35)]"
              >
                {/* Outer Golden Eye shape */}
                <path
                  d="M10 50C25 22 75 22 90 50C75 78 25 78 10 50Z"
                  stroke="#e2b83c"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Dashed outer golden rim */}
                <circle cx="50" cy="50" r="28" stroke="#e2b83c" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                {/* Rotating Globe Iris */}
                <g className="animate-[spin_45s_linear_infinite]">
                  <circle cx="50" cy="50" r="20" stroke="#e2b83c" strokeWidth="2" fill="#01241e" />
                  
                  {/* Latitude / longitude lines */}
                  <path
                    d="M30 50H70M50 30V70M32.5 41C38 43.5 62 43.5 67.5 41M32.5 59C38 56.5 62 56.5 67.5 59"
                    stroke="#fbbf24"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <path
                    d="M43 32C46 38 46 62 43 68M57 32C54 38 54 62 57 68"
                    stroke="#fbbf24"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  
                  {/* Continent outlines silhouettes simplified in pure gold */}
                  <path
                    d="M38 45C39 44 41 47 40 49C38 50 36 47 38 45ZM56 42C59 41 61 44 60 46C58 47 56 44 56 42ZM47 57C48 55 52 56 53 59C51 62 48 60 47 57Z"
                    fill="#fbbf24"
                    opacity="0.8"
                  />
                </g>

                {/* Sparkling Pupil Core */}
                <circle cx="50" cy="50" r="6" fill="#fbbf24" className="animate-pulse" />
                <circle cx="48" cy="48" r="1.5" fill="#ffffff" />
              </svg>
            </div>

            {/* Typography brand lockup matching user image */}
            <div className="mt-4 space-y-0.5 relative z-10 select-none">
              <h2 className="font-display font-bold tracking-[0.1em] text-2xl text-white">
                NOVA <span className="text-gold-premium">VISÃO</span>
              </h2>
              <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-gold-premium/80 font-mono">
                IMÓVEIS INTERNACIONAIS
              </p>
            </div>
          </motion.div>
        </div>

      </section>

      {/* SEARCH AND FILTERS PANEL */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-8 space-y-4">
        
        {/* Primary Search Row */}
        <div className="flex flex-col md:flex-row gap-3 bg-[#01241e] border border-gold-premium/15 p-3 rounded-2xl shadow-xl">
          <div className="flex-1 flex items-center gap-3 bg-emerald-darkest rounded-xl px-4 py-2.5">
            <Search className="w-4 h-4 text-gold-premium shrink-0" />
            <input
              type="text"
              placeholder={dictionary.searchPlace}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full focus:outline-none text-xs text-white"
            />
          </div>

          <div className="flex gap-2">
            
            {/* Country Selector */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-emerald-darkest border border-gold-premium/15 text-xs text-white px-4 py-2.5 rounded-xl font-mono focus:outline-none focus:border-gold-premium cursor-pointer"
            >
              <option value="Todos">{dictionary.filterCountry}: {dictionary.all}</option>
              <option value="Brasil">Brasil</option>
              <option value="Portugal">Portugal</option>
              <option value="EUA">EUA</option>
              <option value="Japão">Japão</option>
              <option value="Emirados Árabes">Emirados Árabes</option>
              <option value="Suíça">Suíça</option>
            </select>

            {/* Toggle advanced filters */}
            <button
              onClick={() => setShowFiltersHud(!showFiltersHud)}
              className="bg-[#012720] hover:bg-emerald-darkest border border-gold-premium/25 text-gold-premium px-4 rounded-xl text-xs flex items-center gap-2 transition-colors font-mono"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden md:inline">FILTROS</span>
            </button>

            {/* Use Geolocation search */}
            <button
              onClick={triggerLocationSearch}
              className="bg-[#d97706] hover:bg-gold-premium text-emerald-darkest font-bold px-4 rounded-xl text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(217,119,6,0.25)] font-mono"
              title={dictionary.useLocation}
            >
              <Navigation className="w-4 h-4" />
              <span className="hidden md:inline">NEARBY</span>
            </button>

          </div>
        </div>

        {/* Dynamic Filters HUD expanded */}
        {showFiltersHud && (
          <div className="bg-[#011d17] border border-gold-premium/15 p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-inner">
            
            {/* Modalidade */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase">{dictionary.filterType}</label>
              <div className="flex gap-2">
                {["Todos", "COMPRA", "ALUGUEL"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedType(t as any)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedType === t 
                        ? "bg-gold-premium text-emerald-darkest border-gold-premium font-bold"
                        : "bg-emerald-darkest border-emerald-accent/10 text-gray-400"
                    }`}
                  >
                    {t === "Todos" ? dictionary.all : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Price maximum */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase">
                {dictionary.filterPrice} ({currency})
              </label>
              <input
                type="range"
                min="0"
                max={selectedType === "ALUGUEL" ? "100000" : "50000000"}
                step="5000"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-full accent-gold-premium"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>Min: {currencyRates[currency]?.symbol} 0</span>
                <span className="text-gold-premium font-bold">
                  {maxPriceFilter > 0 ? `${currencyRates[currency]?.symbol} ${maxPriceFilter.toLocaleString()}` : dictionary.all}
                </span>
              </div>
            </div>

            {/* Minimum Rooms */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-gray-400 uppercase">{dictionary.filterRooms}</label>
              <div className="flex gap-1.5">
                {[0, 2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMinRoomsFilter(num)}
                    className={`flex-1 py-1 text-xs font-mono font-medium rounded-lg border transition-all ${
                      minRoomsFilter === num
                        ? "bg-gold-premium text-emerald-darkest border-gold-premium"
                        : "bg-[#01241e] border-emerald-accent/5 text-gray-400"
                    }`}
                  >
                    {num === 0 ? "Any" : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </section>

      {/* NAVIGATION TABS NAVIGATION MENU */}
      <nav className="max-w-6xl mx-auto px-4 md:px-8 mb-8 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => { setActiveTab("BROWSE"); setSelectedProperty(null); }}
          className={`px-4 py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
            activeTab === "BROWSE"
              ? "bg-[#012720] text-gold-premium border-gold-premium shadow"
              : "bg-transparent text-gray-400 border-gray-800 hover:text-white"
          }`}
        >
          IMÓVEIS DISPONÍVEIS
        </button>

        <button
          onClick={() => { setActiveTab("MAP"); setSelectedProperty(null); }}
          className={`px-4 py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
            activeTab === "MAP"
              ? "bg-[#012720] text-gold-premium border-gold-premium shadow"
              : "bg-transparent text-gray-400 border-gray-800 hover:text-white"
          }`}
        >
          MAPA MUNDI GLOBAL
        </button>

        <button
          onClick={() => { setActiveTab("CHAT"); setSelectedProperty(null); }}
          className={`px-4 py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
            activeTab === "CHAT"
              ? "bg-[#012720] text-gold-premium border-gold-premium shadow"
              : "bg-transparent text-gray-400 border-gray-800 hover:text-white"
          }`}
        >
          CHAT DIRECT {chats.length > 0 && `(${chats.length})`}
        </button>

        <button
          onClick={() => { setActiveTab("FAVORITES"); setSelectedProperty(null); }}
          className={`px-4 py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
            activeTab === "FAVORITES"
              ? "bg-[#012720] text-gold-premium border-gold-premium shadow"
              : "bg-transparent text-gray-400 border-gray-800 hover:text-white"
          }`}
        >
          MEUS FAVORITOS
        </button>

        {currentUser?.role === "SELLER" && (
          <button
            onClick={() => { setActiveTab("BROKER"); setSelectedProperty(null); }}
            className="px-4 py-2 text-xs font-mono font-bold rounded-xl border bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:border-gold-premium"
          >
            {dictionary.brokerTitle}
          </button>
        )}

        {currentUser?.role === "ADMIN" && (
          <button
            onClick={() => { setActiveTab("ADMIN"); setSelectedProperty(null); }}
            className="px-4 py-2 text-xs font-mono font-bold rounded-xl border bg-amber-950/40 text-gold-premium border-gold-premium/30 hover:border-gold-bright"
          >
            {dictionary.adminTitle}
          </button>
        )}
      </nav>

      {/* CORE ACTIVE VIEW SWITCHER */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 flex-1 w-full pb-10">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* TAB BROWSE LISTINGS */}
            {activeTab === "BROWSE" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Listings Grid */}
                <div className={`space-y-6 ${selectedProperty ? "lg:col-span-7" : "lg:col-span-12"}`}>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-xs font-mono text-emerald-accent">
                      LISTANDO {sortedListings.length} DE {properties.length} IMÓVEIS DE LUXO
                    </span>
                    {userCoords && (
                      <span className="text-[10px] font-mono text-gold-premium flex items-center gap-1">
                        <MapPinCheck className="w-3.5 h-3.5" />
                        ORGANIZADOS POR DISTÂNCIA DE VOCÊ
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedListings.map((p) => {
                      const isFav = userFavorites.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          className="bg-[#01241e] border border-gold-premium/15 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:border-gold-premium transition-all duration-300 group"
                        >
                          {/* Image and quick tags */}
                          <div className="relative overflow-hidden aspect-[16/10] bg-black">
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onClick={() => viewPropertyDetails(p)}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 left-3 flex gap-1.5">
                              <span className="bg-emerald-darkest/90 text-gold-premium border border-gold-premium/30 px-2.5 py-1 rounded text-[9px] font-mono font-bold">
                                {p.type === "COMPRA" ? dictionary.buy : dictionary.rent}
                              </span>
                              <span className="bg-[#011d17]/90 text-white border border-emerald-accent/25 px-2.5 py-1 rounded text-[9px] font-mono">
                                {p.country}
                              </span>
                            </div>

                            {/* Fav icon */}
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                              className={`absolute top-3 right-3 p-2 rounded-full border transition-all ${
                                isFav
                                  ? "bg-red-500/20 border-red-500 text-red-500 shadow"
                                  : "bg-[#011d17]/80 border-gray-700 text-gray-300 hover:text-white"
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${isFav ? "fill-red-500" : ""}`} />
                            </button>
                          </div>

                          {/* Info panel */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="cursor-pointer" onClick={() => viewPropertyDetails(p)}>
                              <div className="flex justify-between items-start">
                                <span className="text-[10px] font-mono text-emerald-accent uppercase tracking-wide">
                                  {p.city}
                                </span>
                                <div className="flex items-center gap-1 text-[#fbbf24] text-[11px] font-mono">
                                  <Star className="w-3.5 h-3.5 fill-[#fbbf24]" />
                                  <span>{p.rating}</span>
                                </div>
                              </div>

                              <h3 className="font-display font-bold text-white text-base mt-1 group-hover:text-gold-premium transition-colors">
                                {p.title}
                              </h3>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                {p.description}
                              </p>
                            </div>

                            {/* Features list */}
                            <div className="flex gap-4 text-xs text-gray-400 font-mono border-t border-b border-gold-premium/10 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <BedDouble className="w-4 h-4 text-gold-premium" />
                                <span>{p.rooms} qtos</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Bath className="w-4 h-4 text-gold-premium" />
                                <span>{p.bathrooms} banhs</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Maximize2 className="w-4 h-4 text-gold-premium" />
                                <span>{p.area} m²</span>
                              </div>
                            </div>

                            {/* Price / action footer */}
                            <div className="flex justify-between items-center pt-1.5">
                              <span className="text-lg font-mono font-bold text-gold-premium">
                                {convertPrice(p.price, p.currency)}
                              </span>
                              <button
                                onClick={() => viewPropertyDetails(p)}
                                className="bg-[#01241e] hover:bg-gold-premium hover:text-emerald-darkest border border-gold-premium/40 text-gold-premium text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all"
                              >
                                MAIS DETALHES
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected property Sidebar Details Panel */}
                <AnimatePresence>
                  {selectedProperty && (
                    <motion.div
                      initial={{ opacity: 0, x: 200 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 200 }}
                      className="lg:col-span-5 bg-[#01241e] border border-gold-premium/25 rounded-2xl overflow-hidden shadow-2xl p-6 h-fit sticky top-24 space-y-6"
                    >
                      <div className="flex justify-between items-start border-b border-gold-premium/15 pb-4">
                        <div>
                          <span className="text-[10px] font-mono text-gold-premium uppercase tracking-widest block">MEMORIAL EXCLUSIVO</span>
                          <h2 className="font-display font-bold text-white text-lg tracking-tight mt-1">{selectedProperty.title}</h2>
                          <span className="text-xs text-gray-400">{selectedProperty.city}, {selectedProperty.country}</span>
                        </div>
                        <button
                          onClick={() => setSelectedProperty(null)}
                          className="text-gray-400 hover:text-white text-lg font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Small details grid */}
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono py-2.5">
                        <div className="bg-[#011d17] p-3 rounded-xl border border-emerald-accent/10">
                          <span className="text-[9px] text-gray-400 block uppercase">Preço Final</span>
                          <span className="text-gold-premium font-bold text-base leading-none block mt-1">
                            {convertPrice(selectedProperty.price, selectedProperty.currency)}
                          </span>
                        </div>
                        <div className="bg-[#011d17] p-3 rounded-xl border border-emerald-accent/10">
                          <span className="text-[9px] text-gray-400 block uppercase">Avaliação</span>
                          <span className="text-white font-bold text-base leading-none block mt-1 flex items-center gap-1">
                            <Star className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                            {selectedProperty.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed font-light">
                        {selectedProperty.description}
                      </p>

                      {/* Distance details Button requested explicitly */}
                      <div className="space-y-3 pt-4 border-t border-gold-premium/15">
                        <span className="text-[10px] font-mono text-emerald-accent uppercase tracking-wider block">Estudo de Geoproximidade</span>
                        
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                          <div className="bg-[#011d17] p-2 rounded-lg text-gray-300">
                            🏫 Escolas: <span className="text-white block mt-0.5">{selectedProperty.amenities.schools}</span>
                          </div>
                          <div className="bg-[#011d17] p-2 rounded-lg text-gray-300">
                            💊 Farmácias: <span className="text-white block mt-0.5">{selectedProperty.amenities.pharmacies}</span>
                          </div>
                          <div className="bg-[#011d17] p-2 rounded-lg text-gray-300">
                            ✈️ Aeroporto: <span className="text-white block mt-0.5">{selectedProperty.amenities.airports}</span>
                          </div>
                          <div className="bg-[#011d17] p-2 rounded-lg text-gray-300">
                            🚇 Metrô/Trem: <span className="text-white block mt-0.5">{selectedProperty.amenities.metro}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Triggers */}
                      <div className="flex flex-col gap-2.5 pt-4 border-t border-gold-premium/15">
                        
                        <button
                          onClick={() => initiateChat(selectedProperty)}
                          className="w-full bg-transparent hover:bg-gold-premium/10 border-2 border-gold-premium text-gold-premium py-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {dictionary.contactBroker}
                        </button>

                        <button
                          onClick={() => setActiveTour({ propertyTitle: selectedProperty.title, rooms: selectedProperty.tour3d })}
                          className="w-full bg-[#012d24] hover:bg-[#023e30] border border-emerald-accent/30 text-white py-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <Compass className="w-4 h-4" />
                          {dictionary.tourButton}
                        </button>

                        <button
                          onClick={() => setActiveCheckout(selectedProperty)}
                          className="w-full bg-[#d97706] hover:bg-gold-premium text-emerald-darkest py-3.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,119,6,0.3)]"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {dictionary.reserveButton}
                        </button>

                      </div>

                      {/* Review List & Post Review form */}
                      <div className="pt-6 border-t border-gold-premium/15 space-y-4">
                        <span className="text-xs font-bold text-white block uppercase tracking-wide">{dictionary.reviews}</span>
                        
                        {reviews.length > 0 ? (
                          <div className="space-y-3 max-h-44 overflow-y-auto pr-1 scrollbar-thin text-xs">
                            {reviews.map((rev) => (
                              <div key={rev.id} className="bg-[#011d17] p-3 rounded-xl border border-emerald-accent/5">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-semibold text-white">{rev.userName}</span>
                                  <div className="flex items-center text-[#fbbf24] font-mono text-[10px]">
                                    <Star className="w-3 h-3 fill-[#fbbf24] mr-0.5" />
                                    {rev.rating}/5
                                  </div>
                                </div>
                                <p className="text-gray-400 font-light italic">"{rev.comment}"</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-500 italic">Seja o primeiro a avaliar esta propriedade de luxo.</p>
                        )}

                        {/* Submit review */}
                        {currentUser && (
                          <form onSubmit={postPropertyReview} className="space-y-2.5 pt-2 border-t border-emerald-accent/5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400">Sua nota:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <button
                                    key={num}
                                    type="button"
                                    onClick={() => setNewRating(num)}
                                    className={`p-0.5 text-base transition-colors ${
                                      newRating >= num ? "text-[#fbbf24]" : "text-gray-600"
                                    }`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>
                            <input
                              type="text"
                              required
                              placeholder="Escreva sua avaliação sincera..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full bg-[#011d17] border border-gold-premium/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-premium"
                            />
                            <button
                              type="submit"
                              className="bg-[#022c22] hover:bg-[#033f31] border border-gold-premium/30 text-gold-premium text-[10px] font-mono font-bold w-full py-1.5 rounded-lg transition-colors"
                            >
                              {dictionary.addReview}
                            </button>
                          </form>
                        )}
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

            {/* TAB INTERACTIVE MAP EXPLORER */}
            {activeTab === "MAP" && (
              <InteractiveMap
                properties={properties}
                selectedProperty={selectedProperty}
                onSelectProperty={viewPropertyDetails}
                onFilterCountry={(c) => setSelectedCountry(c)}
                selectedCountry={selectedCountry}
              />
            )}

            {/* TAB CHATS INTERFACE */}
            {activeTab === "CHAT" && currentUser && (
              <ChatIntegrated
                currentUser={currentUser}
                chatSession={activeChat}
                onSendMessage={sendChatMessage}
                allChats={chats}
                onSelectChat={(c) => setActiveChat(c)}
              />
            )}

            {/* TAB CLIENT FAVORITES */}
            {activeTab === "FAVORITES" && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-white text-xl uppercase tracking-wider">{dictionary.favorites}</h2>
                {userFavorites.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">{dictionary.noFavs}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties
                      .filter((p) => userFavorites.includes(p.id))
                      .map((p) => (
                        <div
                          key={p.id}
                          onClick={() => { viewPropertyDetails(p); setActiveTab("BROWSE"); }}
                          className="bg-[#01241e] border border-gold-premium/15 rounded-2xl overflow-hidden cursor-pointer hover:border-gold-premium transition-all"
                        >
                          <img src={p.images[0]} alt={p.title} className="w-full h-44 object-cover" />
                          <div className="p-4 space-y-2">
                            <span className="text-[10px] font-mono text-emerald-accent">{p.city}, {p.country}</span>
                            <h4 className="font-display font-bold text-white text-sm truncate">{p.title}</h4>
                            <span className="text-gold-premium font-mono text-sm block font-bold">
                              {convertPrice(p.price, p.currency)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB BROKER PERFORMANCE DASHBOARD */}
            {activeTab === "BROKER" && currentUser?.role === "SELLER" && (
              <BrokerDashboard
                seller={currentUser}
                properties={properties}
                onAddProperty={handleBrokerAddProperty}
              />
            )}

            {/* TAB ADMINISTRATOR GOVERNANCE DASHBOARD */}
            {activeTab === "ADMIN" && currentUser?.role === "ADMIN" && (
              <AdminPanel
                onApproveSeller={handleAdminApproveSeller}
                onApproveProperty={handleAdminApproveProperty}
                allSellers={allSellers}
                allProperties={properties}
              />
            )}

          </motion.div>
        </AnimatePresence>

      </main>

      {/* FOOTER BRANDS BAR */}
      <footer className="max-w-6xl mx-auto px-4 md:px-8 border-t border-gold-premium/15 mt-12 pt-8 text-center space-y-4">
        <Logo size="sm" showSlogan={false} />
        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          © 2026 NOVA VISÃO S.A. • REGISTRO SFI - 4528.02. CUSTÓDIA ASSECURATÓRIA PATRIMONIAL.
        </p>
      </footer>

      {/* 3D TOUR FULLSCREEN MODAL */}
      {activeTour && (
        <Tour3D
          propertyTitle={activeTour.propertyTitle}
          rooms={activeTour.rooms}
          onClose={() => setActiveTour(null)}
        />
      )}

      {/* STRIPE SECUREPAY SECURE CHECKOUT MODAL */}
      {activeCheckout && currentUser && (
        <GatewayCheckout
          property={activeCheckout}
          currentUser={currentUser}
          onClose={() => setActiveCheckout(null)}
          onPaymentSuccess={() => {
            fetchProperties();
            fetchChats();
          }}
        />
      )}

      {/* CLIENT / BROKER / ADMIN SIGN UP & SIGN IN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#011d17] border border-gold-premium/30 rounded-3xl overflow-hidden p-8 space-y-6 shadow-2xl">
            
            <div className="text-center space-y-2">
              <Logo size="sm" showSlogan={false} />
              <h3 className="font-display font-bold text-white text-base">
                {isRegisterMode ? "Criar Nova Credencial" : "Acesso Seguro e Reservado"}
              </h3>
            </div>

            <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4 text-xs">
              
              {isRegisterMode && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase block">Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Arthur Felipe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase block">Endereço de E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: arthur@gmail.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase block">Perfil de Acesso</label>
                    <select
                      value={registerRole}
                      onChange={(e) => setRegisterRole(e.target.value as any)}
                      className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                    >
                      <option value="CLIENT">Comprador / Locatário (Cliente)</option>
                      <option value="SELLER">Corretor de Imóveis (Vendedor)</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase block">Usuário de Acesso</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: admin ou pedro_luxury"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase block flex justify-between">
                  <span>Senha Criptografada</span>
                  {loginUser.toLowerCase() === "admin" && (
                    <span className="text-[9px] text-gold-premium flex items-center gap-0.5">
                      <Lock className="w-3 h-3" />
                      REQUER CHAVE GOVERNANÇA
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  required
                  placeholder="Senha"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#d97706] hover:bg-gold-premium text-emerald-darkest font-mono font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(217,119,6,0.2)]"
              >
                {isRegisterMode ? "REQUISITAR CADASTRO" : "VERIFICAR IDENTIDADE"}
              </button>

              <div className="flex justify-between items-center pt-2 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-gold-premium hover:underline"
                >
                  {isRegisterMode ? "Já possui conta? Entrar" : "Criar nova conta"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Pre-fill Admin credentials for easy evaluation
                    setLoginUser("admin");
                    setLoginPass("sofialinda00");
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  Preencher Admin Demo
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
