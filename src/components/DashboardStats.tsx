import React from "react";
import { motion } from "motion/react";
import { DollarSign, AlertTriangle, Sparkles, Calendar, TrendingDown } from "lucide-react";
import { Subscription } from "../types";
import { TRANSLATIONS, CURRENCIES, LanguageCode } from "../translations";

interface DashboardStatsProps {
  subscriptions: Subscription[];
  potentialSavings: number; // in USD (annualized)
  onAuditClick: () => void;
  language: LanguageCode;
  currencyCode: string;
}

export default function DashboardStats({
  subscriptions,
  potentialSavings,
  onAuditClick,
  language,
  currencyCode,
}: DashboardStatsProps) {
  const t = TRANSLATIONS[language];
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;

  // Compute basic metrics (in USD)
  const totalMonthlySpendUSD = subscriptions.reduce((sum, sub) => {
    if (sub.period === "monthly") return sum + sub.cost;
    return sum + sub.cost / 12; // annualized divided by 12
  }, 0);

  // Convert to current currency
  const totalMonthlySpendLocal = totalMonthlySpendUSD * curr.rateToUSD;

  // Zombie subscription: has 0 usage count
  const zombieSubscriptions = subscriptions.filter(sub => sub.usageCount === 0);
  const zombieMonthlyCostUSD = zombieSubscriptions.reduce((sum, sub) => {
    if (sub.period === "monthly") return sum + sub.cost;
    return sum + sub.cost / 12;
  }, 0);
  const zombieMonthlyCostLocal = zombieMonthlyCostUSD * curr.rateToUSD;

  // Free trials monitor
  const activeTrials = subscriptions.filter(sub => sub.isTrial);

  // Potential Monthly Savings
  const monthlySavingsUSD = potentialSavings > 0 ? (potentialSavings / 12) : 0;
  const monthlySavingsLocal = monthlySavingsUSD * curr.rateToUSD;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* CARD 1: Total Monthly Spend */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-sans">{t.totalMonthly}</span>
            <h3 className="text-3xl font-bold font-sans text-slate-800 mt-1">
              {curr.symbol}{totalMonthlySpendLocal.toFixed(curr.code === "JPY" ? 0 : 2)}
            </h3>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 font-sans">
          {language === "en" 
            ? <>Across <span className="font-semibold text-slate-700">{subscriptions.length}</span> active digital services</>
            : language === "es"
            ? <>A través de <span className="font-semibold text-slate-700">{subscriptions.length}</span> servicios digitales activos</>
            : language === "de"
            ? <>Über <span className="font-semibold text-slate-700">{subscriptions.length}</span> aktive digitale Dienste</>
            : language === "fr"
            ? <>Sur <span className="font-semibold text-slate-700">{subscriptions.length}</span> services numériques actifs</>
            : <>合計 <span className="font-semibold text-slate-700">{subscriptions.length}</span> 個の有効なデジタルサービス</>
          }
        </p>
      </motion.div>

      {/* CARD 2: Zombie / Leak alerts */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col justify-between ${
          zombieSubscriptions.length > 0 ? "border-amber-100 bg-amber-50/10" : "border-slate-100"
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-sans">
              {language === "en" ? 'Unused "Zombie" Plans' : language === "es" ? "Planes \"Zombi\" Sin Uso" : language === "de" ? "Ungenutzte Abonnements" : language === "fr" ? "Abonnements Inactifs" : "休眠中の「ゾンビ」プラン"}
            </span>
            <h3 className="text-3xl font-bold font-sans text-slate-800 mt-1">
              {zombieSubscriptions.length}
            </h3>
          </div>
          <div className={`p-2.5 rounded-xl ${
            zombieSubscriptions.length > 0 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        {zombieSubscriptions.length > 0 ? (
          <div className="mt-3">
            <p className="text-xs text-amber-700 font-medium font-sans">
              {language === "en" 
                ? `Leak: ${curr.symbol}${zombieMonthlyCostLocal.toFixed(curr.code === "JPY" ? 0 : 2)}/mo at risk!`
                : language === "es"
                ? `Fuga: ¡${curr.symbol}${zombieMonthlyCostLocal.toFixed(curr.code === "JPY" ? 0 : 2)}/mes en riesgo!`
                : language === "de"
                ? `Leck: ${curr.symbol}${zombieMonthlyCostLocal.toFixed(curr.code === "JPY" ? 0 : 2)}/Monat gefährdet!`
                : language === "fr"
                ? `Perte : ${curr.symbol}${zombieMonthlyCostLocal.toFixed(curr.code === "JPY" ? 0 : 2)}/mois à risque !`
                : `毎月 ${curr.symbol}${zombieMonthlyCostLocal.toFixed(0)} の支出が浪費されています！`
              }
            </p>
            <p className="text-[10px] text-slate-400 leading-snug mt-1 font-sans">
              {language === "en" 
                ? `Zero activity recorded for: ${zombieSubscriptions.map(s => s.name).join(", ")}.`
                : `未利用のサービス: ${zombieSubscriptions.map(s => s.name).join(", ")}。`
              }
            </p>
          </div>
        ) : (
          <p className="text-xs text-emerald-600 mt-4 font-sans flex items-center gap-1">
            ✓ {language === "en" ? "Excellent subscription hygiene" : language === "es" ? "Excelente higiene de suscripción" : language === "de" ? "Hervorragende Abo-Hygiene" : language === "fr" ? "Excellente gestion de budget" : "完璧なサブスク健全性"}
          </p>
        )}
      </motion.div>

      {/* CARD 3: Trials Monitor */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider font-sans">
              {language === "en" ? "Active Free Trials" : language === "es" ? "Pruebas Gratuitas Activas" : language === "de" ? "Aktive Testversionen" : language === "fr" ? "Essais Gratuits Actifs" : "無料体験中のプラン"}
            </span>
            <h3 className="text-3xl font-bold font-sans text-slate-800 mt-1">
              {activeTrials.length}
            </h3>
          </div>
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        {activeTrials.length > 0 ? (
          <div className="mt-3">
            <p className="text-xs font-medium text-sky-700 font-sans">
              {activeTrials[0].name} {language === "en" ? "ends soon" : "間もなく終了します"}
            </p>
            <p className="text-[10px] text-slate-400 leading-snug mt-1 font-sans">
              {language === "en" 
                ? `Renewal date: ${activeTrials[0].billingDate} (Auto-renews at ${curr.symbol}${(activeTrials[0].cost * curr.rateToUSD).toFixed(curr.code === "JPY" ? 0 : 2)})`
                : `更新日: ${activeTrials[0].billingDate}（自動更新: ${curr.symbol}${(activeTrials[0].cost * curr.rateToUSD).toFixed(curr.code === "JPY" ? 0 : 2)}）`
              }
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 mt-4 font-sans">
            {language === "en" ? "No active free trials" : "体験版はありません"}
          </p>
        )}
      </motion.div>

      {/* CARD 4: AI Audit Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-radial from-indigo-50/20 to-indigo-500/5 bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1 font-sans">
              <Sparkles className="w-3.5 h-3.5" /> {t.savingsOpportunity}
            </span>
            <h3 className="text-3xl font-bold font-sans text-indigo-900 mt-1">
              {curr.symbol}{monthlySavingsLocal.toFixed(curr.code === "JPY" ? 0 : 2)}
              <span className="text-xs font-normal text-indigo-500 ml-1">/{language === "ja" ? "月" : "mo"}</span>
            </h3>
          </div>
          <div className="p-2.5 bg-indigo-500 text-white rounded-xl">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <button
            onClick={onAuditClick}
            className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 animate-pulse" /> {t.optimizeBtn}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
