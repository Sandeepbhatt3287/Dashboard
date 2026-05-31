import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>My Task Manager</title>
        <meta name="description" content="Task management application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            Task <span className="text-[hsl(280,100%,70%)]">Manager</span>
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-lg bg-white/10 p-4 hover:bg-white/20"
              href="/dashboard"
            >
              <h3 className="text-2xl font-bold text-white">Dashboard →</h3>
              <div className="text-lg text-white/80">
                View all your tasks and projects
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-lg bg-white/10 p-4 hover:bg-white/20"
              href="/tasks"
            >
              <h3 className="text-2xl font-bold text-white">Tasks →</h3>
              <div className="text-lg text-white/80">Manage your tasks</div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            {sessionData && (
              <p className="text-2xl text-white">
                Logged in as {sessionData.user?.name}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
