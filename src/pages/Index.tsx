import { useState } from "react";
import { motion } from "framer-motion";
import { QuantumHeader } from "@/components/QuantumHeader";
import { QRNGPanel } from "@/components/QRNGPanel";
import { KeyPanel } from "@/components/KeyPanel";

const Index = () => {
  const [qrngData, setQrngData] = useState<string>("");

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-6 py-8">
        <QuantumHeader />
        
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <QRNGPanel onQRNGGenerated={setQrngData} />
          <KeyPanel qrngData={qrngData} />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
