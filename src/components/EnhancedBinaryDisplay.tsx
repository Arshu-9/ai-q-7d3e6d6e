import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface EnhancedBinaryDisplayProps {
  qubits: number[];
  isGenerating: boolean;
  onComplete?: (binary: string) => void;
}

export const EnhancedBinaryDisplay = ({ qubits, isGenerating, onComplete }: EnhancedBinaryDisplayProps) => {
  const [displayedBits, setDisplayedBits] = useState<number[]>([]);

  useEffect(() => {
    if (qubits.length === 0) {
      setDisplayedBits([]);
      return;
    }

    // Animate bits appearing one by one
    const timer = setTimeout(() => {
      if (displayedBits.length < qubits.length) {
        setDisplayedBits(prev => [...prev, qubits[prev.length]]);
      } else if (onComplete && displayedBits.length === qubits.length) {
        onComplete(qubits.join(''));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [qubits, displayedBits.length, onComplete]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Quantum Key Construction</h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="relative"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: displayedBits[i] !== undefined ? 1 : 0.8,
                  opacity: displayedBits[i] !== undefined ? 1 : 0.3,
                }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`
                  w-12 h-12 rounded-lg border-2 flex items-center justify-center font-mono text-lg font-bold
                  ${displayedBits[i] === 1 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : displayedBits[i] === 0 
                    ? 'bg-secondary/20 border-secondary text-secondary'
                    : 'bg-muted/20 border-muted text-muted-foreground'
                  }
                `}
              >
                {displayedBits[i] !== undefined ? displayedBits[i] : '?'}
              </motion.div>

              {/* Quantum glow effect */}
              {displayedBits[i] !== undefined && (
                <motion.div
                  className={`absolute inset-0 rounded-lg ${
                    displayedBits[i] === 1 ? 'bg-primary/30' : 'bg-secondary/30'
                  }`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {displayedBits.length === qubits.length && qubits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
          >
            <p className="text-sm text-muted-foreground mb-2">Binary String:</p>
            <p className="font-mono text-xl font-bold">{qubits.join('')}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};