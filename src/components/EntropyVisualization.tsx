import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface EntropyVisualizationProps {
  qrngData: string;
  binary: string;
}

export const EntropyVisualization = ({ qrngData, binary }: EntropyVisualizationProps) => {
  // Analyze bit distribution (0s vs 1s)
  const analyzeBitDistribution = () => {
    if (!binary) return [];
    const zeros = (binary.match(/0/g) || []).length;
    const ones = (binary.match(/1/g) || []).length;
    return [
      { name: "0s", value: zeros, percentage: ((zeros / binary.length) * 100).toFixed(1) },
      { name: "1s", value: ones, percentage: ((ones / binary.length) * 100).toFixed(1) }
    ];
  };

  // Analyze hex character frequency
  const analyzeHexFrequency = () => {
    if (!qrngData) return [];
    const freq: Record<string, number> = {};
    for (const char of qrngData.toLowerCase()) {
      freq[char] = (freq[char] || 0) + 1;
    }
    return Object.entries(freq).map(([char, count]) => ({
      char: char.toUpperCase(),
      count,
      percentage: ((count as number / qrngData.length) * 100).toFixed(1)
    })).sort((a, b) => a.char.localeCompare(b.char));
  };

  // Analyze byte distribution (0-255)
  const analyzeByteDistribution = () => {
    if (!binary) return [];
    const bytes = [];
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.slice(i, i + 8);
      if (byte.length === 8) {
        bytes.push(parseInt(byte, 2));
      }
    }
    
    // Group into ranges for visualization
    const ranges = Array.from({ length: 16 }, (_, i) => ({
      range: `${i * 16}-${(i + 1) * 16 - 1}`,
      count: 0
    }));
    
    bytes.forEach(byte => {
      const rangeIndex = Math.floor(byte / 16);
      ranges[rangeIndex].count++;
    });
    
    return ranges;
  };

  // Calculate entropy score
  const calculateEntropy = () => {
    if (!binary) return 0;
    const freq: Record<string, number> = {};
    for (const bit of binary) {
      freq[bit] = (freq[bit] || 0) + 1;
    }
    
    let entropy = 0;
    const total = binary.length;
    Object.values(freq).forEach(count => {
      const p = (count as number) / total;
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    });
    
    return entropy.toFixed(4);
  };

  const bitDistribution = analyzeBitDistribution();
  const hexFrequency = analyzeHexFrequency();
  const byteDistribution = analyzeByteDistribution();
  const entropy = calculateEntropy();

  const pieColors = ['hsl(var(--royal-blue))', 'hsl(var(--silver))'];

  if (!qrngData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="premium-panel p-6 space-y-6"
    >
      <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
        Entropy Analysis & Randomness Distribution
      </h3>
      
      {/* Entropy Score */}
      <div className="text-center p-4 bg-muted rounded-lg">
        <div className="text-2xl font-bold text-primary mb-1">{entropy}</div>
        <div className="text-sm text-muted-foreground">Shannon Entropy (max: 1.0000)</div>
      </div>

      {/* Bit Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 text-foreground">Bit Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bitDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {bitDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hex Character Frequency */}
        <div>
          <h4 className="font-medium mb-3 text-foreground">Hex Character Frequency</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hexFrequency}>
                <XAxis dataKey="char" className="text-xs" />
                <YAxis className="text-xs" />
                <Bar dataKey="count" fill="hsl(var(--royal-blue))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Byte Distribution */}
      <div>
        <h4 className="font-medium mb-3 text-foreground">Byte Value Distribution (0-255)</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byteDistribution}>
              <XAxis dataKey="range" className="text-xs" />
              <YAxis className="text-xs" />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--royal-blue))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--royal-blue))", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">{qrngData.length}</div>
          <div className="text-xs text-muted-foreground">Hex Characters</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">{binary.length}</div>
          <div className="text-xs text-muted-foreground">Binary Bits</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">{binary.length / 8}</div>
          <div className="text-xs text-muted-foreground">Bytes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">{hexFrequency.length}</div>
          <div className="text-xs text-muted-foreground">Unique Chars</div>
        </div>
      </div>
    </motion.div>
  );
};