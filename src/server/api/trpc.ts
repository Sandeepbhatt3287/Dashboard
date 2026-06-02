import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createTRPCContext(opts: {
  req?: NextApiRequest;
  res?: NextApiResponse;
}) {
  const session = await getServerSession(opts.req, opts.res, authOptions);

  return {
    session,
  };
}
