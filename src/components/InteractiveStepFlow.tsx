import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Copy, ChevronRight, Zap, Binary } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ChunkVisualizationProps {
  binaryString: string;
}

const ChunkVisualization = ({ binaryString }: ChunkVisualizationProps) => {
  const chunks = binaryString.match(/.{1,6}/g) || [];
  const paddedChunks = chunks.map(chunk => chunk.padEnd(6, '0'));
  
  const colors = [
    'bg-blue-500/20 border-blue-400 text-blue-300',
    'bg-emerald-500/20 border-emerald-400 text-emerald-300',
    'bg-purple-500/20 border-purple-400 text-purple-300',
    'bg-amber-500/20 border-amber-400 text-amber-300',
    'bg-rose-500/20 border-rose-400 text-rose-300',
  ];

  return (
    <div className="space-y-3">
      {/* Animated Background */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 p-4">
        {/* Floating particles */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
            }}
          />
        ))}
        
        {/* Binary Stream Visualization */}
        <div className="relative space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Binary className="w-3 h-3" />
            <span>Binary Stream Segmentation</span>
          </div>
          
          {/* Full binary with chunk separators */}
          <div className="font-mono text-sm text-foreground/80 p-2 bg-background/50 rounded border">
            {paddedChunks.map((chunk, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.3, duration: 0.5 }}
                className="inline-block"
              >
                {chunk.split('').map((bit, bitIndex) => (
                  <motion.span
                    key={`${index}-${bitIndex}`}
                    className={`inline-block px-0.5 mx-0.5 rounded ${
                      bit === '1' ? 'bg-primary/30 text-primary' : 'bg-muted/30 text-muted-foreground'
                    }`}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: (index * 6 + bitIndex) * 0.1,
                    }}
                  >
                    {bit}
                  </motion.span>
                ))}
                {index < paddedChunks.length - 1 && (
                  <motion.span
                    className="text-primary/60 mx-1"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                )}
              </motion.span>
            ))}
          </div>
          
          {/* Individual chunks display */}
          <div className="flex flex-wrap gap-2 mt-4">
            {paddedChunks.map((chunk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, rotateY: -90 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  delay: index * 0.2, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                className={`relative px-3 py-2 rounded-lg border-2 font-mono text-xs font-semibold ${
                  colors[index % colors.length]
                } shadow-lg backdrop-blur-sm`}
                style={{
                  transform: 'perspective(1000px) rotateX(5deg)',
                }}
              >
                {/* Lightning effect for active chunks */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                >
                  <Zap className="w-3 h-3 text-primary" />
                </motion.div>
                
                <div className="space-y-1">
                  <div className="text-center">{chunk}</div>
                  <div className="text-[10px] text-center opacity-70">
                    #{index + 1}
                  </div>
                </div>
                
                {/* Quantum glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg border border-primary/30"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0)',
                      '0 0 0 4px rgba(59, 130, 246, 0.3)',
                      '0 0 0 0 rgba(59, 130, 246, 0)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50"
          >
            <div className="flex justify-center gap-4">
              <span>Total chunks: {paddedChunks.length}</span>
              <span>•</span>
              <span>Bits per chunk: 6</span>
              <span>•</span>
              <span>Total bits: {binaryString.length}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface ConversionStep {
  title: string;
  data: string;
  description: string;
  icon: string;
}

interface InteractiveStepFlowProps {
  qubits: number[];
  onFinalKey?: (key: string) => void;
}

export const InteractiveStepFlow = ({ qubits, onFinalKey }: InteractiveStepFlowProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<ConversionStep[]>([]);

  useEffect(() => {
    if (qubits.length === 0) {
      setSteps([]);
      setCurrentStep(0);
      return;
    }

    const binaryString = qubits.join('');
    const hexValue = parseInt(binaryString, 2).toString(16).toUpperCase();
    const chunks = binaryString.match(/.{1,6}/g) || [];
    const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const finalKey = chunks.map(chunk => {
      const paddedChunk = chunk.padEnd(6, '0');
      const value = parseInt(paddedChunk, 2);
      return base62Chars[value % 62];
    }).join('');

    const newSteps: ConversionStep[] = [
      {
        title: "Binary",
        data: binaryString,
        description: "Raw quantum measurements",
        icon: "🔢"
      },
      {
        title: "Hexadecimal",
        data: hexValue,
        description: "Converted to hex format",
        icon: "🔧"
      },
      {
        title: "6-bit Chunks",
        data: chunks.join(' | '),
        description: "Quantum Bit Segmentation Lab",
        icon: "⚡"
      },
      {
        title: "Base62 Key",
        data: finalKey,
        description: "Final alphanumeric key",
        icon: "🔑"
      }
    ];

    setSteps(newSteps);
    
    // Animate through steps
    let stepIndex = 0;
    const stepTimer = setInterval(() => {
      setCurrentStep(stepIndex);
      stepIndex++;
      if (stepIndex >= newSteps.length) {
        clearInterval(stepTimer);
        if (onFinalKey) {
          onFinalKey(finalKey);
        }
      }
    }, 1000);

    return () => clearInterval(stepTimer);
  }, [qubits, onFinalKey]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Data copied to clipboard" });
  };

  if (steps.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-center mb-6">Live Conversion Process</h3>
      
      <div className="flex items-center justify-center gap-4 overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{
                scale: currentStep >= index ? 1 : 0.8,
                opacity: currentStep >= index ? 1 : 0.3,
              }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Card className={`min-w-[200px] transition-all duration-500 ${
                currentStep >= index 
                  ? 'premium-panel shadow-lg border-primary/50' 
                  : 'bg-muted/20 border-border/30'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{step.icon}</span>
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                    </div>
                    {currentStep >= index && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(step.data)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                  
                  {currentStep >= index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.5 }}
                      className="font-mono text-xs bg-background/50 p-2 rounded border break-all"
                    >
                      {index === 2 ? (
                        <ChunkVisualization binaryString={qubits.join('')} />
                      ) : (
                        step.data
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Pulse effect for active step */}
              {currentStep === index && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-primary/50"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5] 
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              )}
            </motion.div>

            {/* Arrow between steps */}
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={{ opacity: currentStep > index ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
              >
                <ChevronRight className="w-6 h-6 text-muted-foreground" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};