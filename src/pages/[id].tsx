import AnswerPoll from "@/components/AnswerPoll";
import { PollData } from "@/types/poll";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const id = router.query.id;

  const { data, isLoading, isError } = useQuery<PollData, { message: string }>(
    ["poll-data", id],
    async () => {
      const response = await fetch(`/api/polls/${id}`);
      if (response.status === 404) {
        throw new Error(
          "We could not find the poll youre looking for, please check if the url is correct."
        );
      }
      const data = await response.json();
      return data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: id ? true : false,
      retry: false,
    }
  );

  if (isLoading && id) {
    return (
      <div className='flex min-h-screen justify-center items-center'>
        <progress className='progress w-56'></progress>
      </div>
    );
  }

  return (
    <>
      <AnswerPoll data={data} isError={isError} />
    </>
  );
}
