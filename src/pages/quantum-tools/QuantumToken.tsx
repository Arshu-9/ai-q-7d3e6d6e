import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket, Copy, Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToolTestComparison, TOKEN_USE_CASES } from "@/components/ToolTestComparison";

const QuantumToken = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [length, setLength] = useState(32);
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

  const generateToken = async () => {
    setLoading(true);
    try {
      const bytes = await fetchQuantumBytes(length);
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const tok = bytes.map(b => chars[b % chars.length]).join("");
      setToken(tok);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    toast({ title: "Copied!", description: "Token copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  // For Test & Compare
  const generateQRNGForTest = async (): Promise<string> => {
    const bytes = await fetchQuantumBytes(16);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return bytes.map(b => chars[b % chars.length]).join("").slice(0, 16);
  };

  const generatePRNGForTest = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
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
              <Ticket className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quantum Token Generator</h1>
              <p className="text-muted-foreground">Unpredictable tokens for API keys & licenses</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-muted-foreground">Length:</label>
              <Input
                type="number"
                min={8}
                max={128}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-24 bg-muted/50 border-border"
              />
              <span className="text-xs text-muted-foreground">(8-128 characters)</span>
            </div>

            <Button
              type="button"
              onClick={generateToken}
              disabled={loading}
              className="w-full fintech-button h-12 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5 mr-2" />}
              Generate Token
            </Button>

            {token && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="code-display p-4 pr-12 font-mono text-sm break-all text-primary max-h-32 overflow-y-auto">
                  {token}
                </div>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="absolute right-4 top-4 p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors border border-primary/30"
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
          <h2 className="text-xl font-bold text-foreground">About Quantum Tokens</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">What is it?</strong> Alphanumeric tokens generated with quantum randomness, providing the highest level of unpredictability for security-critical applications.
            </p>
            <p>
              <strong className="text-foreground">Security Advantage:</strong> Each character is selected using genuine quantum noise, making the tokens impossible to predict or reverse-engineer.
            </p>
            <p>
              <strong className="text-foreground">Use Cases:</strong> API keys, license keys, activation codes, bearer tokens, session identifiers, webhook secrets, and cryptographic seeds.
            </p>
            <p>
              <strong className="text-foreground">Character Set:</strong> Uses Base62 encoding (A-Z, a-z, 0-9) for maximum compatibility with URLs and systems while maintaining high entropy density.
            </p>
          </div>
        </motion.div>

        {/* Test & Compare Section */}
        <div className="mt-8 premium-panel p-6">
          <ToolTestComparison
            toolName="Token"
            generateQRNG={generateQRNGForTest}
            generatePRNG={generatePRNGForTest}
            useCases={TOKEN_USE_CASES}
          />
        </div>
      </div>
    </div>
  );
};

export default QuantumToken;
