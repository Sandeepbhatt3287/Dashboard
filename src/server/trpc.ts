import { TRPCError, initTRPC } from "@trpc/server";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

interface CreateContextOptions {
  req?: NextApiRequest;
  res?: NextApiResponse;
}

export async function createTRPCContext(opts: CreateContextOptions) {
  const session = await getServerSession(opts.req, opts.res, authOptions);
  return {
    session,
    req: opts.req,
    res: opts.res,
  };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const router = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
