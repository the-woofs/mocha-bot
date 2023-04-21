// takes in discord user id and server id, format is /api/bot/verifyAdmin/:userId/:serverId
// returns true if any of the user's roles in the server has admin permissions
// returns false if the user is not in the server or if the user is in the server but has no admin permissions
//
// Path: src/pages/api/bot/verifyAdmin.ts

import { NextApiRequest, NextApiResponse } from "next/types";

// use discord api, authentication token is in .env as TOKEN
// https://discord.com/developers/docs/resources/guild#get-guild-member
// https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
// https://discord.com/developers/docs/resources/guild#get-guild-member

async function verifyAdmin(userId: string, serverId: string) {
  const rawResult = await fetch(
    `https://discord.com/api/guilds/${serverId}/members/${userId}`,
    {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
      },
    }
  );
  const result = await rawResult.json();
  if (result.error) return false;
  const roles = result.roles;
  const rawRoles = await fetch(
    `https://discord.com/api/guilds/${serverId}/roles`,
    {
      headers: {
        Authorization: `Bot ${process.env.TOKEN}`,
      },
    }
  );
  const rolesResult = await rawRoles.json();
  const adminRoles = rolesResult.filter((role: any) => role.permissions & 8);
  const adminRoleIds = adminRoles.map((role: any) => role.id);
  return roles.some((role: any) => adminRoleIds.includes(role));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const forbiddenError = {
    error: "bro tf do you get from trynna hack this",
  };
  try {
    const [userId, serverId] = req.query.path as string[];

    if (!(await verifyAdmin(userId, serverId))) {
      res.status(200).json({ result: false });
      return;
    }

    res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    res.status(500).json(forbiddenError);
  }
}
