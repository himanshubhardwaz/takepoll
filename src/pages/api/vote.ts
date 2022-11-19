import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const id = req.body.id;

    if (!id) {
      res.status(404).send("Id is required");
      return;
    }

    const option = await prisma.option.update({
      where: { id },
      data: {
        votes: {
          increment: 1,
        },
      },
    });

    const options = await prisma.option.findMany({
      where: { pollId: option.pollId },
    });

    res.status(200).json(options);
  }
  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
