import { motion } from "framer-motion";

interface AnimatedChunkDisplayProps {
  binary: string;
}

export const AnimatedChunkDisplay = ({ binary }: AnimatedChunkDisplayProps) => {
  const chunks = [];
  const colors = [
    'bg-purple-100 border-purple-300 text-purple-800',
    'bg-green-100 border-green-300 text-green-800', 
    'bg-blue-100 border-blue-300 text-blue-800',
    'bg-orange-100 border-orange-300 text-orange-800',
    'bg-pink-100 border-pink-300 text-pink-800',
    'bg-yellow-100 border-yellow-300 text-yellow-800',
    'bg-cyan-100 border-cyan-300 text-cyan-800',
  ];

  for (let i = 0; i < binary.length - 5; i += 6) {
    const chunk = binary.slice(i, i + 6);
    if (chunk.length === 6) {
      chunks.push(chunk);
      if (chunks.length >= 7) break; // Limit to 7 chunks for final key
    }
  }

  return (
    <div className="space-y-6">
      {/* Animated Chunking Visualization */}
      <div className="relative">
        <div className="flex flex-wrap gap-3 justify-center">
          {chunks.map((chunk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.2, 
                duration: 0.5,
                type: "spring",
                stiffness: 120
              }}
              className={`px-4 py-3 rounded-xl border-2 font-mono text-lg font-bold ${colors[index % colors.length]} shadow-lg`}
            >
              <div className="text-center">
                <div className="text-xs font-normal opacity-75 mb-1">Chunk {index + 1}</div>
                <div>{chunk}</div>
                <div className="text-xs font-normal opacity-75 mt-1">
                  = {parseInt(chunk, 2)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: chunks.length * 0.2 + 0.3, duration: 0.4 }}
        className="text-center bg-purple-50 p-4 rounded-lg border border-purple-200"
      >
        <div className="text-sm text-purple-700">
          <strong>6-bit Chunking:</strong> Binary data split into {chunks.length} chunks of 6 bits each
        </div>
        <div className="text-xs text-purple-600 mt-1">
          Each chunk represents a value from 0-63 for Base-62 encoding
        </div>
      </motion.div>
    </div>
  );
};