import cors from '@fastify/cors';
import Fastify from 'fastify';
import { flashcardsRoutes } from './modules/flashcards/routes.js';
import { phasesRoutes } from './modules/phases/routes.js';
import { routineRoutes } from './modules/routine/routes.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
app.get('/health', async () => ({ ok: true }));
await app.register(phasesRoutes);
await app.register(routineRoutes);
await app.register(flashcardsRoutes);

await app.listen({ port: Number(process.env.PORT ?? 3333), host: '0.0.0.0' });
