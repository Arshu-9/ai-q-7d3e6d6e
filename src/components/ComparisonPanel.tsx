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
  quantumKey?: string;
  prngKey?: string;
}

export const ComparisonPanel = ({ newQuantumKey, quantumKey, prngKey }: ComparisonPanelProps) => {
  const finalQuantumKey = newQuantumKey || quantumKey;
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
    if (finalQuantumKey) {
      const generatedPrngKey = prngKey || generatePRNGKey();
      setData(prev => ({
        quantum: [finalQuantumKey, ...prev.quantum.slice(0, 4)],
        prng: [generatedPrngKey, ...prev.prng.slice(0, 4)]
      }));

      // Animate the "battle"
      setWinner(null);
      setTimeout(() => setWinner('quantum'), 1000);
    }
  }, [finalQuantumKey, prngKey]);

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

  return null;
};