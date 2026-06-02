import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";
import { prisma } from "~/server/db";

export const projectRouter = router({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("Unauthorized");
      }
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            { creatorId: ctx.session.user.id },
            { members: { some: { userId: ctx.session.user.id } } },
          ],
        },
        include: {
          creator: { select: { id: true, name: true, email: true, image: true } },
          members: {
            include: { user: { select: { id: true, name: true, email: true, image: true } } },
          },
          tasks: true,
        },
      });
      return projects;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("Unauthorized");
      }
      const project = await prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          creatorId: ctx.session.user.id,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "admin",
            },
          },
        },
        include: {
          creator: { select: { id: true, name: true, email: true, image: true } },
          members: {
            include: { user: { select: { id: true, name: true, email: true, image: true } } },
          },
        },
      });
      return project;
    }),

  getOne: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const project = await prisma.project.findUnique({
        where: { id: input },
        include: {
          creator: { select: { id: true, name: true, email: true, image: true } },
          members: {
            include: { user: { select: { id: true, name: true, email: true, image: true } } },
          },
          tasks: {
            include: {
              assignee: true,
              creator: true,
              tags: true,
            },
          },
        },
      });
      return project;
    }),

  addMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        role: z.string().default("member"),
      })
    )
    .mutation(async ({ input }) => {
      const member = await prisma.projectMember.create({
        data: {
          projectId: input.projectId,
          userId: input.userId,
          role: input.role,
        },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      });
      return member;
    }),

  removeMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.projectMember.delete({
        where: {
          projectId_userId: {
            projectId: input.projectId,
            userId: input.userId,
          },
        },
      });
    }),
});
