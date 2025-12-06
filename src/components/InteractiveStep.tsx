import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InteractiveStepProps {
  title: string;
  stepNumber: number;
  isVisible: boolean;
  delay: number;
  tooltip: string;
  children: ReactNode;
}

const InteractiveStep = ({
  title,
  stepNumber,
  isVisible,
  delay,
  tooltip,
  children,
}: InteractiveStepProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="premium-panel border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-neon-red">
                {stepNumber}
              </div>
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-card border-primary/30">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { InteractiveStep };
export default InteractiveStep;
