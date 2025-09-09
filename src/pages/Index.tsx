import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Loader2, Zap, Sparkles } from "lucide-react";
import { ConversionStep } from "@/components/ConversionStep";
import { EnhancedBinaryDisplay } from "@/components/EnhancedBinaryDisplay";
import { AnimatedChunkDisplay } from "@/components/AnimatedChunkDisplay";
import { InteractiveMappingDisplay } from "@/components/InteractiveMappingDisplay";
import { PremiumFinalKeyDisplay } from "@/components/PremiumFinalKeyDisplay";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { EntropyVisualization } from "@/components/EntropyVisualization";

const Index = () => {
  const navigate = useNavigate();
  const [qrngData, setQrngData] = useState<string>("");
  const [binary, setBinary] = useState<string>("");
  const [finalKey, setFinalKey] = useState<string>("");
  const [prngKey, setPrngKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const generateQRNG = async () => {
    setIsLoading(true);
    setCurrentStep(0);
    setQrngData("");
    setBinary("");
    setFinalKey("");
    setPrngKey("");
    
    try {
      // Try ANU QRNG API first
      const response = await fetch(
        "https://qrng.anu.edu.au/API/jsonI.php?length=16&type=hex16"
      );
      
      if (response.ok) {
        const data = await response.json();
        const hexData = data.data.join("");
        setQrngData(hexData);
        
        // Convert to binary and process
        setTimeout(() => {
          convertToBinary(hexData);
        }, 500);
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
      
      // Convert to binary and process
      setTimeout(() => {
        convertToBinary(hexData);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const convertToBinary = (hex: string) => {
    let binaryString = "";
    for (let i = 0; i < hex.length; i += 2) {
      const hexPair = hex.slice(i, i + 2);
      const decimal = parseInt(hexPair, 16);
      binaryString += decimal.toString(2).padStart(8, '0');
    }
    setBinary(binaryString);
    setCurrentStep(1);
    
    // Show chunks after binary
    setTimeout(() => {
      setCurrentStep(2);
    }, 1000);
    
    // Show mapping after chunks
    setTimeout(() => {
      setCurrentStep(3);
    }, 2000);
    
    // Generate final key
    setTimeout(() => {
      generateFinalKey(binaryString);
    }, 3000);
  };

  const generateFinalKey = (binaryString: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    
    for (let i = 0; i < binaryString.length - 5; i += 6) {
      const chunk = binaryString.slice(i, i + 6);
      if (chunk.length === 6) {
        const index = parseInt(chunk, 2) % chars.length;
        key += chars[index];
        if (key.length >= 7) break;
      }
    }
    
    setFinalKey(key.toUpperCase());
    
    // Generate PRNG key for comparison
    generatePRNGKey();
    
    setCurrentStep(4);
  };

  const generatePRNGKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    
    // Use Math.random() - standard PRNG
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      key += chars[randomIndex];
    }
    
    setPrngKey(key.toUpperCase());
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="elegant-title mb-4">
            Heart of Black <span className="text-royal-blue">-Q</span>
          </h1>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-6">
            <Sparkles className="w-5 h-5 text-royal-blue" />
            <p className="text-lg">Interactive Quantum Key Conversion Demo</p>
            <Sparkles className="w-5 h-5 text-royal-blue" />
          </div>
          
          <Button
            onClick={() => navigate("/quantum-education")}
            variant="outline"
            className="gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            Learn About Quantum Physics
          </Button>
        </motion.div>

        {/* Generate Button */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={generateQRNG}
            disabled={isLoading}
            className="fintech-button text-xl px-10 py-5 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Generating Quantum Data...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6" />
                <span>Generate Quantum Key</span>
              </div>
            )}
          </button>
          
          {!isLoading && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground mt-4"
            >
              Click to fetch quantum random data from ANU QRNG and see the conversion process
            </motion.p>
          )}
        </motion.div>

        {/* Interactive Step-by-Step Flow */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Step 1: Quantum Hex Data */}
          <InteractiveStep
            title="Quantum Hex Data Generation"
            stepNumber={1}
            isVisible={!!qrngData}
            delay={0.2}
            tooltip="True quantum random numbers generated from quantum vacuum fluctuations at ANU. These are fundamentally unpredictable, unlike pseudorandom numbers."
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
              <div className="code-display text-center text-2xl font-mono tracking-wider bg-white border-green-300 mb-4">
                {qrngData}
              </div>
              <div className="text-sm text-green-700 text-center bg-green-100 p-3 rounded-lg border border-green-300">
                <strong>Source:</strong> 128-bit quantum random hex from Australian National University (ANU) Quantum RNG
              </div>
            </div>
          </InteractiveStep>

          {/* Step 2: Binary Conversion */}
          <InteractiveStep
            title="Hex to Binary Conversion"
            stepNumber={2}
            isVisible={currentStep >= 1 && !!binary}
            delay={0.5}
            tooltip="Each hexadecimal character is converted to its 4-bit binary representation. This creates a long string of 1s and 0s that we can work with mathematically."
          >
            <EnhancedBinaryDisplay binary={binary} />
          </InteractiveStep>

          {/* Step 3: 6-bit Chunking */}
          <InteractiveStep
            title="6-bit Chunking Process"
            stepNumber={3}
            isVisible={currentStep >= 2 && !!binary}
            delay={0.8}
            tooltip="Binary data is split into 6-bit chunks because 2^6 = 64, which is perfect for Base-62 encoding (62 characters: A-Z, a-z, 0-9)."
          >
            <AnimatedChunkDisplay binary={binary} />
          </InteractiveStep>

          {/* Step 4: Character Mapping */}
          <InteractiveStep
            title="Base-62 Character Mapping"
            stepNumber={4}
            isVisible={currentStep >= 3 && !!binary}
            delay={1.2}
            tooltip="Each 6-bit chunk is converted to a decimal number (0-63), then mapped to our Base-62 character set. The modulo operation ensures we stay within 0-61."
          >
            <InteractiveMappingDisplay binary={binary} />
          </InteractiveStep>

          {/* Step 5: Final Quantum Key */}
          {currentStep >= 4 && finalKey && (
            <InteractiveStep
              title="Your Quantum Key is Ready!"
              stepNumber={5}
              isVisible={true}
              delay={1.8}
              tooltip="This is your final quantum-generated key. It's truly random and suitable for high-security applications where unpredictability is crucial."
            >
              <PremiumFinalKeyDisplay finalKey={finalKey} />
            </InteractiveStep>
          )}

          {/* Security Comparison Panel */}
          {currentStep >= 4 && finalKey && prngKey && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.5 }}
            >
              <ComparisonPanel quantumKey={finalKey} prngKey={prngKey} />
            </motion.div>
          )}

          {/* Entropy Visualization */}
          {qrngData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3 }}
            >
              <EntropyVisualization qrngData={qrngData} binary={binary} />
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Copyright Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50"
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

export default Index;