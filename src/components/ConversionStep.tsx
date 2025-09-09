import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ConversionStepProps {
  title: string;
  children: ReactNode;
  isVisible: boolean;
  delay?: number;
}

export const ConversionStep = ({ title, children, isVisible, delay = 0 }: ConversionStepProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="premium-panel p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
        {title}
      </h3>
      {children}
    </motion.div>
  );
};