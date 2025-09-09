import { motion } from "framer-motion";
import { Shield, AlertTriangle, TrendingUp, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ComparisonProps {
  quantumKey: string;
  prngKey: string;
}

export const ComparisonPanel = ({ quantumKey, prngKey }: ComparisonProps) => {
  const [copiedQuantum, setCopiedQuantum] = useState(false);
  const [copiedPrng, setCopiedPrng] = useState(false);

  const copyToClipboard = async (text: string, type: 'quantum' | 'prng') => {
    await navigator.clipboard.writeText(text);
    if (type === 'quantum') {
      setCopiedQuantum(true);
      setTimeout(() => setCopiedQuantum(false), 2000);
    } else {
      setCopiedPrng(true);
      setTimeout(() => setCopiedPrng(false), 2000);
    }
  };

  const comparisonData = [
    {
      aspect: "Predictability",
      quantum: "Truly Random",
      prng: "Predictable if seed known",
      quantumIcon: <Shield className="w-4 h-4 text-green-600" />,
      prngIcon: <AlertTriangle className="w-4 h-4 text-orange-500" />
    },
    {
      aspect: "Entropy Level",
      quantum: "Maximum Entropy",
      prng: "Lower Entropy",
      quantumIcon: <TrendingUp className="w-4 h-4 text-green-600" />,
      prngIcon: <TrendingUp className="w-4 h-4 text-orange-500" />
    },
    {
      aspect: "Security Level",
      quantum: "Ultra-Secure",
      prng: "Standard Security",
      quantumIcon: <Shield className="w-4 h-4 text-green-600" />,
      prngIcon: <Shield className="w-4 h-4 text-orange-500" />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="premium-panel p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground text-center mb-6">
        Security Comparison
      </h2>

      {/* Key Display Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quantum Key Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800">Quantum Key</h3>
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          
          <div className="code-display bg-white border-green-200 mb-4">
            <div className="text-2xl font-mono text-green-700 tracking-wider text-center">
              {quantumKey}
            </div>
          </div>
          
          <motion.button
            onClick={() => copyToClipboard(quantumKey, 'quantum')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {copiedQuantum ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Quantum Key</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* PRNG Key Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-orange-800">General PRNG Key</h3>
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          
          <div className="code-display bg-white border-orange-200 mb-4">
            <div className="text-2xl font-mono text-orange-700 tracking-wider text-center">
              {prngKey}
            </div>
          </div>
          
          <motion.button
            onClick={() => copyToClipboard(prngKey, 'prng')}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {copiedPrng ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy PRNG Key</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="bg-muted rounded-lg overflow-hidden"
      >
        <div className="grid grid-cols-3 bg-gradient-to-r from-royal-blue to-royal-blue-dark text-white p-4">
          <div className="font-semibold">Aspect</div>
          <div className="font-semibold text-center">Quantum Key</div>
          <div className="font-semibold text-center">General PRNG</div>
        </div>
        
        {comparisonData.map((row, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
            className="grid grid-cols-3 p-4 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors"
          >
            <div className="font-medium text-foreground">{row.aspect}</div>
            <div className="text-center flex items-center justify-center space-x-2">
              {row.quantumIcon}
              <span className="text-sm">{row.quantum}</span>
            </div>
            <div className="text-center flex items-center justify-center space-x-2">
              {row.prngIcon}
              <span className="text-sm">{row.prng}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="text-sm text-muted-foreground text-center bg-blue-50 p-4 rounded-lg border border-blue-200">
        <strong className="text-blue-700">Why Quantum Keys Matter:</strong> Quantum keys are generated from quantum mechanical processes, making them truly random and impossible to predict. This makes them ideal for ultra-secure applications where security is paramount.
      </div>
    </motion.div>
  );
};