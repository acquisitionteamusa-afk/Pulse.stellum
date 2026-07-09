import React, { useState } from "react";
import { BarChart3, TrendingUp, HelpCircle, AlertCircle, Award, PieChart } from "lucide-react";
import { Subscription } from "../types";
import { TRANSLATIONS, CURRENCIES, LanguageCode } from "../translations";

interface SubscriptionChartsProps {
  subscriptions: Subscription[];
  language: LanguageCode;
  currencyCode: string;
}

export default function SubscriptionCharts({ subscriptions, language, currencyCode }: SubscriptionChartsProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const t = TRANSLATIONS[language];
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;

  // Group subscriptions by category for spending distribution (Trends)
  const categoryStats = subscriptions.reduce((acc, sub) => {
    const cost = sub.period === "monthly" ? sub.cost : sub.cost / 12;
    if (!acc[sub.category]) {
      acc[sub.category] = { cost: 0, count: 0, subs: [] };
    }
    acc[sub.category].cost += cost;
    acc[sub.category].count += 1;
    acc[sub.category].subs.push(sub);
    return acc;
  }, {} as Record<string, { cost: number; count: number; subs: Subscription[] }>);

  const categories = Object.keys(categoryStats).map((cat) => ({
    name: cat,
    totalMonthlySpend: categoryStats[cat].cost,
    count: categoryStats[cat].count,
  }));

  const totalMonthlyExpenseUSD = categories.reduce((sum, c) => sum + c.totalMonthlySpend, 0);
  const totalMonthlyExpenseLocal = totalMonthlyExpenseUSD * curr.rateToUSD;
  const maxCategorySpend = Math.max(...categories.map((c) => c.totalMonthlySpend), 1);

  // Sort subscriptions by usage count for the Usage Engagement Chart
  const sortedByUsage = [...subscriptions].sort((a, b) => b.usageCount - a.usageCount);
  const maxUsage = Math.max(...subscriptions.map((s) => s.usageCount), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* CHART 1: TRENDS CHART - CATEGORY EXPENDITURE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                {language === "en" ? "Trends Allocation" : language === "es" ? "Asignación" : language === "de" ? "Trends" : language === "fr" ? "Tendances" : "割合トレンド"}
              </span>
              <h3 className="text-base font-black text-slate-800 mt-1 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-500" /> {language === "en" ? "Category Spend Trends" : language === "es" ? "Tendencias por Categoría" : language === "de" ? "Ausgabentrends nach Kategorie" : language === "fr" ? "Tendances de Dépenses" : "カテゴリー別支出割合"}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900">
                {curr.symbol}{totalMonthlyExpenseLocal.toFixed(curr.code === "JPY" ? 0 : 2)}
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-sans">{t.totalMonthly.toLowerCase()}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-6 font-sans">
            {language === "en" 
              ? "Compare monthly budget distribution across product spaces to expose disproportionate SaaS or Streaming leakages."
              : language === "es"
              ? "Compare la distribución del presupuesto mensual para exponer fugas desproporcionadas en SaaS o Streaming."
              : language === "de"
              ? "Vergleichen Sie das Monatsbudget, um übermäßige Ausgaben für SaaS oder Streaming aufzudecken."
              : language === "fr"
              ? "Comparez le budget mensuel pour repérer les dépenses excessives en SaaS ou Streaming."
              : "月間予算の製品カテゴリー別配分を比較し、無駄なSaaSや動画サブスク等の支出漏れを特定します。"}
          </p>

          {categories.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-medium font-sans">
              {language === "en" 
                ? "No subscription metrics available. Track a plan to formulate analytics!"
                : language === "es"
                ? "Sin suscripciones activas. Agregue un plan para generar análisis."
                : language === "de"
                ? "Keine Abonnements vorhanden. Fügen Sie ein Abo hinzu für Analysen!"
                : language === "fr"
                ? "Aucun abonnement actif. Ajoutez un plan pour générer les graphiques."
                : "計測可能なデータがありません。サブスクを登録して分析グラフを生成しましょう！"}
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => {
                const percentOfTotal = (cat.totalMonthlySpend / (totalMonthlyExpenseUSD || 1)) * 100;
                const percentOfMax = (cat.totalMonthlySpend / maxCategorySpend) * 100;
                const isHovered = hoveredCategory === cat.name;

                return (
                  <div
                    key={cat.name}
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="group space-y-1.5 transition-all"
                  >
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 flex items-center gap-1.5 font-sans">
                        <span className="w-2.5 h-2.5 rounded-md bg-indigo-500 shrink-0 inline-block" />
                        {cat.name} <span className="text-[10px] font-normal text-slate-400">({cat.count} {language === "en" ? "active" : language === "es" ? "activo" : language === "de" ? "aktiv" : language === "fr" ? "actif" : "有効"})</span>
                      </span>
                      <span className="text-slate-800">
                        {curr.symbol}{(cat.totalMonthlySpend * curr.rateToUSD).toFixed(curr.code === "JPY" ? 0 : 2)}
                        <span className="text-[10px] text-slate-400 font-normal ml-1 font-sans">
                          ({percentOfTotal.toFixed(0)}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-lg overflow-hidden relative">
                      <div
                        className={`h-full rounded-lg transition-all duration-500 ${
                          isHovered ? "bg-indigo-600 shadow-xs" : "bg-indigo-500/80 group-hover:bg-indigo-500"
                        }`}
                        style={{ width: `${Math.max(percentOfMax, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Category Summary Callout */}
        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
          <PieChart className="w-5 h-5 text-indigo-500 shrink-0" />
          <p className="text-[11px] text-slate-500 leading-normal font-sans">
            {categories.length > 0 
              ? (language === "en"
                ? `Your highest subscription concentration is in the ${categories.reduce((a, b) => a.totalMonthlySpend > b.totalMonthlySpend ? a : b).name} segment.`
                : language === "es"
                ? `Su mayor concentración de suscripción se encuentra en el segmento de ${categories.reduce((a, b) => a.totalMonthlySpend > b.totalMonthlySpend ? a : b).name}.`
                : language === "de"
                ? `Ihre höchste Abonnementkonzentration liegt im Bereich ${categories.reduce((a, b) => a.totalMonthlySpend > b.totalMonthlySpend ? a : b).name}.`
                : language === "fr"
                ? `Votre plus grande concentration d'abonnements est dans le segment ${categories.reduce((a, b) => a.totalMonthlySpend > b.totalMonthlySpend ? a : b).name}.`
                : `現在最も支出が集中しているのは、${categories.reduce((a, b) => a.totalMonthlySpend > b.totalMonthlySpend ? a : b).name} カテゴリーです。`)
              : (language === "en"
                ? "Track your subscriptions to generate automatic spend trends."
                : "サブスクリプションを登録すると、支出分析が自動で生成されます。")
            }
          </p>
        </div>
      </div>

      {/* CHART 2: USAGE ENGAGEMENT CHART */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                {language === "en" ? "Amortization Audit" : language === "es" ? "Auditoría de Uso" : language === "de" ? "Amortisierung" : language === "fr" ? "Audit d'Usage" : "対費用効果"}
              </span>
              <h3 className="text-base font-black text-slate-800 mt-1 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-500" /> {language === "en" ? "Subscription Engagement Index" : language === "es" ? "Índice de Compromiso" : language === "de" ? "Abonnement-Engagement-Index" : language === "fr" ? "Indice d'Engagement" : "サービスエンゲージメント評価"}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-6 font-sans">
            {language === "en"
              ? "Identifies active engagement vs cost drain. Taller bars indicate highly utilized, cost-effective subscriptions."
              : language === "es"
              ? "Identifica la participación activa frente al drenaje de dinero. Barras más altas indican un uso más rentable."
              : language === "de"
              ? "Erkennt aktive Nutzung vs. Kostenfalle. Höhere Balken stehen für kosteneffiziente Abonnements."
              : language === "fr"
              ? "Identifie l'usage réel face aux dépenses passives. Des barres plus hautes indiquent un plan rentable."
              : "利用頻度と支出効率を対比。バーが高いほどよく利用されており、1利用あたりの費用対効果が高いことを示します。"}
          </p>

          {sortedByUsage.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-medium font-sans">
              {language === "en"
                ? "No usage data captured yet. Click \"Log Usage\" on cards to map metrics!"
                : language === "es"
                ? "Sin datos de uso. ¡Haga clic en \"Registrar Uso\" en las tarjetas!"
                : language === "de"
                ? "Noch keine Nutzungsdaten erfasst. Klicken Sie bei den Abos auf \"Sitzung loggen\"!"
                : language === "fr"
                ? "Aucune donnée d'usage. Cliquez sur \"Enregistrer Session\" sur vos fiches !"
                : "利用履歴がありません。カードの「利用を記録」を押してデータを蓄積しましょう！"}
            </div>
          ) : (
            <div className="h-44 flex items-end justify-between gap-2.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100 relative">
              {sortedByUsage.map((sub) => {
                const heightPercent = (sub.usageCount / maxUsage) * 100;
                const isHovered = hoveredBar === sub.id;

                return (
                  <div
                    key={sub.id}
                    onMouseEnter={() => setHoveredBar(sub.id)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer relative animate-fade-in"
                  >
                    {isHovered && (
                      <div className="absolute bottom-full mb-1.5 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg shadow-md z-40 whitespace-nowrap text-center font-sans">
                        <span className="font-extrabold block">{sub.name}</span>
                        <span>{sub.usageCount} {sub.usageCount === 1 ? t.sessionSingular : t.sessionPlural}</span>
                      </div>
                    )}
                    <div className="w-full relative rounded-t-lg bg-slate-200/50 h-full flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          sub.usageCount === 0 
                            ? "bg-rose-400" 
                            : isHovered 
                              ? "bg-indigo-600" 
                              : "bg-indigo-400/80 hover:bg-indigo-500"
                        }`}
                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-2 truncate w-full text-center">
                      {sub.name.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic warning if any sub has zero usage */}
        {subscriptions.some((s) => s.usageCount === 0) ? (
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2 text-rose-700 bg-rose-50/40 p-3 rounded-xl border border-rose-100">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <p className="text-[10px] font-medium leading-normal font-sans">
              {language === "en"
                ? "Warning: Some services have 0 logged usages this cycle. Consider unsubscribing to save capital!"
                : language === "es"
                ? "Advertencia: Algunos servicios tienen 0 usos registrados. ¡Considere cancelar para ahorrar!"
                : language === "de"
                ? "Warnung: Einige Abos wurden nie genutzt. Erwägen Sie eine Kündigung, um Geld zu sparen!"
                : language === "fr"
                ? "Attention : Certains abonnements ont un usage nul. Résiliez pour économiser !"
                : "警告：今月一度も利用記録がないサブスクがあります。解約によるコスト削減をご検討ください。"}
            </p>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2 text-emerald-700 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-[10px] font-medium leading-normal font-sans">
              {language === "en"
                ? "All tracked subscriptions show positive user engagement. Safe portfolio allocation!"
                : language === "es"
                ? "Todas las suscripciones muestran participación activa. ¡Asignación segura de cartera!"
                : language === "de"
                ? "Alle Abonnements weisen eine positive Nutzung auf. Sichere Portfolioverteilung!"
                : language === "fr"
                ? "Tous les abonnements présentent un usage actif. Allocation de portefeuille saine !"
                : "素晴らしい！すべての登録サブスクでアクティブな利用が確認されています。"}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
