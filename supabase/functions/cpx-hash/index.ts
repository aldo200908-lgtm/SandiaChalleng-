import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    // La API KEY debe estar configurada en el Dashboard de Supabase -> Edge Functions -> Secrets
    // Fix: Access Deno via globalThis to prevent "Cannot find name 'Deno'" errors
    const CPX_API_KEY = (globalThis as any).Deno.env.get('CPX_API_KEY') || 'TU_API_KEY_AQUI'; 

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generar SHA256(userId + CPX_API_KEY)
    const encoder = new TextEncoder();
    const data = encoder.encode(userId + CPX_API_KEY);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const secureHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return new Response(JSON.stringify({ secureHash }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})