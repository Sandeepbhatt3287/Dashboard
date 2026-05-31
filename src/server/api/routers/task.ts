import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "~/server/trpc";
import { prisma } from "~/server/db";

export const taskRouter = router({
  getAll: protectedProcedure
    .input(z.object({ projectId: z.string() }).optional())
    .query(async ({ ctx, input }) => {
      const tasks = await prisma.task.findMany({
        where: {
          projectId: input?.projectId,
        },
        include: {
          assignee: true,
          creator: true,
          tags: true,
          project: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return tasks;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        projectId: z.string(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
        dueDate: z.date().optional(),
        assigneeId: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = await prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          projectId: input.projectId,
          priority: input.priority || "MEDIUM",
          dueDate: input.dueDate,
          assigneeId: input.assigneeId,
          creatorId: ctx.session.user.id,
          tags: {
            connect: input.tags?.map((tag) => ({ id: tag })) || [],
          },
        },
        include: {
          assignee: true,
          creator: true,
          tags: true,
        },
      });
      return task;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "ARCHIVED"]).optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
        dueDate: z.date().optional(),
        assigneeId: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = await prisma.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
          assigneeId: input.assigneeId,
          tags: input.tags ? {
            set: [],
            connect: input.tags.map((tag) => ({ id: tag })),
          } : undefined,
        },
        include: {
          assignee: true,
          creator: true,
          tags: true,
        },
      });
      return task;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await prisma.task.delete({
        where: { id: input },
      });
    }),

  getOne: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const task = await prisma.task.findUnique({
        where: { id: input },
        include: {
          assignee: true,
          creator: true,
          tags: true,
          project: true,
        },
      });
      return task;
    }),
});
