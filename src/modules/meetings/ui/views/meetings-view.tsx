"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { trpc } from "@/trpc/client";
import { columns } from "../components/columns";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { useRouter } from "next/navigation";
import { DataPagination } from "@/components/data-pagination";

export const MeetingsView = () => {

    const router = useRouter();
    const [filters, setFilters] = useMeetingsFilters();
    const { data, isLoading, error } = trpc.meetings.getMany.useQuery({
        ...filters,
    });


// Handle loading state
if (isLoading) {
    return <LoadingState title="Loading Meetings" description="This may take a few seconds"/>;
}

// Handle error state
if (error) {
    return <ErrorState title="Error loading Meetings" description="Please try again later"/>;
}

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
       
        <DataTable 
            data={data?.items ?? []} 
            columns={columns} 
            onRowClick={(row) => {
                router.push(`/meetings/${row.id}`);
            }}
       />
        <DataPagination 
            page={filters.page} 
            totalPages={data?.totalPages ?? 0} 
            onPageChange={(page) => {
                setFilters({ page });
            }}
        />
        {data?.items.length === 0 && (
            <EmptyState
                title="Create your first meeting"
                description="Schedule a meeting to connect with others. Each meeting lets you
                 collaborate, share ideas, and interact with participants in real time"
            />
        )
        }
    </div>
  );
}

export const MeetingsViewLoading = () => {

    return (
        <div>
            <LoadingState title="Loading Meetings" description="This may take a few seconds"/>
        </div>
    )

}

export const MeetingsViewError= () => {

    return (
        <div>
            <ErrorState title="Error loading Meetings" description="Please try again later"/>
        </div>
    )

}