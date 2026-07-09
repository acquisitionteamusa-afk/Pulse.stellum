import React, { useState } from "react";
import { X, Plus, Sparkles } from "lucide-react";
import { Subscription, SubscriptionPeriod } from "../types";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sub: Omit<Subscription, "id">) => void;
}

const CATEGORIES = ["Streaming", "Music", "AI & Tech", "SaaS", "Gaming", "Health & Fitness", "Other"];
const FREQUENCIES = ["daily", "weekly", "monthly", "rarely"] as const;

const LOGO_COLORS = [
  "bg-red-500", "bg-blue-500", "bg-emerald-500", 
  "bg-indigo-500", "bg-purple-500", "bg-amber-500", 
  "bg-pink-500", "bg-teal-600", "bg-gray-800"
];

export default function AddSubscriptionModal({
  isOpen,
  onClose,
  onAdd,
}: AddSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState("Streaming");
  const [period, setPeriod] = useState<SubscriptionPeriod>("monthly");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "rarely">("weekly");
  const [billingDate, setBillingDate] = useState("");
  const [isTrial, setIsTrial] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleTogglePreset = (preset: string) => {
    if (selectedPresets.includes(preset)) {
      setSelectedPresets(selectedPresets.filter((p) => p !== preset));
    } else {
      setSelectedPresets([...selectedPresets, preset]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cost) return;

    // Pick a random logo color
    const logoColor = LOGO_COLORS[Math.floor(Math.random() * LOGO_COLORS.length)];

    // Parse custom tags from input + selected presets
    const customTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const combinedTags = Array.from(new Set([...selectedPresets, ...customTags]));

    onAdd({
      name: name.trim(),
      cost: parseFloat(cost) || 0,
      period,
      category,
      usageFrequency: frequency,
      usageCount: frequency === "daily" ? 30 : frequency === "weekly" ? 4 : frequency === "monthly" ? 1 : 0,
      billingDate: billingDate || new Date().toISOString().split("T")[0],
      isTrial,
      logoColor,
      tags: combinedTags,
    });

    // Reset Form
    setName("");
    setCost("");
    setCategory("Streaming");
    setPeriod("monthly");
    setFrequency("weekly");
    setBillingDate("");
    setIsTrial(false);
    setTagsInput("");
    setSelectedPresets([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" /> Track Subscription
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Service Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Prime Video, ChatGPT Plus, gym subscription"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Cost & Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Billing Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                placeholder="14.99"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Billing Cycle
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as SubscriptionPeriod)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Category & Expected Usage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Usage Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                {FREQUENCIES.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Billing Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Next Renewal / Billing Date
            </label>
            <input
              type="date"
              required
              value={billingDate}
              onChange={(e) => setBillingDate(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Subscription Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Subscription Tags
            </label>
            <p className="text-[10px] text-slate-400 mb-2">Select quick-category tags or type comma-separated values</p>
            
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {["Personal", "Work", "Shared", "Essential", "Optional", "Promo"].map((preset) => {
                const selected = selectedPresets.includes(preset);
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleTogglePreset(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      selected
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-slate-50 text-slate-500 border-slate-200/60 hover:bg-slate-100"
                    }`}
                  >
                    {selected ? `✓ ${preset}` : preset}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              placeholder="e.g. Entertainment, Creative, Health"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Trial Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isTrial"
              checked={isTrial}
              onChange={(e) => setIsTrial(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <label htmlFor="isTrial" className="text-xs font-medium text-slate-600 cursor-pointer select-none">
              This is a Free Trial
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Start Tracking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
