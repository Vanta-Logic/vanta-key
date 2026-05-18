import type { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";

/** In-memory blocklist of revoked JWT IDs (jti). */
export const blocklist = new Set<string>();

export async function authRoutes(app: FastifyInstance) {
  /**
   * POST /api/auth/token
   * Issue an initial JWT. Requires the X-Admin-Secret header.
   */
  app.post("/api/auth/token", {
    schema: {
      tags: ["Auth"],
    },
    handler: async (request, reply) => {
      const adminSecret = process.env.ADMIN_SECRET;
      const provided = (request.headers as Record<string, string>)["x-admin-secret"];
      if (!adminSecret || provided !== adminSecret) {
        return reply.code(401).send({ error: "Unauthorized" });
      }
      const jti = randomUUID();
      const token = await reply.jwtSign({ jti }, { expiresIn: "1h" });
      return reply.send({ token });
    },
  });

  /**
   * POST /api/auth/rotate
   * Issue a new JWT and blocklist the old one. Requires a valid JWT.
   */
  app.post("/api/auth/rotate", {
    schema: {
      tags: ["Auth"],
    },
    handler: async (request, reply) => {
      let payload: { jti: string };
      try {
        payload = await request.jwtVerify<{ jti: string }>();
      } catch {
        return reply.code(401).send({ error: "Unauthorized" });
      }
      if (blocklist.has(payload.jti)) {
        return reply.code(401).send({ error: "Token has been revoked" });
      }
      // Revoke old token
      blocklist.add(payload.jti);
      // Issue new token
      const jti = randomUUID();
      const token = await reply.jwtSign({ jti }, { expiresIn: "1h" });
      return reply.send({ token });
    },
  });
}
