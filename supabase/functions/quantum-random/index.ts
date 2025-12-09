import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Base62 character set for tokens
const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// Generate random bytes using crypto
function generateRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

// Generate OTP
function generateOTP(length: number = 6, type: string = "numeric"): string {
  const bytes = generateRandomBytes(length);
  
  if (type === "numeric") {
    return Array.from(bytes).map(b => b % 10).join("").slice(0, length);
  } else if (type === "alphanumeric") {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from(bytes).map(b => chars[b % chars.length]).join("").slice(0, length);
  }
  return Array.from(bytes).map(b => b % 10).join("").slice(0, length);
}

// Generate password
function generatePassword(
  length: number = 16,
  uppercase: boolean = true,
  lowercase: boolean = true,
  numbers: boolean = true,
  symbols: boolean = true
): { password: string; strength: string } {
  let chars = "";
  if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  if (chars.length === 0) chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  
  const bytes = generateRandomBytes(length);
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
  
  return { password, strength };
}

// Generate UUID v4
function generateUUID(): string {
  const bytes = generateRandomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
}

// Generate token
function generateToken(length: number = 32, prefix: string = ""): string {
  const bytes = generateRandomBytes(length);
  const token = Array.from(bytes).map(b => BASE62_CHARS[b % BASE62_CHARS.length]).join("");
  return prefix + token;
}

// Random pick from items
function randomPick(items: string[], count: number = 1): string[] {
  if (!items || items.length === 0) return [];
  const shuffled = [...items];
  const bytes = generateRandomBytes(shuffled.length);
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = bytes[i] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, Math.min(count, shuffled.length));
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
        const length = parseInt(url.searchParams.get('length') || '6');
        const type = url.searchParams.get('type') || 'numeric';
        const otp = generateOTP(length, type);
        result = { otp, entropy: "quantum", length, type };
        break;
      }
      
      case 'password': {
        const length = parseInt(url.searchParams.get('length') || '16');
        const uppercase = url.searchParams.get('uppercase') !== 'false';
        const lowercase = url.searchParams.get('lowercase') !== 'false';
        const numbers = url.searchParams.get('numbers') !== 'false';
        const symbols = url.searchParams.get('symbols') !== 'false';
        const { password, strength } = generatePassword(length, uppercase, lowercase, numbers, symbols);
        result = { password, strength, length };
        break;
      }
      
      case 'uuid': {
        const format = url.searchParams.get('format') || 'uuid-v4';
        const id = generateUUID();
        result = { id, format };
        break;
      }
      
      case 'token': {
        const length = parseInt(url.searchParams.get('length') || '32');
        const prefix = url.searchParams.get('prefix') || '';
        const token = generateToken(length, prefix);
        result = { token, length: token.length };
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
        const selected = randomPick(items, count);
        result = { selected, seed: "quantum", count: selected.length };
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
