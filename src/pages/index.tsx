import AnswerPoll from "@/components/AnswerPoll";
import { GetServerSideProps } from "next";
import { getUrl } from "@/utils/helper";
import { PollData } from "@/types/poll";

export default function Home({ data }: { data: PollData }) {
  return (
    <>
      <AnswerPoll data={data} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("running get server side props .... ");
  const { res } = context;
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=30, stale-while-revalidate=59"
  );
  const url = getUrl();
  const response = await fetch(`${url}/api/poll?id=${context.query.id}`);
  const data = (await response.json()) as PollData;
  return { props: { data } };
};
