import { createClient } from 'npm:@supabase/supabase-js@2';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SB_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  try {
    const { event, data } = await req.json();

    console.log('createDiscordTicket called with:', { event, data });

    if (event.type !== 'update' || !data.payment_method || data.status !== 'pending') {
      console.log('Skipping - invalid conditions for ticket creation');
      return Response.json({ success: false, reason: 'Skipped' });
    }

    if (data.discord_channel_id) {
      console.log('Ticket already exists for this order');
      return Response.json({ success: false, reason: 'Ticket already exists' });
    }

    const token = Deno.env.get('DISCORD_BOT_TOKEN');
    const guildId = Deno.env.get('DISCORD_CHANNEL_ID');
    const categoryId = '1475219512759685182';

    if (!token || !guildId || !categoryId) {
      console.error('Missing env vars:', { token: !!token, guildId, categoryId });
      return Response.json({ error: 'Missing Discord credentials' }, { status: 500 });
    }

    const channelResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `ticket-${data.id.slice(-6).toLowerCase()}`,
        type: 0,
        parent_id: categoryId,
        topic: `Order #${data.id.slice(-6).toUpperCase()} - ${data.discord_username || data.customer_name}`,
      }),
    });

    if (!channelResponse.ok) {
      const errorText = await channelResponse.text();
      return Response.json({ error: `Failed to create channel: ${errorText}` }, { status: 500 });
    }

    const channel = await channelResponse.json();
    const channelId = channel.id;

    const { error: updateError } = await supabaseAdmin
      .from('Order')
      .update({ discord_channel_id: channelId })
      .eq('id', data.id);

    if (updateError) {
      console.error('Failed to update order:', updateError);
      return Response.json({ error: 'Failed to update order' }, { status: 500 });
    }

    let userId = null;
    try {
      const membersResponse = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/search?query=${encodeURIComponent(data.discord_username)}&limit=1`,
        {
          headers: { 'Authorization': `Bot ${token}` },
        }
      );
      if (membersResponse.ok) {
        const members = await membersResponse.json();
        if (members.length > 0) {
          userId = members[0].user.id;
        }
      }
    } catch (e) {
      console.log('Could not find user by username:', e.message);
    }

    const permissionUpdates = [
      fetch(`https://discord.com/api/v10/channels/${channelId}/permissions/${guildId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bot ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'role',
          deny: '1024',
        }),
      })
    ];

    if (userId) {
      permissionUpdates.push(
        fetch(`https://discord.com/api/v10/channels/${channelId}/permissions/${userId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bot ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'member',
            allow: '1024',
          }),
        })
      );
    }

    await Promise.all(permissionUpdates);

    const serviceNames = {
      ranked: 'Ranked',
      brawler: 'Brawler',
      prestige: 'Prestige',
      trophies: 'Trophies',
      winstreak: 'Winstreak',
      matcherino: 'Matcherino',
    };

    const message = `${userId ? `<@${userId}>` : `@${data.discord_username}`} 👋

**📋 Service Order**
${serviceNames[data.service_type] || data.service_type}

${data.current_rank ? `**From:** \`${data.current_rank}\`` : ''}
${data.desired_rank ? `**To:** \`${data.desired_rank}\`` : ''}

**💰 Price:** \`$${data.price?.toFixed(2) || '0.00'}\`
**💳 Payment:** \`${data.payment_method || 'N/A'}\`

━━━━━━━━━━━━━━━━━
Payment is awaiting verification. We'll get started once confirmed!
${data.notes ? `\n**📝 Notes:** ${data.notes}` : ''}`;

    await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    });

    return Response.json({ success: true, channelId });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});