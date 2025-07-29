import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { 
  CommandResponsiveDialog, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandGroup, 
  CommandEmpty
} from "@/components/ui/command";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const meetings = trpc.meetings.getMany.useQuery({
    search,
    pageSize: 100
  });
  const agents = trpc.agents.getMany.useQuery({
    search,
    pageSize: 100
  });

  const meetingItems = meetings.data?.items || [];
  // Define the expected agent type
  type AgentItem = {
    id: string;
    name?: string;
    meetingCount: number;
  };
  const agentItems = (agents.data?.items as AgentItem[]) || [];

  return (
    <CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen} className="">
      <CommandInput
        placeholder="Find a meeting or agent ..."
        value={search}
        onValueChange={(value) => setSearch(value)}
      />
      <CommandList>
        {meetingItems.length === 0 && agentItems.length === 0 && (
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No meetings or agents found
            </span>
          </CommandEmpty>
        )}
        
        {meetingItems.length > 0 && (
          <CommandGroup heading="Meetings">
            {meetingItems.map((meeting) => (
              <CommandItem
                key={`meeting-${meeting.id}`}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/meetings/${meeting.id}`);
                }}
              >
                {meeting.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {agentItems.length > 0 && (
          <CommandGroup heading="Agents">
            {agentItems.map((agent) => (
              <CommandItem
                key={`agent-${agent.id}`}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/agents/${agent.id}`);
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <GeneratedAvatar
                    className="size-6 flex-shrink-0"
                    seed={agent.name || agent.id}
                    variant="bottsNeutral"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">
                      {agent.name || `Agent ${agent.id}`}
                    </span>
                    {agent.meetingCount !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {agent.meetingCount} meeting{agent.meetingCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandResponsiveDialog>
  );
};