import { useState, useEffect } from "react";
import type { Channel as streamChannel } from "stream-chat";
import {
    useCreateChatClient,
    Chat,
    Channel,
    MessageInput,
    MessageList,
    Thread,
    Window
} from "stream-chat-react";
import  { trpc } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import "stream-chat-react/dist/css/v2/index.css";

interface ChatUIProps {
    meetingId: string;
    meetingName?: string;
    userId: string;
    userName: string;
    userImage: string | undefined;
    agentId?: string;
}

export const ChatUI = ({ meetingId, meetingName, userId, userName, userImage, agentId }: ChatUIProps) => {

   const { mutateAsync: generateChatToken } = trpc.meetings.generateChatToken.useMutation();

    const [channel, setChannel] = useState<streamChannel>();

    const client = useCreateChatClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
        tokenOrProvider: generateChatToken,
        userData: {
            id: userId,
            name: userName,
            image: userImage,
        },
    });

    useEffect(() => {
        if (!client) return;

        const channelInstance = client.channel("messaging", meetingId, {
            members: [userId],
        });

        setChannel(channelInstance);
    }, [client, meetingId, meetingName, userId]);

    useEffect(() => {
        if (!channel || !agentId) return;

        const handleNewMessage = (event: { message?: { text?: string | null; user?: { id?: string | null } | null } }) => {
            const message = event.message;
            if (!message?.text || !message.user?.id) return;
            if (message.user.id !== agentId) return;

            window.dispatchEvent(
                new CustomEvent('ai-transcript', {
                    detail: {
                        text: message.text,
                        userId: message.user.id ?? undefined,
                    },
                }),
            );
        };

        channel.on('message.new', handleNewMessage);
        return () => {
            channel.off('message.new', handleNewMessage);
        };
    }, [channel, agentId]);

    if(!client) {
        return <LoadingState
            title="Loading chat..."
            description="This may take a few seconds."
        />;
    }

   return (
       <div className="bg-white rounded-lg border overflow-hidden">
           <Chat client={client}>
               <Channel channel={channel}>
                     <Window>
                         <div className="flex-1 overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
                             <MessageList />
                         </div>
                          <MessageInput />
                     </Window>
                     <Thread />
                </Channel>
           </Chat>
       </div>
   );
};