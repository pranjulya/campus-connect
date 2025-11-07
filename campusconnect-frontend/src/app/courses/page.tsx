"use client";

import { useCourses } from "@/hooks/use-courses";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const { courses, isLoading, isError } = useCourses();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching courses.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Courses</h1>
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
