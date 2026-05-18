import type { FastifyRequest, FastifyReply } from "fastify";
import { blocklist } from "../routes/auth";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await request.jwtVerify<{ jti: string }>();
    if (blocklist.has(payload.jti)) {
      return reply.code(401).send({ error: "Token has been revoked" });
    }
  } catch {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}
