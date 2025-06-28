import { getQueryClient, trpc } from "@/trpc/server";
import { AgentsView, AgentsViewLoading, AgentsViewError } from "@/modules/agents/ui/views/agents-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {ErrorBoundary} from "react-error-boundary";

const Page = async() => {

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery({
        queryKey: ['agents.getMany'],
        queryFn: () => trpc.agents.getMany()
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsViewLoading />} >
                <ErrorBoundary fallback={<AgentsViewError />}>
                    <AgentsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page;