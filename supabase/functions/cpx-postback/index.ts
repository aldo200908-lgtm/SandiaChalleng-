
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const url = new URL(req.url)
  const ext_user_id = url.searchParams.get('ext_user_id')
  const amount_local = url.searchParams.get('amount_local')
  const trans_id = url.searchParams.get('trans_id')
  const status = url.searchParams.get('status') 

  // CPX envía status=1 para encuestas exitosas
  if (status !== '1') {
    return new Response("OK", { status: 200 })
  }

  if (!ext_user_id || !amount_local) {
    return new Response("Error: Missing parameters", { status: 400 })
  }

  const supabase = createClient(
    (globalThis as any).Deno.env.get('SUPABASE_URL') ?? '',
    (globalThis as any).Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Normalizamos el monto (algunos proveedores envían comas en lugar de puntos)
    const cleanAmount = amount_local.replace(',', '.');
    const rewardValue = parseFloat(cleanAmount);
    
    if (isNaN(rewardValue)) {
      console.error(`Invalid amount received: ${amount_local}`);
      return new Response("Invalid amount", { status: 400 });
    }

    // Insertar el registro. El trigger en la DB hará el resto (sumar al perfil).
    const { error } = await supabase
      .from('reward_history')
      .insert({
        user_id: ext_user_id,
        reward_amount: rewardValue,
        provider: 'CPX Research',
        transaction_id: trans_id || `cpx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'completed'
      });

    if (error) {
      // Código 23505 = Clave duplicada (la encuesta ya se procesó). Retornamos OK para que CPX no reintente.
      if (error.code === '23505') {
        console.log(`Duplicate transaction ignored: ${trans_id}`);
        return new Response("Duplicate", { status: 200 });
      }
      throw error;
    }

    console.log(`Successfully processed reward: S/ ${rewardValue} for user ${ext_user_id}`);
    return new Response("OK", { status: 200 });

  } catch (err) {
    console.error("Postback Error:", err.message);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
})
