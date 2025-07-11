import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const MeetingPage = () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery({
        queryKey: ['meetings.getMany', {}],
        queryFn: () => trpc.meetings.getMany({}),
    });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsViewLoading />}>
            <ErrorBoundary fallback={<MeetingsViewError />}>
                <MeetingsView />
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
  );
};

export default MeetingPage;
