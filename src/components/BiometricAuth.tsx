import React, { useState, useEffect } from "react";
import { Shield, Fingerprint, Lock, Unlock, Sparkles, RefreshCw, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BiometricAuthProps {
  onUnlock: () => void;
  isUnlocked: boolean;
}

export default function BiometricAuth({ onUnlock, isUnlocked }: BiometricAuthProps) {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success" | "failed">("idle");

  const startScanning = () => {
    setScanning(true);
    setScanStatus("scanning");
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStatus("success");
          setTimeout(() => {
            onUnlock();
          }, 800);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 text-white font-sans selection:bg-indigo-900">
      {/* BACKGROUND GRAPHIC ACCENTS */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8 relative z-10"
      >
        {/* LOGO AREA */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest text-white">
              PULSE <span className="text-xs font-bold text-indigo-400 bg-indigo-950 border border-indigo-900/50 rounded-md px-1.5 py-0.5">SECURE</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Zero-Knowledge Subscription Vault
            </p>
          </div>
        </div>

        {/* AUTH CARD */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
              {scanStatus === "success" ? (
                <>
                  <Unlock className="w-5 h-5 text-emerald-400" /> Identity Verified!
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-indigo-400" /> Biometric Key Required
                </>
              )}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Unlock access to your subscription ledger, financial portfolios, and AI intelligence dashboards.
            </p>
          </div>

          {/* SCANNER CONTAINER */}
          <div className="relative flex justify-center py-6">
            <button
              onClick={startScanning}
              disabled={scanning}
              className={`w-32 h-32 rounded-full border-2 transition-all flex flex-col items-center justify-center gap-2 relative ${
                scanStatus === "success"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : scanStatus === "scanning"
                  ? "border-indigo-500 bg-indigo-500/5 text-indigo-400"
                  : "border-slate-800 bg-slate-950/40 hover:border-indigo-500/50 text-slate-300 hover:text-white"
              }`}
            >
              {/* Ripple Ring when scanning */}
              {scanStatus === "scanning" && (
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping" />
              )}

              <Fingerprint className={`w-14 h-14 ${scanStatus === "scanning" ? "animate-pulse" : ""}`} />

              <span className="text-[10px] font-bold uppercase tracking-wider block mt-1">
                {scanStatus === "scanning"
                  ? `${scanProgress}%`
                  : scanStatus === "success"
                  ? "UNLOCKED"
                  : "TAP TO SCAN"}
              </span>

              {/* Glowing horizontal scanner bar */}
              {scanStatus === "scanning" && (
                <motion.div
                  initial={{ top: "10%" }}
                  animate={{ top: "85%" }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                  className="absolute left-4 right-4 h-0.5 bg-indigo-400 shadow-lg shadow-indigo-500/50 rounded-full"
                />
              )}
            </button>
          </div>

          {/* SIMULATED SYSTEM LOGS */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/60 font-mono text-[10px] text-left text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>SECURITY CHANNEL</span>
              <span className="text-indigo-400 font-bold">SECURE_SSL</span>
            </div>
            <div className="flex justify-between">
              <span>AES ENCRYPTION KEYS</span>
              <span className="text-slate-400">256-BIT SHIELDS</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS</span>
              <span className={scanStatus === "success" ? "text-emerald-400" : scanStatus === "scanning" ? "text-indigo-400" : "text-amber-400"}>
                {scanStatus === "success" ? "PASSED_OK" : scanStatus === "scanning" ? "HANDSHAKE" : "PORTAL_LOCKED"}
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER METRICS */}
        <div className="text-slate-500 text-[11px] flex items-center justify-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Secured with local hardware-simulated credentials.</span>
        </div>
      </motion.div>
    </div>
  );
}
