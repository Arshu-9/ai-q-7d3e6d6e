import { motion } from "framer-motion";

export const QuantumHeader = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center py-12"
    >
      <motion.h1 
        className="quantum-title animate-neon-flicker"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        HEART OF BLACK - Q
      </motion.h1>
      <motion.p 
        className="text-2xl text-quantum-glow/80 font-light tracking-[0.3em] mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        PREMIUM QUANTUM GENERATOR
      </motion.p>
      <motion.div 
        className="w-32 h-1 bg-gradient-quantum mx-auto mt-6 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: 128 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      />
    </motion.header>
  );
};