import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createTRPCContext(opts: {
  req?: NextApiRequest;
  res?: NextApiResponse;
}) {
  // Use a fallback to null if req or res are missing
  // We cast through 'unknown' first to cleanly bypass the NextAuth type mismatch
  const session = opts.req && opts.res 
    ? await getServerSession(opts.req as unknown as any, opts.res as unknown as any, authOptions) 
    : null;

  return {
    session,
  };
}
