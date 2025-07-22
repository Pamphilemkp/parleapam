import { useState } from "react";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";
import Highlighter from "react-highlight-words";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateAvatarUri } from "@/lib/avatar";

interface Props {
  meetingId: string;
}

interface TranscriptItem {
    start_ts: number;
    text: string;
    user?: {
        name?: string;
        image?: string;
    };
    speaker?: {
        name?: string;
        image?: string;
    };
}

export const Transcript = ({ meetingId }: Props) => {

    const { data } = trpc.meetings.getTranscript.useQuery({id: meetingId });
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = (data as TranscriptItem[] ?? []).filter((item) =>
          item.text.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg border px-4 py-5 flex flex-col gap-4">
            <p className="text-sm font-medium">Transcript</p>
            <div className="relative mb-4">
                <Input
                    placeholder="Search transcript..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <SearchIcon size={16} />
                </span>
            </div>
            <ScrollArea className="h-96">
                <div className="flex flex-col gap-4">
                    {filteredData.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                            <Avatar>
                                <AvatarImage
                                    src={
                                        item.user?.image ??
                                        item.speaker?.image ??
                                        generateAvatarUri({
                                            seed: item.user?.name ?? item.speaker?.name ?? "",
                                            variant: "initials"
                                        })
                                    }
                                    alt="User Avatar"
                                />
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">
                                        {item.user?.name ?? item.speaker?.name ?? "Unknown"}
                                    </p>
                                    <p className="text-xs text-blue-500 font-medium">
                                        {format(
                                            new Date(item.start_ts),
                                            "mm:ss"
                                        )}
                                    </p>
                                </div>
                                <Highlighter
                                    highlightClassName="bg-yellow-200"
                                    searchWords={[searchQuery]}
                                    autoEscape={true}
                                    textToHighlight={item.text}
                                    className="text-sm text-neutral-700"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );

}