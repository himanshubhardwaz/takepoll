import type { Poll, Option } from "@prisma/client";

export interface PollData extends Poll {
  options: Array<Option>;
}
