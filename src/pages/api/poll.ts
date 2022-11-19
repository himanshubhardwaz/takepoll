import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const id = req.query.id as string;

    const poll = await prisma.poll.findFirst({
      where: { id },
      include: { options: true },
    });

    if (poll) res.status(200).send(poll);
    else res.status(404).send({ error: "Poll not found!" });

    return;
  } else if (req.method === "POST") {
    const { question, options, deadline } = req.body;

    console.log({ question, options, deadline });

    const poll = await prisma.poll.create({
      data: { question, deadline: new Date(deadline) },
    });

    const createdOptions = await prisma.option.createMany({
      data: options.map((option: { name: string }) => ({
        ...option,
        pollId: poll.id,
      })),
    });

    console.log({ poll, createdOptions });

    if (poll && createdOptions) {
      res
        .status(200)
        .json({ message: "Successfully created poll", id: poll.id });
    } else res.status(500).json({ message: "Oops! Something went wrong" });
    return;
  }
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

//http://localhost:3000/?id=cland3pmg00000qsznlqetq0p
