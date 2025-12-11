import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Loader2, Zap, Sparkles } from "lucide-react";
import { ConversionStep } from "@/components/ConversionStep";
import { EnhancedBinaryDisplay } from "@/components/EnhancedBinaryDisplay";
import { AnimatedChunkDisplay } from "@/components/AnimatedChunkDisplay";
import { InteractiveMappingDisplay } from "@/components/InteractiveMappingDisplay";
import { PremiumFinalKeyDisplay } from "@/components/PremiumFinalKeyDisplay";
import { ComparisonPanel } from "@/components/ComparisonPanel";
import { EntropyVisualization } from "@/components/EntropyVisualization";
import { InteractiveStep } from "@/components/InteractiveStep";

// Christmas light colors for the typing indicator effect
const christmasColors = [
  "bg-christmas-red",
  "bg-electric-blue",
  "bg-christmas-green",
  "bg-christmas-yellow",
];

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
    <div className="min-h-screen relative">
      {/* Fog Overlay at Bottom */}
      <div className="fog-overlay" />
      
      {/* Floating Particles - Upside Down Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -20, 20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header with Stranger Things Styling */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="elegant-title mb-4">
            Heart of Black{" "}
            <span className="text-accent">-Q</span>
          </h1>
          <div className="flex items-center justify-center space-x-3 text-muted-foreground mb-6">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <p className="text-lg subtitle-glow tracking-wide">
              Enter the Upside Down of Quantum Randomness
            </p>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Sparkles className="w-5 h-5 text-secondary" />
            </motion.div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => navigate("/quantum-education")}
              variant="outline"
              className="gap-2 border-border hover:border-primary hover:bg-primary/10 transition-all duration-300 hover:shadow-neon-red"
            >
              <GraduationCap className="w-4 h-4" />
              Learn About Quantum Physics
            </Button>
            <Button
              onClick={() => navigate("/quantum-tools")}
              variant="outline"
              className="gap-2 border-border hover:border-secondary hover:bg-secondary/10 transition-all duration-300 hover:shadow-neon-purple"
            >
              <Wrench className="w-4 h-4" />
              Quantum Tools
            </Button>
          </div>
        </motion.div>

        {/* Generate Button - Walkie Talkie Style */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={generateQRNG}
            disabled={isLoading}
            className="fintech-button text-xl px-10 py-5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                {/* Sound Wave Animation */}
                <div className="flex items-center gap-1 h-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary-foreground rounded-full"
                      animate={{
                        height: [12, 24, 12],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                <span>Transmitting from the Upside Down...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-6 h-6" />
                </motion.div>
                <span>Open the Gate</span>
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
              Click to receive quantum transmissions from the other side
            </motion.p>
          )}
          
          {/* Christmas Light Typing Indicator when loading */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-2 mt-6"
            >
              {christmasColors.map((color, i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-full ${color}`}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    boxShadow: `0 0 10px currentColor`,
                  }}
                />
              ))}
            </motion.div>
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
            <div className="premium-panel p-6">
              <div className="code-display text-center text-2xl font-mono tracking-wider mb-4 border-primary/30">
                <motion.span
                  className="text-primary"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {qrngData}
                </motion.span>
              </div>
              <div className="text-sm text-center bg-muted/50 p-3 rounded-lg border border-border">
                <span className="text-primary font-semibold">⚡ QUANTUM SOURCE:</span>
                <span className="text-muted-foreground ml-2">128-bit quantum random hex from the Upside Down (ANU QRNG)</span>
              </div>
            </div>
          </InteractiveStep>

          {/* Step 2: Enhanced Hex to Binary Conversion */}
          <InteractiveStep
            title="Hex → Binary (4-bit Transformation)"
            stepNumber={2}
            isVisible={currentStep >= 1 && !!binary}
            delay={0.5}
            tooltip="Watch each hex digit magically transform into 4 binary bits with quantum-inspired animations!"
          >
            <div className="space-y-8">
              {/* Conversion Theater */}
              <div className="premium-panel p-8 relative overflow-hidden">
                {/* Animated Background Particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-primary/30 rounded-full"
                      animate={{
                        x: [0, Math.random() * 400],
                        y: [0, Math.random() * 300],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                  >
                    <h4 className="text-2xl font-bold text-foreground mb-2">Quantum Conversion Portal</h4>
                    <p className="text-muted-foreground">Witness the hex-to-binary metamorphosis</p>
                  </motion.div>
                  
                  {/* Conversion Grid */}
                  <div className="grid gap-6 max-h-80 overflow-y-auto">
                    {qrngData && qrngData.split('').map((hexChar, index) => {
                      const binaryValue = parseInt(hexChar, 16).toString(2).padStart(4, '0');
                      const decimal = parseInt(hexChar, 16);
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          transition={{ 
                            delay: index * 0.15, 
                            duration: 0.8,
                            type: "spring",
                            stiffness: 100 
                          }}
                          className="flex items-center justify-between p-6 bg-muted/30 rounded-xl border border-border backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
                        >
                          {/* Hex Input */}
                          <div className="flex flex-col items-center">
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.15 + 0.2 }}
                              className="text-xs text-accent font-semibold mb-2 tracking-wide"
                            >
                              HEX INPUT
                            </motion.span>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                              className="text-3xl font-bold text-primary-foreground bg-gradient-to-br from-primary to-secondary px-4 py-3 rounded-lg border border-primary/50 shadow-neon-red"
                            >
                              {hexChar.toUpperCase()}
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.15 + 0.5 }}
                              className="text-xs text-muted-foreground mt-1"
                            >
                              Dec: {decimal}
                            </motion.div>
                          </div>
                          
                          {/* Conversion Arrow with Animation */}
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.15 + 0.4, duration: 0.6 }}
                            className="flex flex-col items-center mx-4"
                          >
                            <motion.div
                              animate={{ 
                                x: [0, 10, 0],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                delay: index * 0.15 + 0.6
                              }}
                              className="text-2xl text-primary"
                            >
                              ⚡
                            </motion.div>
                            <span className="text-xs text-primary mt-1">CONVERT</span>
                          </motion.div>
                          
                          {/* Binary Output */}
                          <div className="flex flex-col items-center">
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.15 + 0.6 }}
                              className="text-xs text-accent font-semibold mb-2 tracking-wide"
                            >
                              4-BIT BINARY
                            </motion.span>
                            <div className="flex gap-1">
                              {binaryValue.split('').map((bit, bitIndex) => (
                                <motion.div
                                  key={bitIndex}
                                  initial={{ opacity: 0, y: 20, rotateX: 90 }}
                                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                  transition={{ 
                                    delay: index * 0.15 + bitIndex * 0.1 + 0.7,
                                    duration: 0.4,
                                    type: "spring"
                                  }}
                                  className={`relative text-xl font-bold px-3 py-2 rounded-lg border-2 transition-all duration-300 ${
                                    bit === '1' 
                                      ? 'bg-gradient-to-br from-primary to-neon-red-glow text-primary-foreground border-primary/50 shadow-neon-red' 
                                      : 'bg-muted text-muted-foreground border-border'
                                  }`}
                                >
                                  {bit}
                                  {bit === '1' && (
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                      transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                                      className="absolute inset-0 bg-primary/30 rounded-lg"
                                    />
                                  )}
                                </motion.div>
                              ))}
                            </div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.15 + 1 }}
                              className="text-xs text-muted-foreground mt-1"
                            >
                              = {parseInt(binaryValue, 2)}
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Final Binary Masterpiece */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qrngData ? qrngData.length * 0.15 + 2 : 2, duration: 0.8 }}
                className="premium-panel p-8 relative overflow-hidden"
              >
                {/* Success Particles */}
                <div className="absolute inset-0">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-primary rounded-full"
                      animate={{
                        y: [100, -10],
                        x: [0, Math.random() * 50 - 25],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <motion.h4 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: qrngData ? qrngData.length * 0.15 + 2.2 : 2.2 }}
                    className="text-2xl font-bold text-primary mb-6 text-center"
                  >
                    🎯 Binary Transformation Complete!
                  </motion.h4>
                  
                  <div className="bg-muted/50 backdrop-blur-sm p-6 rounded-xl border border-border">
                    <div className="font-mono text-sm break-all leading-relaxed">
                      {binary && binary.split('').map((bit, index) => {
                        const isGroupStart = index % 4 === 0;
                        const groupIndex = Math.floor(index / 4);
                        
                        return (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              delay: qrngData ? qrngData.length * 0.15 + 2.5 + groupIndex * 0.1 : 2.5 + groupIndex * 0.1,
                              duration: 0.2 
                            }}
                            className={`inline-block ${
                              bit === '1' ? 'text-primary font-bold' : 'text-muted-foreground'
                            } ${isGroupStart && index > 0 ? 'ml-3' : ''} ${
                              index % 4 === 3 ? 'mr-1' : ''
                            }`}
                          >
                            {bit}
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qrngData ? qrngData.length * 0.15 + 4 : 4 }}
                    className="text-center mt-6 p-4 bg-primary/10 rounded-lg border border-primary/30"
                  >
                    <div className="flex items-center justify-center gap-4 text-primary">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📊</span>
                        <span className="font-semibold">Total Bits:</span>
                        <span className="font-mono text-lg">{binary ? binary.length : 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔢</span>
                        <span className="font-semibold">4-bit Groups:</span>
                        <span className="font-mono text-lg">{binary ? Math.ceil(binary.length / 4) : 0}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
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
        className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-primary/20"
      >
        <div className="container mx-auto px-6 py-4">
          <p className="text-sm text-muted-foreground text-center font-medium">
            © 2025 Md Arshad. All rights reserved. | <span className="text-primary">Hawkins Laboratory</span>
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
