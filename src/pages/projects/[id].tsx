import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "~/utils/trpc";

const ProjectDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();

  const { data: project, isLoading } = trpc.project.getOne.useQuery(id as string, {
    enabled: !!id && !!session,
  });

  if (status === "loading" || isLoading) return <div>Loading...</div>;
  if (!session) {
    void router.push("/auth/signin");
    return null;
  }

  if (!project) return <div>Project not found</div>;

  const todoTasks = project.tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = project.tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = project.tasks.filter((t) => t.status === "DONE");

  return (
    <>
      <Head>
        <title>{project.name} - Task Manager</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Navigation Links */}
          <div className="mb-4 flex gap-4">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 inline-block">
              ← Dashboard
            </Link>
            <Link href="/projects" className="text-blue-600 hover:text-blue-800 inline-block">
              ← Projects
            </Link>
          </div>

          {/* Project Header */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="mt-2 text-gray-600">{project.description}</p>
            )}
            <div className="mt-4 flex gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{project.tasks.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{project.members.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{doneTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Task Columns */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* To Do Column */}
                <div className="rounded-lg bg-white shadow">
                  <div className="border-b border-gray-200 bg-yellow-50 px-4 py-3">
                    <h3 className="font-semibold text-gray-900">To Do ({todoTasks.length})</h3>
                  </div>
                  <div className="divide-y divide-gray-200 p-4 space-y-3">
                    {todoTasks.map((task) => (
                      <div key={task.id} className="rounded bg-yellow-50 p-3">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        {task.assignee && (
                          <p className="text-xs text-gray-600 mt-1">
                            Assigned to: {task.assignee.name}
                          </p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-gray-600">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                          task.priority === "URGENT" ? "bg-red-100 text-red-800" :
                          task.priority === "HIGH" ? "bg-orange-100 text-orange-800" :
                          task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                    {todoTasks.length === 0 && (
                      <p className="text-gray-600 text-sm">No tasks</p>
                    )}
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="rounded-lg bg-white shadow">
                  <div className="border-b border-gray-200 bg-blue-50 px-4 py-3">
                    <h3 className="font-semibold text-gray-900">In Progress ({inProgressTasks.length})</h3>
                  </div>
                  <div className="divide-y divide-gray-200 p-4 space-y-3">
                    {inProgressTasks.map((task) => (
                      <div key={task.id} className="rounded bg-blue-50 p-3">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        {task.assignee && (
                          <p className="text-xs text-gray-600 mt-1">
                            Assigned to: {task.assignee.name}
                          </p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-gray-600">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                        <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
                          task.priority === "URGENT" ? "bg-red-100 text-red-800" :
                          task.priority === "HIGH" ? "bg-orange-100 text-orange-800" :
                          task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                    {inProgressTasks.length === 0 && (
                      <p className="text-gray-600 text-sm">No tasks</p>
                    )}
                  </div>
                </div>

                {/* Done Column */}
                <div className="rounded-lg bg-white shadow">
                  <div className="border-b border-gray-200 bg-green-50 px-4 py-3">
                    <h3 className="font-semibold text-gray-900">Done ({doneTasks.length})</h3>
                  </div>
                  <div className="divide-y divide-gray-200 p-4 space-y-3">
                    {doneTasks.map((task) => (
                      <div key={task.id} className="rounded bg-green-50 p-3 opacity-75">
                        <h4 className="font-medium text-gray-900 line-through">{task.title}</h4>
                        {task.assignee && (
                          <p className="text-xs text-gray-600 mt-1">
                            Assigned to: {task.assignee.name}
                          </p>
                        )}
                      </div>
                    ))}
                    {doneTasks.length === 0 && (
                      <p className="text-gray-600 text-sm">No tasks</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Sidebar */}
            <div>
              <div className="rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 px-4 py-3">
                  <h3 className="font-semibold text-gray-900">Team Members</h3>
                </div>
                <div className="divide-y divide-gray-200 p-4">
                  {project.members.map((member) => (
                    <div key={member.id} className="py-3">
                      <p className="font-medium text-gray-900">{member.user.name}</p>
                      <p className="text-sm text-gray-600">{member.user.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailPage;
