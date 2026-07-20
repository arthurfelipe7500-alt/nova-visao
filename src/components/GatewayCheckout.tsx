import React, { useState } from "react";
import { CreditCard, ShieldCheck, DollarSign, RefreshCw, X, CheckCircle, Ticket } from "lucide-react";
import { Property, User } from "../types";

interface GatewayCheckoutProps {
  property: Property;
  currentUser: User;
  onClose: () => void;
  onPaymentSuccess: (transactionId: string, amountPaid: number) => void;
}

export default function GatewayCheckout({
  property,
  currentUser,
  onClose,
  onPaymentSuccess
}: GatewayCheckoutProps) {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [txnId, setTxnId] = useState("");

  // Sinal / Security downpayment (5% of buying price, or 1 month of rent)
  const sinalAmount = property.type === "COMPRA" 
    ? Math.round(property.price * 0.05) 
    : property.price;

  const adminFee = Math.round(sinalAmount * 0.02);
  const totalDue = sinalAmount + adminFee;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) return;

    setIsProcessing(true);

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          userId: currentUser.id,
          cardName,
          cardNumber,
          amount: totalDue,
          currency: property.currency
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTxnId(data.transactionId);
        setPaymentDone(true);
        onPaymentSuccess(data.transactionId, totalDue);
      } else {
        alert(data.error || "Ocorreu um erro no processamento do gateway.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha ao comunicar com o servidor de pagamento.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-[#011d17] border border-gold-premium/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(226,184,60,0.2)] flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left column - Invoice and order breakdown */}
        <div className="w-full md:w-1/2 bg-[#01241e] p-8 border-b md:border-b-0 md:border-r border-gold-premium/15 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-mono text-gold-premium uppercase tracking-widest block">FATURAMENTO SEGURO</span>
              <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-16 h-16 rounded-xl object-cover border border-gold-premium/20"
              />
              <div>
                <span className="text-[9px] font-mono text-emerald-accent uppercase tracking-wide">
                  RESERVA IMOBILIÁRIA • {property.type}
                </span>
                <h4 className="font-display font-bold text-white text-sm leading-tight mt-1">
                  {property.title}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  {property.city}, {property.country}
                </p>
              </div>
            </div>

            <div className="border-t border-b border-gold-premium/10 py-4 my-4 space-y-3.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  {property.type === "COMPRA" ? "Sinal de Reserva Garantida (5%)" : "Aluguel (1º mês de caução)"}
                </span>
                <span className="text-white font-mono font-medium">
                  {sinalAmount.toLocaleString()} {property.currency}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Custas e Custódia Cartorária</span>
                <span className="text-white font-mono font-medium">
                  {adminFee.toLocaleString()} {property.currency}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">TOTAL DO SINAL</span>
              <span className="text-2xl font-mono font-bold text-gold-premium">
                {totalDue.toLocaleString()} <span className="text-sm font-sans">{property.currency}</span>
              </span>
            </div>

            <div className="bg-emerald-darkest/60 border border-emerald-accent/20 rounded-xl p-3 text-[10px] text-gray-400 leading-relaxed flex gap-2">
              <ShieldCheck className="w-7 h-7 text-emerald-accent shrink-0" />
              <span>
                Esta transação serve como garantia de reserva e sinal do imóvel. O valor será mantido em custódia segura pela <strong>Nova Visão S.A.</strong> até a assinatura final do contrato ou escritura pública.
              </span>
            </div>
          </div>
        </div>

        {/* Right column - Credit Card Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          {!paymentDone ? (
            <form onSubmit={handlePay} className="space-y-5">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gold-premium" />
                  <h3 className="font-display font-bold text-white text-base">Portal SecurePay</h3>
                </div>
                <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase block">Nome no Cartão</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ARTHUR F SILVA"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-premium font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase block">Número do Cartão de Crédito</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim())}
                  className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-premium font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block">Expiração</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/AA"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-premium font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase block">CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    placeholder="***"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-[#01241e] border border-gold-premium/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-premium font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#d97706] hover:bg-gold-premium disabled:bg-gray-700 text-emerald-darkest font-mono font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.3)] mt-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>PROCESSANDO TRANSAÇÃO GLOBAL...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>PAGAR {totalDue.toLocaleString()} {property.currency}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 font-mono">
                <span>🔒 PCI-DSS COMPLIANT</span>
                <span>•</span>
                <span>🌍 GLOBAL INGRESS COVERS</span>
              </div>
            </form>
          ) : (
            <div className="text-center p-4 space-y-5 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-accent flex items-center justify-center text-emerald-accent shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-white text-lg">Reserva Confirmada!</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  O pagamento de garantia de proposta foi aprovado e creditado. O corretor <strong>{property.sellerName}</strong> foi alertado em tempo real e entrará em contato em instantes.
                </p>
              </div>

              <div className="bg-[#01241e] border border-gold-premium/20 rounded-xl p-4 w-full text-left space-y-2 font-mono">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">ID DA TRANSAÇÃO:</span>
                  <span className="text-white font-semibold">{txnId}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">MÉTODO:</span>
                  <span className="text-white">CREDIT CARD (VISA/MC)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">STATUS:</span>
                  <span className="text-emerald-accent font-semibold">APROVADA E CONSIGNADA</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-gold-premium hover:bg-gold-bright text-emerald-darkest font-mono font-bold px-6 py-2.5 rounded-xl transition-all text-xs"
              >
                CONCLUIR E VOLTAR
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
