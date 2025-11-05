"use client";

import { AgentGetOne } from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AgentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { VoiceInput } from "./voice-input";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: Partial<AgentGetOne>;
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues = {},
}: AgentFormProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isRefetchingAfterCreate, setIsRefetchingAfterCreate] = useState(false);

  interface AgentsGetManyResponse {
    items: AgentGetOne[];
  }

  const createAgent = trpc.agents.create.useMutation({
    onSuccess: async (newAgent) => {
      const agentWithMeetingCount = { ...newAgent, meetingCount: 0 };

      // Set cache immediately
      queryClient.setQueryData<AgentsGetManyResponse>(["agents.getMany"], (oldData) => {
        if (!oldData || !oldData.items) return { items: [agentWithMeetingCount] };
        return { items: [...oldData.items, agentWithMeetingCount] };
      });

      toast.success("Agent created successfully!");

      // Show loading state while waiting for fresh data
      setIsRefetchingAfterCreate(true);
      await queryClient.invalidateQueries({ queryKey: ["agents.getMany"] });
      await queryClient.refetchQueries({ queryKey: ["agents.getMany"] });

      await queryClient.invalidateQueries({ queryKey: ["premium.getFreeUsage"] });

      setIsRefetchingAfterCreate(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
      if (error.data?.code === "FORBIDDEN") {
        router.push("/upgrade");
      }
    },
  });

  const updateAgent = trpc.agents.update.useMutation({
    onSuccess: async (updatedAgent) => {
      const agentWithMeetingCount = {
        ...updatedAgent,
        meetingCount: initialValues.meetingCount ?? 0,
      };

      queryClient.setQueryData<AgentsGetManyResponse>(["agents.getMany"], (oldData) => {
        if (!oldData || !oldData.items) return { items: [agentWithMeetingCount] };
        return {
          items: oldData.items.map((item) =>
            item.id === initialValues.id ? agentWithMeetingCount : item
          ),
        };
      });

      queryClient.invalidateQueries({ queryKey: ["agents.getMany"] });
      if (initialValues?.id) {
        queryClient.invalidateQueries({
          queryKey: ["agents.getOne", initialValues.id],
        });
      }

      toast.success("Agent updated successfully!");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof AgentsInsertSchema>>({
    resolver: zodResolver(AgentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof AgentsInsertSchema>) => {
    if (isEdit) {
      updateAgent.mutate({ ...values, id: initialValues.id! });
    } else {
      createAgent.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 max-h-[90dvh] overflow-y-auto w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {isRefetchingAfterCreate ? (
          <div className="text-center py-10 text-sm text-muted-foreground">
            <span className="animate-pulse">🔄 Loading your new agent...</span>
          </div>
        ) : (
          <>
            <GeneratedAvatar
              seed={form.watch("name") || "default"}
              variant="bottsNeutral"
              className="border size-16"
            />
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
              name="instructions"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Instructions</FormLabel>
                    <VoiceInput
                      onTranscript={(text) => {
                        const currentText = field.value || '';
                        field.onChange(currentText ? `${currentText}\n\n${text}` : text);
                        toast.success('Voice instructions added!');
                      }}
                      disabled={isPending}
                    />
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="You are a helpful psychologist teacher... Or click 'Record Voice' to speak your instructions."
                      className="h-32 resize-none overflow-y-auto"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Describe how your AI agent should behave. You can type or use voice recording.
                  </p>
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
          </>
        )}
      </form>
    </Form>
  );
};
