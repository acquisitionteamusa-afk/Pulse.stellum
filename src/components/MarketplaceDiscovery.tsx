import React, { useState } from "react";
import { Plus, Check, Search, Calendar, Sparkles, TrendingDown, Hourglass, ArrowUpRight } from "lucide-react";
import { POPULAR_DIRECTORY } from "../initialData";
import { Subscription } from "../types";

interface MarketplaceDiscoveryProps {
  onSubscribe: (sub: Omit<Subscription, "id">) => void;
  activeSubscriptions: Subscription[];
}

export default function MarketplaceDiscovery({
  onSubscribe,
  activeSubscriptions,
}: MarketplaceDiscoveryProps) {
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleOneClickSubscribe = (item: typeof POPULAR_DIRECTORY[number]) => {
    if (activeSubscriptions.some(sub => sub.name.toLowerCase() === item.name.toLowerCase())) {
      alert(`You are already subscribed to ${item.name}!`);
      return;
    }

    setSubscribingId(item.name);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Apply subscribe action
            onSubscribe({
              name: item.name,
              cost: item.cost,
              period: "monthly",
              category: item.category,
              usageFrequency: "weekly",
              usageCount: 1, // Default starting usage count
              billingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              isTrial: false,
              logoColor: item.logoColor,
            });
            setSuccessId(item.name);
            setSubscribingId(null);
            setTimeout(() => setSuccessId(null), 3000);
          }, 600);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const isSubscribed = (name: string) => {
    return activeSubscriptions.some(sub => sub.name.toLowerCase() === name.toLowerCase());
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="mb-6 border-b border-slate-50 pb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
          <ArrowUpRight className="w-5 h-5 text-indigo-600" /> Marketplace & Onboarding Portal
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          One-click pre-filled integrations to instantly subscribe, browse details, or add new items to your tracking portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POPULAR_DIRECTORY.map((item) => {
          const active = isSubscribed(item.name);
          const isCurrentSubscribing = subscribingId === item.name;
          const isCurrentSuccess = successId === item.name;

          return (
            <div
              key={item.name}
              className={`p-4 border rounded-2xl flex flex-col justify-between transition-all ${
                active 
                  ? "border-indigo-100 bg-indigo-50/5" 
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs"
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg ${item.logoColor} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">{item.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-800">${item.cost.toFixed(2)}</span>
                    <span className="text-[9px] text-slate-400 block">/mo</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed min-h-10 mb-4">
                  {item.description}
                </p>

                {/* Popular alternatives lookup list */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Free / Cheaper Alternatives:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.popularAlternatives.map((alt, i) => (
                      <span key={i} className="text-[9px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-medium border border-indigo-100/30">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                {isCurrentSubscribing ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Pre-filling profile consent...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : isCurrentSuccess ? (
                  <div className="w-full py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Pulse Authorized!
                  </div>
                ) : active ? (
                  <div className="w-full py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100/50 rounded-xl text-center text-xs font-medium flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-indigo-600" /> Active on Pulse
                  </div>
                ) : (
                  <button
                    onClick={() => handleOneClickSubscribe(item)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> 1-Click Fast Track Subscribe
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FREE TRIALS MONITOR SECTION */}
      <div className="mt-8 pt-6 border-t border-slate-50">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Why "1-Click" Matters on Pulse?
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-indigo-50/20 border border-indigo-50 rounded-xl text-xs space-y-1">
            <span className="font-bold text-slate-800 block">Pre-filled Checkout</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              We leverage safe federated APIs to populate name, email, and base currency preference to skip signup fatigue.
            </p>
          </div>
          <div className="p-3 bg-indigo-50/20 border border-indigo-50 rounded-xl text-xs space-y-1">
            <span className="font-bold text-slate-800 block">Auto Trial Warnings</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Any 1-click subscription flagged as a free trial automatically schedules renewal warning reminders.
            </p>
          </div>
          <div className="p-3 bg-indigo-50/20 border border-indigo-50 rounded-xl text-xs space-y-1">
            <span className="font-bold text-slate-800 block">Zero Double-Billing</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              The aggregate intelligence system stops you from accidentally signing up for competing services with duplicated content libraries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
