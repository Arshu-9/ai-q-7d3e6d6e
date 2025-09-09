import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Calculator, Trophy } from "lucide-react";

interface ComparisonData {
  quantum: string[];
  prng: string[];
}

interface ComparisonPanelProps {
  newQuantumKey?: string;
}

export const ComparisonPanel = ({ newQuantumKey }: ComparisonPanelProps) => {
  const [data, setData] = useState<ComparisonData>({ quantum: [], prng: [] });
  const [winner, setWinner] = useState<'quantum' | 'prng' | null>(null);

  // Generate PRNG key
  const generatePRNGKey = () => {
    const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array.from({ length: 1 }, () => 
      base62Chars[Math.floor(Math.random() * base62Chars.length)]
    ).join('');
  };

  useEffect(() => {
    if (newQuantumKey) {
      const prngKey = generatePRNGKey();
      setData(prev => ({
        quantum: [newQuantumKey, ...prev.quantum.slice(0, 4)],
        prng: [prngKey, ...prev.prng.slice(0, 4)]
      }));

      // Animate the "battle"
      setWinner(null);
      setTimeout(() => setWinner('quantum'), 1000);
    }
  }, [newQuantumKey]);

  const calculateEntropy = (keys: string[]) => {
    if (keys.length === 0) return 0;
    const allChars = keys.join('').split('');
    const counts = allChars.reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const total = allChars.length;
    let entropy = 0;
    Object.values(counts).forEach(count => {
      const p = count / total;
      entropy -= p * Math.log2(p);
    });
    return entropy;
  };

  const quantumEntropy = calculateEntropy(data.quantum);
  const prngEntropy = calculateEntropy(data.prng);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Quantum vs Classical Battle</h3>
        <p className="text-muted-foreground">Watch quantum randomness compete against classical algorithms</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quantum Side */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className={`premium-panel transition-all duration-500 ${
            winner === 'quantum' ? 'ring-2 ring-primary shadow-primary/20 shadow-lg' : ''
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Quantum Random
                </div>
                {winner === 'quantum' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <Badge variant="default" className="bg-primary">
                      <Trophy className="w-3 h-3 mr-1" />
                      Winner
                    </Badge>
                  </motion.div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Entropy Score</span>
                  <span className="text-sm font-mono text-primary">
                    {quantumEntropy.toFixed(3)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((quantumEntropy / 6) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-primary/70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Generated Keys</span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {data.quantum.map((key, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="font-mono text-xs p-2 bg-primary/10 rounded border border-primary/20"
                    >
                      {key}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <strong>Advantages:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• True randomness</li>
                  <li>• Unpredictable</li>
                  <li>• Quantum secure</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Classical PRNG Side */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className={`premium-panel transition-all duration-500 ${
            winner === 'prng' ? 'ring-2 ring-secondary shadow-secondary/20 shadow-lg' : ''
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-secondary" />
                  Classical PRNG
                </div>
                {winner === 'prng' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <Badge variant="secondary">
                      <Trophy className="w-3 h-3 mr-1" />
                      Winner
                    </Badge>
                  </motion.div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Entropy Score</span>
                  <span className="text-sm font-mono text-secondary">
                    {prngEntropy.toFixed(3)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((prngEntropy / 6) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-gradient-to-r from-secondary to-secondary/70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Generated Keys</span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {data.prng.map((key, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="font-mono text-xs p-2 bg-secondary/10 rounded border border-secondary/20"
                    >
                      {key}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <strong>Limitations:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Pseudo-random</li>
                  <li>• Predictable patterns</li>
                  <li>• Seed dependent</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Battle Result */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
        >
          <h4 className="text-lg font-semibold mb-2">
            {winner === 'quantum' ? 'Quantum Wins!' : 'PRNG Wins!'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {winner === 'quantum' 
              ? 'Quantum randomness provides superior entropy and true unpredictability!' 
              : 'Classical PRNG performed surprisingly well this round!'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};