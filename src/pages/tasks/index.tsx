import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "~/utils/trpc";

const TasksPage: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | undefined>();

  const { data: tasks, isLoading } = trpc.task.getAll.useQuery(
    projectId ? { projectId } : undefined,
    { enabled: !!session }
  );

  const { data: projects } = trpc.project.getAll.useQuery(undefined, {
    enabled: !!session,
  });

  const createTaskMutation = trpc.task.create.useMutation();

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createTaskMutation.mutateAsync({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        projectId: projectId || (projects?.[0]?.id ?? ""),
        priority: formData.get("priority") as any,
        dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : undefined,
      });
      e.currentTarget.reset();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    void router.push("/api/auth/signin");
    return null;
  }

  return (
    <>
      <Head>
        <title>Tasks - Task Manager</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="mt-2 text-gray-600">Manage your project tasks</p>
          </div>

          {/* Project Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Filter by Project</label>
            <select
              value={projectId || ""}
              onChange={(e) => setProjectId(e.target.value || undefined)}
              className="mt-1 block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Projects</option>
              {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Create Task Form */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Task description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    name="priority"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={createTaskMutation.isLoading}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {createTaskMutation.isLoading ? "Creating..." : "Create Task"}
              </button>
            </form>
          </div>

          {/* Tasks List */}
          <div className="rounded-lg bg-white shadow overflow-hidden">
            <div className="px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
            </div>
            {isLoading ? (
              <div className="px-6 py-4 text-gray-600">Loading tasks...</div>
            ) : tasks && tasks.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <div key={task.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        {task.description && (
                          <p className="mt-1 text-gray-600">{task.description}</p>
                        )}
                        <div className="mt-2 flex gap-2">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                            task.priority === "URGENT" ? "bg-red-100 text-red-800" :
                            task.priority === "HIGH" ? "bg-orange-100 text-orange-800" :
                            task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {task.priority}
                          </span>
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                            {task.status}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {task.assignee && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Assigned to:</p>
                          <p className="font-medium text-gray-900">{task.assignee.name}</p>
                        </div>
                      )}
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
    </>
  );
};

export default TasksPage;
