import React, { useState } from "react";
import { Search, Sparkles, AlertCircle, CheckCircle2, ChevronRight, CornerDownRight, ThumbsUp, DollarSign } from "lucide-react";
import { SearchedSubscription } from "../types";

interface AlternativeParityProps {
  onSearchCustom: (name: string) => Promise<SearchedSubscription | null>;
}

// Preset matrices
const SAMPLE_COMPARISONS = {
  Streaming: {
    premium: { name: "Netflix Premium", cost: "$22.99/mo", ads: "None", quality: "4K UHD", offline: "Yes", library: "Huge original catalog" },
    alternatives: [
      { name: "Tubi TV", cost: "Free", ads: "Yes", quality: "1080p HD", offline: "No", library: "Classic films, live TV channels" },
      { name: "Netflix Standard with Ads", cost: "$6.99/mo", ads: "Light", quality: "1080p HD", offline: "Yes", library: "95% of full catalog" },
      { name: "Pluto TV", cost: "Free", ads: "Yes", quality: "720p HD", offline: "No", library: "Over 250 curated channels" }
    ]
  },
  Music: {
    premium: { name: "Spotify Premium", cost: "$14.99/mo", ads: "None", quality: "320kbps High Quality", offline: "Yes (Unlimited)", library: "100M+ tracks, podcasts" },
    alternatives: [
      { name: "Spotify Free", cost: "Free", ads: "Yes (Frequent)", quality: "160kbps Standard", offline: "No", library: "100M+ (Shuffle mode only)" },
      { name: "YouTube Music (Free)", cost: "Free", ads: "Yes", quality: "128kbps Standard", offline: "No", library: "Unrivaled music video catalog" },
      { name: "Amazon Music Free", cost: "Free", ads: "Yes", quality: "Standard Quality", offline: "No", library: "Shuffle play only" }
    ]
  },
  SaaS: {
    premium: { name: "Adobe Photoshop", cost: "$22.99/mo", ads: "None", quality: "Professional Desktop Apps", offline: "Yes", library: "Cloud Sync, Generative AI" },
    alternatives: [
      { name: "Photopea", cost: "Free", ads: "Light (Ad banner)", quality: "Web-based Editor", offline: "No", library: "Supports PSD, layer structures" },
      { name: "GIMP", cost: "Free", ads: "None", quality: "Desktop App", offline: "Yes", library: "Fully custom plugins, open source" }
    ]
  },
  "AI Assistants": {
    premium: { name: "ChatGPT Plus", cost: "$20.00/mo", ads: "None", quality: "High limit GPT-4o, Custom GPTs", offline: "No", library: "Priority access, data analysis" },
    alternatives: [
      { name: "Gemini Free", cost: "Free", ads: "None", quality: "Standard 1.5 Flash limit", offline: "No", library: "Excellent contextual research" },
      { name: "Claude Free", cost: "Free", ads: "None", quality: "Sonnet standard tier", offline: "No", library: "Superior creative writing" }
    ]
  }
};

type ComparisonCategory = keyof typeof SAMPLE_COMPARISONS;

export default function AlternativeParity({ onSearchCustom }: AlternativeParityProps) {
  const [selectedCat, setSelectedCat] = useState<ComparisonCategory>("Streaming");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchedSubscription | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setSearchResults(null);

    try {
      const res = await onSearchCustom(searchQuery.trim());
      if (res) {
        setSearchResults(res);
      } else {
        setSearchError("No results found. Try another service.");
      }
    } catch (err) {
      setSearchError("Failed to query subscription details from the Gemini engine.");
    } finally {
      setIsSearching(false);
    }
  };

  const activeCompare = SAMPLE_COMPARISONS[selectedCat];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="mb-6 border-b border-slate-50 pb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Feature-Parity Alternative Finder
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Cross-examine premium services against free ad-supported or open-source tiers to maximize cost arbitrage
        </p>
      </div>

      {/* SEARCH INPUT - CAN SCAN ANYTHING OUT THERE */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Search Any Obscure Subscription (AI Analysis Engine)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Type any service (e.g., Midjourney, Peloton, WSJ, LinkedIn Premium)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {isSearching ? "Searching..." : <><Sparkles className="w-3.5 h-3.5" /> Query AI</>}
          </button>
        </div>
      </form>

      {/* DISPLAY SEARCH RESULTS */}
      {isSearching && (
        <div className="py-10 text-center space-y-2 max-w-sm mx-auto">
          <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <h4 className="text-xs font-bold text-slate-700">Deep-Scanning Subscription Catalog</h4>
          <p className="text-[11px] text-slate-400">Gemini is searching features, cancellation guidelines, and free equivalents...</p>
        </div>
      )}

      {searchError && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" /> {searchError}
        </div>
      )}

      {searchResults && !isSearching && (
        <div className="bg-radial from-slate-50 to-indigo-50/10 border border-indigo-100 p-5 rounded-2xl space-y-4 mb-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-slate-800">{searchResults.name}</h4>
                <span className="text-[9px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full capitalize">
                  {searchResults.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Profile compiled by Pulse AI Coach (Rating: {searchResults.rating} ★)</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-800">${searchResults.cost.toFixed(2)}</span>
              <span className="text-[10px] text-slate-400 block -mt-1">/month standard</span>
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Premium Feature Matrix</span>
            <div className="flex flex-wrap gap-1.5">
              {searchResults.features.map((f, i) => (
                <span key={i} className="text-[11px] text-slate-600 bg-white border border-slate-100 px-2.5 py-1 rounded-lg">
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>

          {/* AI Recommended Alternatives */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cheaper Alternatives Discovered</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.alternatives.map((alt, i) => (
                <div key={i} className="bg-white border border-slate-100/80 p-3 rounded-xl shadow-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <CornerDownRight className="w-3.5 h-3.5 text-indigo-500" /> {alt.name}
                    </span>
                    <span className="text-xs font-black text-emerald-600">{alt.cost}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">{alt.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct cancellation guide */}
          <div className="bg-white p-3 rounded-xl border border-slate-100/80 space-y-1">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Easiest Cancellation Method</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">{searchResults.cancelGuide}</p>
          </div>
        </div>
      )}

      {/* CATEGORY SWITCHERS FOR MATRIX */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(Object.keys(SAMPLE_COMPARISONS) as ComparisonCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              selectedCat === cat
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
            }`}
          >
            {cat} Matrix
          </button>
        ))}
      </div>

      {/* MATRIX TABLE */}
      <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50 shadow-xs">
        {/* Header */}
        <div className="grid grid-cols-5 p-3.5 border-b border-slate-100 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-2">Service Platform</div>
          <div>Monthly Cost</div>
          <div>Ad Interrupts</div>
          <div>Offline Mode</div>
        </div>

        {/* Premium Row */}
        <div className="grid grid-cols-5 p-4 border-b border-slate-100 bg-indigo-50/10 text-xs">
          <div className="col-span-2 font-bold text-slate-800 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {activeCompare.premium.name} (Active)
          </div>
          <div className="font-semibold text-indigo-700">{activeCompare.premium.cost}</div>
          <div className="text-slate-500">{activeCompare.premium.ads}</div>
          <div className="text-slate-500">{activeCompare.premium.offline}</div>
        </div>

        {/* Alternative Rows */}
        {activeCompare.alternatives.map((alt, i) => (
          <div key={i} className="grid grid-cols-5 p-4 border-b border-slate-50 bg-white text-xs hover:bg-slate-50/30 transition-all">
            <div className="col-span-2 text-slate-700 flex items-center gap-1.5">
              <CornerDownRight className="w-3.5 h-3.5 text-slate-400" />
              {alt.name}
            </div>
            <div className="font-bold text-emerald-600">{alt.cost}</div>
            <div className="text-slate-500">{alt.ads}</div>
            <div className="text-slate-500">{alt.offline}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-1.5 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/30 text-emerald-800 text-[11px] leading-relaxed">
        <ThumbsUp className="w-4 h-4 text-emerald-600 shrink-0" />
        <strong>FinTech-SaaS Arbitrage Tip:</strong> Swapping a premium music streaming service for its free ad-supported tier or switching to annual plans saves an average of <strong>$140/year</strong> per family!
      </div>
    </div>
  );
}
