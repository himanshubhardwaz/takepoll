import Head from "next/head";
import { ReactNode } from "react";
import Link from "next/link";
import ThemeSelector from "./ThemeSelector";
import { useSession, signIn, signOut } from "next-auth/react";

type Props = {
  title?: string;
  keywords?: string;
  description?: string;
  children: ReactNode;
};

export default function Layout({ title, children }: Props) {
  const { status } = useSession();
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <div className='navbar bg-primary text-primary-content fixed'>
          <div className='flex-1'>
            <Link href='/' className='btn btn-ghost normal-case text-xl'>
              takePoll
            </Link>
          </div>
          <div className='flex-none gap-2'>
            <ThemeSelector />
            {status === "authenticated" ? (
              <div className='avatar placeholder'>
                <div className='bg-neutral-focus text-neutral-content rounded-full w-12'>
                  X
                </div>
              </div>
            ) : (
              <div className='btn btn-ghost' onClick={() => signIn()}>
                Sign In
              </div>
            )}
          </div>
        </div>
        {children}
      </main>
    </>
  );
}

Layout.defaultProps = {
  title: "Welcome to Takepoll",
  keywords: "",
  description:
    "Create and conduct polls in a minute. Use it in your flipped classNameroom, in your lecture or just to amaze your audience. create your poll now!",
};
