
import { agentsRouter } from '../../modules/agents/server/procedures';
import { meetingsRouter } from '@/modules/meetings/server/procedures';
import { createTRPCRouter } from '../init';
import { PremiumRouter } from '@/modules/premium/server/procedures';

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingsRouter,
  premium: PremiumRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;