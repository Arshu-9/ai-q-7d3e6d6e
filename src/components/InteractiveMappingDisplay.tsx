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
      if (mappings.length >= 7) break; // Limit to 7 characters
    }
  }

  const colors = [
    'border-purple-300 bg-purple-50',
    'border-green-300 bg-green-50',
    'border-blue-300 bg-blue-50',
    'border-orange-300 bg-orange-50',
    'border-pink-300 bg-pink-50',
    'border-yellow-300 bg-yellow-50',
    'border-cyan-300 bg-cyan-50',
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
            className={`p-4 rounded-xl border-2 ${colors[index % colors.length]} shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Binary Chunk */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.4 + 0.2, duration: 0.3 }}
                  className="bg-white px-4 py-2 rounded-lg border-2 border-gray-300"
                >
                  <div className="text-xs text-gray-500 mb-1">6-bit Binary</div>
                  <div className="font-mono text-lg font-bold text-gray-800">
                    {mapping.chunk}
                  </div>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.4 + 0.4, duration: 0.3 }}
                >
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </motion.div>

                {/* Decimal Value */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.4 + 0.6, duration: 0.3 }}
                  className="bg-white px-4 py-2 rounded-lg border-2 border-gray-300"
                >
                  <div className="text-xs text-gray-500 mb-1">Decimal</div>
                  <div className="font-bold text-xl text-gray-800">
                    {mapping.decimal}
                  </div>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.4 + 0.8, duration: 0.3 }}
                >
                  <ArrowRight className="w-6 h-6 text-gray-400" />
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
                  className="bg-gradient-to-br from-royal-blue to-royal-blue-dark text-white px-6 py-4 rounded-xl shadow-lg"
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
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200"
      >
        <div className="text-sm text-blue-700 mb-2">
          <strong>Base-62 Character Set:</strong>
        </div>
        <div className="font-mono text-xs text-blue-600 break-all">
          {chars}
        </div>
        <div className="text-xs text-blue-500 mt-2">
          Characters 0-61 mapped from decimal values (62 total characters)
        </div>
      </motion.div>
    </div>
  );
};