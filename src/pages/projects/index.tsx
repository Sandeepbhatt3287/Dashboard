import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";

const ProjectsPage: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: projects, isLoading } = trpc.project.getAll.useQuery(undefined, {
    enabled: !!session,
  });

  const createProjectMutation = trpc.project.create.useMutation();

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await createProjectMutation.mutateAsync({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
      });
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    void router.push("/auth/signin");
    return null;
  }

  return (
    <>
      <Head>
        <title>Projects - Task Manager</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-2 text-gray-600">Manage your projects and team members</p>
          </div>

          {/* Create Project Form */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Project description"
                  rows={4}
                />
              </div>
              <button
                type="submit"
                disabled={createProjectMutation.isLoading}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {createProjectMutation.isLoading ? "Creating..." : "Create Project"}
              </button>
            </form>
          </div>

          {/* Projects Grid */}
          <div>
            {isLoading ? (
              <div className="text-gray-600">Loading projects...</div>
            ) : projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <div className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      {project.description && (
                        <p className="mt-2 line-clamp-3 text-gray-600">{project.description}</p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            {project.tasks.length} {project.tasks.length === 1 ? "task" : "tasks"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {project.members.length} {project.members.length === 1 ? "member" : "members"}
                          </p>
                        </div>
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-white p-6 text-center shadow">
                <p className="text-gray-600">No projects yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
