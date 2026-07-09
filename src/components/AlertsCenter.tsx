import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, TrendingUp, X, Sparkles, Check, ChevronDown, ChevronUp, BellOff } from "lucide-react";
import { Subscription, SubscriptionAlert } from "../types";
import { TRANSLATIONS, CURRENCIES, LanguageCode } from "../translations";

interface AlertsCenterProps {
  subscriptions: Subscription[];
  onActionClick: (subName: string) => void;
  language: LanguageCode;
  currencyCode: string;
  budgetLimit: number; // in USD
  onSnoozeAlert?: (message: string) => void;
}

export default function AlertsCenter({
  subscriptions,
  onActionClick,
  language,
  currencyCode,
  budgetLimit,
  onSnoozeAlert,
}: AlertsCenterProps) {
  const [alerts, setAlerts] = useState<SubscriptionAlert[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [snoozedIds, setSnoozedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("pulse_snoozed_alerts");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const t = TRANSLATIONS[language];
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;

  // Automatically generate dynamic subscription alerts based on live data
  useEffect(() => {
    const generatedAlerts: SubscriptionAlert[] = [];

    // Calculate total spend in USD to check budget limits accurately
    const totalUSDSpend = subscriptions.reduce((sum, sub) => {
      const monthlyCost = sub.period === "monthly" ? sub.cost : sub.cost / 12;
      return sum + monthlyCost;
    }, 0);

    // 1. Budget Limit Alert
    if (totalUSDSpend > budgetLimit) {
      const overSpendUSD = totalUSDSpend - budgetLimit;
      const overSpendLocal = overSpendUSD * curr.rateToUSD;
      const budgetLimitLocal = budgetLimit * curr.rateToUSD;
      
      const customMsg = language === "en" 
        ? `Monthly portfolio bill has breached your budget by ${curr.symbol}${overSpendLocal.toFixed(2)}! Total spend is ${curr.symbol}${(totalUSDSpend * curr.rateToUSD).toFixed(2)} against the limit of ${curr.symbol}${budgetLimitLocal.toFixed(0)}.`
        : language === "es"
        ? `¡La factura mensual superó su presupuesto por ${curr.symbol}${overSpendLocal.toFixed(2)}! Gasto total: ${curr.symbol}${(totalUSDSpend * curr.rateToUSD).toFixed(2)} contra el límite de ${curr.symbol}${budgetLimitLocal.toFixed(0)}.`
        : language === "de"
        ? `Das monatliche Budget wurde um ${curr.symbol}${overSpendLocal.toFixed(2)} überschritten! Gesamtausgaben: ${curr.symbol}${(totalUSDSpend * curr.rateToUSD).toFixed(2)} gegenüber dem Limit von ${curr.symbol}${budgetLimitLocal.toFixed(0)}.`
        : language === "fr"
        ? `Le budget mensuel a été dépassé de ${curr.symbol}${overSpendLocal.toFixed(2)} ! Total : ${curr.symbol}${(totalUSDSpend * curr.rateToUSD).toFixed(2)} contre une limite de ${curr.symbol}${budgetLimitLocal.toFixed(0)}.`
        : `月間予算上限を ${curr.symbol}${overSpendLocal.toFixed(0)} オーバーしています！ 現在の支出は ${curr.symbol}${(totalUSDSpend * curr.rateToUSD).toFixed(0)} です（設定上限: ${curr.symbol}${budgetLimitLocal.toFixed(0)}）。`;

      generatedAlerts.push({
        id: "alert-budget-limit",
        subscriptionId: "all",
        subscriptionName: "Budget",
        type: "budget_limit",
        severity: "high",
        message: customMsg,
        dateTriggered: new Date().toISOString().split("T")[0],
      });
    }

    subscriptions.forEach((sub) => {
      // 2. Dormancy Alert: Plan is active but usage count is zero
      if (sub.usageCount === 0 && !sub.isTrial) {
        const dormancyMsg = language === "en"
          ? `Zero activity logged for "${sub.name}" this cycle! Stop paying for zombie plans.`
          : language === "es"
          ? `¡Cero actividad registrada para "${sub.name}" este ciclo! Deje de pagar por planes zombi.`
          : language === "de"
          ? `Keine Aktivität für "${sub.name}" in diesem Zyklus! Bezahlen Sie nicht für ungenutzte Abos.`
          : language === "fr"
          ? `Aucune activité enregistrée pour "${sub.name}" ce cycle ! Arrêtez de payer pour des abonnements fantômes.`
          : `「${sub.name}」の利用履歴が今月はありません！ 不要なプランの課金を停止しましょう。`;

        generatedAlerts.push({
          id: `alert-dormant-${sub.id}`,
          subscriptionId: sub.id,
          subscriptionName: sub.name,
          type: "dormancy",
          severity: "high",
          message: dormancyMsg,
          dateTriggered: new Date().toISOString().split("T")[0],
        });
      }

      // 3. Trial Ending Warning
      if (sub.isTrial) {
        const trialMsg = language === "en"
          ? `Free trial for "${sub.name}" renews to premium soon (${sub.billingDate}). Cancel now if not utilizing.`
          : language === "es"
          ? `La prueba gratuita de "${sub.name}" se renovará a premium pronto (${sub.billingDate}). Cancele si no la usa.`
          : language === "de"
          ? `Die kostenlose Testversion für "${sub.name}" wird bald kostenpflichtig (${sub.billingDate}). Jetzt kündigen, wenn ungenutzt.`
          : language === "fr"
          ? `L'essai gratuit pour "${sub.name}" se termine bientôt (${sub.billingDate}). Résiliez s'il n'est pas utilisé.`
          : `「${sub.name}」の無料体験期間がまもなく終了し、自動更新されます（${sub.billingDate}）。不要な場合は今すぐ解約してください。`;

        generatedAlerts.push({
          id: `alert-trial-${sub.id}`,
          subscriptionId: sub.id,
          subscriptionName: sub.name,
          type: "trial_expire",
          severity: "high",
          message: trialMsg,
          dateTriggered: sub.billingDate,
        });
      }

      // 4. Price spikes (SaaS or Streaming above $25/mo with low usage)
      const monthlyCost = sub.period === "monthly" ? sub.cost : sub.cost / 12;
      const convertedCost = monthlyCost * curr.rateToUSD; // scaling appropriately
      if (monthlyCost > 25 && sub.usageCount < 5) {
        const priceMsg = language === "en"
          ? `"${sub.name}" holds a high price tier (${curr.symbol}${(sub.cost * curr.rateToUSD).toFixed(2)}/${sub.period === "monthly" ? "mo" : "yr"}) with minimal usage frequency.`
          : language === "es"
          ? `"${sub.name}" tiene una tarifa alta (${curr.symbol}${(sub.cost * curr.rateToUSD).toFixed(2)}/${sub.period === "monthly" ? "mes" : "año"}) con frecuencia de uso mínima.`
          : language === "de"
          ? `"${sub.name}" hat eine hohe Preisstufe (${curr.symbol}${(sub.cost * curr.rateToUSD).toFixed(2)}/${sub.period === "monthly" ? "Monat" : "Jahr"}) bei minimaler Nutzung.`
          : language === "fr"
          ? `"${sub.name}" présente un tarif élevé (${curr.symbol}${(sub.cost * curr.rateToUSD).toFixed(2)}/${sub.period === "monthly" ? "mois" : "an"}) avec un usage minimal.`
          : `「${sub.name}」は高額料金プラン (${curr.symbol}${(sub.cost * curr.rateToUSD).toFixed(0)}/${sub.period === "monthly" ? "月" : "年"}) に設定されていますが、利用頻度が低いです。`;

        generatedAlerts.push({
          id: `alert-price-${sub.id}`,
          subscriptionId: sub.id,
          subscriptionName: sub.name,
          type: "price_hike",
          severity: "medium",
          message: priceMsg,
          dateTriggered: new Date().toISOString().split("T")[0],
        });
      }
    });

    setAlerts(generatedAlerts);
  }, [subscriptions, budgetLimit, currencyCode, language]);

  const activeAlerts = alerts.filter(
    (alert) => !dismissedIds.includes(alert.id) && !snoozedIds.includes(alert.id)
  );

  const handleDismiss = (id: string) => {
    setDismissedIds([...dismissedIds, id]);
  };

  const handleSnooze = (id: string) => {
    const nextSnoozed = [...snoozedIds, id];
    setSnoozedIds(nextSnoozed);
    localStorage.setItem("pulse_snoozed_alerts", JSON.stringify(nextSnoozed));
    if (onSnoozeAlert) {
      onSnoozeAlert(t.alertSnoozed);
    }
  };

  const handleResetSnooze = () => {
    setSnoozedIds([]);
    localStorage.removeItem("pulse_snoozed_alerts");
    if (onSnoozeAlert) {
      onSnoozeAlert("All alert snoozes have been reset.");
    }
  };

  if (activeAlerts.length === 0 && snoozedIds.length === 0) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden transition-all duration-300">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-amber-500/10 to-indigo-500/5 px-5 py-3.5 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 flex-wrap">
              {t.alertsTitle}
              <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-full">
                {activeAlerts.length} {t.actionNeeded}
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* ALERTS ACCORDION LIST */}
      {isExpanded && (
        <div className="p-4 space-y-3 max-h-72 overflow-y-auto divide-y divide-slate-100/60">
          {activeAlerts.map((alert) => {
            const isHigh = alert.severity === "high";
            const isTrial = alert.type === "trial_expire";
            const isBudget = alert.type === "budget_limit";

            return (
              <div
                key={alert.id}
                className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
              >
                <div className="flex gap-2.5 items-start">
                  <div className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                    isTrial 
                      ? "bg-sky-50 text-sky-600 border border-sky-100" 
                      : isBudget
                      ? "bg-rose-50 text-rose-600 border border-rose-100 animate-pulse"
                      : isHigh 
                      ? "bg-rose-50 text-rose-600 border border-rose-100" 
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}>
                    {isTrial ? <Clock className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {alert.type === "dormancy" 
                        ? t.dormancyWarning 
                        : alert.type === "trial_expire" 
                        ? t.trialWarning 
                        : alert.type === "budget_limit"
                        ? t.budgetLimitLabel
                        : t.highBillWarning}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  {!isBudget && (
                    <button
                      onClick={() => onActionClick(alert.subscriptionName)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> {t.optimizeBtn}
                    </button>
                  )}
                  {!isBudget && (
                    <button
                      onClick={() => handleSnooze(alert.id)}
                      className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold rounded-lg text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                      title={t.snoozeBtn}
                    >
                      <BellOff className="w-3 h-3 text-slate-400" /> {t.snoozeBtn}
                    </button>
                  )}
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title="Mute Alert"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          
          {snoozedIds.length > 0 && (
            <div className="pt-3 pb-1 flex justify-between items-center text-[10px] text-slate-400 font-medium border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <BellOff className="w-3 h-3 text-slate-400 shrink-0" />
                {snoozedIds.length} alert{snoozedIds.length > 1 ? "s" : ""} snoozed for this cycle
              </span>
              <button
                onClick={handleResetSnooze}
                className="text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer hover:underline bg-transparent border-0"
              >
                Reset Snoozes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
