import { motion } from "framer-motion";

interface BinaryDisplayProps {
  binary: string;
}

export const BinaryDisplay = ({ binary }: BinaryDisplayProps) => {
  // Group binary into 8-bit chunks for better readability
  const chunks = [];
  for (let i = 0; i < binary.length; i += 8) {
    chunks.push(binary.slice(i, i + 8));
  }

  return (
    <div className="code-display max-h-40 overflow-y-auto">
      <div className="flex flex-wrap gap-2">
        {chunks.map((chunk, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-muted px-2 py-1 rounded text-sm font-mono border"
          >
            {chunk}
          </motion.span>
        ))}
      </div>
    </div>
  );
};