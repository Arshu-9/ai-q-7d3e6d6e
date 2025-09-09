import { motion } from "framer-motion";

interface ChunkDisplayProps {
  binary: string;
}

export const ChunkDisplay = ({ binary }: ChunkDisplayProps) => {
  const chunks = [];
  const colors = [
    'bg-blue-100 border-blue-300 text-blue-800',
    'bg-green-100 border-green-300 text-green-800',
    'bg-purple-100 border-purple-300 text-purple-800',
    'bg-orange-100 border-orange-300 text-orange-800',
    'bg-pink-100 border-pink-300 text-pink-800',
    'bg-yellow-100 border-yellow-300 text-yellow-800',
  ];

  for (let i = 0; i < binary.length - 5; i += 6) {
    const chunk = binary.slice(i, i + 6);
    if (chunk.length === 6) {
      chunks.push(chunk);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {chunks.map((chunk, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
            className={`px-3 py-2 rounded-lg border-2 font-mono text-sm ${colors[index % colors.length]}`}
          >
            {chunk}
          </motion.div>
        ))}
      </div>
      <div className="text-sm text-muted-foreground">
        Total 6-bit chunks: {chunks.length}
      </div>
    </div>
  );
};