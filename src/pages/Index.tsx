import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";
import { ConversionStep } from "@/components/ConversionStep";
import { BinaryDisplay } from "@/components/BinaryDisplay";
import { ChunkDisplay } from "@/components/ChunkDisplay";
import { MappingDisplay } from "@/components/MappingDisplay";
import { FinalKeyDisplay } from "@/components/FinalKeyDisplay";
import { QuantumHeader } from "@/components/QuantumHeader";

const Index = () => {
  const [qrngData, setQrngData] = useState<string>("");
  const [binary, setBinary] = useState<string>("");
  const [finalKey, setFinalKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const generateQRNG = async () => {
    setIsLoading(true);
    setCurrentStep(0);
    setQrngData("");
    setBinary("");
    setFinalKey("");
    
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
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <QuantumHeader />

        {/* Generate Button */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={generateQRNG}
            disabled={isLoading}
            className="fintech-button text-lg px-8 py-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Quantum Data...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5" />
                <span>Generate Quantum Hex</span>
              </div>
            )}
          </button>
        </motion.div>

        {/* Conversion Steps */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Step 1: Quantum Hex */}
          <ConversionStep
            title="1. Quantum Hex Data"
            isVisible={!!qrngData}
            delay={0.2}
          >
            <div className="code-display text-center text-lg font-mono tracking-wider">
              {qrngData}
            </div>
            <div className="text-sm text-muted-foreground text-center">
              128-bit quantum random hex from ANU Quantum RNG
            </div>
          </ConversionStep>

          {/* Step 2: Binary Conversion */}
          <ConversionStep
            title="2. Binary Conversion"
            isVisible={currentStep >= 1 && !!binary}
            delay={0.4}
          >
            <BinaryDisplay binary={binary} />
            <div className="text-sm text-muted-foreground">
              Each hex character converted to 8-bit binary representation
            </div>
          </ConversionStep>

          {/* Step 3: 6-bit Chunking */}
          <ConversionStep
            title="3. 6-bit Chunking"
            isVisible={currentStep >= 2 && !!binary}
            delay={0.6}
          >
            <ChunkDisplay binary={binary} />
            <div className="text-sm text-muted-foreground">
              Binary data split into 6-bit chunks for Base-62 encoding
            </div>
          </ConversionStep>

          {/* Step 4: Character Mapping */}
          <ConversionStep
            title="4. Base-62 Character Mapping"
            isVisible={currentStep >= 3 && !!binary}
            delay={0.8}
          >
            <MappingDisplay binary={binary} />
            <div className="text-sm text-muted-foreground">
              Each 6-bit chunk converted to decimal, then mapped to Base-62 character set
            </div>
          </ConversionStep>

          {/* Step 5: Final Key */}
          {currentStep >= 4 && finalKey && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <FinalKeyDisplay finalKey={finalKey} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;