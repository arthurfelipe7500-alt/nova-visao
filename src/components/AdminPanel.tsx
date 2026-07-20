import React, { useState, useEffect } from "react";
import { User, Property, AdminReport } from "../types";
import { ShieldCheck, CheckCircle, XCircle, BarChart3, Users, Building, Coins, TrendingUp, Settings, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface AdminPanelProps {
  onApproveSeller: (sellerId: string) => void;
  onApproveProperty: (propertyId: string, status: "APPROVED" | "REJECTED", price?: number) => void;
  allSellers: User[];
  allProperties: Property[];
}

export default function AdminPanel({
  onApproveSeller,
  onApproveProperty,
  allSellers,
  allProperties
}: AdminPanelProps) {
  const [report, setReport] = useState<AdminReport | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [customPrice, setCustomPrice] = useState<string>("");

  useEffect(() => {
    fetchReports();
  }, [allSellers, allProperties]);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Failed to load reports", err);
    }
  };

  const handlePriceUpdate = (propId: string) => {
    if (!customPrice) return;
    onApproveProperty(propId, "APPROVED", Number(customPrice));
    setEditingPriceId(null);
    setCustomPrice("");
  };

  const pendingSellers = allSellers.filter((s) => !s.isApproved);
  const approvedSellers = allSellers.filter((s) => s.isApproved);

  const pendingProps = allProperties.filter((p) => p.status === "PENDING");
  const approvedProps = allProperties.filter((p) => p.status === "APPROVED");

  return (
    <div className="w-full space-y-8">
      {/* Overview stats cards */}
      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-5 shadow flex items-center gap-4">
            <div className="p-3 bg-gold-premium/10 rounded-xl text-gold-premium">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Volume Portfólio</span>
              <span className="text-lg font-mono font-bold text-white">
                € {report.summary.globalVolumeEUR.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-5 shadow flex items-center gap-4">
            <div className="p-3 bg-emerald-accent/10 rounded-xl text-emerald-accent">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Receitas Comissões (5%)</span>
              <span className="text-lg font-mono font-bold text-emerald-accent">
                € {report.summary.estimatedCommissionEUR.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-5 shadow flex items-center gap-4">
            <div className="p-3 bg-gold-premium/10 rounded-xl text-gold-premium">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Imóveis Ativos</span>
              <span className="text-lg font-mono font-bold text-white">
                {report.summary.approvedListings} <span className="text-xs text-gray-500 font-sans font-light">({report.summary.pendingListings} pendentes)</span>
              </span>
            </div>
          </div>

          <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-5 shadow flex items-center gap-4">
            <div className="p-3 bg-emerald-accent/10 rounded-xl text-emerald-accent">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Corretores Ativos</span>
              <span className="text-lg font-mono font-bold text-white">
                {report.summary.activeSellers} <span className="text-xs text-gray-500 font-sans font-light">({report.summary.pendingSellers} novos)</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Columns: Left is Moderation, Right is Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* MODERATION AREA */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Sellers waiting approval */}
          <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-6 shadow">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gold-premium" />
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">Aprovação de Corretores / Parceiros</h4>
            </div>

            {pendingSellers.length === 0 ? (
              <p className="text-xs text-gray-400">Todos os corretores cadastrados já foram validados.</p>
            ) : (
              <div className="space-y-3">
                {pendingSellers.map((seller) => (
                  <div key={seller.id} className="bg-emerald-darkest/40 border border-gold-premium/10 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={seller.avatar} alt={seller.name} className="w-10 h-10 rounded-full border border-gold-premium/20 object-cover" />
                      <div>
                        <span className="text-xs font-semibold text-white block">{seller.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{seller.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onApproveSeller(seller.id)}
                      className="bg-gold-premium hover:bg-gold-bright text-emerald-darkest font-mono font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all"
                    >
                      APROVAR CADASTRO
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Listings waiting approval */}
          <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-6 shadow">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-gold-premium" />
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">Moderação de Anúncios e Precificação</h4>
            </div>

            {pendingProps.length === 0 ? (
              <p className="text-xs text-gray-400">Nenhum anúncio pendente de aprovação.</p>
            ) : (
              <div className="space-y-4">
                {pendingProps.map((prop) => (
                  <div key={prop.id} className="bg-emerald-darkest/50 border border-gold-premium/10 rounded-xl p-4 space-y-3">
                    <div className="flex gap-3">
                      <img src={prop.images[0]} alt={prop.title} className="w-14 h-14 rounded-lg object-cover border border-gold-premium/20" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-white truncate block">{prop.title}</span>
                        <p className="text-[10px] text-gray-400 line-clamp-1">{prop.description}</p>
                        <span className="text-[10px] text-gold-premium font-mono mt-1 block">
                          Proposta do Corretor: {prop.price.toLocaleString()} {prop.currency}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2 border-t border-emerald-accent/5">
                      {editingPriceId === prop.id ? (
                        <div className="flex gap-2 items-center w-full">
                          <input
                            type="number"
                            placeholder="Ajustar preço..."
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            className="flex-1 bg-emerald-darkest border border-gold-premium text-xs text-white px-3 py-1.5 rounded-lg font-mono focus:outline-none"
                          />
                          <button
                            onClick={() => handlePriceUpdate(prop.id)}
                            className="bg-emerald-accent text-emerald-darkest font-mono font-bold text-[10px] px-3 py-1.5 rounded-lg"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingPriceId(prop.id)}
                            className="bg-transparent hover:bg-emerald-darkest border border-gold-premium/30 text-gold-premium font-mono text-[10px] px-3 py-1.5 rounded-lg transition-all"
                          >
                            AJUSTAR VALOR
                          </button>
                          <button
                            onClick={() => onApproveProperty(prop.id, "REJECTED")}
                            className="bg-transparent hover:bg-red-950/20 border border-red-500/20 text-red-400 font-mono text-[10px] px-3 py-1.5 rounded-lg transition-all"
                          >
                            REJEITAR
                          </button>
                          <button
                            onClick={() => onApproveProperty(prop.id, "APPROVED")}
                            className="bg-[#d97706] hover:bg-gold-premium text-emerald-darkest font-mono font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-all"
                          >
                            APROVAR & PUBLICAR
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* PERFORMANCE CHARTS AREA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#01241e] border border-gold-premium/15 rounded-2xl p-6 shadow">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-gold-premium" />
              <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider">Análise de Vendas Globais (EUR)</h4>
            </div>

            {report && (
              <div className="space-y-6">
                
                {/* Custom SVG Bar Chart */}
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-3">Vendas Mensais de Luxo</span>
                  <div className="relative w-full h-36 flex items-end justify-between gap-1 pb-4 pt-4 border-b border-emerald-accent/10 px-2">
                    {report.monthlyPerformance.map((perf, i) => {
                      const maxVal = Math.max(...report.monthlyPerformance.map(m => m.vendas));
                      const pct = maxVal > 0 ? (perf.vendas / maxVal) * 100 : 0;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                          <div className="w-full relative flex items-end justify-center bg-emerald-darkest/40 rounded h-24">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${pct}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="w-full bg-gradient-to-t from-[#064e3b] to-[#fbbf24] rounded-t border-t border-gold-bright"
                            />
                            {/* Hover tooltip */}
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-darkest text-[8px] font-mono text-white px-1.5 py-0.5 rounded border border-gold-premium/30 z-10">
                              €{(perf.vendas / 1000000).toFixed(1)}M
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-gray-500">{perf.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Properties by Country horizontal list progress bars */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Portfólio por Países</span>
                  {report.listingsByCountry.map((item, i) => {
                    const totalListings = report.listingsByCountry.reduce((sum, c) => sum + c.count, 0);
                    const percent = totalListings > 0 ? (item.count / totalListings) * 100 : 0;

                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-gray-300 font-sans">{item.country}</span>
                          <span className="text-gold-premium">{item.count} imóveis ({Math.round(percent)}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-emerald-darkest rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gold-premium rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Audit Logs */}
                <div className="pt-4 border-t border-emerald-accent/5">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-2">Logs de Governança</span>
                  <div className="space-y-1.5 text-[9px] font-mono text-gray-500">
                    <p>[2026-07-20 09:20] LOG: Admin Arthur revisou preços de sintra</p>
                    <p>[2026-07-20 08:15] LOG: Vendedor Pedro Silva respondeu cliente Arthur</p>
                    <p>[2026-07-19 14:30] LOG: Novo imóvel cadastrado pendente em St. Moritz</p>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
