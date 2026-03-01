'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [stage, setStage] = useState<'jump' | 'reveal' | 'finished'>('jump');

    useEffect(() => {
        // Stage 1: Jump (V pops in huge)
        // Stage 2: Reveal (V moves back, text slides out)
        // Stage 3: Finish

        const revealTimer = setTimeout(() => {
            setStage('reveal');
        }, 1400);

        const finishTimer = setTimeout(() => {
            onComplete();
        }, 4000);

        return () => {
            clearTimeout(revealTimer);
            clearTimeout(finishTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
            <div className="relative flex items-center justify-center">
                {/* The Brand 'V' Logo with Netflix-style Jump */}
                <motion.div
                    layout
                    initial={{
                        scale: 5,
                        opacity: 0,
                        filter: "brightness(0) blur(20px)"
                    }}
                    animate={{
                        scale: stage === 'jump' ? 1.4 : 1,
                        opacity: 1,
                        filter: "brightness(1) blur(0px)",
                        x: stage === 'reveal' ? -80 : 0, // Retreat back to the left
                    }}
                    transition={{
                        duration: stage === 'jump' ? 1.4 : 1.2,
                        ease: [0.34, 1.56, 0.64, 1], // bouncy effect
                    }}
                    className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center pointer-events-none"
                >
                    {/* Subtle Outer Glow to highlight the V on black */}
                    <div className="absolute inset-4 blur-[80px] bg-blue-600/30 rounded-full" />

                    <img
                        src="/image-removebg-preview.png"
                        alt="V"
                        className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.6)]"
                    />
                </motion.div>

                {/* The "aani AI" suffix revealed from the 'V' */}
                <AnimatePresence>
                    {stage === 'reveal' && (
                        <motion.div
                            initial={{ opacity: 0, x: -120, clipPath: 'inset(0 100% 0 0)' }}
                            animate={{ opacity: 1, x: -80, clipPath: 'inset(0 0% 0 0)' }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                            className="flex items-center whitespace-nowrap z-0 origin-left -ml-4 h-full"
                        >
                            <span className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-tighter leading-none select-none pr-2">
                                aani
                            </span>
                            <motion.span
                                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="text-7xl md:text-9xl font-normal text-purple-400 ml-2 italic tracking-tight italic-glow leading-none pr-4"
                            >
                                AI
                            </motion.span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
        .italic-glow {
          text-shadow: 0 0 25px rgba(96, 165, 250, 0.5);
        }
      `}</style>

            {/* Background radial sweep */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.08 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.2),transparent_70%)] pointer-events-none"
            />

            {/* Modern Accent Bar */}
            <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent"
                initial={{ width: "0%", x: "-100%" }}
                animate={{ width: "100%", x: "100%" }}
                transition={{ duration: 3.5, ease: "linear" }}
            />
        </motion.div>
    );
};
