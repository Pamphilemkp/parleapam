import { AgentIdView, AgentIdViewError, AgentIdViewLoading } from "@/modules/agents/ui/views/agent-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{agentId: string}>
};


const Page = async ({params}: Props) => {
    const {agentId} = await params;
    const queryClient = getQueryClient();

    void queryClient.prefetchQuery({
        queryKey: ["agents.getOne", {id: agentId}],
        queryFn: () => trpc.agents.getOne({id: agentId}),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentIdViewLoading />}>
                <ErrorBoundary fallback={<AgentIdViewError />}>
                    <AgentIdView  agentId={agentId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page;