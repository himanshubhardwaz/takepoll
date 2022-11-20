import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import ErrorAlert from "@/components/Error";
import type { Option } from "@prisma/client";
import type { PollData } from "@/types/poll";
import Link from "next/link";

const MyPolls = () => {
  const { data, isLoading, error } = useQuery<
    Array<PollData>,
    { message?: string }
  >(["my-polls"], async () => {
    const response = await fetch("/api/polls");
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
    if (response.status === 404) {
      throw new Error("Cannot find your polls");
    }
    if (response.status === 401) {
      throw new Error("Please login to access your polls");
    }
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert message={error?.message} />;
  }

  const getTotalVotes = (options: Array<Option>) => {
    return options.reduce((sum, curr) => {
      return sum + curr.votes;
    }, 0);
  };

  return (
    <div className='flex justify-center align-middle min-h-screen py-20'>
      <div className='grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center content-center mt-8'>
        {data.map((poll) => (
          <div className='card w-96 bg-base-100 shadow-xl' key={poll.id}>
            <div className='card-body'>
              <h2 className='card-title'>{poll.question}</h2>
              {poll.options?.map((option) => (
                <div key={option.id}>
                  <p>
                    {option.name} - {option.votes} votes
                  </p>
                </div>
              ))}
              <div className='card-actions justify-end'>
                <Link className='btn' href={`/${poll.id}`}>
                  Go to pole
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPolls;
