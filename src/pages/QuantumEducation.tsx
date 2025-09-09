import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Atom, Zap, GitBranch, Copy, BarChart3, Shuffle, Sparkles, Brain, RotateCcw, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { QuantumHeader } from "@/components/QuantumHeader";

interface QubitProps {
  isGenerating: boolean;
  value?: number;
  delay?: number;
  index: number;
  probability?: number;
  onMeasure?: () => void;
  isDraggable?: boolean;
}

interface AnimatedKeyBuilderProps {
  qubits: number[];
  finalKey: string;
  isGenerating: boolean;
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

interface EducationCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: string[];
}

const Qubit = ({ isGenerating, value, delay = 0, index, probability = 0.5, onMeasure, isDraggable = false }: QubitProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const getQubitColor = () => {
    if (value === undefined) return "hsl(var(--muted))";
    return value === 1 ? "hsl(var(--royal-blue))" : "hsl(var(--silver))";
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
        drag={isDraggable}
        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{ x: position.x, y: position.y }}
      >
        {/* 3D Sphere Effect with Enhanced Visuals */}
        <motion.div
          animate={{
            rotateX: isGenerating ? 360 : (isDragging ? 45 : 0),
            rotateY: isGenerating ? 360 : (isDragging ? 45 : 0),
            scale: isDragging ? 1.1 : 1,
          }}
          transition={{
            rotateX: { duration: 3, repeat: isGenerating ? Infinity : 0, ease: "linear" },
            rotateY: { duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" },
            scale: { duration: 0.2 },
          }}
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: value !== undefined ? getQubitColor() : "hsl(var(--border))",
            background: `conic-gradient(from 0deg, ${getQubitColor()}, transparent, ${getQubitColor()})`,
            boxShadow: value !== undefined 
              ? `0 0 20px ${getQubitColor()}40` 
              : "0 0 10px hsl(var(--muted))40",
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

        {/* Enhanced Quantum glow when measured */}
        {value !== undefined && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: value === 1 
                  ? "radial-gradient(circle, hsl(var(--royal-blue) / 0.3), transparent)"
                  : "radial-gradient(circle, hsl(var(--silver) / 0.3), transparent)"
              }}
              animate={{ 
                scale: [1, 1.8, 1],
                opacity: [0.8, 0, 0.8] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border"
              style={{
                borderColor: getQubitColor(),
              }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.2, 0.6],
                rotate: [0, 180, 360] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          </>
        )}
      </motion.div>

      {/* Enhanced Qubit label */}
      <div className="text-center">
        <Badge variant={value !== undefined ? "default" : "secondary"} className="mb-2">
          Q{index + 1}
        </Badge>
        <div className="text-xs text-muted-foreground">
          P(1): {(probability * 100).toFixed(0)}%
        </div>
        {isDraggable && (
          <div className="text-xs text-primary mt-1">
            Drag to explore!
          </div>
        )}
      </div>
    </div>
  );
};

// Animated Multi-Qubit Key Builder Component
const AnimatedKeyBuilder = ({ qubits, finalKey, isGenerating }: AnimatedKeyBuilderProps) => {
  const [displayedChars, setDisplayedChars] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (finalKey && !isGenerating) {
      setDisplayedChars([]);
      setCurrentStep(0);
      
      const chars = finalKey.split('');
      chars.forEach((char, index) => {
        setTimeout(() => {
          setDisplayedChars(prev => [...prev, char]);
          setCurrentStep(index + 1);
        }, index * 300);
      });
    }
  }, [finalKey, isGenerating]);

  return (
    <Card className="premium-panel">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Quantum Key Construction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Binary representation */}
        {qubits.length > 0 && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Binary Sequence</div>
            <div className="flex justify-center gap-1 flex-wrap">
              {qubits.map((bit, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    bit === 1 ? 'bg-royal-blue text-white' : 'bg-silver text-foreground'
                  }`}
                >
                  {bit}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Key building animation */}
        {finalKey && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-4">Generated Session Key</div>
            <div className="flex justify-center gap-2 flex-wrap min-h-[60px] items-center">
              <AnimatePresence>
                {displayedChars.map((char, index) => (
                  <motion.div
                    key={index}
                    initial={{ 
                      scale: 0, 
                      opacity: 0, 
                      rotateY: 180,
                      y: 20 
                    }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      rotateY: 0,
                      y: 0 
                    }}
                    transition={{ 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-lg flex items-center justify-center shadow-lg"
                    style={{
                      boxShadow: "0 4px 20px hsl(var(--royal-blue) / 0.3)"
                    }}
                  >
                    {char}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Loading indicators for remaining characters */}
              {displayedChars.length < finalKey.length && (
                <>
                  {Array.from({ length: finalKey.length - displayedChars.length }, (_, index) => (
                    <motion.div
                      key={`loading-${index}`}
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [0.9, 1, 0.9] 
                      }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity,
                        delay: index * 0.1 
                      }}
                      className="w-12 h-12 rounded-xl bg-muted border-2 border-dashed border-primary/30 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-primary/50 rounded-full" />
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
        isActive ? 'bg-muted/50 border-royal-blue/50 shadow-lg' : 'bg-muted/20 border-border/30'
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

const EducationCard = ({ title, description, icon: Icon, content }: EducationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 30px hsl(var(--royal-blue) / 0.15)"
      }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Card className="premium-panel h-full transition-all duration-300 hover:border-royal-blue/30">
        <CardHeader className="text-center">
          <motion.div 
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-royal-blue/20 to-silver/20 flex items-center justify-center"
            whileHover={{ 
              rotate: 360,
              background: "linear-gradient(135deg, hsl(var(--royal-blue) / 0.3), hsl(var(--silver) / 0.3))"
            }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-8 h-8 text-royal-blue" />
          </motion.div>
          <CardTitle className="text-xl font-semibold text-foreground">{title}</CardTitle>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {content.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 hover:border-royal-blue/30 transition-colors"
                    >
                      <p className="text-sm text-foreground leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="p-6 pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full hover:bg-royal-blue/10 hover:text-royal-blue transition-colors"
          >
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
  const keyBuilderRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qubits, setQubits] = useState<number[]>([]);
  const [probabilities, setProbabilities] = useState<number[]>(Array(5).fill(0.5));
  const [finalKey, setFinalKey] = useState<string>("");
  const [entropyData, setEntropyData] = useState<EntropyData>({ quantum: [], prng: [] });
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [showInteractiveMode, setShowInteractiveMode] = useState(false);
  const [conversionSteps, setConversionSteps] = useState<ConversionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const generateQuantumKey = async () => {
    setIsGenerating(true);
    setQubits([]);
    setFinalKey("");
    setConversionSteps([]);
    setCurrentStepIndex(0);
    
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
      
      // Create conversion steps
      const binary = newQubits.join('');
      const hex = parseInt(binary, 2).toString(16).toUpperCase();
      const chunks = binary.match(/.{1,6}/g) || [];
      const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const key = chunks.map(chunk => {
        const paddedChunk = chunk.padEnd(6, '0');
        const value = parseInt(paddedChunk, 2);
        return base62Chars[value % 62];
      }).join('');
      
      const steps = [
        {
          title: "1. Quantum Measurement",
          data: binary,
          description: "Qubits collapse from superposition to definite states"
        },
        {
          title: "2. Binary to Hexadecimal",
          data: hex,
          description: "Convert binary sequence to hexadecimal representation"
        },
        {
          title: "3. 6-bit Chunking",
          data: chunks.join(' '),
          description: "Split binary into 6-bit chunks for Base62 encoding"
        },
        {
          title: "4. Base62 Encoding",
          data: key,
          description: "Convert chunks to alphanumeric session key"
        }
      ];
      
      setConversionSteps(steps);
      
      // Update entropy data
      setEntropyData(prev => ({
        quantum: [...prev.quantum, ...newQubits],
        prng: [...prev.prng, ...Array.from({ length: 5 }, () => Math.round(Math.random()))]
      }));
      
      // Animate through conversion steps
      steps.forEach((_, index) => {
        setTimeout(() => {
          setCurrentStepIndex(index + 1);
        }, (index + 1) * 1000);
      });
      
      // Set final key
      setTimeout(() => {
        setFinalKey(key);
        setGeneratedKeys(prev => [key, ...prev.slice(0, 4)]);
        
        // Scroll to key builder
        setTimeout(() => {
          keyBuilderRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }, steps.length * 1000 + 500);
    }, 1500);

    // Wait for all animations to complete
    setTimeout(() => {
      setIsGenerating(false);
    }, 8000);
  };

  const handleMeasureQubit = (index: number) => {
    if (isGenerating || qubits[index] !== undefined) return;
    
    const newQubits = [...qubits];
    newQubits[index] = Math.random() < probabilities[index] ? 1 : 0;
    setQubits(newQubits);
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
        "A qubit can exist in a combination of both 0 and 1 states simultaneously until measured",
        "This creates infinite possibilities and enables quantum computational advantages",
        "Superposition is the fundamental principle that makes quantum randomness truly random",
        "Classical bits are deterministic - they can only be either 0 or 1, never both"
      ]
    },
    {
      title: "Measurement",
      description: "True randomness from quantum collapse",
      icon: Zap,
      content: [
        "Measuring a qubit forces it to 'choose' between 0 or 1 - this choice is truly random",
        "The outcome cannot be predicted even with perfect knowledge of the system",
        "Each measurement is independent and generates genuine entropy from physics",
        "This randomness is certified by the fundamental laws of quantum mechanics"
      ]
    },
    {
      title: "Quantum Applications",
      description: "Why QRNG keys matter for security",
      icon: Atom,
      content: [
        "Session keys generated with QRNG provide cryptographic security rooted in physics",
        "Unlike PRNGs, quantum keys cannot be reverse-engineered or predicted",
        "Critical for secure communications, financial transactions, and sensitive data",
        "Quantum randomness ensures your encryption keys are truly unbreakable"
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
        {/* Enhanced Quantum Visualization Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-royal-blue to-silver bg-clip-text text-transparent">
              Interactive Quantum Measurement
            </h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Atom className="w-8 h-8 text-royal-blue" />
            </motion.div>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-lg">
            Experience quantum superposition and measurement in real-time. Watch qubits exist in multiple states 
            simultaneously until measurement forces them to choose, generating true quantum randomness.
          </p>
          
          <div className="flex flex-col gap-8">
            {/* Enhanced Controls */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                onClick={generateQuantumKey}
                disabled={isGenerating}
                size="lg"
                className="bg-gradient-to-r from-royal-blue to-royal-blue-dark hover:from-royal-blue-dark hover:to-royal-blue text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Shuffle className="w-5 h-5 mr-2" />
                    </motion.div>
                    Generating Quantum Key...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Generate New Quantum Key
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => setShowInteractiveMode(!showInteractiveMode)}
                variant="outline"
                size="lg"
                className="border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white px-8 py-3 rounded-xl transition-all duration-300"
              >
                <Brain className="w-5 h-5 mr-2" />
                {showInteractiveMode ? 'Auto Mode' : 'Interactive Mode'}
              </Button>
            </div>

            {/* Enhanced Qubits Display */}
            <div className="grid grid-cols-5 gap-6 max-w-4xl mx-auto">
              {Array.from({ length: 5 }, (_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Qubit
                    index={index}
                    isGenerating={isGenerating}
                    value={qubits[index]}
                    delay={index * 0.2}
                    probability={probabilities[index]}
                    onMeasure={() => handleMeasureQubit(index)}
                    isDraggable={showInteractiveMode}
                  />
                </motion.div>
              ))}
            </div>
            
            {showInteractiveMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-center"
              >
                <Card className="premium-panel max-w-md mx-auto">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 text-royal-blue">Interactive Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      Click any qubit to measure it individually. Drag qubits around to explore quantum behavior!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Step-by-Step Conversion Process */}
        {conversionSteps.length > 0 && (
          <motion.section
            ref={conversionRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Live Conversion Process
              </h2>
              <p className="text-muted-foreground">
                Watch the step-by-step transformation from quantum measurements to session key
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {conversionSteps.map((step, index) => (
                <ConversionStepDisplay
                  key={index}
                  step={step}
                  isActive={currentStepIndex > index}
                  data={currentStepIndex > index ? step.data : ""}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Animated Multi-Qubit Key Builder */}
        {qubits.length > 0 && (
          <motion.section
            ref={keyBuilderRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <AnimatedKeyBuilder
              qubits={qubits}
              finalKey={finalKey}
              isGenerating={isGenerating}
            />
          </motion.section>
        )}



        {/* Educational Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-royal-blue to-silver bg-clip-text text-transparent mb-4">
              Understanding Quantum Principles
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Dive deep into the quantum mechanics that power true randomness and secure encryption
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {educationData.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
              >
                <EducationCard {...card} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Enhanced Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
        className="bg-gradient-to-r from-muted/20 to-muted/30 py-12 mt-20 border-t border-border/50"
      >
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="w-12 h-12 mx-auto mb-4"
            >
              <Atom className="w-full h-full text-royal-blue" />
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground">
              Quantum Visualization & Education
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Experience the future of cryptographic security through quantum randomness
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Badge variant="outline" className="border-royal-blue text-royal-blue">
                Quantum-Powered
              </Badge>
              <Badge variant="outline" className="border-silver text-silver-dark">
                Cryptographically Secure
              </Badge>
            </div>
            <div className="pt-8 border-t border-border/30 mt-8">
              <p className="text-muted-foreground text-sm">
                © 2025 Md Arshad. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default QuantumEducation;