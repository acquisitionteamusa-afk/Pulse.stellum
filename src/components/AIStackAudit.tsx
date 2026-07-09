import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, TrendingDown, RefreshCw, ChevronRight, Check, HeartCrack, HelpCircle, CornerDownRight } from "lucide-react";
import { Subscription, AIAnalysisResult } from "../types";

interface AIStackAuditProps {
  subscriptions: Subscription[];
  analysisResult: AIAnalysisResult | null;
  onRunAudit: () => Promise<void>;
  isAnalyzing: boolean;
  onApplyAlternative: (subName: string, altName: string, altCostStr: string) => void;
}

export default function AIStackAudit({
  subscriptions,
  analysisResult,
  onRunAudit,
  isAnalyzing,
  onApplyAlternative,
}: AIStackAuditProps) {
  const [loadingStep, setLoadingStep] = useState(0);

  // Steps to display during AI reasoning
  const loadingSteps = [
    "Pulse AI is reading your subscription footprint...",
    "Calculating true Cost-Per-Use from engagement counts...",
    "Scanning databases for free ad-supported tiers...",
    "Evaluating competitive feature-parity alternatives...",
    "Formulating optimal bundle architectures...",
    "Polishing tailored financial optimization plan..."
  ];

  // Rotate loading steps while analyzing
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Color mapper for status badges
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "good":
        return "bg-teal-50 text-teal-700 border-teal-100";
      case "review":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "waste":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-slate-50 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5 font-sans">
            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" /> Pulse AI Optimization Coach
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Generative stack analysis of your monthly expense leakage and smarter alternatives
          </p>
        </div>
        <button
          onClick={onRunAudit}
          disabled={isAnalyzing || subscriptions.length === 0}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Stack...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> {analysisResult ? "Re-Run AI Coach Audit" : "Request AI Stack Audit"}
            </>
          )}
        </button>
      </div>

      {subscriptions.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-xs">Add your first subscription to begin AI portfolio auditing!</p>
        </div>
      )}

      {/* RENDER ANALYZING LOADER */}
      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="py-12 flex flex-col items-center text-center max-w-sm mx-auto"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            </div>
            <h4 className="text-sm font-semibold text-slate-700 animate-pulse">Running Pulse AI Engine</h4>
            <p className="text-xs text-slate-400 mt-2 min-h-8 leading-relaxed">
              {loadingSteps[loadingStep]}
            </p>
            {/* Visual Progress Bar */}
            <div className="w-48 bg-slate-100 h-1 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="bg-indigo-600 h-full"
                animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
        )}

        {/* RENDER RESULT ONCE READY */}
        {!isAnalyzing && analysisResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Overall summary & annual savings card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100/80">
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    AI Coach Summary
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  "{analysisResult.overallSummary}"
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200/50 flex flex-col justify-between text-center md:text-left shadow-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                    Estimated Annual Leakage Saved
                  </span>
                  <span className="text-3xl font-extrabold text-indigo-600 block mt-1">
                    ${analysisResult.totalPotentialSavings.toFixed(2)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-center md:justify-start gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-500" /> By adopting the matching recommendations
                </div>
              </div>
            </div>

            {/* Individual subscription breakdowns */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Breakdown & Alternative Discovery</h4>
              {analysisResult.analysisList.map((item, idx) => (
                <div key={idx} className="border border-slate-100 rounded-2xl p-5 space-y-4 bg-white hover:border-slate-200 transition-all shadow-xs">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{item.subscriptionName}</span>
                      <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.valueScore}% - {item.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded-lg">
                      Recommendation: {item.recommendation}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 leading-relaxed">
                    {item.analysis}
                  </p>

                  {/* Alternatives */}
                  {item.cheaperAlternatives.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cheaper / Free Alternatives:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.cheaperAlternatives.map((alt, altIdx) => (
                          <div key={altIdx} className="bg-slate-50/20 border border-slate-100 hover:border-indigo-100/70 p-3 rounded-xl flex flex-col justify-between transition-all">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                  <CornerDownRight className="w-3 h-3 text-indigo-500" /> {alt.name}
                                </span>
                                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                  {alt.cost}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-normal">{alt.pros}</p>
                            </div>
                            <button
                              onClick={() => onApplyAlternative(item.subscriptionName, alt.name, alt.cost)}
                              className="w-full mt-3 py-1 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg transition-all"
                            >
                              Apply: {alt.linkText}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* General tips */}
            {analysisResult.generalTips.length > 0 && (
              <div className="bg-indigo-50/10 border border-indigo-100/40 rounded-2xl p-5 space-y-2">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider block">AI Best Practices & Tips</span>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-indigo-950 font-sans">
                  {analysisResult.generalTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
