"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { useRouter, useParams } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  dueDate: z.string().datetime(),
});

export default function CreateAssignmentForm() {
  const params = useParams();
  const { id } = params;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date().toISOString().slice(0, 16),
    },
  });

  const router = useRouter();
  const createAssignmentMutation = useApi(`/courses/${id}/assignments`);

  function onSubmit(values: z.infer<typeof formSchema>) {
    createAssignmentMutation.mutate(values, {
      onSuccess: () => {
        router.push(`/courses/${id}`);
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register("title")} />
        {form.formState.errors.title && <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...form.register("description")} />
        {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" type="datetime-local" {...form.register("dueDate")} />
        {form.formState.errors.dueDate && <p className="text-red-500 text-sm">{form.formState.errors.dueDate.message}</p>}
      </div>
      <Button type="submit" disabled={createAssignmentMutation.isLoading}>
        {createAssignmentMutation.isLoading ? "Creating..." : "Create Assignment"}
      </Button>
    </form>
  );
}
