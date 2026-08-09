import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const SYSTEM_PROMPT = `Eres un analista cuantitativo institucional y auditor estadístico de trading.
Analizas una captura de gráfico junto con el contexto operativo aportado por el trader.
Tu objetivo es describir el contexto institucional (fase de mercado, comportamiento de liquidez,
estructura, sesión) y detectar patrones repetibles.
Restricciones estrictas: no des señales de compra o venta, no prometas rentabilidad,
no induzcas a invertir. Lenguaje profesional, objetivo, educativo y sin juicio.
Responde SIEMPRE en el idioma del contexto aportado por el usuario (por defecto español).`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) return json({ error: 'Missing LOVABLE_API_KEY' }, 500);

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims?.sub) return json({ error: 'Unauthorized' }, 401);
    const userId = claimsData.claims.sub as string;

    let body: { sampleId?: unknown };
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const sampleId = typeof body.sampleId === 'string' ? body.sampleId.trim() : '';
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(sampleId)) return json({ error: 'sampleId inválido' }, 400);

    const { data: sample, error: sampleErr } = await userClient
      .from('brain_samples')
      .select('*')
      .eq('id', sampleId)
      .eq('user_id', userId)
      .maybeSingle();

    if (sampleErr) return json({ error: sampleErr.message }, 400);
    if (!sample) return json({ error: 'Muestra no encontrada' }, 404);

    await userClient
      .from('brain_samples')
      .update({ ai_status: 'analyzing' })
      .eq('id', sampleId);

    // Signed URL for the private image
    const { data: signed, error: signErr } = await userClient.storage
      .from('brain-samples')
      .createSignedUrl(sample.image_path, 600);

    if (signErr || !signed?.signedUrl) {
      await userClient.from('brain_samples').update({ ai_status: 'error' }).eq('id', sampleId);
      return json({ error: 'No se pudo leer la imagen de la muestra' }, 400);
    }

    const contextText = [
      `Sesión: ${sample.session}`,
      `Activo: ${sample.symbol}`,
      `Temporalidad: ${sample.timeframe ?? 'n/d'}`,
      `Fecha del evento: ${sample.occurred_at}`,
      `Estructura marcada por el trader: ${(sample.structure_tags ?? []).join(', ') || 'n/d'}`,
      `Resultado: ${sample.outcome}`,
      `R obtenido: ${sample.r_multiple ?? 'n/d'}`,
      `Tipo de setup: ${sample.setup_type ?? 'n/d'}`,
      `Notas del trader: ${sample.notes ?? 'n/d'}`,
    ].join('\n');

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': lovableKey,
        'X-Lovable-AIG-SDK': 'fetch',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.6-flash',
        stream: false,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  `Analiza esta operación y su contexto.\n\n${contextText}\n\n` +
                  `Devuelve un objeto JSON con estas claves exactas: ` +
                  `{"summary": string (análisis de 3 a 6 frases: fase de mercado, liquidez, estructura y lectura institucional), ` +
                  `"patterns": string[] (2 a 6 etiquetas cortas de patrón detectado), ` +
                  `"quality_score": number entero de 0 a 100 con la calidad del setup, ` +
                  `"observations": string (1 a 3 observaciones accionables sobre el proceso)}. ` +
                  `Responde solo con el JSON, sin texto adicional.`,
              },
              { type: 'image_url', image_url: { url: signed.signedUrl } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      await userClient.from('brain_samples').update({ ai_status: 'error' }).eq('id', sampleId);
      if (aiRes.status === 429) return json({ error: 'rate_limited' }, 429);
      if (aiRes.status === 402) return json({ error: 'payment_required' }, 402);
      console.error('[analyze-brain-sample] gateway error', aiRes.status, errText);
      return json({ error: 'No se pudo completar el análisis' }, 502);
    }

    const aiJson = await aiRes.json();
    const raw = aiJson?.choices?.[0]?.message?.content ?? '';

    let parsed: {
      summary?: string;
      patterns?: string[];
      quality_score?: number;
      observations?: string;
    } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { summary: typeof raw === 'string' ? raw : '' };
    }

    const patterns = Array.isArray(parsed.patterns)
      ? parsed.patterns.filter((p) => typeof p === 'string').slice(0, 8)
      : [];
    const scoreNum = Number(parsed.quality_score);
    const quality = Number.isFinite(scoreNum)
      ? Math.max(0, Math.min(100, Math.round(scoreNum)))
      : null;
    const summary = [parsed.summary, parsed.observations].filter(Boolean).join('\n\n');

    const { data: updated, error: updateErr } = await userClient
      .from('brain_samples')
      .update({
        ai_status: 'done',
        ai_summary: summary || null,
        ai_patterns: patterns,
        ai_quality_score: quality,
        ai_raw: parsed,
      })
      .eq('id', sampleId)
      .select()
      .single();

    if (updateErr) return json({ error: updateErr.message }, 400);

    return json({ sample: updated });
  } catch (e) {
    console.error('[analyze-brain-sample] error', e);
    return json({ error: 'Error inesperado' }, 500);
  }
});
