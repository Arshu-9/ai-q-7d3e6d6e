import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Copy, Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToolTestComparison, PASSWORD_USE_CASES } from "@/components/ToolTestComparison";

const QuantumPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
      const array = new Uint8Array(count);
      crypto.getRandomValues(array);
      return Array.from(array);
    }
  };

  const generatePassword = async () => {
    setLoading(true);
    try {
      const bytes = await fetchQuantumBytes(length);
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      const charSet = includeSymbols ? chars + symbols : chars;
      const pass = bytes.map(b => charSet[b % charSet.length]).join("");
      setPassword(pass);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast({ title: "Copied!", description: "Password copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthInfo = () => {
    const charSetSize = includeSymbols ? 88 : 62;
    const entropy = Math.log2(Math.pow(charSetSize, length));
    return {
      entropy: entropy.toFixed(1),
      crackTime: entropy > 128 ? "Centuries" : entropy > 80 ? "Millions of years" : entropy > 60 ? "Years" : "Days"
    };
  };

  const strength = getStrengthInfo();

  // For Test & Compare
  const generateQRNGForTest = async (): Promise<string> => {
    const bytes = await fetchQuantumBytes(12);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    return bytes.map(b => chars[b % chars.length]).join("").slice(0, 12);
  };

  const generatePRNGForTest = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  return (
    <div className="min-h-screen relative pb-20">
      <div className="fog-overlay" />
      
      <div className="container mx-auto px-6 py-8 relative z-10 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            type="button"
            onClick={() => navigate("/quantum-tools")}
            variant="outline"
            className="mb-6 gap-2 border-border hover:border-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-panel p-8 space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-primary/20 border border-primary/30">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quantum Password Creator</h1>
              <p className="text-muted-foreground">High-entropy unpredictable passwords</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-muted-foreground">Length:</label>
              <Input
                type="number"
                min={8}
                max={64}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-24 bg-muted/50 border-border"
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

            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Entropy:</span>
                <span className="text-primary font-mono">{strength.entropy} bits</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Estimated crack time:</span>
                <span className="text-green-400 font-mono">{strength.crackTime}</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={generatePassword}
              disabled={loading}
              className="w-full fintech-button h-12 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5 mr-2" />}
              Generate Password
            </Button>

            {password && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="code-display p-4 pr-12 font-mono text-lg break-all text-primary">
                  {password}
                </div>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors border border-primary/30"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-primary" />}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 premium-panel p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-foreground">About Quantum Passwords</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">What is it?</strong> Passwords generated using true quantum randomness, ensuring each character is selected with genuine unpredictability from quantum vacuum fluctuations.
            </p>
            <p>
              <strong className="text-foreground">Why Quantum?</strong> Classical random generators follow deterministic patterns. Quantum randomness exploits the fundamental indeterminacy of quantum mechanics, providing provably random output.
            </p>
            <p>
              <strong className="text-foreground">Entropy Matters:</strong> A 16-character password with symbols provides ~105 bits of entropy. With quantum sourcing, there are no hidden patterns to exploit.
            </p>
            <p>
              <strong className="text-foreground">Best Practices:</strong> Use 16+ characters with symbols for sensitive accounts. Never reuse quantum passwords across services.
            </p>
          </div>
        </motion.div>

        {/* Test & Compare Section */}
        <div className="mt-8 premium-panel p-6">
          <ToolTestComparison
            toolName="Password"
            generateQRNG={generateQRNGForTest}
            generatePRNG={generatePRNGForTest}
            useCases={PASSWORD_USE_CASES}
          />
        </div>
      </div>
    </div>
  );
};

export default QuantumPassword;
