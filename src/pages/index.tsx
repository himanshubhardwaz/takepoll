import AnswerPoll from "@/components/AnswerPoll";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <AnswerPoll id={id} />
    </>
  );
}
