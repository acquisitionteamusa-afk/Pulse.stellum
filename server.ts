import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client safely to avoid crashes if API key is not set
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_FALLBACK",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Analyze entire subscription stack
app.post("/api/analyze-stack", async (req: express.Request, res: express.Response) => {
  try {
    const { subscriptions } = req.body;
    if (!subscriptions || !Array.isArray(subscriptions)) {
      res.status(400).json({ error: "Missing or invalid subscriptions list" });
      return;
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Return high-quality, simulated fallback data if key is missing
      console.log("No API key found. Serving high-quality simulated optimization response.");
      const mockSavings = subscriptions.reduce((sum, sub) => sum + (sub.cost || 0), 0) * 0.35 * 12;
      res.json({
        overallSummary: "We detected several opportunities to optimize your digital subscription footprint! By consolidating duplicate streaming plans and switching to cheaper/free alternatives, you can save substantially without losing access to your favorite entertainment or tools.",
        totalPotentialSavings: parseFloat(mockSavings.toFixed(2)),
        analysisList: subscriptions.map(sub => {
          const cost = sub.cost || 0;
          const usageFactor = sub.usageCount === 0 ? 0 : sub.usageCount > 10 ? 95 : 40;
          const valueScore = sub.usageCount === 0 ? 5 : Math.round((usageFactor * 15) / cost);
          const finalScore = Math.min(Math.max(valueScore, 0), 100);
          
          let status = "good";
          let recommendation = "Keep using as normal.";
          let alternatives = [];

          if (finalScore < 30) {
            status = "waste";
            recommendation = "Cancel immediately. Unused and costing too much.";
            alternatives = [
              { name: "Free Tier", cost: "$0.00", pros: "Completely free, basic access", linkText: "Downgrade in settings" }
            ];
          } else if (finalScore < 60) {
            status = "review";
            recommendation = "Consider downgrading to ad-supported tier or switching to annual plan.";
            alternatives = [
              { name: `${sub.name} Ad-supported`, cost: `${(cost * 0.6).toFixed(2)}/mo`, pros: "Same content library with minor ad breaks", linkText: "Manage Account" }
            ];
          }

          return {
            subscriptionName: sub.name,
            valueScore: finalScore,
            status,
            analysis: `Your calculated cost-per-use is high due to low frequency of usage (${sub.usageCount} times recently).`,
            cheaperAlternatives: alternatives,
            recommendation
          };
        }),
        generalTips: [
          "Switch monthly plans to annual packages on services you use year-round for 20% flat savings.",
          "Check for student, family, or carrier bundles (e.g. Apple One, Spotify Family, Mobile provider streaming perks).",
          "Identify and eliminate 'zombie subscriptions' with zero logged usage in the last 30 days."
        ]
      });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `You are Pulse AI Coach, an expert FinTech-SaaS subscription optimizer.
Analyze this list of the user's active subscriptions:
${JSON.stringify(subscriptions, null, 2)}

Calculate a precise "Value Score" (0-100) for each subscription. A high score means they get outstanding value (low cost-per-use, high usage). A low score means they are overpaying or rarely using the service.
Classify status as: 'excellent', 'good', 'review' (needs adjustment), or 'waste' (cancel-ready).
Provide tailored, high-fidelity real-world free or cheaper alternatives (e.g. Spotify Free, Tubi for Netflix, YouTube Music, etc.).
Calculate overall potential annual savings in USD.
Be realistic, engaging, and professional. Ensure no invalid JSON characters or broken formats.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSummary: {
              type: Type.STRING,
              description: "A summary advising the user on their subscription health and how to maximize digital value."
            },
            totalPotentialSavings: {
              type: Type.NUMBER,
              description: "The estimated annual savings in USD if they follow your optimization recommendations."
            },
            analysisList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subscriptionName: { type: Type.STRING },
                  valueScore: { type: Type.INTEGER, description: "A score from 0 to 100." },
                  status: { type: Type.STRING, description: "Must be excellent, good, review, or waste" },
                  analysis: { type: Type.STRING, description: "Short breakdown explaining why they got this value score." },
                  cheaperAlternatives: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING, description: "Cheaper alternative or competitor name" },
                        cost: { type: Type.STRING, description: "e.g., 'Free', '$5.99/month', or '$100/year'" },
                        pros: { type: Type.STRING, description: "Core features or trade-offs" },
                        linkText: { type: Type.STRING, description: "Direct action recommendation, e.g. 'Switch to Spotify Free'" }
                      },
                      required: ["name", "cost", "pros", "linkText"]
                    }
                  },
                  recommendation: { type: Type.STRING, description: "Actionable verdict, e.g., 'Downgrade to Ad-supported tier', 'Switch to annual billing', or 'Cancel immediately'" }
                },
                required: ["subscriptionName", "valueScore", "status", "analysis", "cheaperAlternatives", "recommendation"]
              }
            },
            generalTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Proactive subscription hygiene tips, bundle optimizations, or scheduling recommendations."
            }
          },
          required: ["overallSummary", "totalPotentialSavings", "analysisList", "generalTips"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error analyzing subscription stack:", error);
    res.status(500).json({ error: error.message || "Internal server error during analysis" });
  }
});

// 2. Query any arbitrary subscription in the world
app.post("/api/query-subscription", async (req: express.Request, res: express.Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Please provide a subscription name to search." });
      return;
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.log(`No API Key found. Returning simulated search response for: ${name}`);
      res.json({
        name: name,
        category: "Digital Content & SaaS",
        cost: 14.99,
        features: ["Multi-device streaming", "High-definition content", "Offline downloads", "Ad-free experience"],
        rating: 4.2,
        alternatives: [
          { name: "Ad-supported Tier", cost: "$5.99/mo", details: "Keep the exact same content but view standard ad breaks." },
          { name: "Pluto TV / Tubi", cost: "Free", details: "Completely free alternative streaming service with catalog rotation." }
        ],
        cancelGuide: "Log into the official website, navigate to 'Account' > 'Plan Details' > 'Cancel Subscription', and confirm your cancellation."
      });
      return;
    }

    const ai = getGeminiClient();
    const prompt = `Retrieve exact subscription details, standard market cost (USD monthly), primary features, ratings, alternative options, and direct cancellation guide for the digital subscription named: "${name}". If it doesn't exist, guess standard values based on the name. Provide an objective, robust profile.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING, description: "e.g., Video Streaming, Music, AI Companion, SaaS, Publication, Fitness" },
            cost: { type: Type.NUMBER, description: "The standard monthly price in USD, e.g. 14.99" },
            features: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key features provided by this subscription."
            },
            rating: { type: Type.NUMBER, description: "Average user satisfaction rating (1.0 to 5.0 stars)." },
            alternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  cost: { type: Type.STRING, description: "e.g. Free or $6.99/mo" },
                  details: { type: Type.STRING }
                },
                required: ["name", "cost", "details"]
              }
            },
            cancelGuide: { type: Type.STRING, description: "Brief step-by-step instructions on the easiest way to cancel this subscription." }
          },
          required: ["name", "category", "cost", "features", "rating", "alternatives", "cancelGuide"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error querying subscription details:", error);
    res.status(500).json({ error: error.message || "Error searching subscription" });
  }
});

// Configure Vite middleware or static files serving
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite Dev Server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving built static files in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pulse server is running at http://0.0.0.0:${PORT}`);
  });
}

configureServer().catch((err) => {
  console.error("Failed to start Pulse server:", err);
});
