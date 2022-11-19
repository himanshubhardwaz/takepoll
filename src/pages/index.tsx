import AnswerPoll from "@/components/AnswerPoll";
import { PollData } from "@/types/poll";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

// todo theme
export default function Home() {
  const router = useRouter();
  const id = router.query.id;

  const { data, isLoading, isError, error } = useQuery<
    PollData,
    { message: string }
  >(
    ["poll-data", id],
    async () => {
      const response = await fetch(`/api/poll?id=${id}`);
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
      enabled: !!id,
      retry: false,
    }
  );

  if (isLoading) {
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

//export const getServerSideProps: GetServerSideProps = async (context) => {
//  console.log("running get server side props .... ");
//  const { res } = context;
//  res.setHeader(
//    "Cache-Control",
//    "public, s-maxage=30, stale-while-revalidate=59"
//  );
//  const url = getUrl();
//  const id = context.query.id;
//  if (id) {
//    const response = await fetch(`${url}/api/poll?id=${context.query.id}`);
//    const data = (await response.json()) as PollData;

//    if (!data?.id) {
//      return { notFound: true };
//    }

//    return { props: { data } };
//  } else {
//    return { props: {} };
//  }
//};
