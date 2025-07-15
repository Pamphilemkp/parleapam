import { useState } from "react";
import {trpc} from "@/trpc/client";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {useMeetingsFilters } from "../../hooks/use-meetings-filters";

const AgentIdFilter = () => {
  const [agentSearch, setAgentSearch] = useState("");
  const [filters, setFilters] = useMeetingsFilters();
  const { data } = trpc.agents.getMany.useQuery({
    pageSize: 100,
    search: agentSearch,
  });


  return (
    <CommandSelect
      className="h-9"
      placeholder="Agent"
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              seed={agent.name}
              variant="bottsNeutral"
              className="size-4" />
            {agent.name}
          </div>
        ),
      }))}
      onSelect={(value) => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
      value={filters.agentId}
    />
  );
};
export default AgentIdFilter;