"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { trpc } from "@/trpc/client";

export const MeetingsView = () => {

    const { data } = trpc.meetings.getMany.useQuery({});
  return (
    <div className="px-6">
     TODO DATA TABLE
    {JSON.stringify(data, null, 2)}
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