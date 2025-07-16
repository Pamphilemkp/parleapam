"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { trpc } from "@/trpc/client";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";

interface Props {
    meetingId: string;
  };

  export const MeetingIdView = ({ meetingId }: Props) => {
    
    const { data } = trpc.meetings.getOne.useQuery({ id: meetingId });
        const router = useRouter();
        const trpcContext = trpc.useContext();
        const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);


    const removeMeeting = trpc.meetings.remove.useMutation({
        onSuccess: async () => {
            await trpcContext.meetings.getMany.invalidate();
            toast.success("Meeting removed successfully");
            router.push("/meetings");

            //TODO: invalidate free tier usage
        },
        onError: (error: { message: string }) => {
            toast.error(`Error removing meeting: ${error.message}`);
        },
    });

        const [RemoveConfirmation, confirmRemove] = useConfirm(
            "Are you sure you want to remove this meeting?",
            `The following action will remove this meeting.`,
        );

        const handleRemoveMeeting = async() => {
            const ok = await confirmRemove();
            if (!ok) return;

            await removeMeeting.mutateAsync({ id: meetingId });
        };
    

    return (
        <>
            <RemoveConfirmation />
            {data && (
                <UpdateMeetingDialog
                    open={updateMeetingDialogOpen}
                    onOpenChange={setUpdateMeetingDialogOpen}
                    initialValues={data}
                />
            )}
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data?.name ?? ""}
                    onEdit={() => {setUpdateMeetingDialogOpen(true)}}
                    onRemove={() => {handleRemoveMeeting()}}
                />
                {JSON.stringify(data, null, 2)}
            </div>
        
        </>
    );
  };

  export const MeetingIdViewLoading = () => {
  
      return (
          <div>
              <LoadingState title="Loading Meeting" description="This may take a few seconds"/>
          </div>
      )
  
  }
  
  export const MeetingIdViewError= () => {
  
      return (
          <div>
              <ErrorState title="Error loading Meeting" description="Please try again later"/>
          </div>
      )
  
  }