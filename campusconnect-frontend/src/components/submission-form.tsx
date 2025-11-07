"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { useParams } from "next/navigation";

const formSchema = z.object({
  content: z.string().min(10),
});

export default function SubmissionForm() {
  const params = useParams();
  const { id, aid } = params;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const submissionMutation = useApi(`/courses/${id}/assignments/${aid}/submissions`);

  function onSubmit(values: z.infer<typeof formSchema>) {
    submissionMutation.mutate(values);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <Textarea {...form.register("content")} />
        {form.formState.errors.content && <p className="text-red-500 text-sm">{form.formState.errors.content.message}</p>}
      </div>
      <Button type="submit" disabled={submissionMutation.isLoading}>
        {submissionMutation.isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
