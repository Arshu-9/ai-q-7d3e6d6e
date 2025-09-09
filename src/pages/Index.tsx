import { useState } from "react";
import { motion } from "framer-motion";
import { QuantumHeader } from "@/components/QuantumHeader";
import { QRNGPanel } from "@/components/QRNGPanel";
import { KeyPanel } from "@/components/KeyPanel";

const Index = () => {
  const [qrngData, setQrngData] = useState<string>("");

  return (
    <div className="min-h-screen bg-quantum-bg relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-glow rounded-full blur-3xl opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-quantum-purple/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <QuantumHeader />
        
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <QRNGPanel onQRNGGenerated={setQrngData} />
          <KeyPanel qrngData={qrngData} />
        </motion.div>

        {/* Floating particles effect */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-quantum-neon/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
