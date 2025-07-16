"use client";
import { ErrorState } from "@/components/error-state";
import { trpc } from "@/trpc/client";
import { CallProvider } from "../components/call-provider";

interface Props {
    meetingId: string;
}

const CallView = ({ meetingId }: Props) => {

    const { data } = trpc.meetings.getOne.useQuery({ id: meetingId });

    if (data && data.status === "completed") {
        return (
            <div className="h-screen flex items-center justify-center">
                <ErrorState
                    title="Meeting has end"
                    description="You can no longer join."
                />
            </div>
        );
    }

    return (
        <CallProvider
         meetingId={meetingId}
         meetingName={data?.name ?? "Meeting"}
          />
    );
};

export default CallView;
