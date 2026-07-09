export type SubscriptionPeriod = "monthly" | "yearly";

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  period: SubscriptionPeriod;
  category: string;
  usageFrequency: "daily" | "weekly" | "monthly" | "rarely";
  usageCount: number; // Simulated usage occurrences
  billingDate: string; // ISO date string or DD/MM format
  isTrial: boolean;
  trialEndDate?: string;
  logoColor?: string; // Tailwind color name for aesthetic placeholders
  tags?: string[]; // Custom categorization tags
}

export interface SubscriptionAlert {
  id: string;
  subscriptionId: string;
  subscriptionName: string;
  type: "dormancy" | "trial_expire" | "price_hike" | "budget_limit";
  severity: "high" | "medium" | "low";
  message: string;
  dateTriggered: string;
}


export interface CheaperAlternative {
  name: string;
  cost: string;
  pros: string;
  linkText: string;
}

export interface SubscriptionAnalysis {
  subscriptionName: string;
  valueScore: number;
  status: "excellent" | "good" | "review" | "waste";
  analysis: string;
  cheaperAlternatives: CheaperAlternative[];
  recommendation: string;
}

export interface AIAnalysisResult {
  overallSummary: string;
  totalPotentialSavings: number;
  analysisList: SubscriptionAnalysis[];
  generalTips: string[];
}

export interface SearchedSubscription {
  name: string;
  category: string;
  cost: number;
  features: string[];
  rating: number;
  alternatives: {
    name: string;
    cost: string;
    details: string;
  }[];
  cancelGuide: string;
}
