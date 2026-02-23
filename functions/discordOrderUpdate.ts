import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const { orderId, command } = await req.json();

    if (!orderId || !command) {
      return Response.json({ error: 'Missing orderId or command' }, { status: 400 });
    }

    // Map commands to statuses
    const commandMap = {
      'inprog': 'in_progress',
      'comp': 'completed',
      'canc': 'cancelled'
    };

    const status = commandMap[command.toLowerCase()];
    if (!status) {
      return Response.json({ error: 'Invalid command. Use: inprog, comp, canc' }, { status: 400 });
    }

    // Update the order
    const base44 = createClientFromRequest(req);
    const updatedOrder = await base44.asServiceRole.entities.Order.update(orderId, { status });

    return Response.json({ 
      success: true, 
      orderId,
      status,
      message: `Order updated to ${status}`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});