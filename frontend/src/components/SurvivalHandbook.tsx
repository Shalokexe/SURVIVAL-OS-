import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ShieldCheck, Tag } from 'lucide-react';

export const SurvivalHandbook: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchArticles();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge/search?query=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.map((d: any) => ({
          file_name: d.file_name || d.title,
          title: d.title,
          category: d.category,
          source: d.source,
          region: d.region,
          verified: d.verified,
          preview: d.content
        })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'water', 'food', 'first_aid', 'power', 'evacuation', 'general'];

  const filteredArticles = selectedCategory === 'ALL'
    ? articles
    : articles.filter(a => a.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-purple-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-lg font-bold font-heading uppercase text-white tracking-wide">
            OFFLINE SURVIVAL HANDBOOK
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Curated Emergency Guidance, Technical Protocols & Verifiable Source Metadata
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mt-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search handbook... (e.g. Water boiling time, Tourniquet MARCH, Solar panels)..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs font-mono rounded-lg flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>SEARCH</span>
          </button>
        </form>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase font-semibold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((art, idx) => (
          <div key={idx} className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold font-heading text-white text-lg">{art.title}</h3>
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold rounded uppercase">
                {art.category}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {art.preview}
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SOURCE: {art.source || 'Verified Protocol'}</span>
              </div>
              <span className="text-slate-500">{art.region || 'Global'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
