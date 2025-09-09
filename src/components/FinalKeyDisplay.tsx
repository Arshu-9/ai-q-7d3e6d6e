import { motion } from "framer-motion";
import { Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

interface FinalKeyDisplayProps {
  finalKey: string;
}

export const FinalKeyDisplay = ({ finalKey }: FinalKeyDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (finalKey) {
      await navigator.clipboard.writeText(finalKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative"
    >
      <div className="premium-panel p-8 text-center bg-gradient-to-br from-silver-light to-card">
        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
          Generated 7-Bit Quantum Key
        </h3>
        <div className="key-display text-primary mb-4">
          {finalKey.split('').map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="inline-block mx-1"
            >
              {char}
            </motion.span>
          ))}
        </div>
        
        <motion.button
          onClick={copyToClipboard}
          className="fintech-button inline-flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Key</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};