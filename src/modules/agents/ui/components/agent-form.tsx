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

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: Partial<AgentGetOne>;
}

export const AgentForm = ({ onSuccess, onCancel, initialValues = {} }: AgentFormProps) => {
  const queryClient = useQueryClient();

  interface AgentsGetManyResponse {
    items: AgentGetOne[];
  }

  const createAgent = trpc.agents.create.useMutation({
    onSuccess: async (
      newAgent: {
        id: string;
        createdAt: string;
        updatedAt: string;
        userId: string;
        name: string;
        instructions: string;
      }
    ) => {
      // Optimistically update the cache
      queryClient.setQueryData<AgentsGetManyResponse>(["agents.getMany"], (oldData) => {
        const agentWithMeetingCount = {
          ...newAgent,
          meetingCount: 0,
        };
        if (!oldData || !oldData.items) {
          return { items: [agentWithMeetingCount] };
        }
        return { items: [...oldData.items, agentWithMeetingCount] };
      });

      // Invalidate queries in the background
      queryClient.invalidateQueries({ queryKey: ["agents.getMany"] });

      toast.success("Agent created successfully!");
      //TODO: Invalidate free tier usage
      onSuccess?.();
    },
    onError: (error: { message: string; code?: string }) => {
      toast.error(error.message);

      // TODO: check if error code is "FORBIDDEN", redirect to /upgrade 
    },
  });

  const updateAgent = trpc.agents.update.useMutation({
    onSuccess: async (
      updatedAgent: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        userId: string;
        instructions: string;
      }
    ) => {
      // Add meetingCount if missing (fallback to 0 or from initialValues)
      const agentWithMeetingCount = {
        ...updatedAgent,
        meetingCount: initialValues.meetingCount ?? 0,
      };

      // Optimistically update the cache
      queryClient.setQueryData<AgentsGetManyResponse>(["agents.getMany"], (oldData) => {
        if (!oldData || !oldData.items) {
          return { items: [agentWithMeetingCount] };
        }
        // Update the specific agent in the items array
        return {
          items: oldData.items.map((item) =>
            item.id === initialValues.id ? agentWithMeetingCount : item
          ),
        };
      });

      // Invalidate queries in the background
      queryClient.invalidateQueries({ queryKey: ["agents.getMany"] });
      if (initialValues?.id) {
        queryClient.invalidateQueries({
          queryKey: ["agents.getOne", initialValues.id],
        });
      }

      toast.success("Agent updated successfully!");
      onSuccess?.();
    },
    onError: (error: { message: string; code?: string }) => {
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
      updateAgent.mutate({
        ...values,
        id: initialValues.id!,
      });
    } else {
      createAgent.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="You are a helpful psychologist teacher that can answer questions and provide psychotherapy"
                />
              </FormControl>
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
  );
};