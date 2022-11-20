import { PollData } from "@/types/poll";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Option } from "@prisma/client";
import { useTimer } from "react-timer-hook";
import { useQueryClient } from "@tanstack/react-query";
import HomeView from "./HomeView";

const DeadlineTimer = ({
  expiryTimestamp,
  setCanVote,
  id,
}: {
  expiryTimestamp: Date;
  setCanVote: Dispatch<SetStateAction<boolean>>;
  id: string;
}) => {
  const queryClient = useQueryClient();
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: new Date(expiryTimestamp),
    onExpire: () => {
      setCanVote(false);
      localStorage.setItem(id, "done");
      queryClient.invalidateQueries({ queryKey: ["poll-data"] });
    },
  });
  return (
    <div className='mb-8'>
      <div className='grid grid-flow-col gap-5 text-center auto-cols-max'>
        <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
          <span className='countdown font-mono text-5xl'>
            <span style={{ ["--value" as any]: days }}></span>
          </span>
          days
        </div>
        <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
          <span className='countdown font-mono text-5xl'>
            <span style={{ ["--value" as any]: hours }}></span>
          </span>
          hours
        </div>
        <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
          <span className='countdown font-mono text-5xl'>
            <span style={{ ["--value" as any]: minutes }}></span>
          </span>
          min
        </div>
        <div className='flex flex-col p-2 bg-neutral rounded-box text-neutral-content'>
          <span className='countdown font-mono text-5xl'>
            <span style={{ ["--value" as any]: seconds }}></span>
          </span>
          sec
        </div>
      </div>
    </div>
  );
};

const AnswerPoll = ({ data }: { data?: PollData; isError: boolean }) => {
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

  if (!data?.id) return <HomeView isError={true} />;

  return (
    <div className='min-h-screen flex justify-center items-center text-center flex-col'>
      <DeadlineTimer
        expiryTimestamp={data.deadline}
        setCanVote={setCanVote}
        id={data.id}
      />
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
                  className='font-semibold text-xl grid grid-cols-2 gap-2'
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
                  className='font-semibold text-xl grid grid-cols-2 gap-2'
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
