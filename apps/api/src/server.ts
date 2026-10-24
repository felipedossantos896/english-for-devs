import cors from '@fastify/cors';
import Fastify from 'fastify';
import { phasesRoutes } from './modules/phases/routes.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
app.get('/health', async () => ({ ok: true }));
await app.register(phasesRoutes);

await app.listen({ port: Number(process.env.PORT ?? 3333), host: '0.0.0.0' });
