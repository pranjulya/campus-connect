"use client";

import { useCourses } from "@/hooks/use-courses";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/use-me";
import Link from "next/link";

export default function CoursesPage() {
  const { courses, isLoading, isError } = useCourses();
  const { me } = useMe();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching courses.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        {me?.role === "professor" && (
          <Link href="/courses/create">
            <Button>Create Course</Button>
          </Link>
        )}
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course: any) => (
          <Card key={course._id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Professor: {course.professor.name}</p>
            </CardContent>
            <CardFooter>
              <Button>Enroll</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
