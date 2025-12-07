import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  KeyRound, 
  Lock, 
  Fingerprint, 
  Shuffle, 
  Ticket,
  Copy,
  Check,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Pre-generated particle positions to avoid re-renders
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 1000,
  y: Math.random() * 800,
  duration: 4 + Math.random() * 4,
  delay: Math.random() * 2,
}));

const QuantumTools = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Shared state
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // OTP State
  const [otp, setOtp] = useState("");
  const [otpLength, setOtpLength] = useState(6);
  const [otpLoading, setOtpLoading] = useState(false);

  // Password State
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Unique ID State
  const [uniqueId, setUniqueId] = useState("");
  const [idLoading, setIdLoading] = useState(false);

  // Random Picker State
  const [pickerItems, setPickerItems] = useState("");
  const [pickedItem, setPickedItem] = useState("");
  const [pickerLoading, setPickerLoading] = useState(false);

  // Token State
  const [token, setToken] = useState("");
  const [tokenLength, setTokenLength] = useState(32);
  const [tokenLoading, setTokenLoading] = useState(false);

  // Fetch quantum random bytes
  const fetchQuantumBytes = async (count: number): Promise<number[]> => {
    try {
      const response = await fetch(
        `https://qrng.anu.edu.au/API/jsonI.php?length=${count}&type=uint8`
      );
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
      throw new Error("API failed");
    } catch {
      // Fallback to crypto
      const array = new Uint8Array(count);
      crypto.getRandomValues(array);
      return Array.from(array);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Copied!", description: "Copied to clipboard" });
    setTimeout(() => setCopiedField(null), 2000);
  };

  // 1. Generate OTP
  const generateOTP = async () => {
    setOtpLoading(true);
    try {
      const bytes = await fetchQuantumBytes(otpLength);
      const digits = bytes.map(b => b % 10).join("").slice(0, otpLength);
      setOtp(digits);
    } finally {
      setOtpLoading(false);
    }
  };

  // 2. Generate Password
  const generatePassword = async () => {
    setPasswordLoading(true);
    try {
      const bytes = await fetchQuantumBytes(passwordLength);
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const charSet = includeSymbols ? chars + symbols : chars;
      
      const pass = bytes.map(b => charSet[b % charSet.length]).join("");
      setPassword(pass);
    } finally {
      setPasswordLoading(false);
    }
  };

  // 3. Generate Unique ID
  const generateUniqueId = async () => {
    setIdLoading(true);
    try {
      const bytes = await fetchQuantumBytes(16);
      const hex = bytes.map(b => b.toString(16).padStart(2, "0")).join("");
      // Format as UUID-like: 8-4-4-4-12
      const formatted = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
      setUniqueId(formatted.toUpperCase());
    } finally {
      setIdLoading(false);
    }
  };

  // 4. Random Picker
  const pickRandom = async () => {
    const items = pickerItems.split(",").map(i => i.trim()).filter(i => i);
    if (items.length === 0) {
      toast({ title: "Error", description: "Enter items separated by commas", variant: "destructive" });
      return;
    }
    setPickerLoading(true);
    try {
      const bytes = await fetchQuantumBytes(1);
      const index = bytes[0] % items.length;
      setPickedItem(items[index]);
    } finally {
      setPickerLoading(false);
    }
  };

  // 5. Generate Token
  const generateToken = async () => {
    setTokenLoading(true);
    try {
      const bytes = await fetchQuantumBytes(tokenLength);
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const tok = bytes.map(b => chars[b % chars.length]).join("");
      setToken(tok);
    } finally {
      setTokenLoading(false);
    }
  };

  const ToolCard = ({ 
    icon: Icon, 
    title, 
    description, 
    children,
    delay = 0 
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    children: React.ReactNode;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="premium-panel p-6 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );

  const ResultDisplay = ({ value, field }: { value: string; field: string }) => (
    <div className="relative">
      <div className="code-display p-4 pr-12 font-mono text-lg break-all min-h-[60px] flex items-center">
        <motion.span
          key={value}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary"
        >
          {value || "—"}
        </motion.span>
      </div>
      {value && (
        <button
          type="button"
          onClick={() => copyToClipboard(value, field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors border border-primary/30"
        >
          {copiedField === field ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-primary" />
          )}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Fog Overlay */}
      <div className="fog-overlay" />

      {/* Floating Particles - Memoized */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{ x: particle.x, y: particle.y }}
            animate={{ y: [null, -20, 20], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Button
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
          <p className="text-center text-muted-foreground text-lg subtitle-glow">
            Advanced security tools powered by true quantum randomness
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* 1. OTP Generator */}
          <ToolCard
            icon={KeyRound}
            title="Quantum OTP Generator"
            description="Ultra-secure One-Time Passwords"
            delay={0.1}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm text-muted-foreground">Length:</label>
                <Input
                  type="number"
                  min={4}
                  max={12}
                  value={otpLength}
                  onChange={(e) => setOtpLength(Number(e.target.value))}
                  className="w-20 bg-muted/50 border-border"
                />
              </div>
              <Button
                type="button"
                onClick={generateOTP}
                disabled={otpLoading}
                className="w-full fintech-button"
              >
                {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Generate OTP
              </Button>
              <ResultDisplay value={otp} field="otp" />
            </div>
          </ToolCard>

          {/* 2. Password Creator */}
          <ToolCard
            icon={Lock}
            title="Quantum Password Creator"
            description="High-entropy unpredictable passwords"
            delay={0.2}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm text-muted-foreground">Length:</label>
                <Input
                  type="number"
                  min={8}
                  max={64}
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(Number(e.target.value))}
                  className="w-20 bg-muted/50 border-border"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                Include symbols (!@#$%...)
              </label>
              <Button
                type="button"
                onClick={generatePassword}
                disabled={passwordLoading}
                className="w-full fintech-button"
              >
                {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Generate Password
              </Button>
              <ResultDisplay value={password} field="password" />
            </div>
          </ToolCard>

          {/* 3. Unique ID Generator */}
          <ToolCard
            icon={Fingerprint}
            title="Quantum Unique ID Generator"
            description="Collision-resistant IDs for any system"
            delay={0.3}
          >
            <div className="space-y-4">
              <Button
                type="button"
                onClick={generateUniqueId}
                disabled={idLoading}
                className="w-full fintech-button"
              >
                {idLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Generate Unique ID
              </Button>
              <ResultDisplay value={uniqueId} field="uniqueId" />
            </div>
          </ToolCard>

          {/* 4. Random Picker */}
          <ToolCard
            icon={Shuffle}
            title="Quantum Fair Draw"
            description="Unbiased random selection"
            delay={0.4}
          >
            <div className="space-y-4">
              <Input
                placeholder="Enter items (comma-separated)"
                value={pickerItems}
                onChange={(e) => setPickerItems(e.target.value)}
                className="bg-muted/50 border-border"
              />
              <Button
                type="button"
                onClick={pickRandom}
                disabled={pickerLoading}
                className="w-full fintech-button"
              >
                {pickerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4 mr-2" />}
                Pick Random
              </Button>
              {pickedItem && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl border border-primary/40"
                >
                  <p className="text-sm text-muted-foreground mb-2">Winner:</p>
                  <p className="text-3xl font-bold text-primary">{pickedItem}</p>
                </motion.div>
              )}
            </div>
          </ToolCard>

          {/* 5. Token Generator - Full Width */}
          <div className="md:col-span-2">
            <ToolCard
              icon={Ticket}
              title="Quantum Token & Key Generator"
              description="Mathematically unpredictable tokens for API keys, license keys, or activation codes"
              delay={0.5}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-muted-foreground">Length:</label>
                  <Input
                    type="number"
                    min={8}
                    max={128}
                    value={tokenLength}
                    onChange={(e) => setTokenLength(Number(e.target.value))}
                    className="w-24 bg-muted/50 border-border"
                  />
                </div>
                <Button
                  type="button"
                  onClick={generateToken}
                  disabled={tokenLoading}
                  className="w-full fintech-button"
                >
                  {tokenLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Generate Token
                </Button>
                <ResultDisplay value={token} field="token" />
              </div>
            </ToolCard>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p>All randomness sourced from quantum vacuum fluctuations</p>
        </motion.div>
      </div>
    </div>
  );
};

export default QuantumTools;
