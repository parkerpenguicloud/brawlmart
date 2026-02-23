import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SB_SERVICE_ROLE_KEY')!
);

const COMMAND_PREFIX = '.';
const COMMANDS = {
  'inpro': 'in_progress',
  'comp': 'completed',
  'canc': 'cancelled'
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();

    if (body.type === 1) {
      return Response.json({ type: 1 });
    }

    if (body.type === 3) {
      return Response.json({ type: 4, data: { content: 'Processing...' } });
    }

    if (body.content && body.content.startsWith(COMMAND_PREFIX)) {
      const args = body.content.slice(COMMAND_PREFIX.length).trim().split(/\s+/);
      const command = args[0].toLowerCase();
      const orderId = args[1];

      if (!COMMANDS[command]) {
        return Response.json({ error: 'Unknown command' }, { status: 400 });
      }

      if (!orderId) {
        return Response.json({ error: 'Order ID required' }, { status: 400 });
      }

      const { error } = await supabaseAdmin
        .from('Order')
        .update({ status: COMMANDS[command] })
        .eq('id', orderId);

      if (error) {
        console.error('Failed to update order status:', error);
        return Response.json({ error: 'Failed to update order' }, { status: 500 });
      }

      return Response.json({ 
        success: true, 
        message: `Order ${orderId} marked as ${COMMANDS[command]}` 
      });
    }

    return Response.json({ success: false }, { status: 400 });
  } catch (error) {
    console.error('Discord bot handler error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});