"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import  { trpc } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AgentsView = () => {
    const { data } = useSuspenseQuery({
        queryKey: ['agents.getMany'],
        queryFn: () => trpc.agents.getMany.useQuery(),
    })

    return (
        <div>
            {JSON.stringify(data, null, 2)}
        </div>
    )

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