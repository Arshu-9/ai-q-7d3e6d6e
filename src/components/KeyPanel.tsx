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
      if (key.length >= 12) break; // Limit to 12 characters
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
      className="glass-panel p-8 space-y-6"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Key className="w-6 h-6 text-quantum-purple animate-glow-pulse" />
        <h2 className="text-2xl font-bold text-quantum-purple">
          Quantum Key Generator
        </h2>
      </div>

      <motion.button
        onClick={convertToAlphanumeric}
        disabled={!qrngData}
        className="quantum-button w-full disabled:opacity-30 disabled:cursor-not-allowed"
        whileHover={{ scale: qrngData ? 1.02 : 1 }}
        whileTap={{ scale: qrngData ? 0.98 : 1 }}
        style={{
          background: qrngData 
            ? "linear-gradient(135deg, hsl(var(--quantum-purple)), hsl(var(--quantum-neon)))"
            : "linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted)))"
        }}
      >
        Convert to Key
      </motion.button>

      {generatedKey && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h3 className="text-lg font-semibold text-quantum-glow">
            Generated Quantum Key:
          </h3>
          
          <div className="relative">
            <motion.div 
              className="quantum-key text-center py-8 bg-gradient-to-br from-quantum-glass/20 to-quantum-surface/30 rounded-2xl border border-quantum-glow/30 animate-neon-flicker"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {generatedKey.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 rounded-lg bg-quantum-surface/50 hover:bg-quantum-surface/70 transition-all duration-200 group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-quantum-glow group-hover:text-quantum-neon transition-colors" />
              )}
            </motion.button>
          </div>

          {copied && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-green-400 font-medium"
            >
              Key copied to clipboard!
            </motion.p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};