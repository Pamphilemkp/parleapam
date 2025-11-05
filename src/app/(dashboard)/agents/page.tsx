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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentCatalog } from "@/modules/agents/ui/components/agent-catalog";


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
        <div className="px-2 sm:px-4 md:px-8 pb-4 w-full max-w-full overflow-x-hidden">
            <Tabs defaultValue="my-agents" className="w-full max-w-full">
                <TabsList className="grid w-full max-w-full sm:max-w-md grid-cols-2 mb-4 sm:mb-6">
                    <TabsTrigger value="my-agents" className="text-sm sm:text-base touch-target">My Agents</TabsTrigger>
                    <TabsTrigger value="catalog" className="text-sm sm:text-base touch-target">Agent Catalog</TabsTrigger>
                </TabsList>
                <TabsContent value="my-agents">
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <Suspense fallback={<AgentsViewLoading />} >
                            <ErrorBoundary fallback={<AgentsViewError />}>
                                <AgentsView />
                            </ErrorBoundary>
                        </Suspense>
                    </HydrationBoundary>
                </TabsContent>
                <TabsContent value="catalog">
                    <AgentCatalog />
                </TabsContent>
            </Tabs>
        </div>
    </>
    )
}

export default Page;