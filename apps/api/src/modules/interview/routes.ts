import { interviewStages } from '@efd/shared';
import type { FastifyInstance, FastifyReply } from 'fastify';
import { z } from 'zod';
import { getCurrentUser } from '../../lib/current-user.js';
import * as service from './service.js';

const idParams = z.object({ id: z.string().uuid() });

const listQuery = z.object({ stage: z.enum(interviewStages).optional() });

const questionBody = z.object({
  stage: z.enum(interviewStages),
  question: z.string().trim().min(1).max(500),
  tags: z.array(z.string().trim().min(1).max(40)).max(10).default([]),
  difficulty: z.number().int().min(1).max(3).default(1),
});

const starPart = z.string().trim().max(3000).default('');

const answerBody = z.object({
  situation: starPart,
  task: starPart,
  action: starPart,
  result: starPart,
  fullAnswer: z.string().trim().max(6000).nullish(),
});

const rehearsalBody = z.object({
  durationSec: z.number().int().min(1).max(60 * 60),
  selfScore: z.number().int().min(1).max(5),
  notes: z.string().trim().max(2000).nullish(),
});

function badRequest(reply: FastifyReply, error: z.ZodError) {
  return reply.code(400).send({ error: 'Invalid request', issues: error.issues });
}

export async function interviewRoutes(app: FastifyInstance) {
  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof service.NotFoundError) return reply.code(404).send({ error: err.message });
    return reply.send(err);
  });

  app.get('/interview/questions', async (req, reply) => {
    const query = listQuery.safeParse(req.query);
    if (!query.success) return badRequest(reply, query.error);
    return service.listQuestions((await getCurrentUser()).id, query.data.stage);
  });

  app.post('/interview/questions', async (req, reply) => {
    const body = questionBody.safeParse(req.body);
    if (!body.success) return badRequest(reply, body.error);
    const question = await service.createQuestion((await getCurrentUser()).id, body.data);
    return reply.code(201).send(question);
  });

  app.get('/interview/questions/:id', async (req, reply) => {
    const params = idParams.safeParse(req.params);
    if (!params.success) return badRequest(reply, params.error);
    return service.getQuestion((await getCurrentUser()).id, params.data.id);
  });

  app.patch('/interview/questions/:id', async (req, reply) => {
    const params = idParams.safeParse(req.params);
    if (!params.success) return badRequest(reply, params.error);
    const body = questionBody.partial().safeParse(req.body);
    if (!body.success) return badRequest(reply, body.error);
    return service.editQuestion((await getCurrentUser()).id, params.data.id, body.data);
  });

  app.delete('/interview/questions/:id', async (req, reply) => {
    const params = idParams.safeParse(req.params);
    if (!params.success) return badRequest(reply, params.error);
    await service.removeQuestion((await getCurrentUser()).id, params.data.id);
    return reply.code(204).send();
  });

  app.put('/interview/questions/:id/answer', async (req, reply) => {
    const params = idParams.safeParse(req.params);
    if (!params.success) return badRequest(reply, params.error);
    const body = answerBody.safeParse(req.body);
    if (!body.success) return badRequest(reply, body.error);
    return service.saveAnswer((await getCurrentUser()).id, params.data.id, body.data);
  });

  app.post('/interview/questions/:id/rehearsals', async (req, reply) => {
    const params = idParams.safeParse(req.params);
    if (!params.success) return badRequest(reply, params.error);
    const body = rehearsalBody.safeParse(req.body);
    if (!body.success) return badRequest(reply, body.error);
    const question = await service.addRehearsal((await getCurrentUser()).id, params.data.id, body.data);
    return reply.code(201).send(question);
  });
}
