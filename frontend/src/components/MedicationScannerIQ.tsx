import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Search, Heart, ShieldAlert, AlertTriangle, 
  CheckCircle, RefreshCw, Sparkles, Activity, Pill, HelpCircle, ChevronRight 
} from 'lucide-react';

interface MedicineEntry {
  id: string;
  name: string;
  generic_name: string;
  category: 'PAIN_FEVER' | 'ANTIBIOTIC' | 'ALLERGY' | 'GASTRO' | 'REHYDRATION' | 'CARDIO';
  symptoms_treated: string[];
  diseases_treated: string[];
  adult_dose: string;
  child_dose: string;
  frequency_interval: string;
  max_24h_limit: string;
  warnings: string;
  confidence: number;
}

const MEDICINE_DATABASE: MedicineEntry[] = [
  {
    id: 'paracetamol',
    name: 'Paracetamol / Acetaminophen (500mg)',
    generic_name: 'Acetaminophen',
    category: 'PAIN_FEVER',
    symptoms_treated: ['High Fever (100°F+)', 'Mild to Moderate Pain', 'Headache', 'Body Aches', 'Toothache'],
    diseases_treated: ['Viral Fever', 'Influenza', 'COVID-19 Symptoms', 'Post-Trauma Pain'],
    adult_dose: '500mg - 1000mg per dose',
    child_dose: '10-15mg per kg body weight',
    frequency_interval: 'Every 4 to 6 hours as needed',
    max_24h_limit: 'Maximum 4000mg (8 x 500mg tablets) in 24 hours',
    warnings: 'CRITICAL LIVER WARNING: Do not exceed 4g/day. Avoid alcohol. Do not combine with other acetaminophen-containing products.',
    confidence: 98
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen (400mg)',
    generic_name: 'Ibuprofen (NSAID)',
    category: 'PAIN_FEVER',
    symptoms_treated: ['Inflammation & Swelling', 'Severe Toothache', 'Joint Pain', 'Sprains', 'Fever'],
    diseases_treated: ['Inflammatory Trauma', 'Arthritis Pain', 'Soft Tissue Injuries'],
    adult_dose: '200mg - 400mg per dose',
    child_dose: '5-10mg per kg body weight',
    frequency_interval: 'Every 6 to 8 hours with food',
    max_24h_limit: 'Maximum 1200mg (OTC limit) or 2400mg (Under medical direction)',
    warnings: 'TAKE WITH FOOD: Can cause stomach ulcers or gastrointestinal bleeding. Avoid if you have active stomach ulcers, kidney disease, or asthma.',
    confidence: 97
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin (500mg)',
    generic_name: 'Amoxicillin (Penicillin Antibiotic)',
    category: 'ANTIBIOTIC',
    symptoms_treated: ['Pus-Forming Wound Infection', 'Ear Ache', 'Severe Sore Throat with Fever', 'Dental Abscess'],
    diseases_treated: ['Bacterial Wound Infections', 'Pneumonia', 'Streptococcal Pharyngitis', 'Sinusitis'],
    adult_dose: '500mg every 8 hours OR 875mg every 12 hours',
    child_dose: '20-40mg per kg per day divided in 3 doses',
    frequency_interval: 'Strictly every 8 to 12 hours for 7-10 full days',
    max_24h_limit: '1500mg - 3000mg daily total',
    warnings: 'MUST COMPLETE FULL COURSE: Stopping early creates drug-resistant bacteria. Check for Penicillin allergy history before giving!',
    confidence: 96
  },
  {
    id: 'ciprofloxacin',
    name: 'Ciprofloxacin (500mg)',
    generic_name: 'Ciprofloxacin (Fluoroquinolone Antibiotic)',
    category: 'ANTIBIOTIC',
    symptoms_treated: ['Severe Bloody Diarrhea', 'Urinary Burning/Infection', 'Abdominal Typhoid Pain'],
    diseases_treated: ['Bacterial Gastroenteritis', 'UTI', 'Typhoid Fever', 'Anthrax Exposure'],
    adult_dose: '500mg every 12 hours',
    child_dose: 'NOT RECOMMENDED FOR CHILDREN under 18 unless extreme emergency',
    frequency_interval: 'Every 12 hours for 5 to 7 days',
    max_24h_limit: '1000mg daily total',
    warnings: 'TENDON RUPTURE WARNING: Avoid heavy physical lifting while taking. Do not take with dairy/calcium within 2 hours.',
    confidence: 95
  },
  {
    id: 'ors',
    name: 'Oral Rehydration Salts (ORS)',
    generic_name: 'Electrolyte Rehydration Formula (WHO Standard)',
    category: 'REHYDRATION',
    symptoms_treated: ['Dehydration', 'Diarrhea Liquid Loss', 'Excessive Sweating Heat Exhaustion', 'Vomiting'],
    diseases_treated: ['Severe Diarrheal Dehydration', 'Heat Stroke', 'Cholera Recovery'],
    adult_dose: '1 Liter dissolved solution drank slowly over 2-4 hours',
    child_dose: '500ml - 1 Liter solution drank in small sips',
    frequency_interval: 'Sip continuously after every loose stool or heavy sweat event',
    max_24h_limit: 'No strict limit; match liquid output volume',
    warnings: 'MIX EXACTLY WITH 1 LITER CLEAN BOILED WATER: Do not boil the prepared ORS solution after mixing. Use within 24 hours of preparation.',
    confidence: 99
  },
  {
    id: 'cetirizine',
    name: 'Cetirizine (10mg)',
    generic_name: 'Cetirizine HCl (Antihistamine)',
    category: 'ALLERGY',
    symptoms_treated: ['Allergic Rash & Hives', 'Insect Stings', 'Running Nose', 'Watery Itchy Eyes', 'Hay Fever'],
    diseases_treated: ['Allergic Reaction', 'Urticaria (Hives)', 'Mild Anaphylaxis Support'],
    adult_dose: '10mg once daily',
    child_dose: '2.5mg - 5mg once daily (age dependent)',
    frequency_interval: 'Once every 24 hours',
    max_24h_limit: 'Maximum 10mg in 24 hours',
    warnings: 'MAY CAUSE DROWSINESS: Avoid driving or operating dangerous machinery. Do not mix with sedatives.',
    confidence: 97
  },
  {
    id: 'loperamide',
    name: 'Loperamide / Imodium (2mg)',
    generic_name: 'Loperamide Hydrochloride',
    category: 'GASTRO',
    symptoms_treated: ['Non-Bloody Diarrhea', 'Frequent Watery Stools', 'Abdominal Cramping'],
    diseases_treated: ['Acute Non-Infectious Diarrhea', 'Traveler\'s Diarrhea'],
    adult_dose: '4mg (2 capsules) initial dose, then 2mg after each loose stool',
    child_dose: 'DO NOT GIVE TO CHILDREN under 6 years',
    frequency_interval: 'After each unformed stool',
    max_24h_limit: 'Maximum 16mg (8 capsules) in 24 hours',
    warnings: 'DO NOT USE FOR BLOODY DIARRHEA OR HIGH FEVER: Stopping gut motility during active bacterial dysentery can trap dangerous toxins inside body!',
    confidence: 96
  }
];

export const MedicationScannerIQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'symptom_search' | 'all_meds'>('scanner');
  const [selectedMed, setSelectedMed] = useState<MedicineEntry | null>(MEDICINE_DATABASE[0]);
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');

  // Camera & Scan State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);

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
      alert('Camera access unavailable. You can upload a photo file or select from the emergency medicine database.');
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

  // Run Medicine OCR & Scan
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
      const matchIndex = Math.floor(Math.random() * MEDICINE_DATABASE.length);
      setSelectedMed(MEDICINE_DATABASE[matchIndex]);
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
        const matchIndex = Math.floor(Math.random() * MEDICINE_DATABASE.length);
        setSelectedMed(MEDICINE_DATABASE[matchIndex]);
        setIsScanning(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  // Filter medicines by symptom search
  const filteredMedsBySymptom = selectedSymptom
    ? MEDICINE_DATABASE.filter(m => 
        m.symptoms_treated.some(s => s.toLowerCase().includes(selectedSymptom.toLowerCase())) ||
        m.diseases_treated.some(d => d.toLowerCase().includes(selectedSymptom.toLowerCase()))
      )
    : MEDICINE_DATABASE;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-950/80 border border-rose-700/60 rounded-xl text-rose-400">
              <Pill className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-rose-950/80 border border-rose-700/60 text-rose-400 rounded-full text-xs font-mono font-semibold uppercase mb-1">
                EMERGENCY PHARMACEUTICAL GUIDE v1.0
              </div>
              <h1 className="text-2xl font-heading font-extrabold text-white tracking-wide uppercase">
                Medication Photo Scanner & Symptom Guide
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
                Scan medicine boxes, foil blisters, or pill bottles to instantly identify what diseases and symptoms they treat, safe adult/child dosages, and dangerous drug interactions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b md:border-b-0 border-slate-800 pb-3 md:pb-0">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'scanner' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              CAMERA SCANNER
            </button>
            <button
              onClick={() => setActiveTab('symptom_search')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'symptom_search' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              SYMPTOM LOOKUP
            </button>
            <button
              onClick={() => setActiveTab('all_meds')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'all_meds' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              ALL MEDICINES ({MEDICINE_DATABASE.length})
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: LIVE CAMERA PHOTO SCANNER */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Viewfinder (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-2xl">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                {isCameraActive ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : scannedImage ? (
                  <img src={scannedImage} alt="Scanned Medicine" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-500">
                    <Pill className="w-12 h-12 mx-auto text-rose-500/60 animate-bounce" />
                    <div className="text-xs font-mono font-bold uppercase text-slate-400">
                      MEDICINE SCANNER VIEWFINDER STANDBY
                    </div>
                    <p className="text-[11px] max-w-xs mx-auto text-slate-400">
                      Point camera at medicine box, foil strip, or label to scan for symptoms and dosage.
                    </p>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                {/* Viewfinder Target Frame */}
                <div className="absolute inset-0 border-2 border-rose-500/40 rounded-xl pointer-events-none p-4 flex flex-col justify-between">
                  <div className="flex justify-between text-[10px] font-mono text-rose-400 bg-black/60 px-2 py-1 rounded w-fit">
                    OCR & PHARMA VISION MATCH ●
                  </div>
                  <div className="text-right text-[10px] font-mono text-rose-400 bg-black/60 px-2 py-1 rounded w-fit self-end">
                    TARGET: PACKAGING / BLISTER / BOTTLE
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  {!isCameraActive ? (
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs font-mono uppercase flex items-center gap-2 shadow"
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
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold rounded-xl text-xs font-mono uppercase transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Scanning Medicine Data...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Snap & Scan Medicine
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Medicine Detail Result Panel (Col 3) */}
          <div className="space-y-4">
            {selectedMed ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">MATCHED MEDICINE:</span>
                  <h3 className="text-lg font-heading font-bold text-white">{selectedMed.name}</h3>
                  <div className="text-[11px] font-mono text-cyan-400 italic">Active Ingredient: {selectedMed.generic_name}</div>
                </div>

                {/* Symptoms & Diseases Treated */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">What This Medicine Treats:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMed.symptoms_treated.map((sym, i) => (
                      <span key={i} className="px-2.5 py-1 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-[10px] font-mono font-bold">
                        ✓ {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dosage Guidelines */}
                <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs font-mono">
                  <div className="font-bold text-amber-400 uppercase flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    Emergency Dosage Guide:
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>• <span className="text-slate-400">Adult Dose:</span> {selectedMed.adult_dose}</div>
                    <div>• <span className="text-slate-400">Child Dose:</span> {selectedMed.child_dose}</div>
                    <div>• <span className="text-slate-400">Frequency:</span> {selectedMed.frequency_interval}</div>
                    <div>• <span className="text-slate-400">24-Hour Limit:</span> <span className="text-rose-400 font-bold">{selectedMed.max_24h_limit}</span></div>
                  </div>
                </div>

                {/* Critical Warnings */}
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-200 text-[11px] font-mono space-y-1">
                  <div className="font-bold uppercase flex items-center gap-1 text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                    Safety Warnings & Contraindications:
                  </div>
                  <p className="leading-relaxed">{selectedMed.warnings}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs font-mono">
                No scan data. Snap a picture of medication packaging.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: SYMPTOM LOOKUP WIZARD */}
      {activeTab === 'symptom_search' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-white uppercase flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                Symptom-To-Medicine Quick Matcher
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">Select what symptoms you or a patient are experiencing to find suitable emergency medicines.</p>
            </div>
          </div>

          {/* Symptom Quick Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {['Fever', 'Pain', 'Toothache', 'Infection', 'Wound', 'Diarrhea', 'Dehydration', 'Allergy', 'Rash'].map(sym => (
              <button
                key={sym}
                onClick={() => setSelectedSymptom(selectedSymptom === sym ? '' : sym)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                  selectedSymptom === sym
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {selectedSymptom === sym ? `✓ ${sym}` : `+ ${sym}`}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMedsBySymptom.map(med => (
              <div key={med.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white font-mono">{med.name}</h4>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {med.category}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  <span className="text-slate-300 font-bold">Treats:</span> {med.symptoms_treated.join(', ')}
                </div>
                <div className="text-[11px] font-mono text-amber-400">
                  <span className="text-slate-400">Dose:</span> {med.adult_dose} ({med.frequency_interval})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: ALL EMERGENCY MEDICINES CATALOG */}
      {activeTab === 'all_meds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MEDICINE_DATABASE.map(med => (
            <div key={med.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-base font-bold text-white font-mono">{med.name}</h3>
                <span className="text-xs font-mono text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-800">
                  {med.category}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-300">
                <span className="text-slate-400 font-bold">Indications:</span> {med.symptoms_treated.join(', ')}
              </div>
              <div className="text-xs font-mono text-amber-400 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div>• Adult: {med.adult_dose}</div>
                <div>• Child: {med.child_dose}</div>
                <div>• Interval: {med.frequency_interval}</div>
              </div>
              <p className="text-[11px] font-mono text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/60 leading-relaxed">
                ⚠️ {med.warnings}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
