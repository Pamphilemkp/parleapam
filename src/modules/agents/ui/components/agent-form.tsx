import { AgentGetOne } from "../../types";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import z from "zod";
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
  FormMessage
} from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues: AgentGetOne
}

export const AgentForm = ({onSuccess, onCancel, initialValues}: AgentFormProps)=> {
   
    const queryClient = useQueryClient();
    
    const createAgent = trpc.agents.create.useMutation({
        onSuccess: async (newAgent) => {
            // Optimistically update the cache
            queryClient.setQueryData<AgentGetOne[]>(['agents.getMany'], (oldData) => {
                if (!oldData) return [newAgent]; // If no previous data, return array with new agent
                return [...oldData, newAgent]; // Append new agent to existing data
            });

            // Invalidate queries to ensure consistency with server
            await queryClient.invalidateQueries({ queryKey: ['agents.getMany'] });

            if (initialValues?.id) {
                await queryClient.invalidateQueries({ queryKey: [['agents', 'getOne', initialValues?.id]] });
            }
            onSuccess?.();
        },
        onError: (error: { message: string; code?: string }) => {
            toast.error(error.message);
            // TODO: check if error code is forbidden, redirect to /upgrade
        }
    });

    const form = useForm<z.infer<typeof AgentsInsertSchema>>({
        resolver: zodResolver(AgentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? ""
        }
    })

    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending;

    const onSubmit = (values: z.infer<typeof AgentsInsertSchema>) => {
        if (isEdit) {
            console.log("TODO: Update Agent")
        } else {
            createAgent.mutate(values)
        }
    }

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant="bottsNeutral"
                    className="border size-16"
                />
                <FormField
                    name="name"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="E.g Professional Psychologist " />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="instructions"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="You are an helpful psychologist teacher that can answer questions and provide psycho therapy " />
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
    )
}