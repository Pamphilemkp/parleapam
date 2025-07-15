"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import  { trpc } from "@/trpc/client";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";


export const AgentsView = () => {

const [filters, setFilters] = useAgentsFilters();
const router =  useRouter();

// Add authentication check
// Use the correct session endpoint based on your trpc router structure
// If you have authentication, import useSession from 'next-auth/react' or your auth provider


// Remove session check if not needed, or update to your actual session endpoint
const { data, isLoading, error } = trpc.agents.getMany.useQuery({
    ...filters
}, {
    // enabled: !!session, // Uncomment and update if you have session logic
    retry: (failureCount: number, error: unknown) => {
        // Don't retry on 401 errors
        if (
            typeof error === "object" &&
            error !== null &&
            "data" in error &&
            (error as { data?: { code?: string } }).data?.code === 'UNAUTHORIZED'
        ) {
            return false;
        }
        return failureCount < 3;
    }
});

// Handle loading state
if (isLoading) {
    return <LoadingState title="Loading Agents" description="This may take a few seconds"/>;
}

// Handle error state
if (error) {
    return <ErrorState title="Error loading Agents" description="Please try again later"/>;
}

const items = data?.items ?? [];

return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-8">
         <DataTable 
                data={items} 
                columns={columns} 
                onRowClick={(row) => router.push(`/agents/${row.id}`)}
             />
            <DataPagination
                page={filters.page}
                totalPages={data?.totalPages ?? 0}
                onPageChange={(page: number)=> setFilters({page})}
            />
        {items.length === 0 && (
            <EmptyState
                title="Create your first agent"
                description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call"
            />
        ) 
        }
    </div>
);

}

export const AgentsViewLoading = () => {

    return (
        <div>
            <LoadingState title="Loading Agents " description="This may take a few seconds"/>
        </div>
    )

}

export const AgentsViewError= () => {

    return (
        <div>
            <ErrorState title="Error loading Agents" description="Please try again later"/>
        </div>
    )

}