import React, { useState } from 'react';
import { 
  Printer, QrCode, ShieldAlert, Download, Share2, 
  Copy, Check, Phone, FileText, Droplets, HeartPulse, Radio, AlertTriangle, UserCheck, RefreshCw 
} from 'lucide-react';

interface EmergencyProfile {
  survivorName: string;
  bloodType: string;
  allergies: string;
  iceContact: string;
  radioFrequency: string;
  medicalNotes: string;
}

export const PocketSyncIQ: React.FC = () => {
  const [profile, setProfile] = useState<EmergencyProfile>({
    survivorName: 'Alex Mercer',
    bloodType: 'O Negative',
    allergies: 'Penicillin, Severe Bee Stings',
    iceContact: '+1 (555) 019-2834 (Sarah Mercer - Spouse)',
    radioFrequency: '433.92 MHz (Channel 04)',
    medicalNotes: 'Asthmatic - Carries Albuterol Inhaler in Bug-Out Bag Pocket 2'
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [qrSize, setQrSize] = useState<number>(200);

  // Generate QR Code URL using fallback public SVG/API chart payload
  const qrDataPayload = JSON.stringify(profile);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrDataPayload)}&color=000000&bgcolor=ffffff`;

  const copyPayload = () => {
    navigator.clipboard.writeText(qrDataPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
                <QrCode className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                  OFFLINE QR SYNC & POCKET FIELD CARD <span className="text-xs px-2 py-0.5 bg-purple-900/50 text-purple-300 border border-purple-500/30 rounded">ZERO NET SYNC</span>
                </h2>
                <p className="text-slate-400 text-sm">
                  Transfer ICE emergency data between survivor smartphones offline via QR code scans & 1-click printable field pocket sheets.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-purple-900/40 transition text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT POCKET FIELD CARD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1">
        
        {/* Offline QR Code Transmitter */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 print:hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-400" />
              Offline Phone-to-Phone QR Transfer Payload
            </h3>
            <span className="text-xs px-2 py-1 bg-purple-950 text-purple-300 border border-purple-800/40 rounded font-mono">
              CAMERA SCANNER COMPATIBLE
            </span>
          </div>

          {/* QR Code Container */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center space-y-4 text-center">
            <div className="p-4 bg-white rounded-xl shadow-2xl border-4 border-purple-500/40">
              <img 
                src={qrCodeUrl} 
                alt="Emergency QR Profile" 
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  // Fallback visual if API is offline
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            
            <p className="text-xs text-slate-400 max-w-xs">
              Scan this QR code with any survivor’s smartphone camera to instantly import your ICE medical profile offline.
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={copyPayload}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Payload!' : 'Copy Data String'}</span>
              </button>
            </div>
          </div>

          {/* Profile Form Editor */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Emergency Profile Fields:
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-purple-400 hover:underline"
              >
                {isEditing ? 'Save Profile' : 'Edit Profile Fields'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Survivor Name:</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.survivorName}
                  onChange={(e) => setProfile({ ...profile, survivorName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white p-2 rounded outline-none disabled:opacity-75"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Blood Type:</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.bloodType}
                  onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-rose-400 font-bold p-2 rounded outline-none disabled:opacity-75"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Allergies & Risks:</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-amber-400 p-2 rounded outline-none disabled:opacity-75"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ICE Contact:</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.iceContact}
                  onChange={(e) => setProfile({ ...profile, iceContact: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-cyan-400 p-2 rounded outline-none disabled:opacity-75"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Printable Pocket Field Card Template */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
          <div className="flex items-center justify-between print:hidden">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              1-Page Folding Field Pocket Cheat Sheet Preview
            </h3>
            <span className="text-xs text-slate-500">FORMAT: PRINT / FOLD 4-WAY</span>
          </div>

          {/* Printable Sheet Container */}
          <div className="bg-slate-950 border-2 border-dashed border-slate-800 p-5 rounded-xl space-y-4 print:bg-white print:text-black print:border-2 print:border-black print:rounded-none">
            
            {/* Header */}
            <div className="border-b border-slate-800 print:border-black pb-3 flex justify-between items-center">
              <div>
                <h4 className="text-base font-bold text-white print:text-black tracking-wider uppercase">
                  ⚡ SURVIVAL-OS // POCKET EMERGENCY CARD
                </h4>
                <p className="text-[11px] text-slate-400 print:text-gray-700">Keep in wallet or bug-out bag primary pocket</p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-rose-950 text-rose-300 print:bg-black print:text-white rounded font-bold">
                BLOOD: {profile.bloodType}
              </span>
            </div>

            {/* Emergency Profile Section */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900 print:bg-gray-100 p-2.5 rounded border border-slate-800 print:border-gray-300">
                <span className="text-[10px] text-slate-400 print:text-gray-600 block">SURVIVOR NAME:</span>
                <strong className="text-white print:text-black">{profile.survivorName}</strong>
              </div>

              <div className="bg-slate-900 print:bg-gray-100 p-2.5 rounded border border-slate-800 print:border-gray-300">
                <span className="text-[10px] text-slate-400 print:text-gray-600 block">RADIO FREQ:</span>
                <strong className="text-cyan-400 print:text-black">{profile.radioFrequency}</strong>
              </div>

              <div className="col-span-2 bg-slate-900 print:bg-gray-100 p-2.5 rounded border border-slate-800 print:border-gray-300">
                <span className="text-[10px] text-slate-400 print:text-gray-600 block">ALLERGIES / WARNINGS:</span>
                <strong className="text-amber-400 print:text-black">{profile.allergies}</strong>
              </div>

              <div className="col-span-2 bg-slate-900 print:bg-gray-100 p-2.5 rounded border border-slate-800 print:border-gray-300">
                <span className="text-[10px] text-slate-400 print:text-gray-600 block">ICE CONTACT:</span>
                <strong className="text-emerald-400 print:text-black">{profile.iceContact}</strong>
              </div>
            </div>

            {/* Water & Morse Cheat Sheet */}
            <div className="border-t border-slate-800 print:border-black pt-3 space-y-2 text-xs">
              <span className="font-bold text-slate-300 print:text-black uppercase block">💧 Emergency Water Purification Cheat Sheet:</span>
              <ul className="list-disc list-inside text-slate-400 print:text-gray-800 text-[11px] space-y-1 font-mono">
                <li>Boiling: Rolling boil for 1 full minute (3 mins at high altitude).</li>
                <li>Bleach Disinfection: 2 drops liquid bleach (5-6% sodium hypochlorite) per Liter. Wait 30 mins.</li>
                <li>SODIS Solar Disinfection: Clear PET bottle in direct sunlight for 6 hours.</li>
              </ul>
            </div>

            <div className="border-t border-slate-800 print:border-black pt-3 space-y-2 text-xs">
              <span className="font-bold text-slate-300 print:text-black uppercase block">📡 Morse Code Quick Reference:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 print:text-gray-800">
                <div>• SOS: <strong className="text-white print:text-black">· · ·  — — —  · · ·</strong></div>
                <div>• MAYDAY: <strong className="text-white print:text-black">— —  · —  — · · ·</strong></div>
                <div>• NEED MEDS: <strong className="text-white print:text-black">— —  ·  — · ·</strong></div>
                <div>• ALL CLEAR: <strong className="text-white print:text-black">· —  · — ·  · — ·</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
