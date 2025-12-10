import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ANU QRNG API endpoint
const ANU_QRNG_API = "https://qrng.anu.edu.au/API/jsonI.php";

// Base62 character set for tokens
const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Fetch true quantum random bytes from ANU QRNG
async function fetchQuantumBytes(length: number): Promise<{ bytes: Uint8Array; isQuantum: boolean }> {
  try {
    // ANU API returns uint8 values (0-255)
    const response = await fetch(`${ANU_QRNG_API}?length=${length}&type=uint8`, {
      headers: { 'Accept': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(`ANU API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.data && Array.isArray(data.data)) {
      console.log(`Fetched ${data.data.length} true quantum random bytes from ANU QRNG`);
      return { bytes: new Uint8Array(data.data), isQuantum: true };
    }
    
    throw new Error("Invalid response from ANU QRNG");
  } catch (error) {
    console.warn(`ANU QRNG unavailable, falling back to CSPRNG: ${error.message}`);
    // Fallback to cryptographically secure pseudo-random
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return { bytes, isQuantum: false };
  }
}

// Generate OTP with quantum randomness
async function generateOTP(length: number = 6, type: string = "numeric"): Promise<{ otp: string; isQuantum: boolean }> {
  const { bytes, isQuantum } = await fetchQuantumBytes(length);
  
  let otp: string;
  if (type === "numeric") {
    otp = Array.from(bytes).map(b => b % 10).join("").slice(0, length);
  } else if (type === "alphanumeric") {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    otp = Array.from(bytes).map(b => chars[b % chars.length]).join("").slice(0, length);
  } else {
    otp = Array.from(bytes).map(b => b % 10).join("").slice(0, length);
  }
  
  return { otp, isQuantum };
}

// Generate password with quantum randomness
async function generatePassword(
  length: number = 16,
  uppercase: boolean = true,
  lowercase: boolean = true,
  numbers: boolean = true,
  symbols: boolean = true
): Promise<{ password: string; strength: string; isQuantum: boolean }> {
  let chars = "";
  if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  if (chars.length === 0) chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  
  const { bytes, isQuantum } = await fetchQuantumBytes(length);
  const password = Array.from(bytes).map(b => chars[b % chars.length]).join("");
  
  // Calculate strength
  let strength = "weak";
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
  const varietyCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  
  if (length >= 16 && varietyCount >= 3) strength = "very_strong";
  else if (length >= 12 && varietyCount >= 2) strength = "strong";
  else if (length >= 8 && varietyCount >= 2) strength = "medium";
  
  return { password, strength, isQuantum };
}

// Generate UUID v4 with quantum randomness
async function generateUUID(): Promise<{ uuid: string; isQuantum: boolean }> {
  const { bytes, isQuantum } = await fetchQuantumBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const uuid = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
  
  return { uuid, isQuantum };
}

// Generate token with quantum randomness
async function generateToken(length: number = 32, prefix: string = ""): Promise<{ token: string; isQuantum: boolean }> {
  const { bytes, isQuantum } = await fetchQuantumBytes(length);
  const token = prefix + Array.from(bytes).map(b => BASE62_CHARS[b % BASE62_CHARS.length]).join("");
  return { token, isQuantum };
}

// Random pick from items with quantum randomness
async function randomPick(items: string[], count: number = 1): Promise<{ selected: string[]; isQuantum: boolean }> {
  if (!items || items.length === 0) return { selected: [], isQuantum: false };
  
  const { bytes, isQuantum } = await fetchQuantumBytes(items.length);
  const shuffled = [...items];
  
  // Fisher-Yates shuffle using quantum random bytes
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = bytes[i] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return { selected: shuffled.slice(0, Math.min(count, shuffled.length)), isQuantum };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const action = pathParts[pathParts.length - 1];

    console.log(`Quantum API called: ${action}`);

    let result: Record<string, unknown>;

    switch (action) {
      case 'otp': {
        const length = Math.min(parseInt(url.searchParams.get('length') || '6'), 20);
        const type = url.searchParams.get('type') || 'numeric';
        const { otp, isQuantum } = await generateOTP(length, type);
        result = { 
          otp, 
          entropy: isQuantum ? "quantum" : "csprng",
          source: isQuantum ? "Stranger Q" : "CSPRNG fallback",
          length, 
          type 
        };
        break;
      }
      
      case 'password': {
        const length = Math.min(parseInt(url.searchParams.get('length') || '16'), 128);
        const uppercase = url.searchParams.get('uppercase') !== 'false';
        const lowercase = url.searchParams.get('lowercase') !== 'false';
        const numbers = url.searchParams.get('numbers') !== 'false';
        const symbols = url.searchParams.get('symbols') !== 'false';
        const { password, strength, isQuantum } = await generatePassword(length, uppercase, lowercase, numbers, symbols);
        result = { 
          password, 
          strength, 
          length,
          entropy: isQuantum ? "quantum" : "csprng",
          source: isQuantum ? "Stranger Q" : "CSPRNG fallback"
        };
        break;
      }
      
      case 'uuid': {
        const format = url.searchParams.get('format') || 'uuid-v4';
        const { uuid, isQuantum } = await generateUUID();
        result = { 
          id: uuid, 
          format,
          entropy: isQuantum ? "quantum" : "csprng",
          source: isQuantum ? "Stranger Q" : "CSPRNG fallback"
        };
        break;
      }
      
      case 'token': {
        const length = Math.min(parseInt(url.searchParams.get('length') || '32'), 256);
        const prefix = url.searchParams.get('prefix') || '';
        const { token, isQuantum } = await generateToken(length, prefix);
        result = { 
          token, 
          length: token.length,
          entropy: isQuantum ? "quantum" : "csprng",
          source: isQuantum ? "Stranger Q" : "CSPRNG fallback"
        };
        break;
      }
      
      case 'pick': {
        if (req.method !== 'POST') {
          return new Response(JSON.stringify({ error: 'POST method required for pick' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        const body = await req.json();
        const items = body.items || [];
        const count = body.count || 1;
        const { selected, isQuantum } = await randomPick(items, count);
        result = { 
          selected, 
          count: selected.length,
          entropy: isQuantum ? "quantum" : "csprng",
          source: isQuantum ? "Stranger Q" : "CSPRNG fallback"
        };
        break;
      }
      
      default:
        return new Response(JSON.stringify({ 
          error: 'Unknown endpoint',
          available: ['otp', 'password', 'uuid', 'token', 'pick']
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    console.log(`Quantum API result:`, result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Quantum API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
