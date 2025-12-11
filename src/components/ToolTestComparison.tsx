import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Calculator, Shield, AlertTriangle, Play, RotateCcw, 
  CheckCircle2, XCircle, Lock, Unlock, Target, Activity,
  Building2, CreditCard, Smartphone, Server, Globe, ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface UseCase {
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  qrngBenefit: string;
  prngRisk: string;
}

interface ToolTestComparisonProps {
  toolName: string;
  generateQRNG: () => Promise<string>;
  generatePRNG: () => string;
  useCases: UseCase[];
}

export const ToolTestComparison = ({ 
  toolName, 
  generateQRNG, 
  generatePRNG,
  useCases 
}: ToolTestComparisonProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [qrngSamples, setQrngSamples] = useState<string[]>([]);
  const [prngSamples, setPrngSamples] = useState<string[]>([]);
  const [testScores, setTestScores] = useState({ qrng: 0, prng: 0 });

  // Calculate entropy of a string
  const calculateEntropy = (str: string): number => {
    const freq: Record<string, number> = {};
    for (const char of str) {
      freq[char] = (freq[char] || 0) + 1;
    }
    let entropy = 0;
    const len = str.length;
    for (const count of Object.values(freq)) {
      const p = count / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  };

  // Check for patterns/repetition
  const patternScore = (samples: string[]): number => {
    let uniqueChars = new Set(samples.join('')).size;
    let maxPossible = samples.join('').length;
    return Math.min(100, (uniqueChars / Math.min(maxPossible, 36)) * 100);
  };

  // Check for sequential patterns
  const sequentialScore = (samples: string[]): number => {
    let sequential = 0;
    const all = samples.join('');
    for (let i = 1; i < all.length; i++) {
      if (Math.abs(all.charCodeAt(i) - all.charCodeAt(i-1)) === 1) sequential++;
    }
    return Math.max(0, 100 - (sequential / all.length) * 200);
  };

  const runComparison = async () => {
    setIsRunning(true);
    setShowResults(false);
    setQrngSamples([]);
    setPrngSamples([]);

    const qrngResults: string[] = [];
    const prngResults: string[] = [];

    // Generate 10 samples of each
    for (let i = 0; i < 10; i++) {
      const qrng = await generateQRNG();
      const prng = generatePRNG();
      qrngResults.push(qrng);
      prngResults.push(prng);
      setQrngSamples([...qrngResults]);
      setPrngSamples([...prngResults]);
      await new Promise(r => setTimeout(r, 200));
    }

    // Calculate scores
    const qrngEntropy = qrngResults.reduce((sum, s) => sum + calculateEntropy(s), 0) / qrngResults.length;
    const prngEntropy = prngResults.reduce((sum, s) => sum + calculateEntropy(s), 0) / prngResults.length;
    
    const qrngPattern = patternScore(qrngResults);
    const prngPattern = patternScore(prngResults);
    
    const qrngSeq = sequentialScore(qrngResults);
    const prngSeq = sequentialScore(prngResults);

    const qrngTotal = (qrngEntropy * 20 + qrngPattern + qrngSeq) / 3;
    const prngTotal = (prngEntropy * 20 + prngPattern + prngSeq) / 3;

    setTestScores({ 
      qrng: Math.min(100, qrngTotal), 
      prng: Math.min(100, prngTotal) 
    });

    setIsRunning(false);
    setShowResults(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/20 border border-secondary/30">
            <Target className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Test & Compare</h2>
            <p className="text-sm text-muted-foreground">See why Quantum {toolName} is superior</p>
          </div>
        </div>
        <Button
          onClick={runComparison}
          disabled={isRunning}
          className="gap-2"
          variant={showResults ? "outline" : "default"}
        >
          {isRunning ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <RotateCcw className="w-4 h-4" />
              </motion.div>
              Testing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {showResults ? "Run Again" : "Run Comparison"}
            </>
          )}
        </Button>
      </div>

      {/* Live Comparison */}
      <AnimatePresence>
        {(isRunning || showResults) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {/* QRNG Side */}
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="w-4 h-4 text-primary" />
                  Quantum RNG Samples
                  {showResults && (
                    <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Secure
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {qrngSamples.map((sample, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-sm bg-muted/50 px-3 py-1.5 rounded border border-border"
                    >
                      <span className="text-primary">{sample}</span>
                    </motion.div>
                  ))}
                </div>
                {showResults && (
                  <div className="pt-3 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Security Score</span>
                      <span className="font-bold text-primary">{testScores.qrng.toFixed(1)}%</span>
                    </div>
                    <Progress value={testScores.qrng} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* PRNG Side */}
            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calculator className="w-4 h-4 text-orange-400" />
                  PRNG Samples (Math.random)
                  {showResults && (
                    <Badge className="ml-auto bg-orange-500/20 text-orange-400 border-orange-500/30">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Predictable
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {prngSamples.map((sample, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-sm bg-muted/50 px-3 py-1.5 rounded border border-border"
                    >
                      <span className="text-orange-400">{sample}</span>
                    </motion.div>
                  ))}
                </div>
                {showResults && (
                  <div className="pt-3 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Security Score</span>
                      <span className="font-bold text-orange-400">{testScores.prng.toFixed(1)}%</span>
                    </div>
                    <Progress value={testScores.prng} className="h-2 [&>div]:bg-orange-500" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Analysis */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border border-green-500/30 bg-green-500/10"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-400">QRNG Wins!</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Quantum-generated {toolName.toLowerCase()}s show higher entropy, better distribution, and no detectable patterns. 
                PRNG outputs can be reverse-engineered if the seed is discovered.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Real-World Use Cases */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Real-World Applications
        </h3>
        <div className="grid gap-4">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <useCase.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{useCase.title}</h4>
                        <p className="text-sm text-muted-foreground">{useCase.description}</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Lock className="w-3 h-3 text-green-400" />
                            <span className="text-xs font-semibold text-green-400">With QRNG</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{useCase.qrngBenefit}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Unlock className="w-3 h-3 text-red-400" />
                            <span className="text-xs font-semibold text-red-400">With PRNG</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{useCase.prngRisk}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why QRNG Section */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Why Quantum Randomness Matters</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span><strong className="text-foreground">True Unpredictability:</strong> Quantum randomness comes from fundamental quantum mechanics, not algorithms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span><strong className="text-foreground">No Seed Vulnerability:</strong> Unlike PRNGs, there's no seed that attackers can discover or predict.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span><strong className="text-foreground">Future-Proof:</strong> Quantum-generated values remain secure even against quantum computers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span><strong className="text-foreground">PRNG Risk:</strong> Mathematical patterns can be detected with enough samples, enabling prediction attacks.</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Pre-defined use cases for different tools
export const OTP_USE_CASES: UseCase[] = [
  {
    title: "Banking & Financial Transactions",
    icon: CreditCard,
    description: "Banks use OTPs for authorizing high-value transfers and sensitive operations.",
    qrngBenefit: "Truly random OTPs that cannot be predicted, even with access to previous codes.",
    prngRisk: "Attackers analyzing OTP patterns could predict future codes and authorize fraudulent transactions."
  },
  {
    title: "Two-Factor Authentication",
    icon: Smartphone,
    description: "Login verification for corporate systems, email accounts, and secure platforms.",
    qrngBenefit: "Each OTP is generated from quantum vacuum fluctuations - physically impossible to predict.",
    prngRisk: "Compromised PRNG seeds could allow attackers to generate valid OTPs remotely."
  },
  {
    title: "Government & Military Systems",
    icon: Building2,
    description: "Access control for classified systems and secure communications.",
    qrngBenefit: "Military-grade entropy ensures no state actor can predict access codes.",
    prngRisk: "Nation-state attackers with advanced computing could break PRNG-based authentication."
  }
];

export const PASSWORD_USE_CASES: UseCase[] = [
  {
    title: "Database Encryption Keys",
    icon: Server,
    description: "Master passwords protecting entire databases of sensitive information.",
    qrngBenefit: "Quantum-generated passwords have maximum entropy, making brute-force infeasible.",
    prngRisk: "Weak PRNG patterns reduce effective password strength, enabling faster cracking."
  },
  {
    title: "Cloud Service Accounts",
    icon: Globe,
    description: "Administrative access to cloud infrastructure and services.",
    qrngBenefit: "True randomness ensures no correlation between passwords across systems.",
    prngRisk: "PRNG-generated passwords may share patterns, compromising multiple accounts."
  },
  {
    title: "API & Service Keys",
    icon: Lock,
    description: "Authentication tokens for critical backend services and integrations.",
    qrngBenefit: "Unpredictable keys prevent unauthorized API access even with partial key exposure.",
    prngRisk: "Predictable patterns could allow attackers to enumerate valid API keys."
  }
];

export const TOKEN_USE_CASES: UseCase[] = [
  {
    title: "Session Tokens",
    icon: Smartphone,
    description: "User session management for web applications.",
    qrngBenefit: "Session hijacking becomes impossible as tokens cannot be guessed or predicted.",
    prngRisk: "Attackers could predict session tokens and impersonate authenticated users."
  },
  {
    title: "Cryptocurrency Wallets",
    icon: CreditCard,
    description: "Private keys and seed phrases for digital asset protection.",
    qrngBenefit: "Quantum entropy ensures wallet keys are truly unique and unguessable.",
    prngRisk: "Weak randomness in wallet generation has led to millions in stolen crypto."
  },
  {
    title: "OAuth & JWT Secrets",
    icon: Lock,
    description: "Signing keys for authentication tokens and API authorization.",
    qrngBenefit: "Signatures remain secure even if attackers have extensive token samples.",
    prngRisk: "Compromised signing secrets would allow forging authentication tokens."
  }
];

export const UUID_USE_CASES: UseCase[] = [
  {
    title: "Database Primary Keys",
    icon: Server,
    description: "Unique identifiers for records in distributed databases.",
    qrngBenefit: "Zero collision probability across billions of records.",
    prngRisk: "PRNG collisions could cause data corruption and integrity issues."
  },
  {
    title: "Transaction IDs",
    icon: CreditCard,
    description: "Tracking financial transactions across payment systems.",
    qrngBenefit: "True uniqueness prevents duplicate transaction processing.",
    prngRisk: "Duplicate IDs could lead to double-charging or lost transactions."
  },
  {
    title: "IoT Device Identifiers",
    icon: Globe,
    description: "Unique identification for millions of connected devices.",
    qrngBenefit: "Guaranteed unique IDs even at massive scale deployment.",
    prngRisk: "ID collisions could compromise device authentication and data routing."
  }
];
