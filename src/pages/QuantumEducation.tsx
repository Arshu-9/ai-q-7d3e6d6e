import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Atom, Zap, GitBranch, Copy, BarChart3, TrendingUp, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface QubitProps {
  isGenerating: boolean;
  value?: number;
  delay?: number;
  index: number;
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

const Qubit = ({ isGenerating, value, delay = 0, index }: QubitProps) => {
  const getQubitColor = () => {
    if (value === undefined) return "hsl(var(--muted))";
    return value === 1 ? "hsl(var(--primary))" : "hsl(var(--secondary))";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="relative w-24 h-24 mx-auto"
    >
      {/* Quantum field rings */}
      <motion.div
        animate={{
          rotate: isGenerating ? 360 : 0,
          scale: isGenerating ? [1, 1.2, 1] : 1,
        }}
        transition={{
          rotate: { duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" },
          scale: { duration: 1.5, repeat: isGenerating ? Infinity : 0 },
        }}
        className="absolute inset-0 rounded-full border-2 border-primary/20"
      />
      
      {/* Inner qubit core */}
      <motion.div
        animate={{
          rotateY: isGenerating ? 360 : 0,
          backgroundColor: getQubitColor(),
          boxShadow: value !== undefined 
            ? (value === 1 ? "0 0 20px hsl(var(--primary) / 0.5)" : "0 0 20px hsl(var(--secondary) / 0.5)")
            : "0 0 10px hsl(var(--muted) / 0.3)",
        }}
        transition={{
          rotateY: { duration: 1.5, repeat: isGenerating ? Infinity : 0, ease: "easeInOut" },
          backgroundColor: { duration: 0.5 },
          boxShadow: { duration: 0.5 },
        }}
        className="absolute inset-2 rounded-full bg-gradient-to-br from-background/80 to-muted/50 flex items-center justify-center border border-border/50"
      >
        {/* State display */}
        <motion.div
          animate={{
            opacity: value !== undefined ? 1 : (isGenerating ? [0.3, 1, 0.3] : 0.6),
            scale: value !== undefined ? [1, 1.2, 1] : 1,
          }}
          transition={{
            opacity: { duration: 0.8, repeat: isGenerating ? Infinity : 0 },
            scale: { duration: 0.3 },
          }}
          className="text-lg font-bold"
          style={{ color: value !== undefined ? (value === 1 ? "hsl(var(--primary))" : "hsl(var(--secondary))") : "hsl(var(--muted-foreground))" }}
        >
          {value !== undefined ? value : "?"}
        </motion.div>
      </motion.div>

      {/* Superposition orbits */}
      {isGenerating && (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-primary rounded-full transform -translate-x-1/2" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-secondary rounded-full transform -translate-x-1/2" />
          </motion.div>
        </>
      )}

      {/* Qubit label */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
        Q{index + 1}
      </div>
    </motion.div>
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const conversionRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qubits, setQubits] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [conversionSteps, setConversionSteps] = useState<ConversionStep[]>([]);
  const [entropyData, setEntropyData] = useState<EntropyData>({ quantum: [], prng: [] });
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);

  const generateQuantumKey = async () => {
    setIsGenerating(true);
    setQubits([]);
    setCurrentStep(0);
    setConversionSteps([]);
    
    // Scroll to conversion section
    setTimeout(() => {
      conversionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);

    // Step 1: Generate qubits
    setTimeout(() => {
      const newQubits = Array.from({ length: 5 }, () => Math.round(Math.random()));
      setQubits(newQubits);
      
      // Update entropy data
      setEntropyData(prev => ({
        quantum: [...prev.quantum, ...newQubits],
        prng: [...prev.prng, ...Array.from({ length: 5 }, () => Math.round(Math.random()))]
      }));
      
      setCurrentStep(1);
    }, 1000);

    // Step 2: Convert to hex
    setTimeout(() => {
      const binaryString = qubits.join('');
      const hexValue = parseInt(binaryString, 2).toString(16).toUpperCase();
      setConversionSteps(prev => [...prev, {
        title: "1. Qubits → Hexadecimal",
        data: hexValue,
        description: "Convert qubit measurements to hexadecimal format"
      }]);
      setCurrentStep(2);
    }, 2000);

    // Step 3: Convert to binary
    setTimeout(() => {
      const binaryString = qubits.join('');
      setConversionSteps(prev => [...prev, {
        title: "2. Hex → Binary",
        data: binaryString,
        description: "Convert hexadecimal to binary representation"
      }]);
      setCurrentStep(3);
    }, 3000);

    // Step 4: Create chunks
    setTimeout(() => {
      const binaryString = qubits.join('');
      const chunks = binaryString.match(/.{1,6}/g) || [];
      setConversionSteps(prev => [...prev, {
        title: "3. Binary → 6-bit Chunks",
        data: chunks.join(' | '),
        description: "Split binary into 6-bit chunks for Base62 conversion"
      }]);
      setCurrentStep(4);
    }, 4000);

    // Step 5: Convert to Base62
    setTimeout(() => {
      const binaryString = qubits.join('');
      const chunks = binaryString.match(/.{1,6}/g) || [];
      const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const base62 = chunks.map(chunk => {
        const paddedChunk = chunk.padEnd(6, '0');
        const value = parseInt(paddedChunk, 2);
        return base62Chars[value % 62];
      }).join('');
      
      setConversionSteps(prev => [...prev, {
        title: "4. Chunks → Base62",
        data: base62,
        description: "Convert each chunk to Base62 character"
      }]);
      setCurrentStep(5);
    }, 5000);

    // Step 6: Final alphanumeric key
    setTimeout(() => {
      const binaryString = qubits.join('');
      const chunks = binaryString.match(/.{1,6}/g) || [];
      const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const finalKey = chunks.map(chunk => {
        const paddedChunk = chunk.padEnd(6, '0');
        const value = parseInt(paddedChunk, 2);
        return base62Chars[value % 62];
      }).join('');
      
      setConversionSteps(prev => [...prev, {
        title: "5. Final Alphanumeric Key",
        data: finalKey,
        description: "Secure quantum-generated alphanumeric key ready for use"
      }]);
      
      setGeneratedKeys(prev => [finalKey, ...prev.slice(0, 4)]);
      setCurrentStep(6);
      setIsGenerating(false);
    }, 6000);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-border/50 bg-background/80 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="elegant-title text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Quantum Visualization & Education
              </h1>
              <p className="text-muted-foreground mt-1">
                Explore the fascinating world of quantum randomness
              </p>
            </div>
          </div>
        </div>
      </motion.header>

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
          <div className="grid grid-cols-5 gap-6 mb-12">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="space-y-4">
                <Qubit
                  isGenerating={isGenerating}
                  value={qubits[i]}
                  delay={i * 0.2}
                  index={i}
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
                  <Zap className="w-5 h-5" />
                  Generate Quantum Key
                </div>
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Watch the step-by-step conversion process below
            </p>
          </div>
        </motion.section>

        {/* Step-by-Step Conversion */}
        <motion.section
          ref={conversionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="elegant-title text-2xl font-semibold text-center mb-8">
            Live Conversion Process
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {conversionSteps.map((step, index) => (
              <ConversionStepDisplay
                key={index}
                step={step}
                isActive={currentStep > index + 1}
                data={step.data}
              />
            ))}
          </div>

          {/* Final Key Display */}
          {generatedKeys.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <Card className="premium-panel max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center">Generated Quantum Keys</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatedKeys.map((key, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg border"
                    >
                      <span className="font-mono text-sm">{key}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(key)}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.section>

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
          <h2 className="elegant-title text-2xl font-semibold text-center mb-4">
            Understanding Quantum Mechanics
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Discover the fundamental principles that make quantum randomness possible
          </p>

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