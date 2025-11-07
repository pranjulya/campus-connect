"use client";

import { useCourse } from "@/hooks/use-course";
import { useAssignments } from "@/hooks/use-assignments";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMe } from "@/hooks/use-me";
import { Button } from "@/components/ui/button";

export default function CourseDetailPage() {
  const params = useParams();
  const { id } = params;
  const { course, isLoading: courseIsLoading, isError: courseIsError } = useCourse(id as string);
  const { assignments, isLoading: assignmentsIsLoading, isError: assignmentsIsError } = useAssignments(id as string);
  const { me } = useMe();

  if (courseIsLoading || assignmentsIsLoading) {
    return <div>Loading...</div>;
  }

  if (courseIsError || assignmentsIsError) {
    return <div>Error fetching course data.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{course.name}</h1>
        {me?.role === "professor" && (
          <div className="space-x-2">
            <Link href={`/courses/${id}/edit`}>
              <Button variant="outline">Edit Course</Button>
            </Link>
            <Link href={`/courses/${id}/assignments/create`}>
              <Button>Create Assignment</Button>
            </Link>
          </div>
        )}
      </div>
      <p className="mt-2">{course.description}</p>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Assignments</h2>
        {assignments && assignments.length === 0 && <p>No assignments for this course yet.</p>}
        {assignments && assignments.length > 0 && (
          <ul>
            {assignments.map((assignment: any) => (
              <li key={assignment._id}>
                <Link href={`/courses/${id}/assignments/${assignment._id}`}>{assignment.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Enrolled Students</h2>
        <p>No students enrolled in this course yet.</p>
      </div>
    </div>
  );
}
