import { useState, ChangeEvent, useEffect, KeyboardEvent, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { getUrl } from "@/utils/helper";

type Option = {
  name: string;
  isCorrect?: boolean;
};

type CreatedPoll = {
  id: string;
  message: string;
};

type Error = {
  message: string;
};

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Array<Option>>([{ name: "" }]);
  const [deadline, setDeadline] = useState("");

  const optionsCountRef = useRef<number>(1);
  const questionInputRef = useRef<HTMLInputElement | null>(null);
  const lastInputRef = useRef<HTMLInputElement | null>(null);

  const handleQuestionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const addOption = () => {
    setOptions((prevOptions) => [...prevOptions, { name: "" }]);
  };

  const handleOptionChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index].name = event.target.value;
      return updatedOptions;
    });
  };

  const deleteOption = (index: number) => {
    setOptions((prevOptions) => {
      const filteredOptions = prevOptions.filter(
        (_option: Option, ind: number) => ind !== index
      );

      return filteredOptions;
    });
  };

  const handleDeadlineChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  const handleOnKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.code === "Enter" && index === options.length - 1) {
      addOption();
    }
    if (event.code === "Backspace" && options[index].name === "") {
      deleteOption(index);
    }
  };

  const { mutate, isLoading, error, isSuccess, data } = useMutation<
    CreatedPoll,
    Error,
    void
  >(
    async () => {
      const response = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, options, deadline }),
      });
      const data = await response.json();
      return data;
    },
    {
      retry: false,
      onSuccess: () => {
        setQuestion("");
        setOptions([{ name: "" }]);
        setDeadline("");
      },
    }
  );

  const copyToClipboard = async () => {
    const url = getUrl();
    navigator.clipboard.writeText(`${url}?id=${data?.id}`);
  };

  const createPoll = () => {
    mutate();
  };

  useEffect(() => {
    if (lastInputRef.current && options.length >= 1) {
      if (optionsCountRef.current !== options.length) {
        lastInputRef.current.focus();
        optionsCountRef.current = options.length;
      }
    } else {
      if (questionInputRef.current) questionInputRef.current.focus();
    }
  }, [options]);

  return (
    <>
      <div className='m-auto flex justify-center max-w-3xl h-screen flex-col'>
        <div className='my-4 flex justify-center w-full'>
          <p className='font-bold text-4xl text-center'>
            Create a poll for your audience
          </p>
        </div>
        <div className='w-full flex justify-center'>
          <div className='form-control w-full max-w-xs flex justify-center'>
            {isSuccess && (
              <div className='alert alert-success shadow-lg'>
                <div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='stroke-current flex-shrink-0 h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span>Your poll has been created!</span>
                </div>
                <div className='flex-none'>
                  <button
                    className='btn btn-sm btn-primary'
                    onClick={copyToClipboard}
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}
            {error && (
              <div className='alert alert-error shadow-lg'>
                <div>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='stroke-current flex-shrink-0 h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span>
                    Error! {error.message ?? "Something went wrong!"}.
                  </span>
                </div>
              </div>
            )}
            <label className='label'>
              <span className='label-text'>Question for the poll</span>
            </label>
            <input
              ref={questionInputRef}
              type='text'
              placeholder='Type here'
              className='input input-bordered w-full max-w-xs'
              onChange={handleQuestionChange}
              value={question}
            />
            {options.map((option, index) => (
              <div key={index}>
                <div className='flex gap-3'>
                  <div className='flex-1'>
                    <label className='label'>
                      <span className='label-text'>Option {index + 1}</span>
                    </label>
                    <input
                      value={option.name}
                      onChange={(event) => handleOptionChange(event, index)}
                      ref={index === options.length - 1 ? lastInputRef : null}
                      onKeyDown={(event) => handleOnKeyDown(event, index)}
                      type='text'
                      placeholder='Type here'
                      className='input input-bordered w-full max-w-xs'
                    />
                  </div>
                  <button
                    className='btn btn-square btn-outline self-end'
                    onClick={() => deleteOption(index)}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button className='btn mt-6' onClick={addOption}>
              Add option
            </button>
            <label className='label mt-2'>
              <span className='label-text'>Deadline for the poll</span>
            </label>
            <input
              value={deadline}
              type='datetime-local'
              placeholder='Select deadline for the poll'
              className='input input-bordered w-full max-w-xs'
              onChange={handleDeadlineChange}
            />
            <button
              className={`btn mt-6 ${isLoading ? "loading" : ""}`}
              onClick={createPoll}
            >
              Create poll
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePoll;
