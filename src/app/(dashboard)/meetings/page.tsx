import { auth } from "@/lib/auth";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadSearchParams } from "@/modules/meetings/params";
import type { SearchParams } from "nuqs/server";
import { MeetingStatus } from "@/modules/meetings/types"; 

interface Props {
    searchParams: Promise<SearchParams>;
};

const MeetingPage = async({ searchParams }: Props) => {

    const filters = await loadSearchParams(searchParams);

    const session = await auth.api.getSession({
            headers: await headers(),
    });
        
    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();
    // Only allow valid status values for getMany input // Adjust import path as needed

    const allowedStatuses = [
        MeetingStatus.Upcoming,
        MeetingStatus.Active,
        MeetingStatus.Completed,
        MeetingStatus.Processing,
        MeetingStatus.Cancelled,
    ] as const;

    type AllowedStatus = typeof allowedStatuses[number];

    const safeFilters = {
        ...filters,
        status: allowedStatuses.includes(filters.status as AllowedStatus)
            ? filters.status
            : null,
    };

    void queryClient.prefetchQuery({
        queryKey: ['meetings.getMany', safeFilters],
        queryFn: () => trpc.meetings.getMany(safeFilters),
    });

  return (
    <>
    <MeetingsListHeader />
    <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsViewLoading />}>
            <ErrorBoundary fallback={<MeetingsViewError />}>
                <MeetingsView />
            </ErrorBoundary>
        </Suspense>
    </HydrationBoundary>
</>
  );
};

export default MeetingPage;
