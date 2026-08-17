import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoIcon } from './Logo';

export function Preloader() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('quorik_preloaded');
    }
    return false;
  });
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING CORE...');

  useEffect(() => {
    if (!loading) return;

    const duration = 400; // Ultra snappy fast 400ms boot
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 40) {
        setStatusText('INITIALIZING AGENTS...');
      } else if (pct < 80) {
        setStatusText('SYNCHRONIZING MODULES...');
      } else {
        setStatusText('SYSTEM READY');
      }

      if (pct >= 100) {
        clearInterval(interval);
        setLoading(false);
        try {
          sessionStorage.setItem('quorik_preloaded', 'true');
        } catch (e) {}
      }
    }, 16);

    return () => clearInterval(interval);
  }, [loading]);

  if (!loading) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.25, ease: "easeOut" } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030408] text-white overflow-hidden select-none"
        >
          {/* Cyber Grid & Glowing Ambient Lights */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-teal/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Futuristic HUD Outer Frame Lines */}
          <div className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-mono tracking-widest text-cyan-400/60">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            SYS.BOOT // QUORIK_OS_v2.4
          </div>
          <div className="absolute top-8 right-8 text-[10px] font-mono tracking-widest text-gray-500">
            LOC: 0x89F4 // ONLINE
          </div>
          <div className="absolute bottom-8 left-8 text-[10px] font-mono tracking-widest text-gray-500 hidden sm:block">
            LATENCY: 12ms // ENCRYPTION: AES-256
          </div>
          <div className="absolute bottom-8 right-8 text-[10px] font-mono tracking-widest text-cyan-400/60 hidden sm:block">
            SECURITY: VERIFIED
          </div>

          {/* HUD Corner Accents */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-brand-teal/40" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-brand-teal/40" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-brand-teal/40" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-brand-teal/40" />

          {/* Central Logo & Spinning HUD Ring */}
          <div className="relative flex flex-col items-center z-10 scale-90 sm:scale-100">
            
            {/* Outer Spinning Ring */}
            <div className="relative flex items-center justify-center w-40 h-40 mb-8">
              {/* Counter-rotating dashed HUD ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30"
              />
              
              {/* Outer pulsing ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="absolute -inset-3 rounded-full border border-cyan-400/20 border-t-brand-teal border-b-blue-600"
              />

              {/* Holographic Glowing Core Backlight */}
              <div className="absolute inset-2 rounded-xl bg-gradient-to-tr from-blue-600/30 via-brand-teal/20 to-cyan-400/30 blur-md animate-pulse" />

              {/* Central Logo Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-20 h-20 shadow-[0_0_50px_rgba(6,182,212,0.6)] rounded-lg overflow-hidden border border-cyan-400/40 p-1 bg-[#07090F]"
              >
                <LogoIcon className="w-full h-full" />
              </motion.div>
            </div>

            {/* Glowing Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-1"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.3em] uppercase text-white font-display drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                QUORIK
              </h1>
              <p className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-cyan-400/80 uppercase">
                AI Voice & Automation Architecture
              </p>
            </motion.div>

            {/* Progress Bar & Telemetry */}
            <div className="w-72 sm:w-80 mt-10 space-y-3">
              {/* Progress Percentage & Status */}
              <div className="flex items-center justify-between font-mono text-[11px] tracking-wider">
                <span className="text-cyan-300/90 truncate max-w-[200px]">{statusText}</span>
                <span className="text-brand-teal font-bold text-sm">{progress}%</span>
              </div>

              {/* Track */}
              <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/10 p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-brand-teal rounded-full relative shadow-[0_0_15px_#06B6D4]"
                  style={{ width: `${progress}%` }}
                >
                  {/* Energy pulse highlight */}
                  <div className="absolute top-0 right-0 bottom-0 w-3 bg-white blur-[2px] animate-pulse" />
                </motion.div>
              </div>

              {/* Audio Spectrum Waveform Animation */}
              <div className="flex items-center justify-center gap-1 pt-2 h-6">
                {[40, 75, 30, 90, 60, 100, 45, 80, 35, 65, 85, 50].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [`${h * 0.2}%`, `${h}%`, `${h * 0.3}%`],
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 0.6 + (i % 4) * 0.15,
                      ease: "easeInOut",
                    }}
                    className="w-1 bg-cyan-400/60 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  />
                ))}
              </div>
            </div>

            {/* Optional Fast Skip Action */}
            <button
              onClick={() => {
                setLoading(false);
                sessionStorage.setItem('quorik_preloaded', 'true');
              }}
              className="mt-6 text-[10px] font-mono tracking-widest text-gray-500 hover:text-cyan-400 transition-colors uppercase border-b border-transparent hover:border-cyan-400"
            >
              [ SKIP INTRO ]
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
