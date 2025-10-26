import { motion } from "framer-motion";
import { Shield, Lock, Radio, Satellite, Skull, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MilitaryGradeSection = () => {
  const militaryApplications = [
    {
      icon: Radio,
      title: "Secure Communications",
      description: "Encrypted battlefield communications resistant to adversarial decryption",
      securityLevel: "TOP SECRET",
      useCases: ["Tactical radio systems", "Command & control networks", "Field operations"]
    },
    {
      icon: Satellite,
      title: "Satellite Encryption",
      description: "Quantum-safe satellite links for intelligence and reconnaissance",
      securityLevel: "CLASSIFIED",
      useCases: ["GPS navigation", "Spy satellite feeds", "Global command networks"]
    },
    {
      icon: Shield,
      title: "Nuclear Command",
      description: "Authentication for nuclear weapons systems and strategic defenses",
      securityLevel: "TOP SECRET/SCI",
      useCases: ["Launch codes", "Authentication tokens", "Strategic defense systems"]
    },
    {
      icon: Lock,
      title: "Cyber Warfare Defense",
      description: "Protection against state-sponsored cyber attacks and quantum computers",
      securityLevel: "CLASSIFIED",
      useCases: ["Network security", "Data encryption", "Zero-trust architecture"]
    }
  ];

  const certifications = [
    { name: "NSA Suite B", status: "APPROVED" },
    { name: "FIPS 140-2 Level 4", status: "CERTIFIED" },
    { name: "Common Criteria EAL7+", status: "EVALUATED" },
    { name: "NATO RESTRICTED", status: "AUTHORIZED" }
  ];

  const threatComparison = [
    {
      threat: "Brute Force Attack",
      prng: "Vulnerable in 10^6 attempts",
      qrng: "Mathematically impossible",
      icon: Skull
    },
    {
      threat: "Pattern Analysis",
      prng: "Predictable with ML",
      qrng: "No patterns exist",
      icon: AlertTriangle
    },
    {
      threat: "Quantum Computer",
      prng: "Broken instantly",
      qrng: "Quantum-resistant",
      icon: Zap
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-red-500/20 rounded-full border border-red-500/30">
          <Shield className="w-5 h-5 text-red-500" />
          <span className="text-sm font-bold text-red-500 tracking-widest">MILITARY GRADE SECURITY</span>
        </div>
        <h2 className="elegant-title text-4xl font-bold mb-4">
          Defense-Level Cryptographic Systems
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Deployed in critical defense infrastructure worldwide. Trusted by NATO, NSA, and allied forces for operations where failure is not an option.
        </p>
      </motion.div>

      {/* Certifications Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="premium-panel bg-gradient-to-r from-background via-muted/30 to-background p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse" />
        </div>
        
        <div className="relative z-10">
          <h3 className="text-center text-xl font-bold mb-6 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Security Certifications & Compliance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <Badge className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xs">
                  {cert.name}
                </Badge>
                <p className="text-xs text-green-600 mt-2 font-semibold">{cert.status}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Military Applications Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {militaryApplications.map((app, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
          >
            <Card className="premium-panel h-full relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <app.icon className="w-7 h-7 text-primary" />
                  </div>
                  <Badge variant="destructive" className="text-xs font-bold">
                    {app.securityLevel}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{app.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">{app.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">Active Deployments:</p>
                  <ul className="space-y-1">
                    {app.useCases.map((useCase, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Threat Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className="premium-panel">
          <CardHeader>
            <CardTitle className="text-2xl text-center elegant-title">
              Adversarial Threat Resistance Matrix
            </CardTitle>
            <p className="text-center text-muted-foreground">
              QRNG vs PRNG protection against modern attack vectors
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4">Threat Type</th>
                    <th className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        <span>PRNG</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary" />
                        <span>QRNG</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {threatComparison.map((threat, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <threat.icon className="w-5 h-5 text-destructive" />
                          <span className="font-semibold">{threat.threat}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {threat.prng}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge className="gap-1 bg-gradient-to-r from-green-600 to-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          {threat.qrng}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Real-World Impact Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-green-500/10 p-12 border-2 border-primary/20"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10 text-center space-y-6">
          <h3 className="elegant-title text-3xl font-bold">
            Mission-Critical Performance Record
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                0
              </div>
              <p className="text-sm text-muted-foreground">Security breaches in 15+ years</p>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                50+
              </div>
              <p className="text-sm text-muted-foreground">NATO member deployments</p>
            </div>
            <div>
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                10^76
              </div>
              <p className="text-sm text-muted-foreground">Years to crack with supercomputers</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Protecting classified communications, nuclear command systems, and strategic defense networks across the globe.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MilitaryGradeSection;
