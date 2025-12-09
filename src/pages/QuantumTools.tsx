import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  KeyRound, 
  Lock, 
  Fingerprint, 
  Shuffle, 
  Ticket,
  Code,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    id: "otp",
    icon: KeyRound,
    title: "Quantum OTP",
    subtitle: "One-Time Passwords",
    description: "Ultra-secure codes powered by quantum entropy",
    path: "/quantum-tools/otp",
    gradient: "from-emerald-500/20 via-emerald-600/10 to-transparent",
    iconBg: "from-emerald-500 to-emerald-600",
    glowColor: "emerald"
  },
  {
    id: "password",
    icon: Lock,
    title: "Quantum Password",
    subtitle: "Password Creator",
    description: "High-entropy unpredictable passwords",
    path: "/quantum-tools/password",
    gradient: "from-blue-500/20 via-blue-600/10 to-transparent",
    iconBg: "from-blue-500 to-blue-600",
    glowColor: "blue"
  },
  {
    id: "unique-id",
    icon: Fingerprint,
    title: "Quantum UUID",
    subtitle: "Unique Identifiers",
    description: "Collision-resistant IDs for systems",
    path: "/quantum-tools/unique-id",
    gradient: "from-violet-500/20 via-violet-600/10 to-transparent",
    iconBg: "from-violet-500 to-violet-600",
    glowColor: "violet"
  },
  {
    id: "picker",
    icon: Shuffle,
    title: "Fair Draw",
    subtitle: "Random Selection",
    description: "Unbiased picks for raffles & decisions",
    path: "/quantum-tools/picker",
    gradient: "from-amber-500/20 via-amber-600/10 to-transparent",
    iconBg: "from-amber-500 to-amber-600",
    glowColor: "amber"
  },
  {
    id: "token",
    icon: Ticket,
    title: "Quantum Token",
    subtitle: "Token Generator",
    description: "Unpredictable API keys & licenses",
    path: "/quantum-tools/token",
    gradient: "from-rose-500/20 via-rose-600/10 to-transparent",
    iconBg: "from-rose-500 to-rose-600",
    glowColor: "rose"
  },
  {
    id: "api",
    icon: Code,
    title: "Developer API",
    subtitle: "API Access",
    description: "Integrate quantum randomness in apps",
    path: "/quantum-tools/api",
    gradient: "from-cyan-500/20 via-cyan-600/10 to-transparent",
    iconBg: "from-cyan-500 to-cyan-600",
    glowColor: "cyan"
  }
];

const QuantumTools = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fog-overlay" />
      
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)/0.3) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)/0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

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
            className="mb-8 gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Generator
          </Button>
          
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Powered by Quantum Vacuum Fluctuations</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Quantum
              </span>{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Tools
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Advanced security tools powered by true quantum randomness
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08, type: "spring", stiffness: 100 }}
              onClick={() => navigate(tool.path)}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-6 text-left transition-all duration-500 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Glow effect */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-${tool.glowColor}-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.iconBg} shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-1 mb-3">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {tool.title}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
                    {tool.subtitle}
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
                
                {/* Arrow indicator */}
                <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                  <span className="text-sm font-medium">Open Tool</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              
              {/* Border glow on hover */}
              <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-all duration-500" />
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-background/50 border border-border/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Live quantum data from ANU QRNG
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuantumTools;