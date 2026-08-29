import React, { useState } from 'react';
import { Package, Plus, Trash2, Search, HelpCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { InventoryItem, InventoryAlerts } from '../types';

interface InventoryManagerProps {
  items: InventoryItem[];
  onAddItem: (item: Partial<InventoryItem>) => Promise<void>;
  onDeleteItem: (id: number) => Promise<void>;
  onFindSubstitute: (item: string) => Promise<any>;
  alerts: InventoryAlerts | null;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  items,
  onAddItem,
  onDeleteItem,
  onFindSubstitute,
  alerts
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [substituteQuery, setSubstituteQuery] = useState('');
  const [substituteResult, setSubstituteResult] = useState<any>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('water');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('Liters');
  const [locationNote, setLocationNote] = useState('Shelter Pantry');
  const [expirationDate, setExpirationDate] = useState('');

  const categories = ['ALL', 'water', 'food', 'medical', 'power', 'tools', 'sanitation', 'shelter'];

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter(i => i.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddItem({
      name,
      category,
      quantity: Number(quantity),
      unit,
      location_note: locationNote,
      is_essential: true
      , expiration_date: expirationDate || undefined
    });
    setShowAddModal(false);
    setName('');
    setExpirationDate('');
  };

  const handleSubstituteSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!substituteQuery.trim()) return;
    const res = await onFindSubstitute(substituteQuery);
    setSubstituteResult(res);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400">
            <Package className="w-5 h-5" />
            <h2 className="text-lg font-bold font-heading uppercase text-white tracking-wide">
              MY SHELTER INVENTORY
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Resource Management, Quantity Tracking & Improvised Tool Substitutions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-amber-950/50"
        >
          <Plus className="w-4 h-4" />
          <span>ADD RESOURCE</span>
        </button>
      </div>

      {alerts && alerts.alerts.length > 0 && (
        <div className="bg-[#121824] border border-rose-900/40 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-rose-300 font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              SUPPLY ALERTS
            </h3>
            <span className="text-[10px] font-mono text-slate-500">NEXT 30 DAYS</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-2"><strong className="block text-lg text-rose-300">{alerts.expired_count}</strong><span className="text-[10px] text-slate-400 uppercase">Expired</span></div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2"><strong className="block text-lg text-amber-300">{alerts.expiring_soon_count}</strong><span className="text-[10px] text-slate-400 uppercase">Expiring</span></div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2"><strong className="block text-lg text-cyan-300">{alerts.shortage_count}</strong><span className="text-[10px] text-slate-400 uppercase">Shortages</span></div>
          </div>
          <ul className="space-y-1.5">
            {alerts.alerts.slice(0, 6).map((alert, index) => (
              <li key={`${alert.type}-${alert.item_id || index}`} className="text-xs text-slate-300 flex items-start gap-2">
                <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${alert.severity === 'critical' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                {alert.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Substitution Engine Box */}
      <div className="bg-[#121824] border border-amber-900/30 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          RESOURCE SUBSTITUTION ENGINE ("I DON'T HAVE X")
        </h3>
        <form onSubmit={handleSubstituteSearch} className="flex gap-2">
          <input
            type="text"
            value={substituteQuery}
            onChange={(e) => setSubstituteQuery(e.target.value)}
            placeholder="Type missing resource (e.g. Flashlight, Water Filter, Stove, First Aid Kit)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs font-mono rounded-lg flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>FIND ALTERNATIVE</span>
          </button>
        </form>

        {substituteResult && (
          <div className="p-4 bg-slate-900/80 border border-amber-500/30 rounded-lg space-y-2 mt-3 text-xs">
            <div className="font-bold text-amber-300 uppercase">
              SAFE ALTERNATIVES FOR: {substituteResult.missing_item}
            </div>
            <ul className="space-y-1 text-slate-200">
              {substituteResult.alternatives?.map((alt: string, i: number) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
            <div className="text-[11px] text-rose-400 font-mono pt-1">
              ⚠️ {substituteResult.safety_warning}
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-semibold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Item List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredItems.map(item => (
          <div key={item.id} className="p-4 bg-[#121824] border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between group transition-all">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
                {item.category}
              </span>
              <h4 className="font-bold text-sm text-white pt-1">{item.name}</h4>
              <p className="text-xs text-slate-400">{item.location_note || 'Shelter Pantry'}</p>
            </div>

            <div className="text-right flex items-center gap-3">
              <div>
                <div className="text-lg font-bold font-mono text-white">{item.quantity}</div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">{item.unit}</div>
              </div>

              {item.id && (
                <button
                  onClick={() => onDeleteItem(item.id!)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-heading">ADD INVENTORY ITEM</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">ITEM NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Canned Beans / Flashlight Batteries"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  >
                    <option value="water">Water</option>
                    <option value="food">Food</option>
                    <option value="medical">Medical</option>
                    <option value="power">Power</option>
                    <option value="tools">Tools</option>
                    <option value="sanitation">Sanitation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">QUANTITY</label>
                  <input
                    type="number"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">EXPIRATION DATE</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">UNIT</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Liters / kg / pcs / cans"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">LOCATION NOTE</label>
                  <input
                    type="text"
                    value={locationNote}
                    onChange={(e) => setLocationNote(e.target.value)}
                    placeholder="Pantry Shelf / Bug-out Bag"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 text-sm font-semibold rounded-lg"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg"
                >
                  SAVE ITEM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
