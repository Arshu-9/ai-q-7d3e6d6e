import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Copy, Check, Terminal, Zap, Shield, Globe, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const QuantumAPI = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});

  const baseUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/quantum-random`;

  const endpoints = [
    {
      id: "otp",
      method: "GET",
      path: "/otp",
      description: "Generate quantum-secure OTP",
      params: "?length=6&type=numeric",
      example: '{ "otp": "847293", "entropy": "quantum" }'
    },
    {
      id: "password",
      method: "GET",
      path: "/password",
      description: "Generate quantum password",
      params: "?length=16&uppercase=true&numbers=true&symbols=true",
      example: '{ "password": "Qx9#mK2$pL7@nR4!", "strength": "very_strong" }'
    },
    {
      id: "uuid",
      method: "GET",
      path: "/uuid",
      description: "Generate quantum unique ID",
      params: "?format=uuid-v4",
      example: '{ "id": "7f3d8a2e-4b1c-9d5f-6e0a-2c8b4d7f1e3a" }'
    },
    {
      id: "token",
      method: "GET",
      path: "/token",
      description: "Generate quantum token",
      params: "?length=32&prefix=qk_",
      example: '{ "token": "qk_8xK2mP9nL4vR7wQ3yT6uI1oA5sD0fG" }'
    },
    {
      id: "pick",
      method: "POST",
      path: "/pick",
      description: "Quantum random selection",
      params: 'body: { "items": ["A","B","C"], "count": 1 }',
      example: '{ "selected": ["B"], "seed": "quantum" }'
    }
  ];

  const copyToClipboard = async (text: string, endpoint: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const testEndpoint = async (endpoint: typeof endpoints[0]) => {
    setLoading(endpoint.id);
    try {
      let response;
      
      if (endpoint.method === "POST") {
        response = await supabase.functions.invoke('quantum-random', {
          body: { items: ["Option A", "Option B", "Option C", "Option D"], count: 1 },
          method: 'POST',
        });
      } else {
        const params = new URLSearchParams(endpoint.params.replace('?', ''));
        response = await fetch(`${baseUrl}${endpoint.path}?${params.toString()}`);
        const data = await response.json();
        response = { data };
      }

      if (response.data) {
        setResults(prev => ({
          ...prev,
          [endpoint.id]: JSON.stringify(response.data, null, 2)
        }));
        toast({ title: "API call successful!" });
      }
    } catch (error) {
      console.error('API test error:', error);
      toast({ 
        title: "API call failed", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
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

        {/* Base URL Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-panel p-6 mb-8 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              API Base URL
            </h3>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30">
              Live
            </span>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-3 bg-background/50 rounded-xl border border-border font-mono text-sm text-foreground overflow-x-auto">
              {baseUrl}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-primary/30 hover:bg-primary/10"
              onClick={() => copyToClipboard(baseUrl, "baseurl")}
            >
              {copiedEndpoint === "baseurl" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>

        {/* Endpoints */}
        <div className="max-w-4xl mx-auto space-y-4">
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.id}
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
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => testEndpoint(endpoint)}
                    disabled={loading === endpoint.id}
                    className="border-accent/30 hover:bg-accent/10 text-accent"
                  >
                    {loading === endpoint.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Try It
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`${baseUrl}${endpoint.path}${endpoint.params}`, endpoint.id)}
                    className="hover:bg-primary/10"
                  >
                    {copiedEndpoint === endpoint.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-3">{endpoint.description}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Terminal className="w-3 h-3 text-muted-foreground" />
                  <code className="text-muted-foreground">{endpoint.params}</code>
                </div>
                
                {/* Live Result or Example */}
                <div className="px-3 py-2 bg-background/50 rounded-lg border border-border/50">
                  {results[endpoint.id] ? (
                    <div>
                      <span className="text-xs text-green-400 font-medium mb-1 block">Live Result:</span>
                      <pre className="text-xs text-foreground font-mono whitespace-pre-wrap">{results[endpoint.id]}</pre>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs text-muted-foreground mb-1 block">Example Response:</span>
                      <code className="text-xs text-primary/80 font-mono">{endpoint.example}</code>
                    </div>
                  )}
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
              { icon: Zap, title: "True Randomness", desc: "Powered by cryptographic entropy" },
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
