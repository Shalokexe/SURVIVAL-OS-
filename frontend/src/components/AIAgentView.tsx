import React, { useState } from 'react';
import { 
  ShieldAlert, AlertOctagon, CheckCircle2, HelpCircle, 
  Package, AlertTriangle, Clock, BookOpen, Send, Bot, RefreshCw, Sparkles, Cpu
} from 'lucide-react';
import { StructuredResponse } from '../types';

interface AIAgentViewProps {
  initialPrompt?: string;
  initialScenario?: string;
  onQuery: (prompt: string, scenario: string) => Promise<StructuredResponse>;
  lastResponse: StructuredResponse | null;
}

export const AIAgentView: React.FC<AIAgentViewProps> = ({
  initialPrompt = '',
  initialScenario = 'power_outage',
  onQuery,
  lastResponse
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [scenario, setScenario] = useState(initialScenario);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<StructuredResponse | null>(lastResponse);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await onQuery(prompt || "What are my immediate action steps right now?", scenario);
      setResponse(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toUpperCase()) {
      case 'CRITICAL':
      case 'EXTREME (SIMULATION)':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40 glow-red';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MODERATE':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Header */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-rose-500">
            <Bot className="w-5 h-5" />
            <h2 className="text-lg font-bold font-heading uppercase text-white tracking-wide">
              APOCALYPSE AI REASONING ENGINE
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
            ● LOCAL AI ONLINE
          </span>
        </div>

        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
            >
              <option value="power_outage">Power Outage</option>
              <option value="water_shortage">Water Shortage</option>
              <option value="food_shortage">Food Shortage</option>
              <option value="flood">Flood Crisis</option>
              <option value="earthquake">Earthquake</option>
              <option value="pandemic">Pandemic / Outbreak</option>
              <option value="evacuation">Evacuation</option>
              <option value="zombie_simulation">Fictional Zombie Sim</option>
            </select>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask specific survival guidance... (e.g. How to purify water with bleach?)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-sans"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>ANALYZE</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Structured Output Container */}
      {loading ? (
        <div className="bg-[#121824] border border-slate-800 rounded-xl p-12 text-center space-y-4">
          <div className="inline-block p-4 bg-rose-950/50 rounded-full border border-rose-600/30 text-rose-400 animate-bounce">
            <Cpu className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-white font-bold font-heading text-lg">REASONING IN PROGRESS</h3>
            <p className="text-slate-400 text-xs font-mono">
              Gathering household inventory, local RAG handbook, and evaluating risk priority...
            </p>
          </div>
        </div>
      ) : response ? (
        <div className="space-y-4">
          {/* Situation & Risk Level Header */}
          <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">CURRENT SITUATION</span>
                <h3 className="text-xl font-bold text-white mt-0.5 font-heading">
                  {response.situation}
                </h3>
              </div>
              <div className={`px-4 py-1.5 rounded-lg border font-mono text-sm font-bold uppercase tracking-wider shrink-0 ${getRiskColor(response.risk_level)}`}>
                RISK LEVEL: {response.risk_level}
              </div>
            </div>

            {/* Do This Now Action Cards */}
            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                DO THIS NOW (IMMEDIATE PRIORITY)
              </h4>
              <div className="space-y-2">
                {response.do_this_now.map((action, idx) => (
                  <div key={idx} className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg flex items-start gap-3 text-slate-200 text-sm">
                    <span className="w-6 h-6 bg-emerald-900/50 text-emerald-400 rounded font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why + Available / Needed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Why */}
            <div className="bg-[#121824] border border-slate-800 rounded-xl p-5">
              <h4 className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                WHY THIS ACTION IS REQUIRED
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">{response.why}</p>
            </div>

            {/* Next Check */}
            <div className="bg-[#121824] border border-slate-800 rounded-xl p-5">
              <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                NEXT REASSESSMENT POINT
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed font-mono">{response.next_check}</p>
            </div>
          </div>

          {/* Resources & Avoid Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* What you have */}
            <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                WHAT YOU HAVE
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {response.what_you_have.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What you may need */}
            <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                WHAT YOU MAY NEED
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {response.what_you_may_need.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoid */}
            <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-2 border-rose-950/40">
              <h4 className="text-xs font-mono uppercase tracking-widest text-rose-400 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4" />
                ACTIONS TO AVOID
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-200">
                {response.avoid.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sources Metadata */}
          {response.sources_used.length > 0 && (
            <div className="bg-[#121824] border border-slate-800 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-400 font-mono">
              <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
              <span>HANDBOOK SOURCES CONSULTED:</span>
              <div className="flex flex-wrap gap-2">
                {response.sources_used.map((src, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                    {src}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
