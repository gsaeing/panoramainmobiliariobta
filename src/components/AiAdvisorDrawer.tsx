import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, BogotaZone, PropertyListing } from '../types';
import { FREQUENT_INVESTMENT_QUESTIONS } from '../data/bogotaData';
import { Sparkles, Send, X, Bot, User, Loader2, ArrowRight, CornerDownLeft, MapPin } from 'lucide-react';

interface AiAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeZoneContext?: BogotaZone | null;
  activePropertyContext?: PropertyListing | null;
  initialPrompt?: string;
}

export const AiAdvisorDrawer: React.FC<AiAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  activeZoneContext,
  activePropertyContext,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        '¡Hola! Soy tu **Asesor de Inteligencia Inmobiliaria de Bogotá**. Conozco a profundidad los precios por m², estratos (3 al 6), tasas de rentabilidad (Cap Rate), leyes de arrendamiento (Ley 820) y normatividad POT en Bogotá.\n\n¿En qué tipo de inversión o consulta sobre la capital te puedo asesorar hoy?',
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If initialPrompt provided, auto-trigger it once
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          zoneContext: activeZoneContext
            ? {
                name: activeZoneContext.name,
                locality: activeZoneContext.locality,
                estrato: activeZoneContext.estrato,
                avgPriceM2Sale: activeZoneContext.avgPriceM2Sale,
                capRate: activeZoneContext.capRate,
              }
            : undefined,
          propertyContext: activePropertyContext
            ? {
                title: activePropertyContext.title,
                zone: activePropertyContext.zoneName,
                priceCop: activePropertyContext.priceCop,
                estimatedRent: activePropertyContext.estimatedMonthlyRentCop,
                estrato: activePropertyContext.estrato,
              }
            : undefined,
          conversationHistory: messages.slice(-6),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al comunicarse con el asesor de IA.');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No se obtuvo respuesta del modelo.',
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Error calling /api/gemini/advisor:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          '⚠️ No fue posible conectar con el servicio de IA en este momento. Verifique que la variable de entorno `GEMINI_API_KEY` esté configurada.',
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Simple Markdown-style formatter for bullets and bolding
  const renderFormattedMessage = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Heading lines
      if (line.startsWith('### ') || line.startsWith('## ')) {
        const text = line.replace(/^[#]+\s*/, '');
        return (
          <h4 key={idx} className="font-bold text-amber-300 text-sm mt-2 mb-1">
            {text}
          </h4>
        );
      }
      // Bullet items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 text-xs sm:text-sm my-0.5">
            {parseBold(text)}
          </li>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-slate-200 text-xs sm:text-sm leading-relaxed">
          {parseBold(line)}
        </p>
      );
    });
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[85vh] max-h-[750px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  Asesor de Inteligencia Inmobiliaria Bogotá
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Análisis de precios, leyes, plusvalía y retorno financiero
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Context Banner if any */}
        {(activeZoneContext || activePropertyContext) && (
          <div className="px-5 py-2 bg-slate-950/90 border-b border-slate-800 text-xs text-amber-300 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span>
              Contexto activo:{' '}
              <strong>
                {activePropertyContext ? activePropertyContext.title : activeZoneContext?.name}
              </strong>
            </span>
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm space-y-1 ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium ml-auto rounded-tr-none'
                    : 'bg-slate-950/90 border border-slate-800 text-slate-100 rounded-tl-none shadow-md'
                }`}
              >
                {msg.role === 'assistant' ? (
                  renderFormattedMessage(msg.content)
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
                <span
                  className={`block text-[9px] mt-1 ${
                    msg.role === 'user' ? 'text-slate-900/80 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-2 text-xs text-slate-300">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Analizando datos de mercado de Bogotá...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Pill Strip */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/50 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-slate-500 shrink-0 font-semibold">Sugerencias:</span>
          {FREQUENT_INVESTMENT_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors border border-slate-700/60"
            >
              {q.length > 45 ? `${q.substring(0, 45)}...` : q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-advisor-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Pregunte sobre precios por m², leasing, rentabilidad en Cedritos o Rosales..."
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              disabled={isLoading}
            />
            <button
              id="ai-advisor-submit"
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Consultar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
