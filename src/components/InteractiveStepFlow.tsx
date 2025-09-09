import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StepProps {
  title: string;
  children: ReactNode;
  isVisible: boolean;
  delay?: number;
  tooltip?: string;
  stepNumber: number;
}

export const InteractiveStep = ({ 
  title, 
  children, 
  isVisible, 
  delay = 0, 
  tooltip,
  stepNumber 
}: StepProps) => {
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && stepRef.current) {
      const timer = setTimeout(() => {
        stepRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, delay * 1000 + 500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  if (!isVisible) return null;

  return (
    <motion.div
      ref={stepRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="premium-panel p-6 space-y-4 mb-8"
    >
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-royal-blue to-royal-blue-dark text-white rounded-full flex items-center justify-center text-sm font-bold">
            {stepNumber}
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            {title}
          </h3>
        </div>
        
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 hover:bg-muted rounded-full transition-colors cursor-help">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-card border border-border">
                <p className="text-sm text-foreground">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="animate-gentle-fade">
        {children}
      </div>
    </motion.div>
  );
};