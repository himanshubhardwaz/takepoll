import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function HomeView({ isError }: { isError?: boolean }) {
  const router = useRouter();
  const { status } = useSession();

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
          <div
            className='tooltip'
            data-tip={
              status === "loading" || status === "unauthenticated"
                ? "Please Sign In before creating a poll"
                : "Create a poll now!"
            }
          >
            <button
              className='btn btn-primary'
              onClick={rediectToCreatePoll}
              disabled={status === "loading" || status === "unauthenticated"}
            >
              Create Poll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
