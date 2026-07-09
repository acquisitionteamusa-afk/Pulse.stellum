import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Plus, Search, Calendar, CheckCircle2, 
  ArrowUpRight, SlidersHorizontal, RefreshCw, LayoutDashboard, 
  Dumbbell, Play, Music, Cpu, Cloud, Gamepad2, X, HelpCircle,
  Download, Fingerprint, Database, BarChart3, ShieldCheck, RefreshCcw, Globe, DollarSign, Settings,
  Sun, Moon, Share2
} from "lucide-react";

import { Subscription, AIAnalysisResult, SearchedSubscription } from "./types";
import { INITIAL_SUBSCRIPTIONS, CATEGORY_ICONS } from "./initialData";
import { TRANSLATIONS, CURRENCIES, LanguageCode } from "./translations";

import DashboardStats from "./components/DashboardStats";
import SubscriptionCard from "./components/SubscriptionCard";
import AddSubscriptionModal from "./components/AddSubscriptionModal";
import AIStackAudit from "./components/AIStackAudit";
import AlternativeParity from "./components/AlternativeParity";
import MarketplaceDiscovery from "./components/MarketplaceDiscovery";
import BillingCalendar from "./components/BillingCalendar";
import BiometricAuth from "./components/BiometricAuth";
import AlertsCenter from "./components/AlertsCenter";
import SubscriptionCharts from "./components/SubscriptionCharts";

export default function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "ai" | "parity" | "marketplace" | "calendar">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Theme & Extra States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("pulse_dark_mode") === "true";
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpStep, setHelpStep] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareText, setShareText] = useState("");

  // Localization States
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("pulse_language");
    return (saved as LanguageCode) || "en";
  });

  // Currency States
  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    const saved = localStorage.getItem("pulse_currency");
    return saved || "USD";
  });

  // Budget Limit state (in USD)
  const [budgetLimit, setBudgetLimit] = useState<number>(() => {
    const saved = localStorage.getItem("pulse_budget_limit");
    return saved ? parseFloat(saved) : 150.0; // standard $150 default monthly budget limit
  });

  const t = TRANSLATIONS[language];
  const curr = CURRENCIES[currencyCode] || CURRENCIES.USD;


  // Biometrics States
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("pulse_biometrics_enabled");
    return saved !== null ? saved === "true" : true; // Default true for pristine demo experience
  });
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // AI States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState<AIAnalysisResult | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Load subscriptions from local storage or initial list
  useEffect(() => {
    const saved = localStorage.getItem("pulse_subscriptions");
    if (saved) {
      try {
        setSubscriptions(JSON.parse(saved));
      } catch (err) {
        setSubscriptions(INITIAL_SUBSCRIPTIONS);
      }
    } else {
      setSubscriptions(INITIAL_SUBSCRIPTIONS);
    }
  }, []);

  // Save to local storage on change
  const saveSubscriptions = (updated: Subscription[]) => {
    setSubscriptions(updated);
    localStorage.setItem("pulse_subscriptions", JSON.stringify(updated));
  };

  // Trigger transient toast notification
  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Increment usage counter on click
  const handleLogUsage = (id: string) => {
    const updated = subscriptions.map((sub) => {
      if (sub.id === id) {
        const newCount = sub.usageCount + 1;
        showNotification(`Logged 1 active usage for ${sub.name}!`, "success");
        return {
          ...sub,
          usageCount: newCount,
        };
      }
      return sub;
    });
    saveSubscriptions(updated);
  };

  // Remove subscription
  const handleCancelSubscription = (id: string) => {
    const sub = subscriptions.find(s => s.id === id);
    const updated = subscriptions.filter((s) => s.id !== id);
    saveSubscriptions(updated);
    showNotification(`Stopped tracking ${sub?.name || "service"}.`, "info");
  };

  // Create manual subscription
  const handleAddSubscription = (newSub: Omit<Subscription, "id">) => {
    const sub: Subscription = {
      ...newSub,
      id: `sub-${Date.now()}`,
    };
    const updated = [...subscriptions, sub];
    saveSubscriptions(updated);
    showNotification(`Pulse started tracking ${newSub.name}!`, "success");
  };

  // Export subscription portfolio to CSV
  const handleExportCSV = () => {
    if (subscriptions.length === 0) {
      showNotification("No subscriptions to export.", "info");
      return;
    }
    const headers = ["ID", "Name", "Cost", "Period", "Category", "Usage Frequency", "Usage Count", "Billing Date", "Is Trial", "Tags"];
    const rows = subscriptions.map((sub) => [
      sub.id,
      sub.name,
      sub.cost,
      sub.period,
      sub.category,
      sub.usageFrequency,
      sub.usageCount,
      sub.billingDate,
      sub.isTrial ? "Yes" : "No",
      (sub.tags || []).join("; ")
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pulse_portfolio_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification("Portfolio exported to CSV!", "success");
  };

  // Wipe all subscriptions (Clean slate for publishing)
  const handleClearAll = () => {
    saveSubscriptions([]);
    showNotification("Wiped portfolio database to empty slate.", "info");
  };

  // Toggle biometric protection setting
  const handleToggleBiometrics = () => {
    const nextVal = !biometricsEnabled;
    setBiometricsEnabled(nextVal);
    localStorage.setItem("pulse_biometrics_enabled", String(nextVal));
    showNotification(nextVal ? "Biometric scan enabled on startup." : "Biometric startup protection disabled.", "success");
  };

  const toggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    localStorage.setItem("pulse_dark_mode", String(nextVal));
    showNotification(nextVal ? "Switched to Dark Mode" : "Switched to Light Mode", "info");
  };

  const handleShareSnapshot = () => {
    if (subscriptions.length === 0) {
      const emptyMsg = language === "en" 
        ? "No subscriptions to share yet! Add some first." 
        : "¡No hay suscripciones para compartir aún! Agregue algunas primero.";
      showNotification(emptyMsg, "info");
      return;
    }
    const totalUSD = subscriptions.reduce((sum, sub) => sum + (sub.period === "monthly" ? sub.cost : sub.cost / 12), 0);
    const convertedTotal = totalUSD * curr.rateToUSD;

    let snapshot = `📊 **${t.shareTitle}**\n\n`;
    snapshot += `• **Total Spend:** ${curr.symbol}${convertedTotal.toFixed(2)}/mo (${currencyCode})\n`;
    snapshot += `• **Active Subscriptions Count:** ${subscriptions.length}\n\n`;
    snapshot += `**Services Stack:**\n`;
    
    subscriptions.forEach(sub => {
      const subCost = sub.cost * curr.rateToUSD;
      snapshot += `- ${sub.name}: ${curr.symbol}${subCost.toFixed(2)}/${sub.period === "monthly" ? "mo" : "yr"} [Usage: ${sub.usageCount} ${sub.usageCount === 1 ? t.sessionSingular : t.sessionPlural}]\n`;
    });

    snapshot += `\n*Generated via PULSE SUB INTEL*`;
    
    setShareText(snapshot);
    setIsShareModalOpen(true);
    navigator.clipboard.writeText(snapshot).then(() => {
      showNotification(t.shareCopied, "success");
    }).catch(() => {
      showNotification("Could not copy snapshot automatically.", "info");
    });
  };

  const startHelpTutorial = () => {
    setHelpStep(0);
    setIsHelpOpen(true);
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem("pulse_language", lang);
    showNotification(`Language switched to ${lang.toUpperCase()}`, "success");
  };

  const handleCurrencyChange = (currCode: string) => {
    setCurrencyCode(currCode);
    localStorage.setItem("pulse_currency", currCode);
    showNotification(`Currency switched to ${currCode}`, "success");
  };

  const handleBudgetLimitChange = (limit: number) => {
    setBudgetLimit(limit);
    localStorage.setItem("pulse_budget_limit", String(limit));
    showNotification(`Monthly budget limit set to $${limit}`, "success");
  };

  // Run full AI Audit via Gemini Express server
  const handleRunAudit = async () => {
    setIsAnalyzing(true);
    setAuditResult(null);

    try {
      const response = await fetch("/api/analyze-stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptions }),
      });

      if (!response.ok) {
        throw new Error("Failed to optimize stack. Please check backend connection.");
      }

      const data = await response.json();
      setAuditResult(data);
      showNotification("AI Audit Compiled successfully!", "success");
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || "Could not connect to AI server.", "info");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Search custom arbitrary service via Gemini Express server
  const handleSearchCustomService = async (name: string): Promise<SearchedSubscription | null> => {
    try {
      const response = await fetch("/api/query-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Search server failed.");
      }

      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // Apply alternative directly: substitutes premium subscription with free alternative
  const handleApplyAlternative = (subName: string, altName: string, altCostStr: string) => {
    // Parse price from string like "$5.99/mo" or "Free"
    let parsedCost = 0;
    if (altCostStr.toLowerCase() !== "free") {
      const match = altCostStr.match(/\d+(\.\d+)?/);
      if (match) {
        parsedCost = parseFloat(match[0]);
      }
    }

    const updated = subscriptions.map((sub) => {
      if (sub.name.toLowerCase() === subName.toLowerCase()) {
        showNotification(`Downgraded ${subName} to ${altName}! Saved $${(sub.cost - parsedCost).toFixed(2)}/mo.`, "success");
        return {
          ...sub,
          name: altName,
          cost: parsedCost,
          isTrial: altCostStr.toLowerCase().includes("trial"),
          usageCount: 1, // Reset usage index for fresh tier
          logoColor: "bg-slate-700",
        };
      }
      return sub;
    });

    saveSubscriptions(updated);
    
    // Refresh Audit results if present to display updated metrics
    if (auditResult) {
      handleRunAudit();
    }
  };

  // Filter local subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || sub.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const uniqueCategories = ["All", ...Array.from(new Set(subscriptions.map(s => s.category)))];

  if (biometricsEnabled && !isUnlocked) {
    return (
      <BiometricAuth onUnlock={() => setIsUnlocked(true)} isUnlocked={isUnlocked} />
    );
  }

  return (
    <div className={`min-h-screen font-sans flex flex-col selection:bg-indigo-100 transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50/50 text-slate-800"}`}>
      
      {/* HEADER SECTION */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${isDarkMode ? "bg-slate-900/90 border-slate-800/80" : "bg-white/80 border-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className={`text-lg font-black tracking-tight font-sans flex items-center gap-1.5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {t.appName} <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md px-1.5 py-0.5">SUB INTEL</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider -mt-1">
                {t.subTitle}
              </p>
            </div>
          </div>

          {/* Core Navigation Controls */}
          <nav className="hidden xl:flex gap-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "dashboard" 
                  ? (isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-900 text-white") 
                  : (isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> {t.commandCenter}
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "ai" 
                  ? (isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-900 text-white") 
                  : (isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> {t.aiCoach}
            </button>
            <button
              onClick={() => setActiveTab("parity")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "parity" 
                  ? (isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-900 text-white") 
                  : (isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t.parityFinder}
            </button>
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "marketplace" 
                  ? (isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-900 text-white") 
                  : (isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-sky-500" /> {t.marketplace}
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "calendar" 
                  ? (isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-900 text-white") 
                  : (isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> {t.cashFlow}
            </button>
          </nav>

          {/* Quick Config Selectors & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Interactive Onboarding Walkthrough */}
            <button
              onClick={startHelpTutorial}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDarkMode 
                  ? "bg-slate-900 border-slate-800 text-indigo-400 hover:bg-slate-800" 
                  : "bg-slate-50 border-slate-100 text-indigo-600 hover:bg-slate-100"
              }`}
              title={t.tutorialTitle}
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* Share Snapshot */}
            <button
              onClick={handleShareSnapshot}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDarkMode 
                  ? "bg-slate-900 border-slate-800 text-emerald-400 hover:bg-slate-800" 
                  : "bg-slate-50 border-slate-100 text-emerald-600 hover:bg-slate-100"
              }`}
              title={t.shareBtn}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDarkMode 
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800" 
                  : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
              }`}
              title={isDarkMode ? t.themeLight : t.themeDark}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Language Select */}
            <div className={`hidden sm:flex items-center gap-1 border rounded-xl px-2.5 py-1.5 transition-colors ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
                className={`bg-transparent text-[11px] font-bold focus:outline-hidden cursor-pointer ${
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <option value="en" className={isDarkMode ? "bg-slate-900 text-white" : ""}>EN</option>
                <option value="es" className={isDarkMode ? "bg-slate-900 text-white" : ""}>ES</option>
                <option value="de" className={isDarkMode ? "bg-slate-900 text-white" : ""}>DE</option>
                <option value="fr" className={isDarkMode ? "bg-slate-900 text-white" : ""}>FR</option>
                <option value="ja" className={isDarkMode ? "bg-slate-900 text-white" : ""}>JA</option>
              </select>
            </div>

            {/* Currency Select */}
            <div className={`hidden sm:flex items-center gap-1 border rounded-xl px-2.5 py-1.5 transition-colors ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <span className="text-[11px] font-bold text-slate-400">{curr.symbol}</span>
              <select
                value={currencyCode}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className={`bg-transparent text-[11px] font-bold focus:outline-hidden cursor-pointer ${
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <option value="USD" className={isDarkMode ? "bg-slate-900 text-white" : ""}>USD</option>
                <option value="EUR" className={isDarkMode ? "bg-slate-900 text-white" : ""}>EUR</option>
                <option value="GBP" className={isDarkMode ? "bg-slate-900 text-white" : ""}>GBP</option>
                <option value="JPY" className={isDarkMode ? "bg-slate-900 text-white" : ""}>JPY</option>
                <option value="CAD" className={isDarkMode ? "bg-slate-900 text-white" : ""}>CAD</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {t.trackNew}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV */}
      <div className="md:hidden flex overflow-x-auto bg-white border-b border-slate-100 px-3 py-2 gap-1 scrollbar-none">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "dashboard" ? "bg-slate-900 text-white" : "text-slate-500"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "ai" ? "bg-slate-900 text-white" : "text-slate-500"
          }`}
        >
          AI Audit
        </button>
        <button
          onClick={() => setActiveTab("parity")}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "parity" ? "bg-slate-900 text-white" : "text-slate-500"
          }`}
        >
          Parity
        </button>
        <button
          onClick={() => setActiveTab("marketplace")}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "marketplace" ? "bg-slate-900 text-white" : "text-slate-500"
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === "calendar" ? "bg-slate-900 text-white" : "text-slate-500"
          }`}
        >
          Forecast
        </button>
      </div>

      {/* TOAST TRANSIENT NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-18 right-4 z-50 max-w-sm"
          >
            <div className={`p-3.5 rounded-xl border shadow-lg text-xs font-semibold ${
              notification.type === "success" 
                ? "bg-slate-900 text-white border-slate-800" 
                : "bg-indigo-50 text-indigo-800 border-indigo-100"
            }`}>
              {notification.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN BODY WRAPPER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* STATS DECK DISPLAYED AT ROOT FOR DYNAMIC REPORTING */}
        <DashboardStats 
          subscriptions={subscriptions}
          potentialSavings={auditResult ? auditResult.totalPotentialSavings : 0}
          onAuditClick={() => {
            setActiveTab("ai");
            handleRunAudit();
          }}
          language={language}
          currencyCode={currencyCode}
        />

        {/* TAB RENDERS */}
        <div className="space-y-6">
          
          {/* TAB 1: DASHBOARD COMMAND CENTER */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* CHARTS CONTAINER (Usage and Trends Analytics) */}
              <SubscriptionCharts 
                subscriptions={subscriptions} 
                language={language}
                currencyCode={currencyCode}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* PRIMARY FEED: ACTIVE SUBSCRIPTION CARDS */}
                <div className="lg:col-span-2 space-y-4">
                  
                  {/* Smart Proactive Alerts Center */}
                  <AlertsCenter
                    subscriptions={subscriptions}
                    onActionClick={(subName) => {
                      setSearchQuery(subName);
                      setActiveTab("parity");
                    }}
                    language={language}
                    currencyCode={currencyCode}
                    budgetLimit={budgetLimit}
                    onSnoozeAlert={(msg) => showNotification(msg, "info")}
                  />

                  <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-extrabold text-slate-800">My Subscriptions Stack</h2>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                        {filteredSubscriptions.length} Visible
                      </span>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex flex-wrap gap-1">
                      {uniqueCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                            categoryFilter === cat 
                              ? "bg-slate-100 text-slate-800 border-slate-200" 
                              : "bg-transparent text-slate-400 border-transparent hover:text-slate-600"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subscriptions Grid */}
                  {filteredSubscriptions.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-3">
                      <Search className="w-10 h-10 text-slate-300 mx-auto" />
                      <h3 className="text-sm font-semibold text-slate-700">No subscriptions match your filter</h3>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Adjust your search keyword or tap "Track New" to log an offline service custom to your needs.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredSubscriptions.map((sub) => (
                        <SubscriptionCard
                          key={sub.id}
                          subscription={sub}
                          onLogUsage={handleLogUsage}
                          onCancel={handleCancelSubscription}
                          onExploreAlternatives={(name) => {
                            setSearchQuery(name);
                            setActiveTab("parity");
                          }}
                          language={language}
                          currencyCode={currencyCode}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* UTILITY SIDEBAR: SEARCH & VALUE INDEX GUIDE */}
                <div className="space-y-6">
                  
                  {/* Search Bar Widget */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      {t.commandSearch}
                    </span>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Dynamic Monthly Budget Limit Widget */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      {t.budgetLimitLabel}
                    </span>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>{curr.symbol}0</span>
                        <span className="text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg text-[11px] font-sans">
                          {curr.symbol}{(budgetLimit * curr.rateToUSD).toFixed(curr.code === "JPY" ? 0 : 2)}
                        </span>
                        <span>{curr.symbol}{(500 * curr.rateToUSD).toFixed(0)}+</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="500"
                        step="10"
                        value={budgetLimit}
                        onChange={(e) => handleBudgetLimitChange(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <p className={`text-[10px] font-bold flex items-center gap-1 leading-normal font-sans ${
                        subscriptions.reduce((sum, sub) => sum + (sub.period === "monthly" ? sub.cost : sub.cost / 12), 0) > budgetLimit
                          ? "text-rose-600"
                          : "text-emerald-600"
                      }`}>
                        {subscriptions.reduce((sum, sub) => sum + (sub.period === "monthly" ? sub.cost : sub.cost / 12), 0) > budgetLimit
                          ? t.budgetLimitWarning
                          : t.budgetLimitSuccess}
                      </p>
                    </div>
                  </div>

                  {/* Secure Administration & Portability Tools */}
                  <div className="bg-radial from-slate-900 to-indigo-950 text-white rounded-3xl p-5 border border-slate-800 shadow-md relative overflow-hidden space-y-4">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                    <div>
                      <span className="text-[9px] bg-indigo-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block font-sans">
                        {language === "en" ? "Secure Vault Tools" : language === "es" ? "Herramientas de Bóveda" : language === "de" ? "Tresor-Werkzeuge" : language === "fr" ? "Outils de Coffre" : "セキュアボルトツール"}
                      </span>
                      <h4 className="text-sm font-extrabold text-white mt-2.5 font-sans">{t.secureVault}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-sans">
                        {t.vaultDescription}
                      </p>
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      {/* Export CSV */}
                      <button 
                        onClick={handleExportCSV}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs font-sans cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> {t.exportCsv}
                      </button>

                      {/* Biometric Toggle */}
                      <button 
                        onClick={handleToggleBiometrics}
                        className={`w-full py-2 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border font-sans cursor-pointer ${
                          biometricsEnabled
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/60"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800/80"
                        }`}
                      >
                        <Fingerprint className="w-3.5 h-3.5" /> 
                        {biometricsEnabled ? t.bioActive : t.enableBio}
                      </button>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-800">
                      {/* Wipe Database */}
                      <button 
                        onClick={handleClearAll}
                        className="w-full py-2 bg-red-950/40 hover:bg-red-950/60 text-red-400 border border-red-900/30 font-bold rounded-xl text-xs transition-all cursor-pointer font-sans text-center block"
                        title="Purge local state for a clean slate"
                      >
                        {t.purgeIndex}
                      </button>
                    </div>
                  </div>

                  {/* Value index guideline */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">{t.howValueWorks}</h4>
                    <div className="space-y-2">
                      <div className="flex gap-2 text-[11px] text-slate-600 leading-normal font-sans">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <p>
                          {t.valueExcellent}
                        </p>
                      </div>
                      <div className="flex gap-2 text-[11px] text-slate-600 leading-normal font-sans">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                        <p>
                          {t.valueAverage}
                        </p>
                      </div>
                      <div className="flex gap-2 text-[11px] text-slate-600 leading-normal font-sans">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <p>
                          {t.valueLow}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: AI STACK AUDIT */}
          {activeTab === "ai" && (
            <AIStackAudit
              subscriptions={subscriptions}
              analysisResult={auditResult}
              onRunAudit={handleRunAudit}
              isAnalyzing={isAnalyzing}
              onApplyAlternative={handleApplyAlternative}
            />
          )}

          {/* TAB 3: FEATURE PARITY FINDER */}
          {activeTab === "parity" && (
            <AlternativeParity onSearchCustom={handleSearchCustomService} />
          )}

          {/* TAB 4: MARKETPLACE DIRECTORY */}
          {activeTab === "marketplace" && (
            <MarketplaceDiscovery 
              onSubscribe={handleAddSubscription}
              activeSubscriptions={subscriptions}
            />
          )}

          {/* TAB 5: BILLING FORECASTS */}
          {activeTab === "calendar" && (
            <BillingCalendar subscriptions={subscriptions} />
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-white border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 space-y-1">
          <p>© 2026 Pulse Subscription Intelligence. Read-only financial tracking with absolute zero-knowledge security.</p>
          <p className="text-[10px]">Utilizing Google Gemini 3.5 Flash for high-fidelity alternative matching, pricing index data, and stack optimization recommendations.</p>
        </div>
      </footer>

      {/* TRACK MODAL */}
      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubscription}
      />

      {/* SHARE SNAPSHOT MODAL */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-2xl border p-6 shadow-xl relative transition-colors duration-300 ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-800"
              }`}
            >
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">{t.shareBtn}</h3>
                  <p className="text-xs text-slate-400 font-medium">Copied to your clipboard with success!</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl font-mono text-[11px] leading-relaxed mb-5 overflow-y-auto max-h-60 border transition-colors ${
                isDarkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                {shareText.split("\n").map((line, i) => (
                  <p key={i}>{line || "\u00A0"}</p>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareText);
                    showNotification(t.shareCopied, "success");
                  }}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {t.shareCopied.includes("Copied") ? "Copy Again" : "Copiar"}
                </button>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                    isDarkMode 
                      ? "bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-300" 
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HELP WALKTHROUGH TUTORIAL */}
      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-md rounded-2xl border p-6 shadow-xl relative transition-colors duration-300 ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-800"
              }`}
            >
              <button
                onClick={() => setIsHelpOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {helpStep + 1}/4
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 font-sans">
                  {t.tutorialTitle}
                </h3>
              </div>

              {/* Step Content */}
              <div className="min-h-32 flex flex-col justify-center mb-6">
                {helpStep === 0 && (
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold tracking-tight">🚀 {t.appName} sub-portfolio optimizer</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.tutorialStep1}
                    </p>
                  </div>
                )}
                {helpStep === 1 && (
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold tracking-tight">🧠 AI Coach Recommendations</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.tutorialStep2}
                    </p>
                  </div>
                )}
                {helpStep === 2 && (
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold tracking-tight">🔐 Secure Vault & Configuration</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {t.tutorialStep3}
                    </p>
                  </div>
                )}
                {helpStep === 3 && (
                  <div className="space-y-3">
                    <h4 className="text-base font-extrabold tracking-tight">✨ You are completely in control!</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Wipe ledgers at any time, manage offline custom plans, set alerts, snooze warnings, or translate pages to your native tongue instantly.
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Dots */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setHelpStep(idx)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        helpStep === idx 
                          ? "bg-indigo-600 w-5" 
                          : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  {helpStep > 0 && (
                    <button
                      onClick={() => setHelpStep(helpStep - 1)}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        isDarkMode ? "hover:bg-slate-800 text-slate-350" : "hover:bg-slate-100 text-slate-500"
                      }`}
                    >
                      Back
                    </button>
                  )}
                  {helpStep < 3 ? (
                    <button
                      onClick={() => setHelpStep(helpStep + 1)}
                      className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsHelpOpen(false)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      {t.tutorialClose}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
