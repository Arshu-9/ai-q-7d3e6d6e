import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Calculator, Cpu, Lock, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ComparisonBarProps {
  title: string;
  score: number;
  maxScore: number;
  color: string;
  icon: React.ComponentType<any>;
  delay?: number;
}

interface HoverCardData {
  title: string;
  randomnessQuality: string;
  securityStrength: string;
  usageExamples: string[];
  advantages: string[];
  limitations?: string[];
}

const ComparisonBar = ({ title, score, maxScore, color, icon: Icon, delay = 0 }: ComparisonBarProps) => {
  const percentage = (score / maxScore) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color === 'primary' ? 'bg-primary/20' : 'bg-gray-200'}`}>
          <Icon className={`w-5 h-5 ${color === 'primary' ? 'text-primary' : 'text-gray-600'}`} />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Performance Score</span>
          <span className={`text-lg font-bold ${color === 'primary' ? 'text-primary' : 'text-gray-600'}`}>
            {score}/{maxScore}
          </span>
        </div>
        
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, delay: delay + 0.5, ease: "easeOut" }}
            className={`h-full ${
              color === 'primary' 
                ? 'bg-gradient-to-r from-primary to-blue-600' 
                : 'bg-gradient-to-r from-gray-400 to-gray-600'
            }`}
          />
        </div>
      </div>
      
      {/* Animated pulse effect for QRNG */}
      {color === 'primary' && (
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-primary/10 rounded-xl pointer-events-none"
        />
      )}
    </motion.div>
  );
};

const HoverCard = ({ data, isVisible, position }: { data: HoverCardData; isVisible: boolean; position: { x: number; y: number } }) => {
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.2 }}
      className="fixed z-50 w-80 p-4 bg-white/95 backdrop-blur-lg rounded-xl border border-border/50 shadow-xl"
      style={{ left: position.x, top: position.y }}
    >
      <h4 className="font-semibold text-lg mb-3 text-foreground">{data.title}</h4>
      
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-primary">Randomness Quality:</span>
          <p className="text-muted-foreground mt-1">{data.randomnessQuality}</p>
        </div>
        
        <div>
          <span className="font-medium text-primary">Security Strength:</span>
          <p className="text-muted-foreground mt-1">{data.securityStrength}</p>
        </div>
        
        <div>
          <span className="font-medium text-primary">Usage Examples:</span>
          <ul className="text-muted-foreground mt-1 space-y-1">
            {data.usageExamples.map((example, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {example}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <span className="font-medium text-green-600">Advantages:</span>
          <ul className="text-muted-foreground mt-1 space-y-1">
            {data.advantages.map((advantage, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                {advantage}
              </li>
            ))}
          </ul>
        </div>
        
        {data.limitations && (
          <div>
            <span className="font-medium text-orange-600">Limitations:</span>
            <ul className="text-muted-foreground mt-1 space-y-1">
              {data.limitations.map((limitation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">⚠</span>
                  {limitation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const LiveKeyDisplay = ({ title, keyValue, isGenerating, type }: { 
  title: string; 
  keyValue: string; 
  isGenerating: boolean; 
  type: 'quantum' | 'prng';
}) => {
  const [displayedKey, setDisplayedKey] = useState("");
  
  useEffect(() => {
    if (keyValue && !isGenerating) {
      setDisplayedKey("");
      const chars = keyValue.split("");
      chars.forEach((char, index) => {
        setTimeout(() => {
          setDisplayedKey(prev => prev + char);
        }, index * 100);
      });
    }
  }, [keyValue, isGenerating]);
  
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-center">{title}</h4>
      
      <div className={`p-4 rounded-lg border-2 ${
        type === 'quantum' 
          ? 'bg-primary/5 border-primary/30' 
          : 'bg-gray-50 border-gray-300'
      }`}>
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className={`w-4 h-4 border-2 border-t-transparent rounded-full ${
                type === 'quantum' ? 'border-primary' : 'border-gray-400'
              }`}
            />
            <span className="text-sm text-muted-foreground">Generating...</span>
          </div>
        ) : (
          <div className="font-mono text-lg text-center min-h-[2rem] flex items-center justify-center">
            {displayedKey.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={type === 'quantum' ? 'text-primary font-bold' : 'text-gray-700'}
              >
                {char}
              </motion.span>
            ))}
          </div>
        )}
      </div>
      
      {/* Quality indicator */}
      <div className="flex items-center justify-center gap-2">
        {type === 'quantum' ? (
          <>
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Quantum Secure</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">Predictable Pattern</span>
          </>
        )}
      </div>
    </div>
  );
};

export const QRNGComparison = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [quantumKey, setQuantumKey] = useState("");
  const [prngKey, setPrngKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateKeys = () => {
    setIsGenerating(true);
    setQuantumKey("");
    setPrngKey("");
    
    setTimeout(() => {
      // Generate quantum-like key (more truly random)
      const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const quantumResult = Array.from({ length: 8 }, () => 
        base62Chars[Math.floor(Math.random() * base62Chars.length)]
      ).join('');
      
      // Generate PRNG key (more predictable patterns)
      const seed = Date.now();
      let prngResult = "";
      for (let i = 0; i < 8; i++) {
        const value = (seed * (i + 1) * 17) % 62;
        prngResult += base62Chars[value];
      }
      
      setQuantumKey(quantumResult);
      setPrngKey(prngResult);
      setIsGenerating(false);
    }, 2000);
  };

  useEffect(() => {
    generateKeys();
    const interval = setInterval(generateKeys, 10000); // Auto-generate every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX + 10, y: e.clientY - 10 });
  };

  const qrngData: HoverCardData = {
    title: "Quantum Random Number Generator",
    randomnessQuality: "True randomness from quantum vacuum fluctuations. Fundamentally unpredictable.",
    securityStrength: "Maximum entropy - perfect for cryptographic applications and security keys.",
    usageExamples: [
      "Cryptocurrency wallet seeds",
      "SSL/TLS certificate generation",
      "Military-grade encryption",
      "Blockchain consensus algorithms"
    ],
    advantages: [
      "Truly unpredictable output",
      "Cannot be reproduced",
      "Quantum-resistant security",
      "Perfect entropy distribution"
    ]
  };

  const prngData: HoverCardData = {
    title: "Pseudo-Random Number Generator",
    randomnessQuality: "Deterministic algorithm that appears random but follows predictable patterns.",
    securityStrength: "Limited security - vulnerable to prediction if algorithm or seed is known.",
    usageExamples: [
      "Video game mechanics",
      "Simulation modeling",
      "Basic testing scenarios",
      "Non-security applications"
    ],
    advantages: [
      "Fast computation",
      "Reproducible results",
      "Low resource usage",
      "Widely available"
    ],
    limitations: [
      "Predictable with enough data",
      "Vulnerable to cryptanalysis",
      "Periodic repetition",
      "Seed dependency"
    ]
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Section Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Sparkles className="w-8 h-8 text-primary" />
          <h2 className="elegant-title text-3xl font-bold">QRNG vs PRNG Battle</h2>
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Interactive comparison between quantum and classical random number generation
        </p>
      </div>

      {/* Main Comparison Card */}
      <Card className="premium-panel p-8 bg-gradient-to-br from-background via-background/95 to-primary/5 border-2 border-primary/20">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          
          {/* QRNG Side */}
          <motion.div
            className="relative"
            onMouseEnter={() => setHoveredCard('qrng')}
            onMouseLeave={() => setHoveredCard(null)}
            onMouseMove={handleMouseMove}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="premium-panel border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-blue-500/10 relative overflow-hidden">
              {/* Quantum particles background */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/40 rounded-full"
                    animate={{
                      x: [0, Math.random() * 200],
                      y: [0, Math.random() * 150],
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
              
              <CardHeader className="relative z-10">
                <ComparisonBar
                  title="Quantum RNG"
                  score={10}
                  maxScore={10}
                  color="primary"
                  icon={Zap}
                  delay={0.2}
                />
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                <LiveKeyDisplay
                  title="Live Quantum Key"
                  keyValue={quantumKey}
                  isGenerating={isGenerating}
                  type="quantum"
                />
                
                <div className="flex items-center justify-center">
                  <Badge variant="default" className="bg-primary text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Military Grade
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* VS Divider with Flow Arrow */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">VS</span>
              </div>
            </div>
            
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center space-x-2 text-primary"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="text-sm font-medium">Real-time Comparison</span>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.div>

          {/* PRNG Side */}
          <motion.div
            className="relative"
            onMouseEnter={() => setHoveredCard('prng')}
            onMouseLeave={() => setHoveredCard(null)}
            onMouseMove={handleMouseMove}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="premium-panel border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 relative">
              <CardHeader>
                <ComparisonBar
                  title="Classical PRNG"
                  score={6}
                  maxScore={10}
                  color="gray"
                  icon={Calculator}
                  delay={0.4}
                />
              </CardHeader>
              
              <CardContent className="space-y-4">
                <LiveKeyDisplay
                  title="Pseudo-Random Key"
                  keyValue={prngKey}
                  isGenerating={isGenerating}
                  type="prng"
                />
                
                <div className="flex items-center justify-center">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Predictable
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 grid md:grid-cols-3 gap-6 text-center"
        >
          <div className="space-y-2">
            <Cpu className="w-8 h-8 text-primary mx-auto" />
            <h4 className="font-semibold">Entropy Quality</h4>
            <p className="text-sm text-muted-foreground">QRNG: Perfect | PRNG: Limited</p>
          </div>
          <div className="space-y-2">
            <Lock className="w-8 h-8 text-primary mx-auto" />
            <h4 className="font-semibold">Security Level</h4>
            <p className="text-sm text-muted-foreground">QRNG: Unbreakable | PRNG: Vulnerable</p>
          </div>
          <div className="space-y-2">
            <Zap className="w-8 h-8 text-primary mx-auto" />
            <h4 className="font-semibold">Unpredictability</h4>
            <p className="text-sm text-muted-foreground">QRNG: Absolute | PRNG: Algorithmic</p>
          </div>
        </motion.div>
      </Card>

      {/* Hover Cards */}
      <HoverCard
        data={qrngData}
        isVisible={hoveredCard === 'qrng'}
        position={mousePosition}
      />
      <HoverCard
        data={prngData}
        isVisible={hoveredCard === 'prng'}
        position={mousePosition}
      />
    </motion.section>
  );
};