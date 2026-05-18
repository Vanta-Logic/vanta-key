import Fastify from "fastify";
import type { SecretPolicy } from "@vanta-logic/shared";
import { authRoutes } from "./routes/auth";

const app = Fastify({ logger: true });

async function build() {
  const { default: swagger } = await import("@fastify/swagger");
  const { default: swaggerUi } = await import("@fastify/swagger-ui");
  const { default: jwt } = await import("@fastify/jwt");

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Vanta-Key Proxy API",
        description:
          "Off-chain API engine that bridges the admin dashboard and the Stellar blockchain.",
        version: "0.1.0",
      },
      tags: [
        { name: "Health", description: "Health check endpoints" },
        {
          name: "Policies",
          description: "Access policy verification endpoints",
        },
        { name: "Auth", description: "JWT token issuance and rotation" },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "change-me-in-production",
  });

  await app.register(authRoutes);

  app.get("/health", {
    schema: {
      tags: ["Health"],
      response: {
        200: {
          type: "object",
          properties: { status: { type: "string" } },
        },
      },
    },
    handler: async () => ({ status: "ok" }),
  });

  app.post<{ Body: SecretPolicy }>("/api/verify", {
    schema: {
      tags: ["Policies"],
      body: {
        type: "object",
        required: ["client_identity", "resource_hash", "expiration_ledger"],
        properties: {
          client_identity: {
            type: "string",
            description: "Stellar public key of the client",
          },
          resource_hash: {
            type: "string",
            description: "SHA-256 hash of the protected resource",
          },
          expiration_ledger: {
            type: "integer",
            description: "Ledger sequence number at which the policy expires",
          },
        },
      },
      response: {
        202: {
          type: "object",
          properties: {
            received: {
              type: "object",
              properties: {
                client_identity: { type: "string" },
                resource_hash: { type: "string" },
                expiration_ledger: { type: "integer" },
              },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      return reply.code(202).send({ received: request.body });
    },
  });
}

build()
  .then(() => {
    app.listen({ port: 3001, host: "0.0.0.0" }, (err) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
