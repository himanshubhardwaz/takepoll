import CreatePoll from "@/components/CreatePoll";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className='flex min-h-screen justify-center items-center'>
        <progress className='progress w-56'></progress>
      </div>
    );
  }

  if (status === "authenticated") {
    return <CreatePoll />;
  }

  router.push("/");
  return null;
}
