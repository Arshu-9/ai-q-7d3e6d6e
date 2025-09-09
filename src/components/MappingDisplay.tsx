import { motion } from "framer-motion";

interface MappingDisplayProps {
  binary: string;
}

export const MappingDisplay = ({ binary }: MappingDisplayProps) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const mappings = [];

  for (let i = 0; i < binary.length - 5; i += 6) {
    const chunk = binary.slice(i, i + 6);
    if (chunk.length === 6) {
      const decimal = parseInt(chunk, 2);
      const index = decimal % chars.length;
      const char = chars[index];
      mappings.push({ chunk, decimal, char });
      if (mappings.length >= 7) break; // Limit to 7 characters
    }
  }

  return (
    <div className="space-y-4">
      {mappings.map((mapping, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.3, duration: 0.4 }}
          className="flex items-center justify-between p-3 bg-muted rounded-lg border"
        >
          <div className="flex items-center space-x-4">
            <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-300">
              {mapping.chunk}
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="font-medium">
              {mapping.decimal}
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="font-bold text-primary text-lg">
              {mapping.char}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};