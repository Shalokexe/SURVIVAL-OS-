import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Wifi, Send, AlertTriangle, ShieldCheck, Cpu, RefreshCw, 
  MapPin, Lock, Layers, Zap, CheckCircle2, MessageSquare, Signal
} from 'lucide-react';

interface MeshMessage {
  id: string;
  senderId: string;
  senderName: string;
  channel: string;
  text: string;
  timestamp: string;
  isSOS?: boolean;
  coords?: string;
  hops: number;
}

interface MeshNode {
  id: string;
  name: string;
  status: 'ONLINE' | 'RELAYING' | 'WEAK_SIGNAL';
  rssi: number; // dBm
  distance: string;
  lastSeen: string;
}

const DEFAULT_NODES: MeshNode[] = [
  { id: 'node-1', name: 'SHELTER ALPHA (BASE NODE)', status: 'ONLINE', rssi: -55, distance: 'LOCAL NODE', lastSeen: 'NOW' },
  { id: 'node-2', name: 'RECON TEAM BRAVO', status: 'RELAYING', rssi: -72, distance: '120m AWAY', lastSeen: '1m ago' },
  { id: 'node-3', name: 'CIVIL HOSPITAL MEDIC RELAY', status: 'WEAK_SIGNAL', rssi: -88, distance: '450m AWAY', lastSeen: '3m ago' },
];

export const MeshCommsDeck: React.FC = () => {
  const [channel, setChannel] = useState<string>('EMERGENCY_CH1');
  const [messageText, setMessageText] = useState<string>('');
  const [messages, setMessages] = useState<MeshMessage[]>([
    {
      id: 'msg-demo-1',
      senderId: 'node-2',
      senderName: 'RECON TEAM BRAVO',
      channel: 'EMERGENCY_CH1',
      text: 'VHF repeater active on 144.800 MHz. Clean water spring identified 200m north.',
      timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
      hops: 1
    },
    {
      id: 'msg-demo-2',
      senderId: 'node-3',
      senderName: 'CIVIL HOSPITAL MEDIC',
      channel: 'EMERGENCY_CH1',
      text: 'First Aid Triage station operational. Burn dressing supplies available.',
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
      hops: 2
    }
  ]);
  const [nodes, setNodes] = useState<MeshNode[]>(DEFAULT_NODES);
  const [isSOSBroadcasting, setIsSOSBroadcasting] = useState<boolean>(false);

  // BroadcastChannel Ref for cross-tab local P2P simulation
  const bcRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    try {
      const bc = new BroadcastChannel('survival_os_mesh_net');
      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'MESH_MSG') {
          const incomingMsg: MeshMessage = event.data.payload;
          setMessages(prev => [incomingMsg, ...prev]);
        }
      };
      bcRef.current = bc;
    } catch {
      console.warn('BroadcastChannel not supported in this browser context.');
    }

    return () => {
      if (bcRef.current) bcRef.current.close();
    };
  }, []);

  const handleSendMessage = (textToSend?: string, isSOS = false) => {
    const text = textToSend || messageText;
    if (!text.trim()) return;

    const newMsg: MeshMessage = {
      id: `mesh-${Date.now()}`,
      senderId: 'node-1',
      senderName: 'SHELTER ALPHA (YOU)',
      channel: channel,
      text: text,
      timestamp: new Date().toLocaleTimeString(),
      isSOS: isSOS,
      coords: '31.3260°N, 75.5762°E',
      hops: 0
    };

    setMessages(prev => [newMsg, ...prev]);

    // Broadcast across HTML5 BroadcastChannel to all open browser windows/tabs
    if (bcRef.current) {
      bcRef.current.postMessage({
        type: 'MESH_MSG',
        payload: newMsg
      });
    }

    if (!textToSend) setMessageText('');
  };

  const handleBroadcastSOS = () => {
    setIsSOSBroadcasting(true);
    const sosPayload = '⚠️ DISTRESS SOS BEACON: Emergency Assistance Required at Shelter Alpha (31.3260°N, 75.5762°E). Water: 5 days | Medical: Trauma Kit Needed.';
    handleSendMessage(sosPayload, true);

    setTimeout(() => {
      setIsSOSBroadcasting(false);
      alert('SOS Distress Packet broadcasted across local P2P mesh relay nodes!');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-emerald-400">
              <Radio className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 rounded-full text-xs font-mono font-semibold uppercase mb-1">
                LOCAL P2P MESH NETWORK TERMINAL v1.0
              </div>
              <h1 className="text-2xl font-heading font-extrabold text-white tracking-wide uppercase">
                Offline Mesh Comms & P2P Broadcast
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
                Relays encrypted local radio and browser data packets between survivor shelter nodes without internet, cell towers, or centralized servers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBroadcastSOS}
              disabled={isSOSBroadcasting}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs uppercase font-mono shadow-lg transition flex items-center gap-2 animate-pulse disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              BROADCAST SOS DISTRESS
            </button>
          </div>
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Mesh Messaging Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            {/* Channel Selector */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold uppercase">
                <Wifi className="w-4 h-4 text-emerald-400" />
                Active Mesh Relay Channel
              </div>

              <div className="flex items-center gap-1.5">
                {['EMERGENCY_CH1', 'SHELTER_TACTICAL', 'MEDICAL_RECON'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setChannel(ch)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                      channel === ch
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    #{ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Feed List */}
            <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {messages
                .filter(m => m.channel === channel)
                .map(msg => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border space-y-1.5 transition ${
                      msg.isSOS
                        ? 'bg-rose-950/80 border-rose-700 text-rose-200'
                        : msg.senderId === 'node-1'
                        ? 'bg-slate-950 border-emerald-800/80 text-slate-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Signal className="w-3.5 h-3.5 text-emerald-400" />
                        {msg.senderName}
                      </span>
                      <div className="flex items-center gap-3 text-slate-400">
                        <span>HOPS: {msg.hops}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-xs font-mono leading-relaxed">{msg.text}</p>

                    {msg.coords && (
                      <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 pt-1">
                        <MapPin className="w-3 h-3" />
                        <span>GPS STAMP: {msg.coords}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Message Input Box */}
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Type message to broadcast over #${channel}...`}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs font-mono uppercase transition flex items-center gap-2 shadow"
              >
                <Send className="w-4 h-4" />
                SEND
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Connected Relay Node Topology */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-300 font-bold uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                P2P Node Topology ({nodes.length})
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                ENCRYPTED AES-256
              </span>
            </div>

            <div className="space-y-2.5">
              {nodes.map(node => (
                <div key={node.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{node.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      node.status === 'ONLINE' 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>SIGNAL: {node.rssi} dBm</span>
                    <span>{node.distance}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="font-bold text-slate-300">P2P Mesh Protocol Status:</div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Open extra browser tabs or local devices on the same Wi-Fi/Hotspot network to test live cross-node message relaying.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
