import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getCurrentUser } from '../../lib/current-user.js';
import { getToday, setChecked, TaskNotFoundError } from './service.js';

const params = z.object({ taskId: z.string().uuid() });

export async function routineRoutes(app: FastifyInstance) {
  app.get('/routine/today', async () => {
    const user = await getCurrentUser();
    return getToday(user.id, user.timezone);
  });

  for (const [method, checked] of [['PUT', true], ['DELETE', false]] as const) {
    app.route({
      method,
      url: '/routine/today/checks/:taskId',
      handler: async (req, reply) => {
        const parsed = params.safeParse(req.params);
        if (!parsed.success) return reply.code(400).send({ error: 'Invalid task id' });

        const user = await getCurrentUser();
        try {
          return await setChecked(user.id, user.timezone, parsed.data.taskId, checked);
        } catch (err) {
          if (err instanceof TaskNotFoundError) return reply.code(404).send({ error: 'Task not found' });
          throw err;
        }
      },
    });
  }
}
