import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Copy, Check, Terminal, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const QuantumAPI = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const endpoints = [
    {
      method: "GET",
      path: "/api/quantum/otp",
      description: "Generate quantum-secure OTP",
      params: "?length=6&type=numeric",
      response: '{ "otp": "847293", "entropy": "quantum" }'
    },
    {
      method: "GET",
      path: "/api/quantum/password",
      description: "Generate quantum password",
      params: "?length=16&uppercase=true&numbers=true&symbols=true",
      response: '{ "password": "Qx9#mK2$pL7@nR4!", "strength": "very_strong" }'
    },
    {
      method: "GET",
      path: "/api/quantum/uuid",
      description: "Generate quantum unique ID",
      params: "?format=uuid-v4",
      response: '{ "id": "7f3d8a2e-4b1c-9d5f-6e0a-2c8b4d7f1e3a" }'
    },
    {
      method: "GET",
      path: "/api/quantum/token",
      description: "Generate quantum token",
      params: "?length=32&prefix=qk_",
      response: '{ "token": "qk_8xK2mP9nL4vR7wQ3yT6uI1oA5sD0fG" }'
    },
    {
      method: "POST",
      path: "/api/quantum/pick",
      description: "Quantum random selection",
      params: "body: { items: [...], count: 1 }",
      response: '{ "selected": ["item_3"], "seed": "quantum" }'
    }
  ];

  const copyToClipboard = async (text: string, endpoint: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="min-h-screen relative">
      <div className="fog-overlay" />

      <div className="container mx-auto px-6 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            type="button"
            onClick={() => navigate("/quantum-tools")}
            variant="outline"
            className="mb-6 gap-2 border-border hover:border-primary hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Developer API Access
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Integrate quantum randomness directly into your applications
            </p>
          </div>
        </motion.div>

        {/* API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-panel p-6 mb-8 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Your API Key
            </h3>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
              Active
            </span>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-3 bg-background/50 rounded-xl border border-border font-mono text-sm text-muted-foreground">
              qrng_live_••••••••••••••••••••••••
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-primary/30 hover:bg-primary/10"
              onClick={() => copyToClipboard("qrng_live_xxxxxxxxxxxxxxxxxxxxxxxx", "apikey")}
            >
              {copiedEndpoint === "apikey" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>

        {/* Endpoints */}
        <div className="max-w-4xl mx-auto space-y-4">
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="premium-panel p-5 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    endpoint.method === "GET" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-foreground font-mono text-sm">{endpoint.path}</code>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`${endpoint.path}${endpoint.params}`, endpoint.path)}
                  className="hover:bg-primary/10"
                >
                  {copiedEndpoint === endpoint.path ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-muted-foreground text-sm mb-3">{endpoint.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Terminal className="w-3 h-3 text-muted-foreground" />
                  <code className="text-muted-foreground">{endpoint.params}</code>
                </div>
                <div className="px-3 py-2 bg-background/50 rounded-lg border border-border/50">
                  <code className="text-xs text-primary/80 font-mono">{endpoint.response}</code>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">Why Use Quantum API?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "True Randomness", desc: "Powered by quantum vacuum fluctuations" },
              { icon: Shield, title: "Military-Grade", desc: "Cryptographically secure endpoints" },
              { icon: Globe, title: "Global CDN", desc: "Low-latency access worldwide" }
            ].map((item, i) => (
              <div key={i} className="premium-panel p-4 text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuantumAPI;
