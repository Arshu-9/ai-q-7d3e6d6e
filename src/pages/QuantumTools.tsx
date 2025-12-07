import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  KeyRound, 
  Lock, 
  Fingerprint, 
  Shuffle, 
  Ticket,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    id: "otp",
    icon: KeyRound,
    title: "Quantum OTP Generator",
    description: "Ultra-secure One-Time Passwords powered by quantum entropy",
    path: "/quantum-tools/otp"
  },
  {
    id: "password",
    icon: Lock,
    title: "Quantum Password Creator",
    description: "High-entropy unpredictable passwords using quantum random bits",
    path: "/quantum-tools/password"
  },
  {
    id: "unique-id",
    icon: Fingerprint,
    title: "Quantum Unique ID",
    description: "Collision-resistant IDs for users, devices, and IoT systems",
    path: "/quantum-tools/unique-id"
  },
  {
    id: "picker",
    icon: Shuffle,
    title: "Quantum Fair Draw",
    description: "Unbiased random selections for raffles and decision systems",
    path: "/quantum-tools/picker"
  },
  {
    id: "token",
    icon: Ticket,
    title: "Quantum Token Generator",
    description: "Unpredictable tokens for API keys, licenses, and activation codes",
    path: "/quantum-tools/token"
  }
];

const QuantumTools = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      <div className="fog-overlay" />

      <div className="container mx-auto px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Button
            type="button"
            onClick={() => navigate("/")}
            variant="outline"
            className="mb-6 gap-2 border-border hover:border-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generator
          </Button>
          
          <h1 className="elegant-title text-center mb-4">
            Quantum <span className="text-accent">Tools</span>
          </h1>
          <p className="text-center text-muted-foreground text-lg subtitle-glow max-w-2xl mx-auto">
            Advanced security tools powered by true quantum randomness from vacuum fluctuations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tools.map((tool, index) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(tool.path)}
              className="premium-panel p-6 text-left group hover:border-primary/60 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30 group-hover:bg-primary/30 transition-colors">
                  <tool.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p>All tools use real-time quantum data from the ANU Quantum Random Number Generator</p>
        </motion.div>
      </div>
    </div>
  );
};

export default QuantumTools;