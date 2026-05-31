import { type NextPage } from "next";
import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";

const ProfilePage: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: user, isLoading } = trpc.user.getCurrentUser.useQuery(undefined, {
    enabled: !!session,
  });

  const updateProfileMutation = trpc.user.updateProfile.useMutation();

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await updateProfileMutation.mutateAsync({
        name: (formData.get("name") as string) || undefined,
        email: (formData.get("email") as string) || undefined,
        bio: (formData.get("bio") as string) || undefined,
        phone: (formData.get("phone") as string) || undefined,
        department: (formData.get("department") as string) || undefined,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (status === "loading" || isLoading) return <div>Loading...</div>;
  if (!session) {
    void router.push("/api/auth/signin");
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile - Task Manager</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="mt-2 text-gray-600">Manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="text-center">
                  {user?.image && (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="mx-auto h-24 w-24 rounded-full"
                    />
                  )}
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  {user?.role && (
                    <p className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      {user.role}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => signOut()}
                  className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Edit Profile Form */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-6 text-xl font-semibold text-gray-900">Edit Profile</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={user?.name || ""}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={user?.email || ""}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={user?.phone || ""}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <input
                        type="text"
                        name="department"
                        defaultValue={user?.department || ""}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      name="bio"
                      defaultValue={user?.bio || ""}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      rows={4}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {updateProfileMutation.isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>

              {/* Preferences Section */}
              <div className="mt-6 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-6 text-xl font-semibold text-gray-900">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="notifications" className="ml-3 text-gray-700">
                      Receive email notifications for task updates
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="digest"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                    <label htmlFor="digest" className="ml-3 text-gray-700">
                      Receive weekly digest of project activity
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
