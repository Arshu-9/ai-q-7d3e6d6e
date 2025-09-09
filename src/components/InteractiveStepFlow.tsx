import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Copy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
        description: "Split for Base62 conversion",
        icon: "✂️"
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
                      {step.data}
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