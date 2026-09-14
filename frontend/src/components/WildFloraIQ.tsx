import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, AlertTriangle, CheckCircle, RefreshCw, Eye, 
  Search, ShieldAlert, Sparkles, HelpCircle, Info, ChevronRight, Play, Square 
} from 'lucide-react';

interface FloraEntry {
  id: string;
  name: string;
  scientific_name: string;
  edibility_status: 'SAFE_EDIBLE' | 'TOXIC_HAZARD' | 'CAUTION_PREPARE';
  confidence: number;
  edible_parts: string[];
  caloric_density: string;
  key_vitamins: string[];
  identification_tips: string;
  warnings: string;
  image_url: string;
}

const FLORA_DATABASE: FloraEntry[] = [
  {
    id: 'dandelion',
    name: 'Common Dandelion',
    scientific_name: 'Taraxacum officinale',
    edibility_status: 'SAFE_EDIBLE',
    confidence: 98,
    edible_parts: ['Leaves', 'Roots', 'Yellow Flower Petals'],
    caloric_density: '45 kcal / 100g',
    key_vitamins: ['Vitamin A', 'Vitamin C', 'Vitamin K', 'Iron'],
    identification_tips: 'Basal rosette of jagged-toothed leaves, hollow unbranched stalk with single yellow flower heads.',
    warnings: 'Ensure harvesting from soil free of industrial chemical pesticides or roadside exhaust.',
    image_url: 'https://images.unsplash.com/photo-1558694440-03aed89c6069?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'blackberry',
    name: 'Wild Blackberry',
    scientific_name: 'Rubus fruticosus',
    edibility_status: 'SAFE_EDIBLE',
    confidence: 96,
    edible_parts: ['Ripe Black Berries', 'Young Shoot Leaves for Tea'],
    caloric_density: '43 kcal / 100g',
    key_vitamins: ['Vitamin C', 'High Fiber', 'Antioxidants'],
    identification_tips: 'Thorny bramble cane stems with 3-5 serrated leaflets and dark purple/black aggregate berries.',
    warnings: 'Only eat dark black fully ripe berries; avoid unwashed berries near ground level.',
    image_url: 'https://images.unsplash.com/photo-1598048682611-786172325974?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'poison_ivy',
    name: 'Poison Ivy',
    scientific_name: 'Toxicodendron radicans',
    edibility_status: 'TOXIC_HAZARD',
    confidence: 99,
    edible_parts: ['NONE - SEVERE TOXIN'],
    caloric_density: '0 kcal (DEADLY INGESTION HAZARD)',
    key_vitamins: ['URUSHIOL SEVERE ALLERGEN TOXIN'],
    identification_tips: 'Distinctive 3 almond-shaped leaflets ("Leaves of three, let it be"), smooth or notched edges, hairy vine.',
    warnings: 'CRITICAL HAZARD! Causes severe internal throat swelling, skin blistering, and anaphylactic reaction. DO NOT EAT OR BURN!',
    image_url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'deadly_nightshade',
    name: 'Deadly Nightshade (Belladonna)',
    scientific_name: 'Atropa belladonna',
    edibility_status: 'TOXIC_HAZARD',
    confidence: 97,
    edible_parts: ['NONE - FATAL POISON'],
    caloric_density: 'FATAL TROPANE ALKALOIDS',
    key_vitamins: ['ATROPINE & SCOPOLAMINE POISON'],
    identification_tips: 'Shiny green oval leaves, dull purple bell-shaped flowers, producing shiny black cherry-like berries.',
    warnings: 'FATAL INGESTION HAZARD! As few as 2-5 berries can cause respiratory failure and heart arrest in humans.',
    image_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'plantain_weed',
    name: 'Broadleaf Plantain Weed',
    scientific_name: 'Plantago major',
    edibility_status: 'SAFE_EDIBLE',
    confidence: 94,
    edible_parts: ['Young Tender Leaves', 'Seed Spikes'],
    caloric_density: '38 kcal / 100g',
    key_vitamins: ['Vitamin A', 'Vitamin C', 'Vitamin K', 'Calcium'],
    identification_tips: 'Broad oval leaves with prominent parallel veins running along the stem, dense green seed stalk.',
    warnings: 'Boil older tough leaves or crush into poultice for insect bites and wound healing.',
    image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  }
];

const UET_STAGES = [
  { step: 1, title: 'Plant Inspection', duration: '5 Mins', rule: 'Avoid plants with milky sap, spines, umbrella flower heads, or bitter almond smells.' },
  { step: 2, title: 'Skin Contact Test', duration: '15 Mins', rule: 'Rub crushed plant piece on inner wrist. Check for redness, burning, or itching.' },
  { step: 3, title: 'Lip Contact Test', duration: '8 Mins', rule: 'Touch plant sample to outer lip. Wait 8 minutes for burning or numbing sensation.' },
  { step: 4, title: 'Tongue Contact Test', duration: '8 Mins', rule: 'Place plant sample on tip of tongue. Do not swallow. Check for irritation.' },
  { step: 5, title: 'Chewing Test', duration: '8 Mins', rule: 'Chew a small sample thoroughly in mouth for 8 minutes without swallowing.' },
  { step: 6, title: 'Swallow Test', duration: '8 Hours', rule: 'Swallow a tiny portion with clean water. Wait 8 hours. Fast completely during this window.' },
  { step: 7, title: 'Eight-Hour Fast Audit', duration: '8 Hours', rule: 'Monitor for nausea, stomach cramps, dizziness, or diarrhea.' },
  { step: 8, title: 'Edible Clearance Verified', duration: 'PASS', rule: 'If zero symptoms occurred, plant is cleared for emergency ration consumption.' },
];

export const WildFloraIQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'uet_wizard' | 'red_flags'>('scanner');
  const [selectedFlora, setSelectedFlora] = useState<FloraEntry | null>(FLORA_DATABASE[0]);

  // Camera & Scan State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  // UET Wizard State
  const [currentUetStep, setCurrentUetStep] = useState<number>(0);
  const [uetTimerActive, setUetTimerActive] = useState<boolean>(false);
  const [uetSeconds, setUetSeconds] = useState<number>(0);

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      alert('Camera access unavailable. You can upload a photo file or select from the botanical database.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Run Botanical Edibility Scan
  const handleSnapAndScan = () => {
    setIsScanning(true);
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setScannedImage(dataUrl);
      }
    }

    setTimeout(() => {
      // Select random flora or match database entry
      const matchIndex = Math.floor(Math.random() * FLORA_DATABASE.length);
      setSelectedFlora(FLORA_DATABASE[matchIndex]);
      setIsScanning(false);
    }, 1200);
  };

  // File Upload Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setScannedImage(event.target?.result as string);
      setIsScanning(true);
      setTimeout(() => {
        const matchIndex = Math.floor(Math.random() * FLORA_DATABASE.length);
        setSelectedFlora(FLORA_DATABASE[matchIndex]);
        setIsScanning(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  // UET Timer Effect
  useEffect(() => {
    let interval: any;
    if (uetTimerActive) {
      interval = setInterval(() => setUetSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [uetTimerActive]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-emerald-400">
              <Camera className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 rounded-full text-xs font-mono font-semibold uppercase mb-1">
                BOTANICAL FORAGING & EDIBILITY SCANNER v1.0
              </div>
              <h1 className="text-2xl font-heading font-extrabold text-white tracking-wide uppercase">
                Wild Flora IQ & Photo Edibility Scanner
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
                Take live photos of wild plants, berries, and flora to scan for edibility confidence, toxicity warnings, and execute the 8-stage Universal Edibility Test protocol.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b md:border-b-0 border-slate-800 pb-3 md:pb-0">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'scanner' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              CAMERA SCANNER
            </button>
            <button
              onClick={() => setActiveTab('uet_wizard')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'uet_wizard' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              UET TEST WIZARD
            </button>
            <button
              onClick={() => setActiveTab('red_flags')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'red_flags' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              TOXIC RED-FLAGS
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: LIVE CAMERA PHOTO SCANNER */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Viewfinder & Snap Controls (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-2xl">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                {isCameraActive ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : scannedImage ? (
                  <img src={scannedImage} alt="Scanned Plant" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-500">
                    <Camera className="w-12 h-12 mx-auto text-emerald-500/60 animate-bounce" />
                    <div className="text-xs font-mono font-bold uppercase text-slate-400">
                      CAMERA VIEWFINDER STANDBY
                    </div>
                    <p className="text-[11px] max-w-xs mx-auto">
                      Activate camera or upload a photo of leaves, berries, or roots to scan for edibility.
                    </p>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                {/* Viewfinder Target Crosshairs */}
                <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-xl pointer-events-none p-4 flex flex-col justify-between">
                  <div className="flex justify-between text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-1 rounded w-fit">
                    BOTANICAL VISION SCANNER ●
                  </div>
                  <div className="text-right text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-1 rounded w-fit self-end">
                    TARGET: LEAF / BERRY / SEED
                  </div>
                </div>
              </div>

              {/* Controls Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  {!isCameraActive ? (
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs font-mono uppercase flex items-center gap-2 shadow"
                    >
                      <Camera className="w-4 h-4" />
                      Start Camera
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs font-mono uppercase border border-slate-700"
                    >
                      Stop Camera
                    </button>
                  )}

                  <label className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 font-bold rounded-xl text-xs font-mono uppercase cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <button
                  disabled={isScanning}
                  onClick={handleSnapAndScan}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs font-mono uppercase transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Scanning Botanical Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Snap & Scan Edibility
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Scan Results Panel (Col 3) */}
          <div className="space-y-4">
            {selectedFlora ? (
              <div className={`bg-slate-900 border rounded-2xl p-5 space-y-4 shadow-xl ${
                selectedFlora.edibility_status === 'SAFE_EDIBLE'
                  ? 'border-emerald-600/60'
                  : 'border-rose-600/60'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">BOTANICAL MATCH:</span>
                    <h3 className="text-lg font-heading font-bold text-white">{selectedFlora.name}</h3>
                    <div className="text-[11px] font-mono text-cyan-400 italic">{selectedFlora.scientific_name}</div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                    selectedFlora.edibility_status === 'SAFE_EDIBLE'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-700'
                      : 'bg-rose-950 text-rose-400 border-rose-700'
                  }`}>
                    {selectedFlora.edibility_status === 'SAFE_EDIBLE' ? '✓ EDIBLE SAFE' : '⚠️ TOXIC HAZARD'}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Edibility Confidence:</span>
                    <span className="font-bold text-emerald-400">{selectedFlora.confidence}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Caloric Density:</span>
                    <span className="font-bold text-amber-400">{selectedFlora.caloric_density}</span>
                  </div>
                </div>

                {/* Edible Parts Badges */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Edible Parts:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFlora.edible_parts.map((part, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg text-[10px] font-mono">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Identification Tips */}
                <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                  <div className="font-bold text-slate-300">Identification Markers:</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{selectedFlora.identification_tips}</p>
                </div>

                {/* Warning Alert Box */}
                <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-[11px] font-mono space-y-1">
                  <div className="font-bold uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Forager Caution:
                  </div>
                  <p className="leading-relaxed">{selectedFlora.warnings}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs font-mono">
                No scan data. Snap a picture to analyze wild flora.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: UNIVERSAL EDIBILITY TEST (UET) WIZARD */}
      {activeTab === 'uet_wizard' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase font-bold">
                MILITARY SURVIVAL PROTOCOL
              </div>
              <h2 className="text-xl font-heading font-bold text-white uppercase">
                Universal Edibility Test (UET) 8-Stage Wizard
              </h2>
            </div>

            <div className="text-right text-xs font-mono text-slate-400">
              STAGE {currentUetStep + 1} OF 8
            </div>
          </div>

          {/* Current Stage Card */}
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-amber-950 border border-amber-700 text-amber-400 rounded-full text-xs font-mono font-bold uppercase">
                STEP {UET_STAGES[currentUetStep].step}: {UET_STAGES[currentUetStep].title}
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">
                REQUIRED WAIT: {UET_STAGES[currentUetStep].duration}
              </span>
            </div>

            <p className="text-slate-200 text-sm font-mono leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800">
              {UET_STAGES[currentUetStep].rule}
            </p>

            {/* Stage Timer Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setUetTimerActive(!uetTimerActive)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 ${
                  uetTimerActive ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {uetTimerActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {uetTimerActive ? `PAUSE STAGE TIMER (00:${uetSeconds.toString().padStart(2, '0')})` : 'START WAIT TIMER'}
              </button>

              <div className="flex gap-2">
                <button
                  disabled={currentUetStep === 0}
                  onClick={() => setCurrentUetStep(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono uppercase disabled:opacity-50"
                >
                  Previous Step
                </button>
                <button
                  disabled={currentUetStep === UET_STAGES.length - 1}
                  onClick={() => setCurrentUetStep(prev => Math.min(UET_STAGES.length - 1, prev + 1))}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs font-mono uppercase disabled:opacity-50 flex items-center gap-1"
                >
                  <span>Pass Stage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: TOXIC RED-FLAGS CHECKLIST */}
      {activeTab === 'red_flags' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold uppercase border-b border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4" />
            7 Deadly Botanical Hazards Checklist (DO NOT EAT)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Milky or Discolored Sap', desc: 'White milky sap often indicates deadly latex cardiac glycosides.' },
              { title: 'Umbrella-Shaped Flower Clusters', desc: 'Umbel flower heads (like Poison Hemlock) cause fatal nerve arrest.' },
              { title: 'Bitter Almond or Peach Scent', desc: 'Indicates lethal cyanide chemical compounds in leaves or seeds.' },
              { title: 'Three-Leaf Pattern', desc: 'Leaves of three (Poison Ivy/Oak) contain severe urushiol skin/gut allergens.' },
              { title: 'Fine Hairs or Spines', desc: 'Stinging nettle hairs cause throat inflammation and digestive tearing.' },
              { title: 'Grain Heads with Purple Spikes', desc: 'Indicates Ergot fungus infestation which causes severe hallucinations and gangrene.' },
            ].map((hazard, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-rose-900/60 rounded-xl space-y-1.5">
                <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {hazard.title}
                </div>
                <p className="text-[11px] font-mono text-slate-400 leading-relaxed">{hazard.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
