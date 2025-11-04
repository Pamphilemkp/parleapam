import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter,  premiumProcedure,  protectedProcedure, baseProcedure } from "@/trpc/init";
import { AgentsInsertSchema } from "../schemas";
import z from "zod";
import { eq, and, getTableColumns, ilike, desc, count, or } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { SAMPLE_AGENTS } from "../constants/sample-agents";

export const agentsRouter = createTRPCRouter({

    update: protectedProcedure
        .input(AgentsInsertSchema.extend({id: z.string()}))
        .mutation(async({input, ctx}) => {
        const [updatedAgent] = await db
        .update(agents)
        .set(input)
        .where(
            and(
                eq(agents.id, input.id),
                eq(agents.userId, ctx.auth.user.id)
            )
        )
        .returning();

        if (!updatedAgent) {
            throw new TRPCError({code: "NOT_FOUND", message: "Agent not found"});
        };

        return updatedAgent;
    }),

    remove: protectedProcedure
        .input(z.object({id: z.string()}))
        .mutation(async({input, ctx}) => {
        const [removedAgent] = await db
        .delete(agents) 
        .where(
            and(
                eq(agents.id, input.id),
                eq(agents.userId, ctx.auth.user.id)
            )
        )
        .returning();
        if (!removedAgent) {
            throw new TRPCError({code: "NOT_FOUND", message: "Agent not found"});
        };

        return removedAgent;
    }),


    getOne: protectedProcedure
        .input(z.object({id: z.string()}))
        .query(async({input, ctx}) => {
        const [existingAgent] = await db
        .select({
            meetingCount: db.$count(meetings, eq(meetings.agentId, agents.id)), 
            ...getTableColumns(agents),
        })
        .from(agents)
        .where(
            and(
                eq(agents.id, input.id),
                eq(agents.userId, ctx.auth.user.id)
            )
        )

        if (!existingAgent) {
            throw new TRPCError ({code: "NOT_FOUND", message: "Agent not found"});
        }

        return existingAgent;
    }),



    getMany: protectedProcedure
    .input(z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number()
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
    }))

    .query(async ({ctx, input}) => {
        const {search, page, pageSize} = input;

        const data = await db
        .select({
            meetingCount: db.$count(meetings, eq(meetings.agentId, agents.id)), 
            ...getTableColumns(agents),
              })
        .from(agents)
        .where(and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
        ))
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

        const [total] = await db
        .select({count: count()})
        .from(agents)
        .where(and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
        ));

        const totalPages = Math.ceil(total.count / pageSize);

        return {
            items: data,
            totalCount: total.count,
            totalPages,
        };
    }),

    create: premiumProcedure("agent")
    .input(AgentsInsertSchema)
    .mutation(async({input, ctx}) => {
        const [createdAgent] = await db
        .insert(agents)
        .values({
            ...input,
            userId: ctx.auth.user.id
        })
        .returning();

    return createdAgent;
    }),

    getSampleAgents: protectedProcedure
        .query(async ({ ctx }) => {
            // Check user premium status for access control
            const { polarClient } = await import("@/lib/polar");
            let isPremium = false;
            
            try {
                const customer = await polarClient.customers.getStateExternal({
                    externalId: ctx.auth.user.id,
                });
                isPremium = customer.activeSubscriptions.length > 0;
            } catch (error) {
                // If Polar check fails, assume free user
                console.error('Error checking premium status:', error);
            }

            // Return all sample agents with access info
            // Sample agents are always available from constants
            return SAMPLE_AGENTS.map(agent => ({
                ...agent,
                canAccess: agent.tier === 'free' || isPremium,
                isPremium: agent.tier === 'premium',
            }));
        }),

    // Public endpoint to get sample agents (for non-authenticated users)
    getSampleAgentsPublic: baseProcedure
        .query(async () => {
            // Return all sample agents - access check happens when user tries to start meeting
            return SAMPLE_AGENTS.map(agent => ({
                ...agent,
                canAccess: agent.tier === 'free', // Free agents accessible to all, premium requires signup
                isPremium: agent.tier === 'premium',
            }));
        }),

    createFromSample: protectedProcedure
        .input(z.object({ sampleAgentId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const sampleAgent = SAMPLE_AGENTS.find(a => a.id === input.sampleAgentId);
            if (!sampleAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Sample agent not found" });
            }

            // Check premium access for premium agents
            if (sampleAgent.tier === 'premium') {
                const { polarClient } = await import("@/lib/polar");
                const customer = await polarClient.customers.getStateExternal({
                    externalId: ctx.auth.user.id,
                });
                if (customer.activeSubscriptions.length === 0) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Premium subscription required for this agent",
                    });
                }
            }

            // Check if user already has this sample agent cloned
            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        eq(agents.name, sampleAgent.name),
                        eq(agents.isSample, true)
                    )
                )
                .limit(1);

            let agentId: string;

            if (existingAgent) {
                // Use existing cloned agent
                agentId = existingAgent.id;
            } else {
                // Clone the sample agent for the user
                const [clonedAgent] = await db
                    .insert(agents)
                    .values({
                        name: sampleAgent.name,
                        userId: ctx.auth.user.id,
                        instructions: sampleAgent.instructions,
                        isSample: true,
                        isPremium: sampleAgent.tier === 'premium',
                        category: sampleAgent.category,
                        icon: sampleAgent.icon,
                        description: sampleAgent.description,
                        capabilities: sampleAgent.capabilities,
                        useCases: sampleAgent.useCases,
                        hasWhiteboard: sampleAgent.hasWhiteboard || false,
                        hasGestures: sampleAgent.hasGestures || false,
                    })
                    .returning();
                
                agentId = clonedAgent.id;
            }

            return { agentId, agent: sampleAgent };
        }),
})