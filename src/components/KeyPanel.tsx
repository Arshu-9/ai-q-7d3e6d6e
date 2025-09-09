import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Key, CheckCircle } from "lucide-react";

interface KeyPanelProps {
  qrngData: string;
}

export const KeyPanel = ({ qrngData }: KeyPanelProps) => {
  const [generatedKey, setGeneratedKey] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const convertToAlphanumeric = () => {
    if (!qrngData) return;

    // Convert hex to binary then to 7-bit alphanumeric
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let binary = "";
    
    // Convert hex to binary
    for (let i = 0; i < qrngData.length; i += 2) {
      const hex = qrngData.slice(i, i + 2);
      const dec = parseInt(hex, 16);
      binary += dec.toString(2).padStart(8, '0');
    }

    // Convert binary to 7-bit alphanumeric key
    let key = "";
    for (let i = 0; i < binary.length - 6; i += 6) {
      const chunk = binary.slice(i, i + 6);
      const index = parseInt(chunk, 2) % chars.length;
      key += chars[index];
      if (key.length >= 7) break; // Limit to 7 characters for 7-bit
    }

    setGeneratedKey(key.toUpperCase());
  };

  const copyToClipboard = async () => {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      className="premium-panel p-8 space-y-6"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Key className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">
          Key Generator
        </h2>
      </div>

      <motion.button
        onClick={convertToAlphanumeric}
        disabled={!qrngData}
        className="fintech-button w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary"
        whileHover={{ scale: qrngData ? 1.01 : 1 }}
        whileTap={{ scale: qrngData ? 0.99 : 1 }}
      >
        Convert to 7-Bit Key
      </motion.button>

      {generatedKey && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <h3 className="text-lg font-medium text-foreground mb-2">
            Generated 7-Bit Key:
          </h3>
          <div className="text-sm text-muted-foreground mb-4 p-4 bg-muted rounded-lg border border-border">
            <strong className="text-foreground">Conversion Process:</strong> Quantum hex → Binary → 6-bit chunks → Base-62 encoding → 7-character alphanumeric key
          </div>
          
          <div className="relative">
            <motion.div 
              className="key-display text-center py-8 bg-card rounded-lg border border-border animate-soft-scale"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {generatedKey.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="inline-block mx-1"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 rounded-lg bg-background/80 hover:bg-accent transition-all duration-200 group border border-border"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </motion.button>
          </div>

          {copied && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-center text-green-600 font-medium"
            >
              Key copied to clipboard!
            </motion.p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};