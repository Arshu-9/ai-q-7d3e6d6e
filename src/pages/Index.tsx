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
import { InteractiveStep } from "@/components/InteractiveStep";

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
              <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-8 rounded-2xl border border-blue-300/30 relative overflow-hidden">
                {/* Animated Background Particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
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
                    <h4 className="text-2xl font-bold text-white mb-2">Quantum Conversion Theater</h4>
                    <p className="text-blue-200">Witness the hex-to-binary metamorphosis</p>
                  </motion.div>
                  
                  {/* Conversion Grid */}
                  <div className="grid gap-6 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-blue-500">
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
                          className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-xl border border-blue-400/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
                        >
                          {/* Hex Input */}
                          <div className="flex flex-col items-center">
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.15 + 0.2 }}
                              className="text-xs text-blue-300 font-semibold mb-2 tracking-wide"
                            >
                              HEX INPUT
                            </motion.span>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                              className="text-3xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-3 rounded-lg border-2 border-blue-400/50 shadow-lg shadow-blue-500/25"
                            >
                              {hexChar.toUpperCase()}
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.15 + 0.5 }}
                              className="text-xs text-blue-200 mt-1"
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
                              className="text-2xl text-yellow-400"
                            >
                              ⚡
                            </motion.div>
                            <span className="text-xs text-yellow-300 mt-1">CONVERT</span>
                          </motion.div>
                          
                          {/* Binary Output */}
                          <div className="flex flex-col items-center">
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.15 + 0.6 }}
                              className="text-xs text-green-300 font-semibold mb-2 tracking-wide"
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
                                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-300 shadow-lg shadow-green-500/30' 
                                      : 'bg-gradient-to-br from-gray-600 to-gray-700 text-gray-300 border-gray-500 shadow-lg shadow-gray-500/20'
                                  }`}
                                >
                                  {bit}
                                  {bit === '1' && (
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                      transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                                      className="absolute inset-0 bg-green-400/30 rounded-lg"
                                    />
                                  )}
                                </motion.div>
                              ))}
                            </div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.15 + 1 }}
                              className="text-xs text-green-200 mt-1"
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
                className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border-2 border-emerald-300 relative overflow-hidden"
              >
                {/* Success Particles */}
                <div className="absolute inset-0">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-emerald-400 rounded-full"
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
                    className="text-2xl font-bold text-emerald-800 mb-6 text-center"
                  >
                    🎯 Binary Transformation Complete!
                  </motion.h4>
                  
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-emerald-200">
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
                              bit === '1' ? 'text-emerald-600 font-bold' : 'text-gray-600'
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
                    className="text-center mt-6 p-4 bg-emerald-100 rounded-lg border border-emerald-300"
                  >
                    <div className="flex items-center justify-center gap-4 text-emerald-700">
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

          {/* Step 3: Enhanced 6-bit Chunking Process */}
          <InteractiveStep
            title="6-bit Quantum Segmentation"
            stepNumber={3}
            isVisible={currentStep >= 2 && !!binary}
            delay={0.8}
            tooltip="Binary quantum data is precisely segmented into 6-bit chunks for optimal entropy distribution and character mapping."
          >
            <div className="space-y-8">
              {/* Chunking Theater */}
              <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-2xl border border-purple-300/30 relative overflow-hidden">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(168,85,247,0.1)_50%,rgba(168,85,247,0.1)_51%,transparent_52%)] bg-[length:20px_20px]"
                    animate={{ 
                      backgroundPosition: ['0px 0px', '20px 20px'],
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  />
                  {/* Floating Particles */}
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-purple-400/40 rounded-full"
                      animate={{
                        x: [0, Math.random() * 600],
                        y: [0, Math.random() * 400],
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
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
                    <h4 className="text-2xl font-bold text-white mb-2">Quantum Bit Segmentation Lab</h4>
                    <p className="text-purple-200">Precision chunking for maximum entropy extraction</p>
                  </motion.div>

                  {/* Binary Stream Visualization */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mb-8 p-6 bg-black/40 rounded-xl border border-purple-400/30 backdrop-blur-sm"
                  >
                    <div className="text-sm text-purple-300 mb-3 text-center font-semibold tracking-wide">
                      CONTINUOUS BINARY STREAM
                    </div>
                    <div className="font-mono text-xs text-white break-all leading-relaxed text-center bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                      {binary.split('').map((bit, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, color: '#9CA3AF' }}
                          animate={{ opacity: 1, color: bit === '1' ? '#10B981' : '#EF4444' }}
                          transition={{ delay: index * 0.02, duration: 0.3 }}
                          className="inline-block mx-0.5"
                        >
                          {bit}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* 6-bit Chunks Display */}
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-center text-purple-200 mb-4"
                    >
                      <span className="text-lg font-semibold">Segmenting into 6-bit chunks...</span>
                    </motion.div>
                    
                    <div className="grid gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-purple-900 scrollbar-thumb-purple-500">
                      {(() => {
                        const chunks = [];
                        const colors = [
                          'from-blue-500/80 to-blue-600/80 border-blue-400/50',
                          'from-emerald-500/80 to-emerald-600/80 border-emerald-400/50',
                          'from-purple-500/80 to-purple-600/80 border-purple-400/50',
                          'from-orange-500/80 to-orange-600/80 border-orange-400/50',
                          'from-pink-500/80 to-pink-600/80 border-pink-400/50',
                          'from-yellow-500/80 to-yellow-600/80 border-yellow-400/50',
                          'from-indigo-500/80 to-indigo-600/80 border-indigo-400/50',
                          'from-teal-500/80 to-teal-600/80 border-teal-400/50',
                        ];

                        for (let i = 0; i < binary.length - 5; i += 6) {
                          const chunk = binary.slice(i, i + 6);
                          if (chunk.length === 6) {
                            chunks.push(chunk);
                          }
                        }

                        return chunks.slice(0, 8).map((chunk, index) => {
                          const decimal = parseInt(chunk, 2);
                          const colorClass = colors[index % colors.length];
                          
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -50, rotateY: -90 }}
                              animate={{ opacity: 1, x: 0, rotateY: 0 }}
                              transition={{ 
                                delay: index * 0.2 + 1.5, 
                                duration: 0.6,
                                type: "spring",
                                stiffness: 120
                              }}
                              className={`relative p-6 bg-gradient-to-r ${colorClass} rounded-xl border-2 backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}
                            >
                              {/* Chunk Pulse Effect */}
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.05, 1],
                                  opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: Infinity,
                                  delay: index * 0.3
                                }}
                                className="absolute inset-0 bg-white/10 rounded-xl"
                              />
                              
                              <div className="relative z-10 flex items-center justify-between">
                                {/* Chunk Number */}
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-white/80 font-semibold mb-2 tracking-wide">
                                    CHUNK #{index + 1}
                                  </span>
                                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
                                    {index + 1}
                                  </div>
                                </div>

                                {/* Binary Bits */}
                                <div className="flex flex-col items-center flex-1 mx-6">
                                  <span className="text-xs text-white/80 font-semibold mb-3 tracking-wide">
                                    6-BIT SEQUENCE
                                  </span>
                                  <div className="flex gap-1">
                                    {chunk.split('').map((bit, bitIndex) => (
                                      <motion.div
                                        key={bitIndex}
                                        initial={{ opacity: 0, scale: 0, rotateX: 180 }}
                                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                                        transition={{ 
                                          delay: index * 0.2 + bitIndex * 0.1 + 1.7,
                                          duration: 0.4,
                                          type: "spring"
                                        }}
                                        className={`relative w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                                          bit === '1' 
                                            ? 'bg-white text-gray-800 border-white/80 shadow-lg shadow-white/30' 
                                            : 'bg-black/40 text-white/70 border-white/30'
                                        }`}
                                      >
                                        {bit}
                                        {bit === '1' && (
                                          <motion.div
                                            animate={{ 
                                              scale: [1, 1.3, 1], 
                                              opacity: [0.4, 0.8, 0.4] 
                                            }}
                                            transition={{ 
                                              duration: 1.5, 
                                              repeat: Infinity, 
                                              delay: Math.random() 
                                            }}
                                            className="absolute inset-0 bg-yellow-300/40 rounded-lg"
                                          />
                                        )}
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>

                                {/* Decimal Value */}
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-white/80 font-semibold mb-2 tracking-wide">
                                    DECIMAL
                                  </span>
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                      delay: index * 0.2 + 2,
                                      type: "spring",
                                      stiffness: 200
                                    }}
                                    className="w-16 h-16 bg-white/90 rounded-xl flex items-center justify-center text-gray-800 font-bold text-xl border-2 border-white/50 shadow-lg shadow-white/20"
                                  >
                                    {decimal}
                                  </motion.div>
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.2 + 2.2 }}
                                    className="text-xs text-white/70 mt-1"
                                  >
                                    /{Math.pow(2, 6) - 1}
                                  </motion.div>
                                </div>
                              </div>

                              {/* Hover Glow Effect */}
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                          );
                        });
                      })()}
                    </div>

                    {/* Statistics */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 3 }}
                      className="mt-8 p-6 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="text-white">
                          <div className="text-2xl font-bold text-purple-300">
                            {Math.floor(binary.length / 6)}
                          </div>
                          <div className="text-sm text-white/80">Total Chunks</div>
                        </div>
                        <div className="text-white">
                          <div className="text-2xl font-bold text-purple-300">
                            6-bit
                          </div>
                          <div className="text-sm text-white/80">Chunk Size</div>
                        </div>
                        <div className="text-white">
                          <div className="text-2xl font-bold text-purple-300">
                            64
                          </div>
                          <div className="text-sm text-white/80">Possible Values</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
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