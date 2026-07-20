import React, { useState } from "react";
import { User, Property } from "../types";
import { DollarSign, Percent, Sparkles, Plus, CheckCircle, Clock, ShieldCheck, Landmark } from "lucide-react";

interface BrokerDashboardProps {
  seller: User;
  properties: Property[];
  onAddProperty: (propertyData: any) => void;
}

export default function BrokerDashboard({
  seller,
  properties,
  onAddProperty
}: BrokerDashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("Portugal");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [type, setType] = useState<"COMPRA" | "ALUGUEL">("COMPRA");
  const [rooms, setRooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("3");
  const [area, setArea] = useState("150");
  const [image, setImage] = useState("");

  const sellerProps = properties.filter((p) => p.sellerId === seller.id);
  const approvedCount = sellerProps.filter((p) => p.status === "APPROVED").length;
  const pendingCount = sellerProps.filter((p) => p.status === "PENDING").length;

  const totalValue = sellerProps
    .filter((p) => p.status === "APPROVED")
    .reduce((sum, p) => sum + p.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !city || !price) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const amenities = {
      schools: "0.8 km (Escola Premium)",
      pharmacies: "0.2 km (Farmácia 24h)",
      airports: "22 km (Aeroporto Internacional)",
      metro: "0.5 km (Estação Central)",
      supermarket: "0.4 km (Mercado Orgânico)",
      hospital: "1.8 km (Hospital Albert)"
    };

    onAddProperty({
      title,
      description,
      country,
      city,
      price: Number(price),
      currency,
      type,
      rooms: Number(rooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      images: image ? [image] : [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
      ],
      amenities,
      coordinates: { lat: 38.7994, lng: -9.3872 } // default Sintra coordinates for convenience
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setCity("");
    setPrice("");
    setRooms("3");
    setBathrooms("3");
    setArea("150");
    setImage("");
    setShowAddForm(false);
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Seller Financial stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-5 shadow flex items-center gap-4">
          <div className="p-3 bg-gold-premium/10 rounded-xl text-gold-premium">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Saldo de Comissões</span>
            <span className="text-xl font-mono font-bold text-white">
              {seller.balance ? seller.balance.toLocaleString() : "0"} <span className="text-xs">EUR</span>
            </span>
          </div>
        </div>

        <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-5 shadow flex items-center gap-4">
          <div className="p-3 bg-emerald-accent/10 rounded-xl text-emerald-accent">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Taxa de Conversão</span>
            <span className="text-xl font-mono font-bold text-emerald-accent">
              4.8%
            </span>
          </div>
        </div>

        <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-5 shadow flex items-center gap-4">
          <div className="p-3 bg-gold-premium/10 rounded-xl text-gold-premium">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Imóveis Ativos</span>
            <span className="text-xl font-mono font-bold text-white">
              {approvedCount}
            </span>
          </div>
        </div>

        <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-5 shadow flex items-center gap-4">
          <div className="p-3 bg-emerald-accent/10 rounded-xl text-emerald-accent">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Aguardando Avaliação</span>
            <span className="text-xl font-mono font-bold text-white">
              {pendingCount}
            </span>
          </div>
        </div>

      </div>

      <div className="flex justify-between items-center bg-[#012720] border border-gold-premium/15 rounded-2xl p-6 shadow">
        <div>
          <span className="text-[10px] font-mono text-gold-premium uppercase tracking-widest block">GERENCIAR IMÓVEIS</span>
          <h3 className="font-display font-bold text-white text-lg tracking-tight mt-1">Meus Anúncios Publicados</h3>
          <p className="text-xs text-gray-400 mt-1">Insira e acompanhe o andamento de suas publicações na plataforma global.</p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gold-premium hover:bg-gold-bright text-emerald-darkest font-mono font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          NOVO ANÚNCIO
        </button>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellerProps.map((p) => (
          <div key={p.id} className="bg-[#01241e] border border-gold-premium/15 rounded-2xl overflow-hidden shadow flex flex-col justify-between">
            <div className="relative">
              <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" />
              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold border ${
                  p.status === "APPROVED" 
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                    : p.status === "PENDING"
                    ? "bg-amber-950/80 text-amber-300 border-amber-500/30 animate-pulse"
                    : "bg-red-950/80 text-red-300 border-red-500/30"
                }`}>
                  {p.status === "APPROVED" ? "APROVADO" : p.status === "PENDING" ? "PENDENTE MODERAÇÃO" : "REJEITADO"}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono text-gold-premium uppercase">{p.type} • {p.country}</span>
                <h4 className="font-display font-bold text-white text-sm mt-1 line-clamp-1">{p.title}</h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
              </div>

              <div className="flex justify-between items-baseline border-t border-gold-premium/10 pt-3">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Preço Estimado</span>
                <span className="text-sm font-mono font-bold text-white">
                  {p.price.toLocaleString()} {p.currency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add listing modal form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#011d17] border border-gold-premium/30 rounded-3xl overflow-hidden p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gold-premium/15 pb-4">
              <div>
                <span className="text-[10px] font-mono text-gold-premium uppercase tracking-wider block">CADASTRO DE PROPRIEDADE</span>
                <h3 className="font-display font-bold text-white text-lg mt-1">Registrar Novo Imóvel</h3>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block">Título do Anúncio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mansão Vista Mar"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block">Cidade *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rio de Janeiro"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block">País *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                  >
                    <option value="Brasil">Brasil</option>
                    <option value="Portugal">Portugal</option>
                    <option value="EUA">EUA</option>
                    <option value="Japão">Japão</option>
                    <option value="Emirados Árabes">Emirados Árabes</option>
                    <option value="Suíça">Suíça</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block">Transação *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                  >
                    <option value="COMPRA">COMPRA</option>
                    <option value="ALUGUEL">ALUGUEL</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block">Valor Pretendido *</label>
                  <input
                    type="number"
                    required
                    placeholder="1200000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block">Moeda *</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="BRL">BRL (R$)</option>
                    <option value="USD">USD ($)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="AED">AED (dh)</option>
                    <option value="CHF">CHF (fr)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block">Quartos</label>
                  <input
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block">Banheiros</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block font-sans">Área total (m²)</label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase block">Link da Imagem Principal</label>
                <input
                  type="url"
                  placeholder="Ex: https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase block">Memorial Descritivo Detalhado *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Insira detalhes construtivos, diferenciais tecnológicos, e o perfil do imóvel..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold-premium font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gold-premium/15">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-transparent hover:bg-white/5 border border-gray-700 text-gray-300 font-mono font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="bg-[#d97706] hover:bg-gold-premium text-emerald-darkest font-mono font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(217,119,6,0.2)]"
                >
                  ENVIAR PARA MODERAÇÃO
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
