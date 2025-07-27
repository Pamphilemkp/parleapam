import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import {ErrorBoundary} from "react-error-boundary";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
     UpgradeViewLoading,
     UpgradeViewError,
     UpgradeView
    } from "@/modules/premium/ui/views/upgrade-view";

const Page = async() => {

    const session = await auth.api.getSession({
        headers: await headers(),
      });
    
      if (!session) {
        redirect("/sign-in");
      }


    const queryClient = getQueryClient();
    void queryClient.prefetchQuery({
         queryKey: ['premium', 'currentSubscription'],
        queryFn: () => trpc.premium.getCurrentSubscription(),
    });
        void queryClient.prefetchQuery({
        queryKey: ['premium', 'products'],
        queryFn: () => trpc.premium.getProducts(),
    });

    return (
        <>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<UpgradeViewLoading />} >
                <ErrorBoundary fallback={<UpgradeViewError />}>
                    <UpgradeView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    </>
    )
}

export default Page;