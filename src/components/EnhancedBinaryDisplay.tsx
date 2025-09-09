import { motion } from "framer-motion";

interface EnhancedBinaryDisplayProps {
  binary: string;
}

export const EnhancedBinaryDisplay = ({ binary }: EnhancedBinaryDisplayProps) => {
  // Group binary into 4-bit blocks for hex representation
  const chunks = [];
  for (let i = 0; i < binary.length; i += 4) {
    chunks.push(binary.slice(i, i + 4));
  }

  const getHexFromBinary = (binaryChunk: string) => {
    return parseInt(binaryChunk, 2).toString(16).toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* Binary Display */}
      <div className="code-display max-h-60 overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {chunks.map((chunk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-mono border border-blue-300 mb-1">
                {chunk}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {getHexFromBinary(chunk)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
        <strong className="text-blue-700">Binary Representation:</strong> Each hex character is converted to 4 binary digits (bits). 
        Total bits: {binary.length} | 4-bit blocks: {chunks.length}
      </div>
    </div>
  );
};