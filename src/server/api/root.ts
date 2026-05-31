import { createTRPCRouter } from "~/server/trpc";
import { taskRouter } from "./routers/task";
import { userRouter } from "./routers/user";
import { projectRouter } from "./routers/project";

export const appRouter = createTRPCRouter({
  task: taskRouter,
  user: userRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
