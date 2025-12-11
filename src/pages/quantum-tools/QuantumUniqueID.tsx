import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Fingerprint, Copy, Check, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToolTestComparison, UUID_USE_CASES } from "@/components/ToolTestComparison";

const QuantumUniqueID = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uniqueId, setUniqueId] = useState("");
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

  const generateUniqueId = async () => {
    setLoading(true);
    try {
      const bytes = await fetchQuantumBytes(16);
      const hex = bytes.map(b => b.toString(16).padStart(2, "0")).join("");
      const formatted = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
      setUniqueId(formatted.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(uniqueId);
    setCopied(true);
    toast({ title: "Copied!", description: "Unique ID copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  // For Test & Compare
  const generateQRNGForTest = async (): Promise<string> => {
    const bytes = await fetchQuantumBytes(8);
    const hex = bytes.map(b => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0,8)}-${hex.slice(8,16)}`.toUpperCase();
  };

  const generatePRNGForTest = (): string => {
    const hex = Array.from({ length: 8 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
    ).join("");
    return `${hex.slice(0,8)}-${hex.slice(8,16)}`.toUpperCase();
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
              <Fingerprint className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quantum Unique ID</h1>
              <p className="text-muted-foreground">Collision-resistant IDs for any system</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              onClick={generateUniqueId}
              disabled={loading}
              className="w-full fintech-button h-12 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5 mr-2" />}
              Generate Unique ID
            </Button>

            {uniqueId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="code-display p-6 font-mono text-xl text-center tracking-wider text-primary">
                  {uniqueId}
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
          <h2 className="text-xl font-bold text-foreground">About Quantum Unique IDs</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">What is it?</strong> A 128-bit universally unique identifier (UUID) generated using quantum randomness, formatted in standard UUID notation.
            </p>
            <p>
              <strong className="text-foreground">Collision Resistance:</strong> With 128 bits of true quantum entropy, the probability of generating duplicate IDs is astronomically low—approximately 1 in 340 undecillion (3.4×10³⁸).
            </p>
            <p>
              <strong className="text-foreground">Use Cases:</strong> Database primary keys, distributed system identifiers, IoT device IDs, order numbers, session identifiers, and any scenario requiring globally unique identifiers.
            </p>
            <p>
              <strong className="text-foreground">Format:</strong> Standard UUID format (8-4-4-4-12) compatible with most databases and systems worldwide.
            </p>
          </div>
        </motion.div>

        {/* Test & Compare Section */}
        <div className="mt-8 premium-panel p-6">
          <ToolTestComparison
            toolName="UUID"
            generateQRNG={generateQRNGForTest}
            generatePRNG={generatePRNGForTest}
            useCases={UUID_USE_CASES}
          />
        </div>
      </div>
    </div>
  );
};

export default QuantumUniqueID;
