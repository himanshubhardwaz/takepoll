import { useRouter } from "next/router";
import Image from "next/image";
import { PollData } from "@/types/poll";

function NoId() {
  const router = useRouter();

  const rediectToCreatePoll = () => {
    router.push("/create");
  };

  return (
    <div className='hero min-h-screen'>
      <Image src='/home_bg.jpeg' fill alt={""} className='' />
      <div className='hero-overlay bg-opacity-60'></div>
      <div className='hero-content text-center text-neutral-content'>
        <div className='max-w-md'>
          <h1 className='mb-5 text-5xl font-bold text-white'>Hello there</h1>
          <p className='mb-5 text-white'>
            Create and conduct polls in a minute. Use it in your flipped
            classroom, in your lecture or just to amaze your audience. create
            your poll now!
          </p>
          <button className='btn btn-primary' onClick={rediectToCreatePoll}>
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
}

const AnswerPoll = ({ data }: { data?: PollData }) => {
  if (!data?.id) return <NoId />;

  return <>We found data: {JSON.stringify(data)}</>;
};

export default AnswerPoll;
