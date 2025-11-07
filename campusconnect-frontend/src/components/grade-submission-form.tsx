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
  grade: z.number().min(0).max(100),
  feedback: z.string().optional(),
});

export default function GradeSubmissionForm({ submission }: { submission: any }) {
  const params = useParams();
  const { id, aid } = params;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: submission.grade || 0,
      feedback: submission.feedback || "",
    },
  });

  const router = useRouter();
  const gradeSubmissionMutation = useApi(`/courses/${id}/assignments/${aid}/submissions/${submission._id}/review`);

  function onSubmit(values: z.infer<typeof formSchema>) {
    gradeSubmissionMutation.mutate(values, {
      onSuccess: () => {
        router.push(`/courses/${id}/assignments/${aid}/grade`);
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="grade">Grade</Label>
        <Input id="grade" type="number" {...form.register("grade", { valueAsNumber: true })} />
        {form.formState.errors.grade && <p className="text-red-500 text-sm">{form.formState.errors.grade.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea id="feedback" {...form.register("feedback")} />
        {form.formState.errors.feedback && <p className="text-red-500 text-sm">{form.formState.errors.feedback.message}</p>}
      </div>
      <Button type="submit" disabled={gradeSubmissionMutation.isLoading}>
        {gradeSubmissionMutation.isLoading ? "Grading..." : "Grade Submission"}
      </Button>
    </form>
  );
}
