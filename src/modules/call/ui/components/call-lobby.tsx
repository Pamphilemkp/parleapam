import { LogInIcon } from "lucide-react";
import { 
    DefaultVideoPlaceholder,
    StreamVideoParticipant,
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,
    VideoPreview
} from "@stream-io/video-react-sdk";
import Link from 'next/link';
import  {  authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {generateAvatarUri } from "@/lib/avatar";
import "@stream-io/video-react-sdk/dist/css/styles.css";



interface Props {
    onJoin: () => void;
};

const disabledVideoPreview = ()=> {
    const {data} = authClient.useSession();

    return (
        <DefaultVideoPlaceholder
          participant ={
            {
              name: data?.user.name ?? "",
              image: 
                data?.user.image ??
              generateAvatarUri({
                seed: data?.user.name ?? "",
                variant: "initials",
              }),
          } as StreamVideoParticipant
        }
            className="w-full h-full"   
        />
    )
}

const AllowBrowserPermissions = () => {
    return (
        <p className="text-sm">
            Please grant browser permissions for camera and microphone to join the call.
        </p>
    );
}

export const CallLobby = ({ onJoin }: Props) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();

    const hasBrowserMediaPermission = hasMicPermission && hasCameraPermission;

    return (
        <div className="flex flex-col items-center justify-center h-screen-mobile bg-radial from-sidebar-accent to-sidebar w-full overflow-hidden">
            <div className="py-4 px-4 sm:px-8 flex flex-1 items-center justify-center w-full max-w-full">
                <div className="flex flex-col items-center justify-center gap-y-4 sm:gap-y-6 bg-background rounded-lg p-4 sm:p-10 shadow-sm w-full max-w-md mx-auto">
                    <div className="flex flex-col gap-y-2 text-center w-full">
                        <h6 className="text-base sm:text-lg font-medium">Ready to join?</h6>
                        <p className="text-xs sm:text-sm">
                            Make sure your camera and microphone are working.
                        </p>
                    </div>
                    <div className="w-full aspect-video max-h-[40vh] sm:max-h-none overflow-hidden rounded-lg bg-muted">
                        <div className="w-full h-full flex items-center justify-center">
                            <VideoPreview
                               DisabledVideoPreview={
                                 hasBrowserMediaPermission ?
                                   disabledVideoPreview :
                                    AllowBrowserPermissions
                               }
                            />
                        </div>
                    </div>
                    <div className="flex gap-x-2 w-full justify-center">
                       <ToggleAudioPreviewButton />
                       <ToggleVideoPreviewButton />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-x-2 justify-between w-full">
                        <Button asChild variant="ghost" className="w-full sm:w-auto min-h-[44px]">
                            <Link href="/meetings">Cancel</Link>
                        </Button>
                       <Button onClick={onJoin} className="w-full sm:w-auto min-h-[44px]">
                            <LogInIcon className="size-4 mr-2" />
                            Join Call
                       </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
