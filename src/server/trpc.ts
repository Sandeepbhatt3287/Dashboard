import { TRPCError, initTRPC } from "@trpc/server";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

const t = initTRPC.context<{
  req?: NextApiRequest;
  res?: NextApiResponse;
}>().create();

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
