"use client";

import { ErrorState } from "@/components/error-state";
import { useState } from "react";
import { LoadingState } from "@/components/loading-state";
import { trpc } from "@/trpc/client";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../../../hooks/use-confirm";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface Props {
    agentId: string;
};


export const AgentIdView = ({agentId}: Props) => {
    const { data } = trpc.agents.getOne.useQuery({ id: agentId });
    const router = useRouter();
    const trpcContext = trpc.useContext();
    const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

    const removeAgent = trpc.agents.remove.useMutation({
        onSuccess: async () => {
            await trpcContext.agents.getMany.invalidate();
            await trpcContext.premium.getFreeUsage.invalidate();
            router.push("/agents");
        },
        onError: (error: { message: string }) => {
            toast.error(`Error removing agent: ${error.message}`);
        },
    });

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure you want to remove this agent?",
        `The following action will remove ${data?.meetingCount} associated meetings.`,
    );

    const handleRemoveAgent = async() => {
        const ok = await confirmRemove();
        if (!ok) return;

        await removeAgent.mutateAsync({ id: agentId });
    };

    return (
        <>
        <RemoveConfirmation />
        
          {data && (
            <UpdateAgentDialog
              open={updateAgentDialogOpen}
              onOpenChange={setUpdateAgentDialogOpen}
              initialValues={data}
            />
          )}
        <div className="flex-1 px-2 sm:px-4 py-2 sm:py-4 md:px-8 flex flex-col gap-2 sm:gap-4 w-full max-w-full overflow-x-hidden">
            <AgentIdViewHeader
                agentId={agentId}
                agentName={data?.name ?? ""}
                onEdit={() => {setUpdateAgentDialogOpen(true)}}
                onRemove={() => handleRemoveAgent()}
            />
            <div className="bg-white p-2 sm:p-4 rounded-lg w-full max-w-full">
                <div className="px-2 sm:px-4 py-2 gap-y-3 sm:gap-y-5 flex flex-col">
                    <div className="flex items-center gap-x-2 sm:gap-x-3">
                        <GeneratedAvatar
                            variant="bottsNeutral"
                            seed={data?.name?? ""}
                            className="size-8 sm:size-10"
                        />
                        <h2 className="text-lg sm:text-2xl font-medium break-words">
                            {data?.name}
                        </h2>
                    </div>
                    <Badge
                        variant="outline"
                        className="flex items-center gap-x-2 [&>svg]:size-4 w-fit text-xs sm:text-sm"
                        >
                        <VideoIcon className="text-blue-800"/>
                        {data?.meetingCount} {data?.meetingCount === 1 ? "Meeting" : "Meetings"}
                    </Badge>
                    <div className="flex flex-col gap-y-2 sm:gap-y-4">
                    <p className="text-base sm:text-lg font-medium">Instruction</p>
                    <p className="text-sm sm:text-base text-neutral-800 break-words whitespace-pre-wrap">
                        {data?.instructions}
                    </p>
                    </div>
                </div>
            </div>
        </div>
     </>
    );
}

export const AgentIdViewLoading = () => {

    return (
        <div>
            <LoadingState title="Loading Agent " description="This may take a few seconds"/>
        </div>
    )

}

export const AgentIdViewError= () => {

    return (
        <div>
            <ErrorState title="Error loading Agent" description="Please try again later"/>
        </div>
    )

}