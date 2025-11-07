"use client";

import { useCourse } from "@/hooks/use-course";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
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
      <h1 className="text-2xl font-bold">{course.name}</h1>
      <p className="mt-2">{course.description}</p>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Assignments</h2>
        <p>No assignments for this course yet.</p>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Enrolled Students</h2>
        <p>No students enrolled in this course yet.</p>
      </div>
    </div>
  );
}
