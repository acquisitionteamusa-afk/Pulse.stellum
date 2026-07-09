import React, { useState } from "react";
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from "motion/react";
import { 
  Play, Plus, Info, AlertOctagon, CheckCircle2, AlertTriangle, X, Search, Sparkles, Trash2, ShieldAlert
} from "lucide-react";
import { Subscription } from "../types";
import { TRANSLATIONS, CURRENCIES, LanguageCode } from "../translations";

interface SubscriptionCardProps {
  key?: string;
  subscription: Subscription;
  onLogUsage: (id: string) => void;
  onCancel: (id: string) => void;
  onExploreAlternatives: (name: string) => void;
  language: LanguageCode;
  currencyCode: string;
}

export default function SubscriptionCard({
  subscription,
  onLogUsage,
  onCancel,
  onExploreAlternatives,
  language,
  currencyCode,
}: SubscriptionCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const t = TRANSLATIONS[language];
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;

  // Convert USD pricing to current currency on the fly
  const localCost = subscription.cost * curr.rateToUSD;

  // Compute cost-per-use
  const monthlyEquivalent = subscription.period === "monthly" ? subscription.cost : subscription.cost / 12;
  const costPerUseUSD = subscription.usageCount === 0 
    ? monthlyEquivalent 
    : monthlyEquivalent / subscription.usageCount;
  const localCostPerUse = costPerUseUSD * curr.rateToUSD;

  // Compute Value Index Score (0 - 100)
  // Higher usage or lower cost gives a higher score.
  // Formula: Score starts at 100, drops if cost-per-use is high relative to category standards
  const calculateValueScore = () => {
    if (subscription.usageCount === 0) return 0;
    // Base cost per session thresholds
    let baseIdealSessionCost = 2.0; // standard $2 per session ideal
    if (subscription.category === "Music") baseIdealSessionCost = 0.50;
    if (subscription.category === "SaaS") baseIdealSessionCost = 3.0;
    if (subscription.category === "AI & Tech") baseIdealSessionCost = 1.0;

    const ratio = baseIdealSessionCost / costPerUseUSD;
    const score = Math.round(ratio * 75);
    return Math.min(Math.max(score, 10), 100);
  };

  const valueScore = calculateValueScore();

  // Color-coding based on value score
  const getValueColor = (score: number) => {
    if (score >= 70) {
      return { 
        bg: "bg-emerald-50 text-emerald-700 border-emerald-100", 
        bar: "bg-emerald-500", 
        text: language === "en" ? "Worth It" : language === "es" ? "Excelente" : language === "de" ? "Sehr Gut" : language === "fr" ? "Rentable" : "優良", 
        badge: "bg-emerald-500" 
      };
    }
    if (score >= 40) {
      return { 
        bg: "bg-amber-50 text-amber-700 border-amber-100", 
        bar: "bg-amber-500", 
        text: language === "en" ? "Average Value" : language === "es" ? "Promedio" : language === "de" ? "Mittelwert" : language === "fr" ? "Moyen" : "標準", 
        badge: "bg-amber-500" 
      };
    }
    return { 
      bg: "bg-rose-50 text-rose-700 border-rose-100", 
      bar: "bg-rose-500", 
      text: language === "en" ? "Low Value (Review)" : language === "es" ? "Revisar" : language === "de" ? "Prüfen" : language === "fr" ? "À Résilier" : "要確認", 
      badge: "bg-rose-500" 
    };
  };

  const scoreDetails = getValueColor(valueScore);

  // Motion drag setup for desktop/mobile "swipe" simulation
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  // Transform drag distance to background indicators
  const swipeBackground = useTransform(
    x,
    [-150, 0, 150],
    ["rgba(239, 68, 68, 0.1)", "rgba(255, 255, 255, 1)", "rgba(99, 102, 241, 0.1)"]
  );

  const handleDragEnd = async (event: any, info: any) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      // Swiped Left: Cancel
      await controls.start({ x: -300, opacity: 0 });
      onCancel(subscription.id);
    } else if (info.offset.x > threshold) {
      // Swiped Right: Alternatives
      await controls.start({ x: 0 });
      onExploreAlternatives(subscription.name);
    } else {
      // Snap Back
      controls.start({ x: 0 });
    }
  };

  return (
    <motion.div
      style={{ background: swipeBackground }}
      whileHover={{ y: -3, scale: 1.006, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.08)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative rounded-2xl border border-slate-100 shadow-xs mb-4 overflow-hidden bg-white hover:border-indigo-100 transition-colors"
    >
      {/* Swipe action hints */}
      <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none z-0">
        <span className="text-rose-500 text-xs font-semibold flex items-center gap-1">
          <X className="w-4 h-4" /> {language === "en" ? "Cancel/Flag" : language === "es" ? "Cancelar" : language === "de" ? "Kündigen" : language === "fr" ? "Résilier" : "解約"}
        </span>
        <span className="text-indigo-500 text-xs font-semibold flex items-center gap-1">
          <Search className="w-4 h-4" /> {language === "en" ? "Alternatives" : language === "es" ? "Alternativas" : language === "de" ? "Alternativen" : language === "fr" ? "Alternatives" : "代替案"}
        </span>
      </div>

      {/* Swipeable card body */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -180, right: 180 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="relative bg-white p-5 border-b border-slate-100 cursor-grab active:cursor-grabbing z-10 select-none"
      >
        {/* INLINE DELETE CONFIRMATION INTERFACE */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-slate-900 text-white p-5 z-30 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {language === "en" ? `Stop Tracking ${subscription.name}?` : language === "es" ? `¿Dejar de rastrear ${subscription.name}?` : language === "de" ? `${subscription.name} nicht mehr tracken?` : language === "fr" ? `Arrêter de suivre ${subscription.name}?` : `${subscription.name} の記録を停止？`}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-0.5 font-sans">
                    {language === "en" 
                      ? "This will immediately purge its metrics, tags, and logged sessions from your portfolio index."
                      : language === "es"
                      ? "Esto eliminará inmediatamente sus métricas, etiquetas y sesiones registradas de su portafolio."
                      : language === "de"
                      ? "Dadurch werden alle Kennzahlen, Tags und protokollierten Sitzungen sofort aus dem Portfolio entfernt."
                      : language === "fr"
                      ? "Cela supprimera immédiatement ses métriques, tags et sessions enregistrées de votre portefeuille."
                      : "この操作により、指標、タグ、利用ログがポートフォリオからただちに抹消されます。"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700/50"
                >
                  {language === "en" ? "Keep Subscription" : language === "es" ? "Mantener" : language === "de" ? "Behalten" : language === "fr" ? "Conserver" : "キープする"}
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    onCancel(subscription.id);
                  }}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-600/20"
                >
                  {language === "en" ? "Confirm Delete" : language === "es" ? "Confirmar" : language === "de" ? "Bestätigen" : language === "fr" ? "Confirmer" : "削除を確認"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            {/* Logo placeholder */}
            <div className={`w-10 h-10 rounded-xl ${subscription.logoColor || "bg-indigo-500"} text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0`}>
              {subscription.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-semibold text-slate-800 text-base">{subscription.name}</h4>
                <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-md px-1.5 py-0.5">
                  {subscription.category}
                </span>
                {subscription.isTrial && (
                  <span className="text-[9px] font-semibold text-sky-600 bg-sky-50 border border-sky-100 rounded-md px-1.5 py-0.5 animate-pulse">
                    TRIAL
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                {t.renewsOn} {subscription.billingDate}
              </p>

              {/* Tag Badges rendering */}
              {subscription.tags && subscription.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {subscription.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold text-indigo-700 bg-indigo-50/50 border border-indigo-100/30 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold text-slate-800">
              {curr.symbol}{localCost.toFixed(curr.code === "JPY" ? 0 : 2)}
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-sans">
              /{subscription.period === "monthly" ? t.monthly.toLowerCase() : t.yearly.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Engagement Stats and calculations */}
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-50 pt-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">{t.activeSessions}</span>
            <span className="text-xs font-medium text-slate-700 capitalize flex items-center gap-1 mt-0.5">
              <Play className="w-3 h-3 text-slate-400 fill-slate-400" /> 
              {subscription.usageFrequency} ({subscription.usageCount} {subscription.usageCount === 1 ? t.sessionSingular : t.sessionPlural})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">{t.costPerSession}</span>
            <span className="text-xs font-medium text-slate-700 mt-0.5 block">
              {curr.symbol}{localCostPerUse.toFixed(curr.code === "JPY" ? 0 : 2)} <span className="text-[10px] text-slate-400 font-normal font-sans">/{t.sessionSingular}</span>
            </span>
          </div>
        </div>

        {/* Worth It / Value scoring scale */}
        <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100/50">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] font-medium text-slate-500 font-sans">{language === "en" ? "Value Rating Index" : language === "es" ? "Índice de Valor" : language === "de" ? "Wertbewertung" : language === "fr" ? "Indice de Valeur" : "バリュー評価指数"}:</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${scoreDetails.bg} font-sans`}>
              {valueScore}% ({scoreDetails.text})
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${scoreDetails.bar} transition-all duration-500`}
              style={{ width: `${valueScore}%` }}
            />
          </div>
        </div>

        {/* Interactive Simulators & Quick actions */}
        <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
          {/* Quick swipe hints for click interface */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => onLogUsage(subscription.id)}
              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-600 font-sans text-xs font-bold rounded-lg transition-all flex items-center gap-1"
              title="Simulate using this subscription to increase its worth-it score!"
            >
              <Plus className="w-3.5 h-3.5" /> {t.logSession}
            </button>
            <button
              onClick={() => onExploreAlternatives(subscription.name)}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-sans text-xs font-bold rounded-lg transition-all flex items-center gap-1 border border-slate-200/50"
            >
              <Info className="w-3.5 h-3.5" /> {language === "en" ? "Compare" : language === "es" ? "Comparar" : language === "de" ? "Vergleichen" : language === "fr" ? "Comparer" : "比較"}
            </button>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold font-sans transition-all border border-red-100 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> {t.cancelPlan}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
