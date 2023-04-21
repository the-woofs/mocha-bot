import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  const forbiddenError = {
    error: "bro tf do you get from trynna hack this",
  };

  if (!session) {
    res.status(401).json(forbiddenError);
    return;
  }

  const [path, ...rest] = req.query.path as string[];

  const constructedPath = `${path}/${rest.join("/")}`;

  try {
    const rawResult = await fetch(
      "https://discordapp.com/api/" + constructedPath,
      {
        headers: {
          Authorization: `Bot ${process.env.TOKEN}`,
        },
      }
    );
    const result = await rawResult.json();
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: "failed to load data" });
  }
}
