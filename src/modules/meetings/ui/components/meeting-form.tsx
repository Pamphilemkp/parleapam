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

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: Partial<MeetingGetOne>;
}

export const MeetingForm = ({ onSuccess, onCancel, initialValues = {} }: MeetingFormProps) => {
  const queryClient = useQueryClient();
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const  [agentSearch, setAgentSearch] = useState("");
  const agents = trpc.agents.getMany.useQuery({
    pageSize: 100,
    search: agentSearch,
  });

  interface MeetingsGetManyResponse {
    items: MeetingGetOne[];
  }

  const createMeeting = trpc.meetings.create.useMutation({
    onSuccess: async (
      data
    ) => {
      // Optimistically update the cache
      queryClient.setQueryData<MeetingsGetManyResponse>(["meetings.getMany"], (oldData) => {
        const meetingWithAllFields: MeetingGetOne = {
          ...data,
          status: data.status ?? "upcoming",
          startedAt: data.startedAt ?? null,
          endedAt: data.endedAt ?? null,
          transcriptUrl: data.transcriptUrl ?? null,
          recordingUrl: data.recordingUrl ?? null,
          summary: data.summary ?? null,
          agentId: data.agentId ?? "",
        };
        if (!oldData || !oldData.items) {
          return { items: [meetingWithAllFields] };
        }
        return { items: [...oldData.items, meetingWithAllFields] };
      });

      // Invalidate queries in the background
      queryClient.invalidateQueries({ queryKey: ["meetings.getMany"] });

      toast.success("Meeting created successfully!");

      //TODO: Invalidate free tier usage
      onSuccess?.(data.id);
    },
    onError: (error: { message: string; code?: string }) => {
      
      // TODO: check if error code is "FORBIDDEN", redirect to /upgrade 
      toast.error(error.message);
    },
  });

  // Use the correct mutation for updating meetings, not agents
  const updateMeeting = trpc.meetings.update.useMutation({
    onSuccess: async (
      updatedMeeting: MeetingGetOne
    ) => {
      // Optimistically update the cache
      queryClient.setQueryData<MeetingsGetManyResponse>(["meetings.getMany"], (oldData) => {
        if (!oldData || !oldData.items) {
          return { items: [updatedMeeting] };
        }
        // Update the specific meeting in the items array
        return {
          items: oldData.items.map((item) =>
            item.id === initialValues.id ? updatedMeeting : item
          ),
        };
      });

      // Invalidate queries in the background
      queryClient.invalidateQueries({ queryKey: ["meetings.getMany"] });
      if (initialValues?.id) {
        queryClient.invalidateQueries({
          queryKey: ["meetings.getOne", initialValues.id],
        });
      }

      toast.success("Meeting updated successfully!");
      onSuccess?.();
    },
    onError: (error: { message: string; code?: string }) => {
      
      // TODO: check if error code is "FORBIDDEN", redirect to /upgrade 
      toast.error(error.message);
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

  return (
  <>
     <NewAgentDialog
      open={openNewAgentDialog}
      onOpenChange={setOpenNewAgentDialog}
      />
        <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="E.g. Professional Psychologist" />
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
                    agents.data?.items?.map((agent) => ({
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