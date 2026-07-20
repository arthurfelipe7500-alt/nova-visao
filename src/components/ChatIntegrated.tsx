import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, ShieldCheck, User, Sparkles, Clock } from "lucide-react";
import { Chat, ChatMessage, User as UserType } from "../types";

interface ChatIntegratedProps {
  currentUser: UserType;
  chatSession: Chat | null;
  onSendMessage: (chatId: string, text: string) => void;
  allChats: Chat[];
  onSelectChat: (chat: Chat) => void;
}

export default function ChatIntegrated({
  currentUser,
  chatSession,
  onSendMessage,
  allChats,
  onSelectChat
}: ChatIntegratedProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatSession?.messages, isTyping]);

  // Simulate Typing animation when client sends message
  useEffect(() => {
    if (chatSession && chatSession.messages.length > 0) {
      const lastMsg = chatSession.messages[chatSession.messages.length - 1];
      if (lastMsg.senderId === currentUser.id) {
        setIsTyping(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [chatSession?.messages, currentUser.id]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatSession) return;
    onSendMessage(chatSession.id, inputText.trim());
    setInputText("");
  };

  return (
    <div className="w-full h-[580px] rounded-2xl overflow-hidden premium-gradient flex flex-col md:flex-row">
      
      {/* Sidebar - Chats list */}
      <div className="w-full md:w-72 bg-[#012720]/95 border-b md:border-b-0 md:border-r border-gold-premium/15 flex flex-col h-full">
        <div className="p-4 border-b border-gold-premium/10 bg-emerald-darkest/40 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gold-premium" />
          <span className="font-display font-bold text-xs text-white uppercase tracking-wider">Canais de Mensagem</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
          {allChats.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500">
              Nenhuma conversa ativa no momento.
            </div>
          ) : (
            allChats.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              const isSelected = chatSession?.id === chat.id;

              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-gold-premium/10 border-gold-premium shadow-sm"
                      : "bg-[#011d17] border-emerald-accent/5 hover:border-gold-premium/30"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-semibold text-white font-display truncate max-w-[120px]">
                      {currentUser.role === "SELLER" ? chat.clientName : chat.sellerName}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className="text-[10px] text-gold-premium font-medium truncate w-full">
                    {chat.propertyTitle}
                  </span>
                  {lastMessage && (
                    <p className="text-[11px] text-gray-400 truncate w-full">
                      {lastMessage.text}
                    </p>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Conversation panel */}
      <div className="flex-1 flex flex-col bg-[#011d17] h-full relative">
        {chatSession ? (
          <>
            {/* Active chat header */}
            <div className="p-4 bg-[#012720] border-b border-gold-premium/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gold-premium/10 border border-gold-premium/40 flex items-center justify-center">
                  <User className="w-4 h-4 text-gold-premium" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {currentUser.role === "SELLER" ? chatSession.clientName : chatSession.sellerName}
                  </span>
                  <span className="text-[9px] text-emerald-accent flex items-center gap-1 uppercase font-mono tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-accent rounded-full animate-ping" />
                    Canal Criptografado & Ativo
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-gold-premium/5 border border-gold-premium/20 rounded-md px-2 py-1 text-[9px] font-mono text-gold-premium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NOVA VISÃO SECURE</span>
              </div>
            </div>

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {chatSession.messages.map((msg, i) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={i}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-md flex flex-col ${
                        isMe
                          ? "bg-gold-premium text-emerald-darkest rounded-tr-none font-medium"
                          : "bg-[#012d24] text-white border border-gold-premium/10 rounded-tl-none"
                      }`}
                    >
                      <span className="text-[9px] font-mono opacity-60 mb-0.5 uppercase tracking-wide">
                        {msg.senderName}
                      </span>
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                      <span className={`text-[8px] font-mono mt-1 text-right ${isMe ? "text-emerald-darkest/70" : "text-gray-400"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#012d24] text-white border border-gold-premium/10 rounded-2xl rounded-tl-none px-4 py-3.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#fbbf24] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3.5 bg-[#01241e] border-t border-gold-premium/15 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escreva sua mensagem com total sigilo..."
                className="flex-1 bg-emerald-darkest border border-gold-premium/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-premium font-sans"
              />
              <button
                type="submit"
                className="bg-[#d97706] hover:bg-gold-premium text-emerald-darkest font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1 shadow"
              >
                <Send className="w-4 h-4" />
                <span className="text-xs font-mono">ENVIAR</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <Sparkles className="w-10 h-10 text-gold-premium/45 mb-3 animate-pulse" />
            <span className="font-display font-semibold text-white mb-1">Central de Comunicação</span>
            <p className="text-xs max-w-sm text-gray-500 leading-relaxed">
              Inicie uma conversa direta com corretores credenciados ao clicar em "Contatar Corretor" nos detalhes de qualquer imóvel listado.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
