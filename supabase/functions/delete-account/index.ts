import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userErr } =
      await userClient.auth.getUser(token);
    if (userErr || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = userData.user.id;
    const admin = createClient(supabaseUrl, serviceKey);

    const tables: Array<[string, string]> = [
      ['trades', 'user_id'],
      ['psychology_entries', 'user_id'],
      ['trading_accounts', 'user_id'],
      ['pre_market_checkins', 'user_id'],
      ['process_validations', 'user_id'],
      ['user_streaks', 'user_id'],
      ['psychological_errors', 'user_id'],
      ['ai_insights', 'user_id'],
      ['analytics_snapshots', 'user_id'],
      ['trade_screenshots', 'user_id'],
      ['trading_rules', 'user_id'],
      ['study_progress', 'user_id'],
      ['user_roles', 'user_id'],
      ['profiles', 'id'],
    ];

    const failures: string[] = [];
    for (const [table, col] of tables) {
      const { error } = await admin.from(table).delete().eq(col, userId);
      if (error) {
        console.error(`Failed deleting ${table}:`, error.message);
        failures.push(table);
      }
    }

    if (failures.length > 0) {
      return new Response(
        JSON.stringify({
          error: 'Partial deletion failed',
          failedTables: failures,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const { error: deleteErr } = await admin.auth.admin.deleteUser(userId);
    if (deleteErr) {
      console.error('Failed to delete user:', deleteErr);
      return new Response(
        JSON.stringify({ error: 'Failed to delete user' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('delete-account internal error:', e);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again later.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
