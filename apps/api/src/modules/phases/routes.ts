import type { FastifyInstance } from 'fastify';
import { asc } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { phases } from '../../db/schema.js';

export async function phasesRoutes(app: FastifyInstance) {
  app.get('/phases', async () => {
    const rows = await db.query.phases.findMany({
      orderBy: asc(phases.position),
      with: { goals: true },
    });
    return rows.map((phase) => ({
      ...phase,
      progress: phase.goals.length
        ? phase.goals.reduce((sum, g) => sum + Math.min(g.currentValue / g.targetValue, 1), 0) /
          phase.goals.length
        : 0,
    }));
  });
}
