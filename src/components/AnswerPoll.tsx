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
    <div className='hero min-h-screen'>
      <div className='hero-overlay bg-opacity-60'></div>
      <div className='hero-content text-center text-neutral-content'>
        <div className='max-w-md'>
          <h1 className='mb-5 text-5xl font-bold text-white'>Hello there</h1>
          {isError ? (
            <p className='text-lg mb-5'>
              We could not find the poll youre looking for, please check if the
              url is correct.
            </p>
          ) : (
            <p className='mb-5 text-white text-lg'>
              Create and conduct polls in a minute. Use it in your flipped
              classroom, in your lecture or just to amaze your audience. create
              your poll now!
            </p>
          )}
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
      onSuccess: () => {
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
          {updatedOptions
            ? updatedOptions?.map((option) => (
                <div key={option.id} className='font-semibold text-xl'>
                  {option.name} - {option.votes} votes
                </div>
              ))
            : data?.options?.map((option) => (
                <div key={option.id} className='font-semibold text-xl'>
                  {option.name} - {option.votes} votes
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default AnswerPoll;

//http://localhost:3000?id=clanf8oq400040qszkpc0w4qe
