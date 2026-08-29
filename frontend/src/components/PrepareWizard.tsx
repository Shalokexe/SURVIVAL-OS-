import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Download, RefreshCw, Layers } from 'lucide-react';

interface PrepareWizardProps {
  onComplete: () => void;
}

export const PrepareWizard: React.FC<PrepareWizardProps> = ({ onComplete }) => {
  const [auditing, setAuditing] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);

  const runAudit = async () => {
    setAuditing(true);
    try {
      const res = await fetch('/api/knowledge/prepare_offline', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAuditData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-white uppercase">
              PREPARE FOR OFFLINE WIZARD & AUDIT
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Verify local model, database, RAG index, and offline maps before disaster strikes.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-2">
          <div className="font-bold text-white uppercase">PHILOSOPHY AUDIT CHECKLIST:</div>
          <p>
            When network connectivity is lost, Apocalypse AI operates 100% locally. 
            Run the audit below to test local systems readiness.
          </p>
        </div>

        <button
          onClick={runAudit}
          disabled={auditing}
          className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-950/50"
        >
          {auditing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          <span>RUN FULL OFFLINE READINESS AUDIT</span>
        </button>

        {auditData && (
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg">
              <span className="font-bold text-emerald-400 text-sm font-mono">{auditData.overall_readiness}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="space-y-2">
              {auditData.audits?.map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-white">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.details}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold rounded">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
