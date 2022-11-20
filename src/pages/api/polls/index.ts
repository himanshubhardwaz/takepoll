import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import type { Poll } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    res.send("Currently in development!");
    return;
  }
  if (req.method === "POST") {
    const session = await unstable_getServerSession(req, res, authOptions);

    const { question, options, deadline } = req.body;

    let poll: Poll;

    // @ts-ignore
    if (session?.user?.id) {
      poll = await prisma.poll.create({
        data: {
          question,
          deadline: new Date(deadline),
          user: {
            // @ts-ignore
            connect: { id: session.user.id },
          },
        },
      });
    } else {
      poll = await prisma.poll.create({
        data: { question, deadline: new Date(deadline) },
      });
    }

    const createdOptions = await prisma.option.createMany({
      data: options.map((option: { name: string }) => ({
        ...option,
        pollId: poll.id,
      })),
    });

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
