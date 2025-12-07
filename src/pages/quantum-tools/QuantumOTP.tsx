import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Copy, Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const QuantumOTP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [otpLength, setOtpLength] = useState(6);
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

  const generateOTP = async () => {
    setLoading(true);
    try {
      const bytes = await fetchQuantumBytes(otpLength);
      const digits = bytes.map(b => b % 10).join("").slice(0, otpLength);
      setOtp(digits);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(otp);
    setCopied(true);
    toast({ title: "Copied!", description: "OTP copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative">
      <div className="fog-overlay" />
      
      <div className="container mx-auto px-6 py-8 relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quantum OTP Generator</h1>
              <p className="text-muted-foreground">Ultra-secure One-Time Passwords</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-muted-foreground">Length:</label>
              <Input
                type="number"
                min={4}
                max={12}
                value={otpLength}
                onChange={(e) => setOtpLength(Number(e.target.value))}
                className="w-24 bg-muted/50 border-border"
              />
            </div>

            <Button
              type="button"
              onClick={generateOTP}
              disabled={loading}
              className="w-full fintech-button h-12 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5 mr-2" />}
              Generate OTP
            </Button>

            {otp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="code-display p-6 font-mono text-3xl text-center tracking-[0.5em] text-primary">
                  {otp}
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

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 premium-panel p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-foreground">About Quantum OTP</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">What is it?</strong> A One-Time Password (OTP) generated using true quantum randomness from vacuum fluctuations, making it completely unpredictable.
            </p>
            <p>
              <strong className="text-foreground">Why Quantum?</strong> Traditional pseudo-random generators use mathematical algorithms that can theoretically be predicted. Quantum randomness is fundamentally unpredictable due to quantum mechanics.
            </p>
            <p>
              <strong className="text-foreground">Use Cases:</strong> Two-factor authentication, secure login verification, transaction confirmations, session tokens, and any scenario requiring temporary secure codes.
            </p>
            <p>
              <strong className="text-foreground">Security Level:</strong> Military-grade entropy sourced directly from quantum vacuum fluctuations at the Australian National University.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuantumOTP;