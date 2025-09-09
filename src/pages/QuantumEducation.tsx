import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Atom, Zap, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface QubitProps {
  isGenerating: boolean;
  value?: number;
  delay?: number;
}

const Qubit = ({ isGenerating, value, delay = 0 }: QubitProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="relative w-32 h-32 mx-auto"
    >
      {/* Outer quantum field */}
      <motion.div
        animate={{
          rotate: isGenerating ? 360 : 0,
          scale: isGenerating ? [1, 1.1, 1] : 1,
        }}
        transition={{
          rotate: { duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" },
          scale: { duration: 1.5, repeat: isGenerating ? Infinity : 0 },
        }}
        className="absolute inset-0 rounded-full border-2 border-primary/30"
      />
      
      {/* Inner qubit sphere */}
      <motion.div
        animate={{
          rotateY: isGenerating ? 360 : 0,
          backgroundColor: value !== undefined 
            ? (value === 1 ? "hsl(var(--primary))" : "hsl(var(--secondary))") 
            : "hsl(var(--muted))",
        }}
        transition={{
          rotateY: { duration: 1.5, repeat: isGenerating ? Infinity : 0, ease: "easeInOut" },
          backgroundColor: { duration: 0.5 },
        }}
        className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 shadow-neon flex items-center justify-center"
      >
        {/* Qubit state indicator */}
        <motion.div
          animate={{
            opacity: value !== undefined ? 1 : (isGenerating ? [0.3, 1, 0.3] : 0.6),
          }}
          transition={{
            opacity: { duration: 0.8, repeat: isGenerating ? Infinity : 0 },
          }}
          className="text-2xl font-bold text-white"
        >
          {value !== undefined ? value : "?"}
        </motion.div>
      </motion.div>

      {/* Superposition visualization */}
      {isGenerating && (
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-secondary rounded-full transform -translate-x-1/2" />
        </motion.div>
      )}
    </motion.div>
  );
};

interface EducationCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  content: string[];
}

const EducationCard = ({ title, description, icon: Icon, content }: EducationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Card className="premium-panel h-full transition-all duration-300 hover:shadow-purple/20 hover:shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="elegant-title text-xl">{title}</CardTitle>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardHeader>
        
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <CardContent className="pt-0">
            <div className="space-y-3">
              {content.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 10 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <p className="text-sm text-foreground/80">{item}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </motion.div>
        
        <div className="p-6 pt-0">
          <Button variant="ghost" size="sm" className="w-full">
            {isExpanded ? "Show Less" : "Learn More"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

const QuantumEducation = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [qubits, setQubits] = useState<number[]>([]);

  const generateQuantumKey = () => {
    setIsGenerating(true);
    setQubits([]);
    
    setTimeout(() => {
      const newQubits = Array.from({ length: 4 }, () => Math.round(Math.random()));
      setQubits(newQubits);
      setIsGenerating(false);
    }, 3000);
  };

  const educationData = [
    {
      title: "Superposition",
      description: "Quantum states existing simultaneously",
      icon: GitBranch,
      content: [
        "A qubit can exist in a combination of both 0 and 1 states simultaneously",
        "This creates infinite possibilities until the moment of measurement",
        "Superposition is what gives quantum systems their computational power",
        "Classical bits can only be either 0 or 1, never both at once"
      ]
    },
    {
      title: "Measurement",
      description: "True randomness from quantum collapse",
      icon: Zap,
      content: [
        "When a qubit in superposition is measured, it randomly collapses to 0 or 1",
        "This collapse is fundamentally unpredictable - even Einstein called it 'spooky'",
        "The randomness comes from the laws of quantum mechanics themselves",
        "No amount of computing power can predict the outcome in advance"
      ]
    },
    {
      title: "Quantum vs PRNG",
      description: "Why quantum randomness is superior",
      icon: Atom,
      content: [
        "PRNGs use mathematical algorithms that are ultimately deterministic",
        "Quantum randomness is based on fundamental physical processes",
        "Classical random numbers can be reproduced if you know the seed",
        "Quantum random numbers are truly unpredictable and non-reproducible"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-border/50 bg-background/80 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="elegant-title text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Quantum Visualization & Education
              </h1>
              <p className="text-muted-foreground mt-1">
                Explore the fascinating world of quantum randomness
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-12 space-y-16">
        {/* Quantum Visualization Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <h2 className="elegant-title text-2xl font-semibold mb-4">
            Quantum Measurement Visualization
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Watch as qubits in superposition collapse into definite states when measured, 
            generating true quantum randomness.
          </p>

          {/* Qubit Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-4">
                <Qubit
                  isGenerating={isGenerating}
                  value={qubits[i]}
                  delay={i * 0.2}
                />
                <div className="text-sm text-muted-foreground">
                  Qubit {i + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateQuantumKey}
            disabled={isGenerating}
            size="lg"
            className="fintech-button"
          >
            {isGenerating ? "Measuring Qubits..." : "Generate Quantum Key"}
          </Button>

          {/* Result Display */}
          {qubits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8 p-6 rounded-lg bg-muted/30 border border-border/50 max-w-md mx-auto"
            >
              <h3 className="font-semibold mb-2">Quantum Key Generated:</h3>
              <div className="font-mono text-lg text-primary font-bold">
                {qubits.join("")}
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* Education Cards Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="elegant-title text-2xl font-semibold text-center mb-4">
            Understanding Quantum Mechanics
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Discover the fundamental principles that make quantum randomness possible
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {educationData.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <EducationCard {...card} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Copyright Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-16"
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

export default QuantumEducation;