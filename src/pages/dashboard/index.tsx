import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";

const DashboardPage: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: tasks } = trpc.task.getAll.useQuery(undefined, {
    enabled: !!session,
  });
  const { data: projects } = trpc.project.getAll.useQuery(undefined, {
    enabled: !!session,
  });

  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    void router.push("/auth/signin");
    return null;
  }

  const todoCount = tasks?.filter((t) => t.status === "TODO").length || 0;
  const inProgressCount = tasks?.filter((t) => t.status === "IN_PROGRESS").length || 0;
  const completedCount = tasks?.filter((t) => t.status === "DONE").length || 0;

  return (
    <>
      <Head>
        <title>Dashboard - Task Manager</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                  Task Manager
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                  {session.user?.name}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {session.user?.name}!</h1>
            <p className="mt-2 text-gray-600">Here's an overview of your tasks and projects</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-gray-600">To Do</p>
                  <p className="text-3xl font-bold text-gray-900">{todoCount}</p>
                </div>
                <div className="text-3xl text-yellow-500">📋</div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{inProgressCount}</p>
                </div>
                <div className="text-3xl text-blue-500">⚙️</div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
                </div>
                <div className="text-3xl text-green-500">✅</div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-gray-600">Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{projects?.length || 0}</p>
                </div>
                <div className="text-3xl text-purple-500">📁</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/tasks"
              className="rounded-lg bg-white p-6 text-center shadow hover:shadow-lg"
            >
              <div className="text-4xl">📝</div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">View All Tasks</h3>
            </Link>
            <Link
              href="/projects"
              className="rounded-lg bg-white p-6 text-center shadow hover:shadow-lg"
            >
              <div className="text-4xl">📂</div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">View Projects</h3>
            </Link>
            <Link
              href="/profile"
              className="rounded-lg bg-white p-6 text-center shadow hover:shadow-lg"
            >
              <div className="text-4xl">👤</div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">Edit Profile</h3>
            </Link>
          </div>

          {/* Recent Tasks */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
            <div className="mt-4 rounded-lg bg-white shadow overflow-hidden">
              {tasks && tasks.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.project.name}</p>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            task.status === "DONE"
                              ? "bg-green-100 text-green-800"
                              : task.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-4 text-gray-600">No tasks yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
