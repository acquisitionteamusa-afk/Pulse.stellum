export type LanguageCode = "en" | "es" | "de" | "fr" | "ja";

export interface TranslationDictionary {
  appName: string;
  subTitle: string;
  commandCenter: string;
  aiCoach: string;
  parityFinder: string;
  marketplace: string;
  cashFlow: string;
  trackNew: string;
  visibleCount: string;
  noSubsFound: string;
  adjustSearch: string;
  commandSearch: string;
  searchPlaceholder: string;
  secureVault: string;
  vaultDescription: string;
  exportCsv: string;
  bioActive: string;
  enableBio: string;
  purgeIndex: string;
  loadDemo: string;
  howValueWorks: string;
  valueExcellent: string;
  valueAverage: string;
  valueLow: string;
  totalMonthly: string;
  overallHealth: string;
  projectedYearly: string;
  savingsOpportunity: string;
  renewsOn: string;
  monthly: string;
  yearly: string;
  activeSessions: string;
  sessionSingular: string;
  sessionPlural: string;
  logSession: string;
  costPerSession: string;
  cancelPlan: string;
  budgetLimitLabel: string;
  budgetLimitWarning: string;
  budgetLimitSuccess: string;
  alertsTitle: string;
  actionNeeded: string;
  dormancyWarning: string;
  trialWarning: string;
  highBillWarning: string;
  optimizeBtn: string;
  shareBtn: string;
  shareTitle: string;
  shareCopied: string;
  snoozeBtn: string;
  alertSnoozed: string;
  themeLight: string;
  themeDark: string;
  tutorialTitle: string;
  tutorialStep1: string;
  tutorialStep2: string;
  tutorialStep3: string;
  tutorialClose: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: "PULSE",
    subTitle: "Unified COMMAND & OPTIMIZATION Engine",
    commandCenter: "Command Center",
    aiCoach: "AI Coach Optimizer",
    parityFinder: "Parity Comparison",
    marketplace: "Marketplace",
    cashFlow: "Cash Flow Forecast",
    trackNew: "Track New",
    visibleCount: "Visible",
    noSubsFound: "No subscriptions match your filter",
    adjustSearch: "Adjust your search keyword or tap 'Track New' to log an offline service.",
    commandSearch: "Command Search",
    searchPlaceholder: "Search name, category, tier...",
    secureVault: "Data Portability & Guard Keys",
    vaultDescription: "Export local ledgers to spreadsheet-ready backup tables, or manage secure physical credentials.",
    exportCsv: "Export Portfolio to CSV",
    bioActive: "Biometric Protection: Active",
    enableBio: "Enable Biometrics",
    purgeIndex: "Purge Index",
    loadDemo: "Load Demo Stack",
    howValueWorks: "How Value Scoring Works?",
    valueExcellent: "Excellent (70%+): Highly used digital subscriptions with low amortized cost-per-session.",
    valueAverage: "Average (40-69%): Medium usage rate. Opportunities exist to shift to lower cycles.",
    valueLow: "Low Value (Under 40%): Redundant or zombie services which are drainers.",
    totalMonthly: "Total Monthly Spend",
    overallHealth: "Overall Stack Health",
    projectedYearly: "Projected Yearly Cost",
    savingsOpportunity: "Potential Monthly Savings",
    renewsOn: "Renews on",
    monthly: "Monthly",
    yearly: "Yearly",
    activeSessions: "active sessions",
    sessionSingular: "session",
    sessionPlural: "sessions",
    logSession: "Log Session",
    costPerSession: "per session",
    cancelPlan: "Cancel Plan",
    budgetLimitLabel: "Set Monthly Budget Limit",
    budgetLimitWarning: "Warning: You have breached your monthly budget limit!",
    budgetLimitSuccess: "Safe: Spend is currently within your specified monthly budget.",
    alertsTitle: "Pulse Proactive Smart Alerts",
    actionNeeded: "Action Needed",
    dormancyWarning: "Dormancy Warning",
    trialWarning: "Trial Expiring Soon",
    highBillWarning: "High Bill Alert",
    optimizeBtn: "Optimize",
    shareBtn: "Share Snapshot",
    shareTitle: "Subscription Portfolio Snapshot",
    shareCopied: "Copied snapshot to clipboard!",
    snoozeBtn: "Snooze Alert",
    alertSnoozed: "Alert has been snoozed.",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    tutorialTitle: "Pulse Interactive Walkthrough",
    tutorialStep1: "Welcome to Pulse! Track your subscriptions, find overlaps, and monitor usage rates in real-time.",
    tutorialStep2: "Use the AI Coach to discover cost optimization strategies and get direct recommendations.",
    tutorialStep3: "Toggle currencies, set monthly budget limits, and configure biometrics to secure your local index.",
    tutorialClose: "Got it, let's go!",
  },
  es: {
    appName: "PULSE",
    subTitle: "Motor Unificado de CONTROL Y OPTIMIZACIÓN",
    commandCenter: "Centro de Control",
    aiCoach: "Entrenador AI",
    parityFinder: "Comparación de Paridad",
    marketplace: "Mercado de Planes",
    cashFlow: "Pronóstico de Flujo",
    trackNew: "Agregar Plan",
    visibleCount: "Visibles",
    noSubsFound: "Ninguna suscripción coincide con el filtro",
    adjustSearch: "Ajuste su palabra clave o toque 'Agregar Plan' para registrar un servicio.",
    commandSearch: "Buscar Suscripciones",
    searchPlaceholder: "Buscar nombre, categoría, nivel...",
    secureVault: "Portabilidad de Datos y Claves",
    vaultDescription: "Saca copias de seguridad de tus registros o gestiona llaves de seguridad física locales.",
    exportCsv: "Exportar Cartera a CSV",
    bioActive: "Protección Biométrica: Activa",
    enableBio: "Activar Biometría",
    purgeIndex: "Vaciar Índice",
    loadDemo: "Cargar Demo",
    howValueWorks: "¿Cómo funciona la Puntuación?",
    valueExcellent: "Excelente (70%+): Suscripciones muy usadas con bajo costo amortizado por sesión.",
    valueAverage: "Promedio (40-69%): Uso intermedio. Existen oportunidades para bajar de ciclo.",
    valueLow: "Bajo Valor (Bajo 40%): Servicios redundantes o zombies listos para cancelar.",
    totalMonthly: "Gasto Mensual Total",
    overallHealth: "Salud General de la Cuenta",
    projectedYearly: "Costo Anual Proyectado",
    savingsOpportunity: "Ahorro Mensual Potencial",
    renewsOn: "Se renueva el",
    monthly: "Mensual",
    yearly: "Anual",
    activeSessions: "sesiones activas",
    sessionSingular: "sesión",
    sessionPlural: "sesiones",
    logSession: "Registrar Uso",
    costPerSession: "por sesión",
    cancelPlan: "Cancelar Plan",
    budgetLimitLabel: "Límite de Presupuesto Mensual",
    budgetLimitWarning: "Advertencia: ¡Ha superado el límite de presupuesto mensual!",
    budgetLimitSuccess: "Seguro: El gasto está dentro de su presupuesto mensual especificado.",
    alertsTitle: "Alertas Inteligentes Proactivas",
    actionNeeded: "Acciones requeridas",
    dormancyWarning: "Advertencia de Inactividad",
    trialWarning: "Prueba por Expirar",
    highBillWarning: "Gasto Elevado",
    optimizeBtn: "Optimizar",
    shareBtn: "Compartir Resumen",
    shareTitle: "Resumen de Cartera de Suscripciones",
    shareCopied: "¡Resumen copiado al portapapeles!",
    snoozeBtn: "Posponer Alerta",
    alertSnoozed: "La alerta ha sido pospuesta.",
    themeLight: "Modo Claro",
    themeDark: "Modo Oscuro",
    tutorialTitle: "Guía Interactiva de Pulse",
    tutorialStep1: "¡Bienvenido a Pulse! Administre sus planes, detecte duplicados y monitoree el uso en tiempo real.",
    tutorialStep2: "Use el Entrenador AI para descubrir estrategias de optimización y recibir consejos.",
    tutorialStep3: "Cambie monedas, defina límites de presupuesto mensual y habilite biometría para proteger sus datos.",
    tutorialClose: "¡Entendido, comencemos!",
  },
  de: {
    appName: "PULSE",
    subTitle: "Einheitliche STEUERUNGS- & OPTIMIERUNGS-Engine",
    commandCenter: "Kommandozentrale",
    aiCoach: "KI-Optimierungs-Coach",
    parityFinder: "Paritätsvergleich",
    marketplace: "Marktplatz",
    cashFlow: "Cashflow-Prognose",
    trackNew: "Neu tracken",
    visibleCount: "Sichtbar",
    noSubsFound: "Keine Abonnements entsprechen Ihrem Filter",
    adjustSearch: "Passen Sie Ihren Suchbegriff an oder tippen Sie auf 'Neu tracken', um ein Offline-Abo hinzuzufügen.",
    commandSearch: "Befehlssuche",
    searchPlaceholder: "Name, Kategorie, Tarif suchen...",
    secureVault: "Datenportabilität & Schutzschlüssel",
    vaultDescription: "Exportieren Sie lokale Register in tabellenfertige Tabellen oder verwalten Sie lokale Hardwareschlüssel.",
    exportCsv: "Portfolio in CSV exportieren",
    bioActive: "Biometrischer Schutz: Aktiv",
    enableBio: "Biometrie aktivieren",
    purgeIndex: "Index leeren",
    loadDemo: "Demo-Daten laden",
    howValueWorks: "Wie funktioniert die Bewertung?",
    valueExcellent: "Hervorragend (70%+): Häufig genutzte Abos mit geringen amortisierten Kosten pro Sitzung.",
    valueAverage: "Mittelmäßig (40-69%): Mittlere Nutzungsrate. Wechselchancen zu kürzeren Zyklen.",
    valueLow: "Geringer Wert (Unter 40%): Überflüssige Dienste oder Karteileichen.",
    totalMonthly: "Monatliche Gesamtausgaben",
    overallHealth: "Gesamtzustand des Stacks",
    projectedYearly: "Projezierte Jahreskosten",
    savingsOpportunity: "Mögliche monatliche Ersparnis",
    renewsOn: "Verlängert sich am",
    monthly: "Monatlich",
    yearly: "Jährlich",
    activeSessions: "aktive Sitzungen",
    sessionSingular: "Sitzung",
    sessionPlural: "Sitzungen",
    logSession: "Sitzung loggen",
    costPerSession: "pro Sitzung",
    cancelPlan: "Abo kündigen",
    budgetLimitLabel: "Monatliches Budgetlimit",
    budgetLimitWarning: "Warnung: Sie haben Ihr monatliches Budgetlimit überschritten!",
    budgetLimitSuccess: "Sicher: Die Ausgaben liegen im Rahmen Ihres monatlichen Budgets.",
    alertsTitle: "Pulse Proaktive Smart-Warnungen",
    actionNeeded: "Aktion erforderlich",
    dormancyWarning: "Inaktivitätswarnung",
    trialWarning: "Testphase läuft ab",
    highBillWarning: "Hohe Rechnung",
    optimizeBtn: "Optimieren",
    shareBtn: "Snapshot teilen",
    shareTitle: "Abonnement-Portfolio Snapshot",
    shareCopied: "Snapshot in die Zwischenablage kopiert!",
    snoozeBtn: "Meldung snoozen",
    alertSnoozed: "Meldung wurde stummgeschaltet.",
    themeLight: "Heller Modus",
    themeDark: "Dunkler Modus",
    tutorialTitle: "Pulse Interaktive Einführung",
    tutorialStep1: "Willkommen bei Pulse! Verwalten Sie Ihre Abos, finden Sie Überschneidungen und überwachen Sie die Nutzung in Echtzeit.",
    tutorialStep2: "Nutzen Sie den KI-Coach für Kostenoptimierungsstrategien und maßgeschneiderte Tipps.",
    tutorialStep3: "Währung wechseln, monatliche Budgetlimits festlegen und Biometrie für die Datensicherheit aktivieren.",
    tutorialClose: "Verstanden, los geht's!",
  },
  fr: {
    appName: "PULSE",
    subTitle: "Moteur Unifié de COMMANDE & OPTIMISATION",
    commandCenter: "Centre de Commande",
    aiCoach: "Coach AI Optimiseur",
    parityFinder: "Comparatif de Parité",
    marketplace: "Portail Offres",
    cashFlow: "Flux de Trésorerie",
    trackNew: "Ajouter Plan",
    visibleCount: "Visibles",
    noSubsFound: "Aucun abonnement ne correspond à votre filtre",
    adjustSearch: "Modifiez votre recherche ou cliquez sur 'Ajouter Plan' pour inscrire un service.",
    commandSearch: "Recherche Commande",
    searchPlaceholder: "Nom, catégorie, palier...",
    secureVault: "Portabilité des Données",
    vaultDescription: "Exportez les journaux locaux vers des tableaux prêts pour tableur ou gérez les clés d'accès.",
    exportCsv: "Exporter Portfolio en CSV",
    bioActive: "Protection Biométrique : Active",
    enableBio: "Activer la Biométrie",
    purgeIndex: "Purger l'index",
    loadDemo: "Charger la Démo",
    howValueWorks: "Comment fonctionne le score ?",
    valueExcellent: "Excellent (70%+) : Abonnements très utilisés avec un coût amorti par session minime.",
    valueAverage: "Moyen (40-69%) : Fréquence d'usage moyenne. Possibilités de basculer vers des cycles courts.",
    valueLow: "Faible Valeur (Sous 40%) : Abonnements redondants ou oubliés à résilier d'urgence.",
    totalMonthly: "Dépenses Mensuelles Totales",
    overallHealth: "Santé Globale de la Pile",
    projectedYearly: "Coût Annuel Projeté",
    savingsOpportunity: "Économies Mensuelles Potentielles",
    renewsOn: "Renouvelé le",
    monthly: "Mensuel",
    yearly: "Annuel",
    activeSessions: "sessions actives",
    sessionSingular: "session",
    sessionPlural: "sessions",
    logSession: "Enregistrer Session",
    costPerSession: "par session",
    cancelPlan: "Résilier le Plan",
    budgetLimitLabel: "Limite de Budget Mensuel",
    budgetLimitWarning: "Attention : Vous avez dépassé votre limite budgétaire mensuelle !",
    budgetLimitSuccess: "Sécurisé : Les dépenses respectent votre budget mensuel spécifié.",
    alertsTitle: "Alertes Intelligentes Proactives",
    actionNeeded: "Action Requise",
    dormancyWarning: "Alerte Inactivité",
    trialWarning: "Fin d'Essai Imminente",
    highBillWarning: "Alerte Facture Élevée",
    optimizeBtn: "Optimiser",
    shareBtn: "Partager Aperçu",
    shareTitle: "Aperçu du Portefeuille d'Abonnements",
    shareCopied: "Aperçu copié dans le presse-papiers !",
    snoozeBtn: "Reporter l'alerte",
    alertSnoozed: "L'alerte a été reportée.",
    themeLight: "Mode Clair",
    themeDark: "Mode Sombre",
    tutorialTitle: "Tutoriel Interactif Pulse",
    tutorialStep1: "Bienvenue sur Pulse ! Suivez vos abonnements, détectez les doublons et suivez l'usage en temps réel.",
    tutorialStep2: "Utilisez le Coach AI pour obtenir des stratégies de réduction des coûts et des conseils avisés.",
    tutorialStep3: "Changez de devise, définissez un budget limite mensuel et sécurisez vos données locales avec la biométrie.",
    tutorialClose: "Compris, c'est parti !",
  },
  ja: {
    appName: "PULSE",
    subTitle: "統合型サブスク管理＆最適化エンジン",
    commandCenter: "コマンドセンター",
    aiCoach: "AIコーチ最適化",
    parityFinder: "機能・パリティ比較",
    marketplace: "マーケットプレイス",
    cashFlow: "キャッシュフロー予測",
    trackNew: "新規追加",
    visibleCount: "表示中",
    noSubsFound: "該当するサブスクリプションがありません",
    adjustSearch: "検索キーワードを変更するか、「新規追加」からオフラインサービスを登録してください。",
    commandSearch: "コマンド検索",
    searchPlaceholder: "サービス名、カテゴリー、価格帯で検索...",
    secureVault: "データのエクスポートとセキュリティ保護",
    vaultDescription: "登録リストをスプレッドシート対応のCSV形式でエクスポート、または生体認証セキュリティを設定します。",
    exportCsv: "ポートフォリオをCSVでエクスポート",
    bioActive: "生体認証保護: 有効",
    enableBio: "生体認証を有効にする",
    purgeIndex: "インデックスの初期化",
    loadDemo: "デモデータを読み込む",
    howValueWorks: "バリュー評価基準について",
    valueExcellent: "優良 (70%+): セッションあたりの費用対効果が非常に高く、頻繁に利用されているサービス。",
    valueAverage: "標準 (40-69%): 平均的な利用率。下位プランや請求周期の変更が推奨されます。",
    valueLow: "低価値 (40%未満): 利用頻度が低く、無駄遣いになっている解約検討候補。",
    totalMonthly: "月間合計支出額",
    overallHealth: "スタックの健全性スコア",
    projectedYearly: "年間予測支出額",
    savingsOpportunity: "潜在的な節約可能額 (月間)",
    renewsOn: "次回更新日:",
    monthly: "月額",
    yearly: "年額",
    activeSessions: "アクティブセッション",
    sessionSingular: "セッション",
    sessionPlural: "セッション",
    logSession: "利用を記録",
    costPerSession: "1利用あたりのコスト",
    cancelPlan: "プランを解約",
    budgetLimitLabel: "月間予算リミット設定",
    budgetLimitWarning: "警告：設定された月間支出予算を突破しています！",
    budgetLimitSuccess: "安全：支出は設定された月間予算枠内に収まっています。",
    alertsTitle: "Pulse 先進プロアクティブアラート",
    actionNeeded: "要対応アクション",
    dormancyWarning: "利用休止中警告",
    trialWarning: "無料体験期限間近",
    highBillWarning: "高額プラン警告",
    optimizeBtn: "最適化を実行",
    shareBtn: "ポートフォリオ共有",
    shareTitle: "サブスクリプションポートフォリオ概要",
    shareCopied: "クリップボードにポートフォリオ概要をコピーしました！",
    snoozeBtn: "アラートをスヌーズ",
    alertSnoozed: "アラートをスヌーズしました。",
    themeLight: "ライトモード",
    themeDark: "ダークモード",
    tutorialTitle: "Pulse インタラクティブガイド",
    tutorialStep1: "Pulseへようこそ！サブスクリプションを追跡し、重複を検出し、リアルタイムで利用状況をモニタリングします。",
    tutorialStep2: "AIコーチを使って費用最適化戦略を発見し、直接的な推奨提案を受け取ります。",
    tutorialStep3: "通貨の切り替え、月間予算制限の設定、およびローカルインデックス保護のための生体認証を設定します。",
    tutorialClose: "了解しました、スタート！",
  }
};

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rateToUSD: number;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", rateToUSD: 1.0 },
  EUR: { code: "EUR", symbol: "€", rateToUSD: 0.92 },
  GBP: { code: "GBP", symbol: "£", rateToUSD: 0.78 },
  JPY: { code: "JPY", symbol: "¥", rateToUSD: 160.0 },
  CAD: { code: "CAD", symbol: "C$", rateToUSD: 1.36 }
};
