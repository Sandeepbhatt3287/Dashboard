import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";
import { prisma } from "~/server/db";

export const userRouter = router({
  getCurrentUser: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          accounts: true,
        },
      });
      return user;
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        image: z.string().optional(),
        bio: z.string().optional(),
        phone: z.string().optional(),
        department: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          email: input.email,
          image: input.image,
          bio: input.bio,
          phone: input.phone,
          department: input.department,
        },
      });
      return user;
    }),

  getAll: protectedProcedure
    .query(async () => {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          department: true,
          role: true,
        },
      });
      return users;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          phone: true,
          department: true,
          role: true,
          createdAt: true,
        },
      });
      return user;
    }),
});
