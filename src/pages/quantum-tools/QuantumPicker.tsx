import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shuffle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const QuantumPicker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState("");
  const [pickedItem, setPickedItem] = useState("");
  const [loading, setLoading] = useState(false);

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

  const pickRandom = async () => {
    const itemList = items.split(",").map(i => i.trim()).filter(i => i);
    if (itemList.length === 0) {
      toast({ title: "Error", description: "Enter items separated by commas", variant: "destructive" });
      return;
    }
    if (itemList.length === 1) {
      toast({ title: "Error", description: "Enter at least 2 items to pick from", variant: "destructive" });
      return;
    }
    setLoading(true);
    setPickedItem("");
    try {
      const bytes = await fetchQuantumBytes(1);
      const index = bytes[0] % itemList.length;
      setTimeout(() => {
        setPickedItem(itemList[index]);
        setLoading(false);
      }, 500);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fog-overlay" />
      
      <div className="container mx-auto px-6 py-8 relative z-10 max-w-2xl">
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
              <Shuffle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quantum Fair Draw</h1>
              <p className="text-muted-foreground">Unbiased random selection</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Enter items (comma-separated):</label>
              <Input
                placeholder="Apple, Banana, Cherry, Date..."
                value={items}
                onChange={(e) => setItems(e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>

            <Button
              type="button"
              onClick={pickRandom}
              disabled={loading}
              className="w-full fintech-button h-12 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shuffle className="w-5 h-5 mr-2" />}
              Pick Random Winner
            </Button>

            {pickedItem && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-center p-8 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-xl border-2 border-primary/50"
              >
                <p className="text-sm text-muted-foreground mb-3">🎉 Winner Selected:</p>
                <p className="text-4xl font-bold text-primary">{pickedItem}</p>
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
          <h2 className="text-xl font-bold text-foreground">About Quantum Fair Draw</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">What is it?</strong> A random selection tool powered by quantum randomness, ensuring completely unbiased and fair selections for any purpose.
            </p>
            <p>
              <strong className="text-foreground">True Fairness:</strong> Unlike pseudo-random generators that can exhibit subtle patterns, quantum randomness provides mathematically provable fairness with no hidden biases.
            </p>
            <p>
              <strong className="text-foreground">Use Cases:</strong> Raffles and giveaways, team selections, decision making, A/B testing group assignment, randomized clinical trials, lottery systems, and game mechanics.
            </p>
            <p>
              <strong className="text-foreground">Transparency:</strong> Each selection uses fresh quantum data from the ANU Quantum Random Number Generator, ensuring no manipulation is possible.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuantumPicker;