import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return Response.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update the order
    const updatedOrder = await base44.asServiceRole.entities.Order.update(orderId, {
      status: status
    });

    return Response.json({ 
      success: true, 
      order: updatedOrder,
      message: `Order ${orderId} updated to ${status}`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});