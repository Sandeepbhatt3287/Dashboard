// import { TRPCError, initTRPC } from "@trpc/server";
// import { type NextApiRequest, type NextApiResponse } from "next";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "~/server/auth";

// interface CreateContextOptions {
//   req?: NextApiRequest | undefined;
//   res?: NextApiResponse | undefined;
// }

// export async function createTRPCContext(opts?: CreateContextOptions) {
//   let session = null;
  
//   // Only fetch session server-side, not client-side
//   if (typeof window === "undefined" && opts?.req && opts?.res) {
//     try {
//       const result = await (getServerSession as any)(opts.req, opts.res, authOptions);
//       if (result) {
//         session = result;
//       }
//     } catch (error) {
//       // Silently fail - session not available
//     }
//   }

//   return {
//     session,
//     req: opts?.req,
//     res: opts?.res,
//   };
// }

// type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// const t = initTRPC.context<Context>().create();

// export const createTRPCRouter = t.router;
// export const router = t.router;

// export const publicProcedure = t.procedure;

// const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
//   if (!ctx.session?.user) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return next({
//     ctx: {
//       ...ctx,
//       session: ctx.session,
//     },
//   });
// });

// export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
import { TRPCError, initTRPC } from "@trpc/server";
import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { type IncomingMessage, type ServerResponse } from "http";

interface CreateContextOptions {
  req?: NextApiRequest | undefined;
  res?: NextApiResponse | undefined;
}

export async function createTRPCContext(opts?: CreateContextOptions) {
  let session = null;
  
  // Only fetch session server-side, not client-side
  if (typeof window === "undefined" && opts?.req && opts?.res) {
    try {
      // Cast req and res to the exact structural format next-auth expects
      const req = opts.req as IncomingMessage & { cookies: Partial<{ [key: string]: string }> };
      const res = opts.res as ServerResponse;

      const result = await getServerSession(req, res, authOptions);
      if (result) {
        session = result;
      }
    } catch (error) {
      // Silently fail - session not available
    }
  }

  return {
    session,
    req: opts?.req,
    res: opts?.res,
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