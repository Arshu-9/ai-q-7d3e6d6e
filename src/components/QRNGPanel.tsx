import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, Zap } from "lucide-react";

interface QRNGPanelProps {
  onQRNGGenerated: (data: string) => void;
}

export const QRNGPanel = ({ onQRNGGenerated }: QRNGPanelProps) => {
  const [qrngData, setQrngData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const generateQRNG = async () => {
    setIsLoading(true);
    try {
      // Try ANU QRNG API first
      const response = await fetch(
        "https://qrng.anu.edu.au/API/jsonI.php?length=16&type=hex16"
      );
      
      if (response.ok) {
        const data = await response.json();
        const hexData = data.data.join("");
        setQrngData(hexData);
        onQRNGGenerated(hexData);
      } else {
        throw new Error("ANU API failed");
      }
    } catch (error) {
      // Fallback to crypto.getRandomValues
      console.warn("ANU QRNG API failed, using crypto fallback:", error);
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      const hexData = Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      setQrngData(hexData);
      onQRNGGenerated(hexData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="glass-panel p-8 space-y-6"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Zap className="w-6 h-6 text-quantum-neon animate-glow-pulse" />
        <h2 className="text-2xl font-bold text-quantum-neon">
          Quantum Random Generator
        </h2>
      </div>

      <motion.button
        onClick={generateQRNG}
        disabled={isLoading}
        className="quantum-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Quantum Entangling...</span>
          </div>
        ) : (
          "Generate QRNG"
        )}
      </motion.button>

      {qrngData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-quantum-glow">
            Raw Quantum Data:
          </h3>
          <div className="quantum-code break-all">
            {qrngData}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};