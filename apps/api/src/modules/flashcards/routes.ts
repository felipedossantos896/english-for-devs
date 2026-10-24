import type { Grade } from '@efd/shared';
import type { FastifyInstance, FastifyReply } from 'fastify';
import { z } from 'zod';
import { getCurrentUser } from '../../lib/current-user.js';
import * as service from './service.js';

const idParams = z.object({ id: z.string().uuid() });

const cardBody = z.object({
  front: z.string().trim().min(1).max(500),
  back: z.string().trim().min(1).max(500),
  example: z.string().trim().max(1000).nullish(),
});

const reviewBody = z.object({ grade: z.number().int().min(0).max(5) });

const dueQuery = z.object({
  deckId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

function badRequest(reply: FastifyReply, error: z.ZodError) {
  return reply.code(400).send({ error: 'Invalid request', issues: error.issues });
}

export async function flashcardsRoutes(app: FastifyInstance) {
  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof service.NotFoundError) return reply.code(404).send({ error: err.message });
    return reply.send(err);
  });

  app.get('/decks', async () => service.listDecks((await getCurrentUser()).id));

  app.get('/decks/:id/cards', async (req, reply) => {
    const params = idParams.safeParse(req.params);
    if (!params.success) return badRequest(reply, params.error);
    return service.listCards((await getCurrentUser()).id, params.data.id);
  });

  app.post('/decks/:id/cards', async (req, reply) => {
    const params = idParams.safeParse(req.params);
    if (!params.success) return badRequest(reply, params.error);
    const body = cardBody.safeParse(req.body);
    if (!body.success) return badRequest(reply, body.error);
    const card = await service.createCard((await getCurrentUser()).id, params.data.id, body.data);
    return reply.code(201).send(card);
  });

  app.patch('/cards/:id', async (req, reply) => {
    const params = idParams.safeParse(req.params);
    if (!params.success) return badRequest(reply, params.error);
    const body = cardBody.partial().safeParse(req.body);
    if (!body.success) return badRequest(reply, body.error);
    return service.editCard((await getCurrentUser()).id, params.data.id, body.data);
  });

  app.delete('/cards/:id', async (req, reply) => {
    const params = idParams.safeParse(req.params);
    if (!params.success) return badRequest(reply, params.error);
    await service.removeCard((await getCurrentUser()).id, params.data.id);
    return reply.code(204).send();
  });

  app.get('/reviews/due', async (req, reply) => {
    const query = dueQuery.safeParse(req.query);
    if (!query.success) return badRequest(reply, query.error);
    return service.dueCards((await getCurrentUser()).id, query.data.limit, query.data.deckId);
  });

  app.post('/cards/:id/review', async (req, reply) => {
    const params = idParams.safeParse(req.params);
    if (!params.success) return badRequest(reply, params.error);
    const body = reviewBody.safeParse(req.body);
    if (!body.success) return badRequest(reply, body.error);
    return service.reviewCard((await getCurrentUser()).id, params.data.id, body.data.grade as Grade);
  });
}
