import Fastify from "fastify";
import type { SecretPolicy } from "@vanta-logic/shared";

const app = Fastify({ logger: true });

app.get("/health", async () => ({ status: "ok" }));

app.post<{ Body: SecretPolicy }>("/api/verify", async (request, reply) => {
  // TODO: validate SecretPolicy against on-chain ledger
  return reply.code(202).send({ received: request.body });
});

app.listen({ port: 3001, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
