import { useRouter } from "next/router";
import { PollData } from "@/types/poll";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Option } from "@prisma/client";

function NoId({ isError }: { isError: boolean }) {
  const router = useRouter();

  const rediectToCreatePoll = () => {
    router.push("/create");
  };

  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <h1 className='text-5xl font-bold'>Hello there</h1>
          <p className='py-6'>
            {isError ? (
              <>
                We could not find the poll youre looking for, please check if
                the url is correct.
              </>
            ) : (
              <>
                Create and conduct polls in a minute. Use it in your flipped
                classroom, in your lecture or just to amaze your audience.
                create your poll now!
              </>
            )}
          </p>
          <button className='btn btn-primary' onClick={rediectToCreatePoll}>
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
}

const AnswerPoll = ({
  data,
  isError,
}: {
  data?: PollData;
  isError: boolean;
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [canVote, setCanVote] = useState(true);

  const [totalVotes, setTotalVotes] = useState(() =>
    data?.options.reduce((sum, curr) => {
      return sum + curr.votes;
    }, 0)
  );

  const {
    mutate,
    data: updatedOptions,
    isLoading,
    error: caseVoteError,
  } = useMutation<Array<Option>, Error, void>(
    async () => {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedOption }),
      });
      const data = await response.json();
      return data;
    },
    {
      onSuccess: (newOptions) => {
        setTotalVotes(() =>
          newOptions.reduce((sum, curr) => {
            return sum + curr.votes;
          }, 0)
        );
        if (data?.id) localStorage.setItem(`${data.id}`, "done");
        setCanVote(false);
      },
    }
  );

  const onOptionSelectChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    if (event.target.checked) {
      setSelectedOption(id);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutate();
  };

  useEffect(() => {
    const voted = window?.localStorage?.getItem?.(`${data?.id}`);
    if (voted) setCanVote(false);
  }, [data?.id]);

  if (!data?.id) return <NoId isError={isError} />;

  return (
    <div className='min-h-screen flex justify-center items-center text-center'>
      {canVote ? (
        <form onSubmit={handleSubmit} className='max-w-xs'>
          <p className='text-2xl mb-4'>Question: {data.question}</p>
          {data.options.map((option) => (
            <div className='form-control' key={option.id}>
              <label className='label cursor-pointer'>
                <span className='label-text text-lg'>{option.name}</span>
                <input
                  onChange={(event) => onOptionSelectChange(event, option.id)}
                  type='radio'
                  name='radio-10'
                  className='radio checked:bg-blue-500'
                  checked={selectedOption === option.id}
                />
              </label>
            </div>
          ))}
          <button
            className={`btn btn-primary my-4 ${isLoading ? "loading" : ""}`}
            type='submit'
          >
            Caste vote
          </button>
        </form>
      ) : (
        <div className='flex flex-col gap-3'>
          <p className='text-2xl mb-4'>Question: {data.question}</p>
          {updatedOptions
            ? updatedOptions?.map((option) => (
                <div
                  key={option.id}
                  className='font-semibold text-xl grid grid-cols-2'
                >
                  <div className='self-center'>
                    {option.name} - {option.votes} votes
                  </div>
                  {totalVotes && (
                    <progress
                      className='progress progress-secondary w-56 self-center'
                      value={(option.votes / totalVotes) * 100}
                      max='100'
                    ></progress>
                  )}
                </div>
              ))
            : data?.options?.map((option) => (
                <div
                  key={option.id}
                  className='font-semibold text-xl grid grid-cols-2'
                >
                  <div className='self-center'>
                    {option.name} - {option.votes} votes
                  </div>
                  {totalVotes && (
                    <progress
                      className='progress progress-secondary w-56 self-center'
                      value={(option.votes / totalVotes) * 100}
                      max='100'
                    ></progress>
                  )}
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default AnswerPoll;

//http://localhost:3000?id=clanf8oq400040qszkpc0w4qe
