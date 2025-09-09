import { motion } from "framer-motion";

export const QuantumHeader = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center py-16"
    >
      <motion.h1 
        className="elegant-title"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        HEART OF BLACK - Q
      </motion.h1>
      <motion.p 
        className="text-xl text-muted-foreground font-medium tracking-wide mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Premium Quantum Random Number Generator
      </motion.p>
      <motion.div 
        className="section-divider max-w-md mx-auto"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
      />
    </motion.header>
  );
};