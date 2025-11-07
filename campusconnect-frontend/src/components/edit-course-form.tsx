"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
});

export default function EditCourseForm({ course }: { course: any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: course.name,
      description: course.description,
    },
  });

  const router = useRouter();
  const updateCourseMutation = useApi(`/courses/${course._id}`);

  useEffect(() => {
    form.reset({
      name: course.name,
      description: course.description,
    });
  }, [course, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateCourseMutation.mutate(values, {
      onSuccess: () => {
        router.push(`/courses/${course._id}`);
      },
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Course Name</Label>
        <Input id="name" {...form.register("name")} />
        {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...form.register("description")} />
        {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
      </div>
      <Button type="submit" disabled={updateCourseMutation.isLoading}>
        {updateCourseMutation.isLoading ? "Updating..." : "Update Course"}
      </Button>
    </form>
  );
}
