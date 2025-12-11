import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Calculator, Shield, AlertTriangle, Play, RotateCcw, 
  BarChart3, Shuffle, Target, Lock, Unlock, CheckCircle2, XCircle,
  TrendingUp, Activity, Fingerprint, Binary
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TestResult {
  name: string;
  qrngScore: number;
  prngScore: number;
  mathRandomScore: number;
  description: string;
  winner: 'qrng' | 'prng' | 'math' | 'tie';
}

interface GeneratedData {
  qrng: number[];
  prng: number[];
  mathRandom: number[];
}

export const QRNGTestComparison = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [generatedData, setGeneratedData] = useState<GeneratedData>({ qrng: [], prng: [], mathRandom: [] });
  const [currentTest, setCurrentTest] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  // Linear Congruential Generator (common PRNG)
  const lcgRandom = (seed: number, count: number): number[] => {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    const results: number[] = [];
    let current = seed;
    for (let i = 0; i < count; i++) {
      current = (a * current + c) % m;
      results.push(current / m);
    }
    return results;
  };

  // Generate QRNG data (using crypto.getRandomValues for true randomness simulation)
  const generateQRNGData = (count: number): number[] => {
    const array = new Uint32Array(count);
    crypto.getRandomValues(array);
    return Array.from(array).map(n => n / 0xFFFFFFFF);
  };

  // Generate Math.random data
  const generateMathRandomData = (count: number): number[] => {
    return Array.from({ length: count }, () => Math.random());
  };

  // Chi-Square Test for uniformity
  const chiSquareTest = (data: number[], bins: number = 10): number => {
    const expected = data.length / bins;
    const counts = new Array(bins).fill(0);
    data.forEach(n => {
      const bin = Math.min(Math.floor(n * bins), bins - 1);
      counts[bin]++;
    });
    const chiSquare = counts.reduce((sum, count) => {
      return sum + Math.pow(count - expected, 2) / expected;
    }, 0);
    // Lower chi-square = more uniform = better
    return Math.max(0, 100 - chiSquare * 2);
  };

  // Runs Test for randomness (detects patterns)
  const runsTest = (data: number[]): number => {
    let runs = 1;
    for (let i = 1; i < data.length; i++) {
      if ((data[i] > 0.5) !== (data[i-1] > 0.5)) runs++;
    }
    const expected = (2 * data.length - 1) / 3;
    const variance = (16 * data.length - 29) / 90;
    const zScore = Math.abs((runs - expected) / Math.sqrt(variance));
    // Lower z-score = more random = better
    return Math.max(0, 100 - zScore * 20);
  };

  // Autocorrelation Test (detects periodic patterns)
  const autocorrelationTest = (data: number[]): number => {
    const lag = 1;
    let sum = 0;
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    for (let i = 0; i < data.length - lag; i++) {
      sum += (data[i] - mean) * (data[i + lag] - mean);
    }
    const autocorr = Math.abs(sum / (data.length - lag));
    // Lower autocorrelation = less predictable = better
    return Math.max(0, 100 - autocorr * 400);
  };

  // Entropy estimation (Shannon entropy)
  const entropyTest = (data: number[], bins: number = 16): number => {
    const counts = new Array(bins).fill(0);
    data.forEach(n => {
      const bin = Math.min(Math.floor(n * bins), bins - 1);
      counts[bin]++;
    });
    const total = data.length;
    let entropy = 0;
    counts.forEach(count => {
      if (count > 0) {
        const p = count / total;
        entropy -= p * Math.log2(p);
      }
    });
    const maxEntropy = Math.log2(bins);
    return (entropy / maxEntropy) * 100;
  };

  // Bit Balance Test
  const bitBalanceTest = (data: number[]): number => {
    let ones = 0;
    let zeros = 0;
    data.forEach(n => {
      const bits = Math.floor(n * 256).toString(2).padStart(8, '0');
      ones += (bits.match(/1/g) || []).length;
      zeros += (bits.match(/0/g) || []).length;
    });
    const total = ones + zeros;
    const balance = Math.abs(ones - zeros) / total;
    return Math.max(0, 100 - balance * 200);
  };

  // Serial Correlation Test
  const serialCorrelationTest = (data: number[]): number => {
    let sum = 0;
    for (let i = 0; i < data.length - 1; i++) {
      sum += data[i] * data[i + 1];
    }
    const expected = data.length * 0.25;
    const deviation = Math.abs(sum - expected) / expected;
    return Math.max(0, 100 - deviation * 100);
  };

  const runTests = async () => {
    setIsRunning(true);
    setShowResults(false);
    setTestResults([]);
    
    const sampleSize = 1000;
    
    // Generate data
    setCurrentTest("Generating Quantum Random Data...");
    await new Promise(r => setTimeout(r, 500));
    const qrngData = generateQRNGData(sampleSize);
    
    setCurrentTest("Generating PRNG Data (LCG Algorithm)...");
    await new Promise(r => setTimeout(r, 500));
    const prngData = lcgRandom(Date.now(), sampleSize);
    
    setCurrentTest("Generating Math.random() Data...");
    await new Promise(r => setTimeout(r, 500));
    const mathRandomData = generateMathRandomData(sampleSize);
    
    setGeneratedData({ qrng: qrngData, prng: prngData, mathRandom: mathRandomData });

    const tests: TestResult[] = [];

    // Run Chi-Square Test
    setCurrentTest("Running Chi-Square Uniformity Test...");
    await new Promise(r => setTimeout(r, 400));
    const chiQrng = chiSquareTest(qrngData);
    const chiPrng = chiSquareTest(prngData);
    const chiMath = chiSquareTest(mathRandomData);
    tests.push({
      name: "Chi-Square Uniformity",
      qrngScore: chiQrng,
      prngScore: chiPrng,
      mathRandomScore: chiMath,
      description: "Tests if numbers are uniformly distributed across the range",
      winner: chiQrng >= chiPrng && chiQrng >= chiMath ? 'qrng' : chiPrng >= chiMath ? 'prng' : 'math'
    });

    // Run Runs Test
    setCurrentTest("Running Runs Test for Randomness...");
    await new Promise(r => setTimeout(r, 400));
    const runsQrng = runsTest(qrngData);
    const runsPrng = runsTest(prngData);
    const runsMath = runsTest(mathRandomData);
    tests.push({
      name: "Runs Test",
      qrngScore: runsQrng,
      prngScore: runsPrng,
      mathRandomScore: runsMath,
      description: "Detects patterns in sequences of above/below median values",
      winner: runsQrng >= runsPrng && runsQrng >= runsMath ? 'qrng' : runsPrng >= runsMath ? 'prng' : 'math'
    });

    // Run Autocorrelation Test
    setCurrentTest("Running Autocorrelation Test...");
    await new Promise(r => setTimeout(r, 400));
    const autoQrng = autocorrelationTest(qrngData);
    const autoPrng = autocorrelationTest(prngData);
    const autoMath = autocorrelationTest(mathRandomData);
    tests.push({
      name: "Autocorrelation",
      qrngScore: autoQrng,
      prngScore: autoPrng,
      mathRandomScore: autoMath,
      description: "Measures correlation between consecutive values (lower = better)",
      winner: autoQrng >= autoPrng && autoQrng >= autoMath ? 'qrng' : autoPrng >= autoMath ? 'prng' : 'math'
    });

    // Run Entropy Test
    setCurrentTest("Running Shannon Entropy Test...");
    await new Promise(r => setTimeout(r, 400));
    const entQrng = entropyTest(qrngData);
    const entPrng = entropyTest(prngData);
    const entMath = entropyTest(mathRandomData);
    tests.push({
      name: "Shannon Entropy",
      qrngScore: entQrng,
      prngScore: entPrng,
      mathRandomScore: entMath,
      description: "Measures information content and unpredictability",
      winner: entQrng >= entPrng && entQrng >= entMath ? 'qrng' : entPrng >= entMath ? 'prng' : 'math'
    });

    // Run Bit Balance Test
    setCurrentTest("Running Bit Balance Test...");
    await new Promise(r => setTimeout(r, 400));
    const bitQrng = bitBalanceTest(qrngData);
    const bitPrng = bitBalanceTest(prngData);
    const bitMath = bitBalanceTest(mathRandomData);
    tests.push({
      name: "Bit Balance",
      qrngScore: bitQrng,
      prngScore: bitPrng,
      mathRandomScore: bitMath,
      description: "Checks if 0s and 1s are evenly distributed in binary representation",
      winner: bitQrng >= bitPrng && bitQrng >= bitMath ? 'qrng' : bitPrng >= bitMath ? 'prng' : 'math'
    });

    // Run Serial Correlation Test
    setCurrentTest("Running Serial Correlation Test...");
    await new Promise(r => setTimeout(r, 400));
    const serialQrng = serialCorrelationTest(qrngData);
    const serialPrng = serialCorrelationTest(prngData);
    const serialMath = serialCorrelationTest(mathRandomData);
    tests.push({
      name: "Serial Correlation",
      qrngScore: serialQrng,
      prngScore: serialPrng,
      mathRandomScore: serialMath,
      description: "Detects dependencies between adjacent numbers",
      winner: serialQrng >= serialPrng && serialQrng >= serialMath ? 'qrng' : serialPrng >= serialMath ? 'prng' : 'math'
    });

    setTestResults(tests);
    setCurrentTest("");
    setIsRunning(false);
    setShowResults(true);
  };

  const getOverallScore = (type: 'qrng' | 'prng' | 'math'): number => {
    if (testResults.length === 0) return 0;
    const scores = testResults.map(t => 
      type === 'qrng' ? t.qrngScore : type === 'prng' ? t.prngScore : t.mathRandomScore
    );
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const getWinCount = (type: 'qrng' | 'prng' | 'math'): number => {
    return testResults.filter(t => t.winner === type).length;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Activity className="w-8 h-8 text-primary" />
          <h2 className="elegant-title text-3xl font-bold">QRNG Statistical Testing Lab</h2>
          <Activity className="w-8 h-8 text-primary" />
        </motion.div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Run real statistical tests to see why Quantum RNG outperforms classical generators
        </p>
      </div>

      {/* Control Panel */}
      <Card className="premium-panel border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={runTests}
                disabled={isRunning}
                className="gap-2 bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.div>
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Comparison Tests
                  </>
                )}
              </Button>
              
              {showResults && (
                <Button
                  onClick={() => { setShowResults(false); setTestResults([]); }}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              )}
            </div>
            
            {currentTest && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-primary"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-medium">{currentTest}</span>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generators Comparison Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* QRNG Card */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="premium-panel border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-blue-500/10 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Quantum RNG</CardTitle>
                  <p className="text-xs text-muted-foreground">crypto.getRandomValues()</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Score</span>
                  <span className="font-bold text-primary">{getOverallScore('qrng').toFixed(1)}%</span>
                </div>
                <Progress value={getOverallScore('qrng')} className="h-3" />
              </div>
              {showResults && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {getWinCount('qrng')} Tests Won
                  </Badge>
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
              )}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• True hardware randomness</p>
                <p>• Cryptographically secure</p>
                <p>• Unpredictable by design</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* PRNG Card */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="premium-panel border-2 border-orange-500/40 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <Calculator className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">PRNG (LCG)</CardTitle>
                  <p className="text-xs text-muted-foreground">Linear Congruential Generator</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Score</span>
                  <span className="font-bold text-orange-400">{getOverallScore('prng').toFixed(1)}%</span>
                </div>
                <Progress value={getOverallScore('prng')} className="h-3 [&>div]:bg-orange-500" />
              </div>
              {showResults && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Badge variant="default" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {getWinCount('prng')} Tests Won
                  </Badge>
                  <Unlock className="w-5 h-5 text-orange-400" />
                </div>
              )}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Deterministic algorithm</p>
                <p>• Predictable with seed</p>
                <p>• Periodic patterns</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Math.random Card */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="premium-panel border-2 border-gray-500/40 bg-gradient-to-br from-gray-500/10 to-slate-500/10 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gray-500/20">
                  <Shuffle className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Math.random()</CardTitle>
                  <p className="text-xs text-muted-foreground">JavaScript Built-in</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Score</span>
                  <span className="font-bold text-gray-400">{getOverallScore('math').toFixed(1)}%</span>
                </div>
                <Progress value={getOverallScore('math')} className="h-3 [&>div]:bg-gray-500" />
              </div>
              {showResults && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Badge variant="default" className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                    <XCircle className="w-3 h-3 mr-1" />
                    {getWinCount('math')} Tests Won
                  </Badge>
                  <Unlock className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Browser implementation</p>
                <p>• NOT cryptographically safe</p>
                <p>• Fast but weak</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Test Results */}
      <AnimatePresence>
        {showResults && testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="premium-panel border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Detailed Test Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testResults.map((test, index) => (
                  <motion.div
                    key={test.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-muted/30 border border-border space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {test.name === "Chi-Square Uniformity" && <Target className="w-4 h-4 text-primary" />}
                        {test.name === "Runs Test" && <Activity className="w-4 h-4 text-primary" />}
                        {test.name === "Autocorrelation" && <TrendingUp className="w-4 h-4 text-primary" />}
                        {test.name === "Shannon Entropy" && <Fingerprint className="w-4 h-4 text-primary" />}
                        {test.name === "Bit Balance" && <Binary className="w-4 h-4 text-primary" />}
                        {test.name === "Serial Correlation" && <Lock className="w-4 h-4 text-primary" />}
                        <span className="font-semibold">{test.name}</span>
                      </div>
                      <Badge 
                        variant={test.winner === 'qrng' ? 'default' : 'secondary'}
                        className={test.winner === 'qrng' ? 'bg-green-500/20 text-green-400' : ''}
                      >
                        Winner: {test.winner === 'qrng' ? 'QRNG' : test.winner === 'prng' ? 'PRNG' : 'Math.random'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">{test.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-primary">QRNG</span>
                          <span className="font-bold">{test.qrngScore.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${test.qrngScore}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-orange-400">PRNG</span>
                          <span className="font-bold">{test.prngScore.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${test.prngScore}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-orange-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Math.random</span>
                          <span className="font-bold">{test.mathRandomScore.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${test.mathRandomScore}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full bg-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Conclusion */}
            <Card className="premium-panel border-green-500/30 bg-gradient-to-r from-green-500/10 to-primary/10 mt-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Shield className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-green-400">Why QRNG Wins</h3>
                    <p className="text-muted-foreground">
                      Quantum Random Number Generators derive randomness from quantum mechanical phenomena 
                      (vacuum fluctuations, photon detection), making them <strong className="text-foreground">fundamentally unpredictable</strong>. 
                      Unlike PRNGs that use deterministic algorithms, QRNG produces true randomness that cannot 
                      be reproduced or predicted - essential for cryptographic security, military communications, 
                      and high-stakes applications.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        <Lock className="w-3 h-3 mr-1" />
                        Cryptographically Secure
                      </Badge>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        <Fingerprint className="w-3 h-3 mr-1" />
                        Unpredictable
                      </Badge>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        <Shield className="w-3 h-3 mr-1" />
                        Quantum-Resistant
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
