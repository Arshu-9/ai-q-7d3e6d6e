import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface InteractiveMappingDisplayProps {
  binary: string;
}

export const InteractiveMappingDisplay = ({ binary }: InteractiveMappingDisplayProps) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const mappings = [];

  for (let i = 0; i < binary.length - 5; i += 6) {
    const chunk = binary.slice(i, i + 6);
    if (chunk.length === 6) {
      const decimal = parseInt(chunk, 2);
      const index = decimal % chars.length;
      const char = chars[index];
      mappings.push({ chunk, decimal, char });
      if (mappings.length >= 7) break;
    }
  }

  // Dark theme colors with neon accents
  const colors = [
    'border-primary/40 bg-primary/10',
    'border-secondary/40 bg-secondary/10',
    'border-accent/40 bg-accent/10',
    'border-primary/40 bg-primary/10',
    'border-secondary/40 bg-secondary/10',
    'border-accent/40 bg-accent/10',
    'border-primary/40 bg-primary/10',
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Mapping Cards */}
      <div className="space-y-4">
        {mappings.map((mapping, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.4, 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            className={`p-4 rounded-xl border-2 ${colors[index % colors.length]} shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4 flex-wrap gap-2">
                {/* Binary Chunk */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.4 + 0.2, duration: 0.3 }}
                  className="bg-muted/50 px-4 py-2 rounded-lg border border-border"
                >
                  <div className="text-xs text-muted-foreground mb-1">6-bit Binary</div>
                  <div className="font-mono text-lg font-bold text-foreground">
                    {mapping.chunk}
                  </div>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.4 + 0.4, duration: 0.3 }}
                >
                  <ArrowRight className="w-6 h-6 text-primary" />
                </motion.div>

                {/* Decimal Value */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.4 + 0.6, duration: 0.3 }}
                  className="bg-muted/50 px-4 py-2 rounded-lg border border-border"
                >
                  <div className="text-xs text-muted-foreground mb-1">Decimal</div>
                  <div className="font-bold text-xl text-foreground">
                    {mapping.decimal}
                  </div>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.4 + 0.8, duration: 0.3 }}
                >
                  <ArrowRight className="w-6 h-6 text-primary" />
                </motion.div>

                {/* Final Character */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.4 + 1, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 150
                  }}
                  className="bg-gradient-to-br from-primary to-secondary text-primary-foreground px-6 py-4 rounded-xl shadow-neon-red"
                >
                  <div className="text-xs opacity-90 mb-1">Base-62 Char</div>
                  <div className="font-bold text-3xl">
                    {mapping.char}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Base-62 Character Set Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: mappings.length * 0.4 + 0.5, duration: 0.5 }}
        className="bg-accent/10 p-4 rounded-lg border border-accent/30"
      >
        <div className="text-sm text-foreground mb-2">
          <strong className="text-accent">Base-62 Character Set:</strong>
        </div>
        <div className="font-mono text-xs text-accent break-all">
          {chars}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Characters 0-61 mapped from decimal values (62 total characters)
        </div>
      </motion.div>
    </div>
  );
};
