import { motion } from "framer-motion";
import { Copy, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";

interface PremiumFinalKeyDisplayProps {
  finalKey: string;
}

export const PremiumFinalKeyDisplay = ({ finalKey }: PremiumFinalKeyDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (finalKey) {
      await navigator.clipboard.writeText(finalKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
      className="relative overflow-hidden"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/5 to-silver-light/10 rounded-2xl animate-pulse" />
      
      <div className="relative premium-panel p-8 text-center bg-gradient-to-br from-silver-light/80 to-card border-2 border-royal-blue/20">
        {/* Sparkle Animation */}
        <motion.div
          initial={{ opacity: 0, rotate: -45 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-4 right-4"
        >
          <Sparkles className="w-6 h-6 text-royal-blue animate-pulse" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-lg font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Your Quantum-Generated Key
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-royal-blue to-royal-blue-dark mx-auto rounded-full" />
        </motion.div>

        {/* Key Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 120 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-white to-silver-light/50 p-6 rounded-xl border-2 border-royal-blue/30 shadow-lg">
            <div className="key-display text-royal-blue mb-2">
              {finalKey.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    delay: 1 + index * 0.1, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="inline-block mx-2 font-mono text-4xl font-bold transform hover:scale-110 transition-transform cursor-default"
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              7-Character Quantum Key
            </div>
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mb-6"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full border border-green-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Ultra-Secure Quantum Randomness</span>
          </div>
        </motion.div>
        
        {/* Copy Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.7 }}
          onClick={copyToClipboard}
          className="fintech-button text-lg px-8 py-3 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copy Quantum Key</span>
            </>
          )}
        </motion.button>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mt-6 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg"
        >
          <strong>Technical Details:</strong> Generated from quantum random hex via ANU QRNG API, 
          converted to binary, chunked into 6-bit segments, and mapped to Base-62 characters.
        </motion.div>
      </div>
    </motion.div>
  );
};