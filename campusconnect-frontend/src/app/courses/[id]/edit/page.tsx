"use client";

import { useCourse } from "@/hooks/use-course";
import { useParams } from "next/navigation";
import EditCourseForm from "@/components/edit-course-form";

export default function EditCoursePage() {
  const params = useParams();
  const { id } = params;
  const { course, isLoading, isError } = useCourse(id as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching course.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Course</h1>
      <div className="mt-4">
        <EditCourseForm course={course} />
      </div>
    </div>
  );
}
