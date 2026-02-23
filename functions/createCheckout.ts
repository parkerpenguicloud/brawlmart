import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { price, serviceId, serviceDesc, customerEmail, customerName, notes, currentRank, desiredRank } = await req.json();

    if (!price || price <= 0) {
      return Response.json({ error: "Invalid price" }, { status: 400 });
    }
    if (!customerEmail) {
      return Response.json({ error: "Email required" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://brawlmart.base44.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(price * 100),
            product_data: {
              name: `BrawlMart — ${serviceId.charAt(0).toUpperCase() + serviceId.slice(1)} Boost`,
              description: serviceDesc || `${currentRank || ""} → ${desiredRank || ""}`.trim() || undefined,
            },
          },
        },
      ],
      metadata: {
        service_type: serviceId,
        current_rank: currentRank || "",
        desired_rank: desiredRank || "",
        customer_name: customerName || "",
        notes: notes || "",
      },
      success_url: `${origin}/pages/Home?payment=success`,
      cancel_url: `${origin}/pages/ServiceDetail?service=${serviceId}`,
    });

    // Save order in DB
    await base44.asServiceRole.entities.Order.create({
      service_type: serviceId,
      current_rank: currentRank || serviceDesc || "",
      desired_rank: desiredRank || "",
      price,
      customer_email: customerEmail,
      customer_name: customerName || "",
      notes: notes || "",
      status: "pending",
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});