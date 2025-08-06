"use client";
import { MeetingGetOne } from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { useRouter } from "next/navigation";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: Partial<MeetingGetOne>;
}

interface MeetingsGetManyResponse {
  items: MeetingGetOne[];
}

interface AgentType {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  name: string;
  instructions: string;
  meetingCount: number;
}

export const MeetingForm = ({ onSuccess, onCancel, initialValues = {} }: MeetingFormProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const agents = trpc.agents.getMany.useQuery({
    pageSize: 100,
    search: agentSearch,
  });

  // Debug agent IDs for uniqueness
  if (agents.data?.items) {
    const agentIds = agents.data.items
      .filter((agent): agent is AgentType => typeof agent === "object" && agent !== null && "id" in agent)
      .map((agent) => agent.id);
    console.log("Agent IDs:", agentIds);
    const uniqueIds = new Set(agentIds);
    if (agentIds.length !== uniqueIds.size) {
      console.warn("Duplicate agent IDs detected:", agentIds);
    }
  }

  const createMeeting = trpc.meetings.create.useMutation({
    onMutate: async (newMeeting) => {
      await queryClient.cancelQueries({ queryKey: ["meetings.getMany"] });
      const previousMeetings = queryClient.getQueryData<MeetingsGetManyResponse>(["meetings.getMany"]);

      queryClient.setQueryData<MeetingsGetManyResponse>(["meetings.getMany"], (oldData) => {
        const agentObj: AgentType =
          (agents.data?.items?.find(
            (agent) =>
              typeof agent === "object" &&
              agent !== null &&
              "id" in agent &&
              agent.id === newMeeting.agentId
          ) as AgentType) ?? {
            id: newMeeting.agentId ?? "",
            createdAt: "",
            updatedAt: "",
            userId: "",
            name: "",
            instructions: "",
            meetingCount: 0,
          };

        const meetingWithAllFields: MeetingGetOne = {
          ...newMeeting,
          id: crypto.randomUUID(),
          name: newMeeting.name ?? "",
          status: "upcoming",
          startedAt: null,
          endedAt: null,
          transcriptUrl: null,
          recordingUrl: null,
          summary: null,
          agentId: newMeeting.agentId ?? "",
          duration: 0,
          agent: agentObj,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "",
        };

        return oldData?.items
          ? { items: [...oldData.items, meetingWithAllFields] }
          : { items: [meetingWithAllFields] };
      });

      return { previousMeetings };
    },
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["meetings.getMany"] }),
        queryClient.invalidateQueries({ queryKey: ["meetings.getOne", data.id] }),
        queryClient.invalidateQueries({ queryKey: ["premium.getFreeUsage"] }),
      ]);
      await queryClient.refetchQueries({ queryKey: ["meetings.getMany"] });
      toast.success("Meeting created successfully!");
      onSuccess?.(data.id);
    },
    onError: (error: { message: string; code?: string }, _variables, context) => {
      queryClient.setQueryData(["meetings.getMany"], context?.previousMeetings);
      if (error.code === "FORBIDDEN") {
        router.push("/upgrade");
      }
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings.getMany"] });
      queryClient.invalidateQueries({ queryKey: ["premium.getFreeUsage"] });
    },
  });

  const updateMeeting = trpc.meetings.update.useMutation({
    onMutate: async (updatedMeeting: { name: string; agentId: string; id: string }) => {
      await queryClient.cancelQueries({ queryKey: ["meetings.getMany"] });
      const previousMeetings = queryClient.getQueryData<MeetingsGetManyResponse>(["meetings.getMany"]);

      queryClient.setQueryData<MeetingsGetManyResponse>(["meetings.getMany"], (oldData) => {
        const agentObj: AgentType =
          agents.data?.items?.find(
            (agent): agent is AgentType =>
              typeof agent === "object" &&
              agent !== null &&
              "id" in agent &&
              agent.id === updatedMeeting.agentId
          ) ?? {
            id: updatedMeeting.agentId ?? "",
            createdAt: "",
            updatedAt: "",
            userId: "",
            name: "",
            instructions: "",
            meetingCount: 0,
          };

        // Fill in the missing fields with defaults for optimistic update
        const meetingWithAllFields: MeetingGetOne = {
          ...updatedMeeting,
          status: "upcoming",
          startedAt: null,
          endedAt: null,
          transcriptUrl: null,
          recordingUrl: null,
          summary: null,
          duration: 0,
          agent: agentObj,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "",
        };

        return oldData?.items
          ? {
              items: oldData.items.map((item) =>
                item.id === initialValues.id ? meetingWithAllFields : item
              ),
            }
          : { items: [meetingWithAllFields] };
      });

      return { previousMeetings };
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["meetings.getMany"] }),
        queryClient.invalidateQueries({ queryKey: ["meetings.getOne", initialValues.id] }),
        queryClient.invalidateQueries({ queryKey: ["premium.getFreeUsage"] }),
      ]);
      await queryClient.refetchQueries({ queryKey: ["meetings.getMany"] });
      toast.success("Meeting updated successfully!");
      onSuccess?.();
    },
    onError: (error: { message: string; code?: string }, _variables, context) => {
      queryClient.setQueryData(["meetings.getMany"], context?.previousMeetings);
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings.getMany"] });
      if (initialValues?.id) {
        queryClient.invalidateQueries({ queryKey: ["meetings.getOne", initialValues.id] });
      }
      queryClient.invalidateQueries({ queryKey: ["premium.getFreeUsage"] });
    },
  });

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({
        ...values,
        id: initialValues.id!,
      });
    } else {
      createMeeting.mutate(values);
    }
  };

  // Handle loading and error states
  if (agents.isLoading) {
    return (
      <Form {...form}>
        <div className="text-center text-sm text-muted-foreground">Loading agents...</div>
      </Form>
    );
  }

  if (agents.isError) {
    return (
      <Form {...form}>
        <div className="text-center text-sm text-destructive">
          Error loading agents: {agents.error.message}
        </div>
      </Form>
    );
  }

  return (
    <>
  <NewAgentDialog
    open={openNewAgentDialog}
    onOpenChange={setOpenNewAgentDialog}
  />
  <Form {...form}>
    <form
      className="space-y-4 max-h-[90dvh] overflow-y-auto"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="E.g. Professional Psychologist"
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="agentId"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agent</FormLabel>
            <FormControl>
              <CommandSelect
                options={
                  (agents.data?.items as AgentType[] | undefined)?.map((agent) => ({
                    id: agent.id,
                    value: agent.id,
                    children: (
                      <div className="flex items-center gap-x-2">
                        <GeneratedAvatar
                          seed={agent.name}
                          variant="bottsNeutral"
                          className="border size-6"
                        />
                        <span>{agent.name}</span>
                      </div>
                    ),
                  })) ?? []
                }
                onSelect={field.onChange}
                onSearch={setAgentSearch}
                value={field.value}
                placeholder="Select an agent"
                className="w-full"
              />
            </FormControl>
            <FormDescription>
              Not found what you are looking for?{" "}
              <Button
                type="button"
                variant="link"
                className="text-primary hover:underline"
                onClick={() => setOpenNewAgentDialog(true)}
              >
                Create new agent
              </Button>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-between gap-x-2">
        {onCancel && (
          <Button
            variant="ghost"
            disabled={isPending}
            type="button"
            onClick={() => onCancel()}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isEdit ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  </Form>
  </>
  );
};