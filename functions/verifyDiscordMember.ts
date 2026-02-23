Deno.serve(async (req) => {
  try {
    const { username } = await req.json();

    if (!username) {
      return Response.json({ error: 'Username required' }, { status: 400 });
    }

    const botToken = Deno.env.get('DISCORD_BOT_TOKEN');
    const guildId = Deno.env.get('DISCORD_CHANNEL_ID')?.split('/')[0];

    if (!botToken || !guildId) {
      return Response.json({ error: 'Missing Discord config' }, { status: 500 });
    }

    const response = await fetch(
      https://discord.com/api/v10/guilds/${guildId}/members/search?query=${encodeURIComponent(username)}&limit=1,
      {
        headers: {
          'Authorization': Bot ${botToken},
        },
      }
    );

    if (!response.ok) {
      return Response.json({ found: false, error: 'Failed to search members' }, { status: 200 });
    }

    const members = await response.json();
    const found = members.length > 0;

    return Response.json({
      found,
      username: found ? members[0].user.username : null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
