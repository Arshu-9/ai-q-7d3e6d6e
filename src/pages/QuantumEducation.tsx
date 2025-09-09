import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Atom, Zap, GitBranch, Copy, BarChart3, Shuffle, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QuantumHeader } from "@/components/QuantumHeader";
import { EnhancedBinaryDisplay } from "@/components/EnhancedBinaryDisplay";
import { InteractiveStepFlow } from "@/components/InteractiveStepFlow";
import { ComparisonPanel } from "@/components/ComparisonPanel";

interface QubitProps {
  isGenerating: boolean;
  value?: number;
  delay?: number;
  index: number;
  probability?: number;
  onMeasure?: () => void;
}

interface ConversionStep {
  title: string;
  data: string;
  description: string;
}

interface EntropyData {
  quantum: number[];
  prng: number[];
}

const Qubit = ({ isGenerating, value, delay = 0, index, probability = 0.5, onMeasure }: QubitProps) => {
  const getQubitColor = () => {
    if (value === undefined) return "hsl(var(--muted))";
    return value === 1 ? "hsl(var(--primary))" : "hsl(var(--secondary))";
  };

  return (
    <div className="space-y-4">
      {/* Probability Bar */}
      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mx-auto">
        <motion.div
          className="h-full bg-gradient-to-r from-secondary via-muted to-primary"
          animate={{ 
            width: isGenerating ? ["50%", "80%", "20%", "50%"] : `${probability * 100}%` 
          }}
          transition={{ 
            duration: isGenerating ? 2 : 0.5, 
            repeat: isGenerating ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
        className="relative w-24 h-24 mx-auto cursor-pointer"
        onClick={onMeasure}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 3D Sphere Effect */}
        <motion.div
          animate={{
            rotateX: isGenerating ? 360 : 0,
            rotateY: isGenerating ? 360 : 0,
          }}
          transition={{
            rotateX: { duration: 3, repeat: isGenerating ? Infinity : 0, ease: "linear" },
            rotateY: { duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" },
          }}
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          style={{
            background: `conic-gradient(from 0deg, ${getQubitColor()}, transparent, ${getQubitColor()})`,
          }}
        />
        
        {/* Quantum field rings */}
        <motion.div
          animate={{
            rotate: isGenerating ? 360 : 0,
            scale: isGenerating ? [1, 1.3, 1] : 1,
          }}
          transition={{
            rotate: { duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" },
            scale: { duration: 1.5, repeat: isGenerating ? Infinity : 0 },
          }}
          className="absolute inset-0 rounded-full border border-primary/20"
        />
        
        {/* Inner qubit core */}
        <motion.div
          animate={{
            backgroundColor: getQubitColor(),
            boxShadow: value !== undefined 
              ? (value === 1 ? "0 0 30px hsl(var(--primary) / 0.6)" : "0 0 30px hsl(var(--secondary) / 0.6)")
              : "0 0 15px hsl(var(--muted) / 0.4)",
          }}
          transition={{
            backgroundColor: { duration: 0.5 },
            boxShadow: { duration: 0.5 },
          }}
          className="absolute inset-2 rounded-full bg-gradient-to-br from-background/80 to-muted/50 flex items-center justify-center border border-border/50 backdrop-blur-sm"
        >
          {/* State display */}
          <motion.div
            animate={{
              opacity: value !== undefined ? 1 : (isGenerating ? [0.3, 1, 0.3] : 0.6),
              scale: value !== undefined ? [1, 1.3, 1] : 1,
              rotateY: isGenerating ? [0, 180, 360] : 0,
            }}
            transition={{
              opacity: { duration: 0.8, repeat: isGenerating ? Infinity : 0 },
              scale: { duration: 0.4 },
              rotateY: { duration: 1.5, repeat: isGenerating ? Infinity : 0 },
            }}
            className="text-lg font-bold"
            style={{ color: value !== undefined ? (value === 1 ? "hsl(var(--primary))" : "hsl(var(--secondary))") : "hsl(var(--muted-foreground))" }}
          >
            {value !== undefined ? value : "⚛"}
          </motion.div>
        </motion.div>

        {/* Particle effects */}
        {isGenerating && Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/60 rounded-full"
            animate={{
              rotate: 360,
              scale: [0, 1, 0],
            }}
            transition={{
              rotate: { duration: 2 + i * 0.2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, delay: i * 0.3 },
            }}
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: `${20 + i * 5}px 0px`,
            }}
          />
        ))}

        {/* Quantum glow when measured */}
        {value !== undefined && (
          <motion.div
            className={`absolute inset-0 rounded-full ${
              value === 1 ? 'bg-primary/20' : 'bg-secondary/20'
            }`}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}
      </motion.div>

      {/* Qubit label */}
      <div className="text-center">
        <div className="text-xs text-muted-foreground">Q{index + 1}</div>
        <div className="text-xs text-muted-foreground mt-1">
          P(1): {(probability * 100).toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

const ConversionStepDisplay = ({ step, isActive, data }: { step: ConversionStep; isActive: boolean; data: string }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Data copied to clipboard" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isActive ? 1 : 0.4, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-4 rounded-lg border transition-all duration-300 ${
        isActive ? 'bg-muted/50 border-primary/50 shadow-lg' : 'bg-muted/20 border-border/30'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">{step.title}</h4>
        {data && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => copyToClipboard(data)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
      {data && (
        <div className="font-mono text-xs bg-background/50 p-2 rounded border break-all">
          {data}
        </div>
      )}
    </motion.div>
  );
};

const EntropyMeter = ({ quantumData, prngData }: { quantumData: number[]; prngData: number[] }) => {
  const calculateEntropy = (data: number[]) => {
    if (data.length === 0) return 0;
    const counts = data.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const total = data.length;
    let entropy = 0;
    Object.values(counts).forEach(count => {
      const p = count / total;
      entropy -= p * Math.log2(p);
    });
    return entropy;
  };

  const quantumEntropy = calculateEntropy(quantumData);
  const prngEntropy = calculateEntropy(prngData);

  return (
    <Card className="premium-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Randomness Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantum</span>
              <span className="text-sm text-primary">{quantumEntropy.toFixed(3)}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(quantumEntropy / 1) * 100}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-primary to-primary/70"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">PRNG</span>
              <span className="text-sm text-secondary">{prngEntropy.toFixed(3)}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(prngEntropy / 1) * 100}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-secondary to-secondary/70"
              />
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          Higher entropy = More random (Max: 1.0)
        </div>
      </CardContent>
    </Card>
  );
};

interface EducationCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: string[];
}

const EducationCard = ({ title, description, icon: Icon, content }: EducationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Card className="premium-panel h-full transition-all duration-300 hover:shadow-purple/20 hover:shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="elegant-title text-xl">{title}</CardTitle>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardHeader>
        
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <CardContent className="pt-0">
            <div className="space-y-3">
              {content.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 10 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <p className="text-sm text-foreground/80">{item}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </motion.div>
        
        <div className="p-6 pt-0">
          <Button variant="ghost" size="sm" className="w-full">
            {isExpanded ? "Show Less" : "Learn More"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

const QuantumEducation = () => {
  const { toast } = useToast();
  const conversionRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qubits, setQubits] = useState<number[]>([]);
  const [probabilities, setProbabilities] = useState<number[]>(Array(5).fill(0.5));
  const [finalKey, setFinalKey] = useState<string>("");
  const [entropyData, setEntropyData] = useState<EntropyData>({ quantum: [], prng: [] });
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);

  const generateQuantumKey = async () => {
    setIsGenerating(true);
    setQubits([]);
    setFinalKey("");
    
    // Generate new probabilities for this round
    const newProbabilities = Array.from({ length: 5 }, () => 0.3 + Math.random() * 0.4);
    setProbabilities(newProbabilities);
    
    // Scroll to conversion section
    setTimeout(() => {
      conversionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);

    // Step 1: Generate qubits with probabilities
    setTimeout(() => {
      const newQubits = newProbabilities.map(prob => Math.random() < prob ? 1 : 0);
      setQubits(newQubits);
      
      // Update entropy data
      setEntropyData(prev => ({
        quantum: [...prev.quantum, ...newQubits],
        prng: [...prev.prng, ...Array.from({ length: 5 }, () => Math.round(Math.random()))]
      }));
    }, 1000);

    // Wait for binary display to complete before showing final key
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const handleMeasureQubit = (index: number) => {
    if (isGenerating || qubits[index] !== undefined) return;
    
    const newQubits = [...qubits];
    newQubits[index] = Math.random() < probabilities[index] ? 1 : 0;
    setQubits(newQubits);
  };

  const handleBinaryComplete = (binary: string) => {
    // Convert to final key
    const chunks = binary.match(/.{1,6}/g) || [];
    const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const key = chunks.map(chunk => {
      const paddedChunk = chunk.padEnd(6, '0');
      const value = parseInt(paddedChunk, 2);
      return base62Chars[value % 62];
    }).join('');
    
    setFinalKey(key);
    setGeneratedKeys(prev => [key, ...prev.slice(0, 4)]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Key copied to clipboard" });
  };

  const educationData = [
    {
      title: "Superposition",
      description: "Quantum states existing simultaneously",
      icon: GitBranch,
      content: [
        "A qubit can exist in a combination of both 0 and 1 states simultaneously",
        "This creates infinite possibilities until the moment of measurement",
        "Superposition is what gives quantum systems their computational power",
        "Classical bits can only be either 0 or 1, never both at once"
      ]
    },
    {
      title: "Measurement",
      description: "True randomness from quantum collapse",
      icon: Zap,
      content: [
        "When a qubit in superposition is measured, it randomly collapses to 0 or 1",
        "This collapse is fundamentally unpredictable - even Einstein called it 'spooky'",
        "The randomness comes from the laws of quantum mechanics themselves",
        "No amount of computing power can predict the outcome in advance"
      ]
    },
    {
      title: "Quantum vs PRNG",
      description: "Why quantum randomness is superior",
      icon: Atom,
      content: [
        "PRNGs use mathematical algorithms that are ultimately deterministic",
        "Quantum randomness is based on fundamental physical processes",
        "Classical random numbers can be reproduced if you know the seed",
        "Quantum random numbers are truly unpredictable and non-reproducible"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-primary/30 rounded-full"
            animate={{
              x: [0, window.innerWidth || 1920],
              y: [window.innerHeight || 1080, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <QuantumHeader />

      <div className="container mx-auto px-6 py-12 space-y-16">
        {/* Quantum Visualization Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <h2 className="elegant-title text-2xl font-semibold mb-4">
            Quantum Measurement Visualization
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Watch as qubits in superposition collapse into definite states when measured, 
            generating true quantum randomness.
          </p>

          {/* Qubit Display */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="space-y-4">
                <Qubit
                  isGenerating={isGenerating}
                  value={qubits[i]}
                  delay={i * 0.2}
                  index={i}
                  probability={probabilities[i]}
                  onMeasure={() => handleMeasureQubit(i)}
                />
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <div className="space-y-4">
            <Button
              onClick={generateQuantumKey}
              disabled={isGenerating}
              size="lg"
              className="fintech-button"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Atom className="w-5 h-5" />
                  </motion.div>
                  Measuring Qubits...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Generate Quantum Key
                </div>
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Click qubits to measure individually or use the button above
            </p>
          </div>
        </motion.section>

        {/* Binary Display and Step Flow */}
        {qubits.length > 0 && (
          <motion.section
            ref={conversionRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-12"
          >
            <EnhancedBinaryDisplay 
              qubits={qubits} 
              isGenerating={isGenerating}
              onComplete={handleBinaryComplete}
            />
            
            <InteractiveStepFlow 
              qubits={qubits}
              onFinalKey={setFinalKey}
            />
          </motion.section>
        )}

        {/* Quantum vs Classical Comparison */}
        {finalKey && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <ComparisonPanel newQuantumKey={finalKey} />
          </motion.section>
        )}

        {/* Entropy Visualization */}
        {entropyData.quantum.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <EntropyMeter quantumData={entropyData.quantum} prngData={entropyData.prng} />
          </motion.section>
        )}

        {/* Education Cards Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-primary" />
              <h2 className="elegant-title text-2xl font-semibold">
                Understanding Quantum Mechanics
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the fundamental principles that make quantum randomness possible
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {educationData.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
              >
                <EducationCard {...card} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Copyright Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-16"
      >
        <div className="container mx-auto px-6 py-4">
          <p className="text-sm text-muted-foreground text-center font-medium">
            © 2025 Md Arshad. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default QuantumEducation;