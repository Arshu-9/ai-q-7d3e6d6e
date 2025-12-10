import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ANU_QRNG_API = "https://qrng.anu.edu.au/API/jsonI.php";
const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const FETCH_TIMEOUT = 2000; // 2 second timeout for fast response

// Fast quantum bytes fetch with timeout
async function fetchQuantumBytes(length: number): Promise<{ bytes: Uint8Array; isQuantum: boolean }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  
  try {
    const response = await fetch(`${ANU_QRNG_API}?length=${length}&type=uint8`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeout);
    
    if (!response.ok) throw new Error("API error");
    
    const data = await response.json();
    if (data.success && data.data?.length) {
      return { bytes: new Uint8Array(data.data), isQuantum: true };
    }
    throw new Error("Invalid data");
  } catch {
    clearTimeout(timeout);
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return { bytes, isQuantum: false };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let action = url.pathname.split('/').filter(Boolean).pop();
    
    // For POST requests, check body for action if path doesn't specify one
    let bodyData: Record<string, unknown> = {};
    if (req.method === 'POST') {
      bodyData = await req.json().catch(() => ({}));
      if (!action || action === 'quantum-random') {
        action = bodyData.action as string;
      }
    }

    let result: Record<string, unknown>;

    switch (action) {
      case 'otp': {
        const length = Math.min(parseInt(url.searchParams.get('length') || '6'), 20);
        const type = url.searchParams.get('type') || 'numeric';
        const { bytes, isQuantum } = await fetchQuantumBytes(length);
        
        const otp = type === "alphanumeric" 
          ? Array.from(bytes).map(b => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"[b % 36]).join("")
          : Array.from(bytes).map(b => b % 10).join("");
        
        result = { otp: otp.slice(0, length), entropy: isQuantum ? "quantum" : "csprng", source: isQuantum ? "Stranger Q" : "CSPRNG fallback", length, type };
        break;
      }
      
      case 'password': {
        const length = Math.min(parseInt(url.searchParams.get('length') || '16'), 128);
        let chars = "";
        if (url.searchParams.get('uppercase') !== 'false') chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (url.searchParams.get('lowercase') !== 'false') chars += "abcdefghijklmnopqrstuvwxyz";
        if (url.searchParams.get('numbers') !== 'false') chars += "0123456789";
        if (url.searchParams.get('symbols') !== 'false') chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        if (!chars) chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        
        const { bytes, isQuantum } = await fetchQuantumBytes(length);
        const password = Array.from(bytes).map(b => chars[b % chars.length]).join("");
        
        const variety = [/[A-Z]/, /[a-z]/, /[0-9]/, /[!@#$%^&*]/].filter(r => r.test(password)).length;
        const strength = length >= 16 && variety >= 3 ? "very_strong" : length >= 12 && variety >= 2 ? "strong" : length >= 8 ? "medium" : "weak";
        
        result = { password, strength, length, entropy: isQuantum ? "quantum" : "csprng", source: isQuantum ? "Stranger Q" : "CSPRNG fallback" };
        break;
      }
      
      case 'uuid': {
        const { bytes, isQuantum } = await fetchQuantumBytes(16);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
        const id = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
        
        result = { id, format: "uuid-v4", entropy: isQuantum ? "quantum" : "csprng", source: isQuantum ? "Stranger Q" : "CSPRNG fallback" };
        break;
      }
      
      case 'token': {
        const length = Math.min(parseInt(url.searchParams.get('length') || '32'), 256);
        const prefix = url.searchParams.get('prefix') || '';
        const { bytes, isQuantum } = await fetchQuantumBytes(length);
        const token = prefix + Array.from(bytes).map(b => BASE62_CHARS[b % 62]).join("");
        
        result = { token, length: token.length, entropy: isQuantum ? "quantum" : "csprng", source: isQuantum ? "Stranger Q" : "CSPRNG fallback" };
        break;
      }
      
      case 'pick': {
        const { items = [], count = 1 } = bodyData as { items?: string[]; count?: number };
        if (!items.length) {
          result = { selected: [], count: 0, entropy: "none", source: "N/A" };
          break;
        }
        
        const { bytes, isQuantum } = await fetchQuantumBytes(items.length);
        const shuffled = [...items];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = bytes[i] % (i + 1);
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        result = { selected: shuffled.slice(0, Math.min(count, shuffled.length)), count: Math.min(count, shuffled.length), entropy: isQuantum ? "quantum" : "csprng", source: isQuantum ? "Stranger Q" : "CSPRNG fallback" };
        break;
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Unknown endpoint', available: ['otp', 'password', 'uuid', 'token', 'pick'] }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
