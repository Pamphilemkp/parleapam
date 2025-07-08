import { getQueryClient, trpc } from "@/trpc/server";
import { AgentsView, AgentsViewLoading, AgentsViewError } from "@/modules/agents/ui/views/agents-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {ErrorBoundary} from "react-error-boundary";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { loadSearchParams } from "@/modules/agents/params";
import { SearchParams } from "nuqs/server";


interface Props {
    searchParams: Promise<SearchParams>;
};


const Page = async({searchParams}: Props) => {

    const filters = await loadSearchParams(searchParams);

    const session = await auth.api.getSession({
        headers: await headers(),
      });
    
      if (!session) {
        redirect("/sign-in");
      }


    const queryClient = getQueryClient();
    void queryClient.prefetchQuery({
        queryKey: ['agents.getMany'],
        queryFn: () => trpc.agents.getMany({
            ...filters
        }),
    });

    return (
        <>
        <AgentsListHeader />
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsViewLoading />} >
                <ErrorBoundary fallback={<AgentsViewError />}>
                    <AgentsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    </>
    )
}

export default Page;