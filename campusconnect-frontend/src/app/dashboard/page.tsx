"use client";

import { useEnrolledCourses } from "@/hooks/use-enrolled-courses";

export default function DashboardPage() {
  const { courses, isLoading, isError } = useEnrolledCourses();

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Enrolled Courses</h2>
          {isLoading && <p>Loading...</p>}
          {isError && <p>Error fetching courses.</p>}
          {courses && courses.length === 0 && <p>You are not enrolled in any courses yet.</p>}
          {courses && courses.length > 0 && (
            <ul>
              {courses.map((course: any) => (
                <li key={course._id}>{course.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
          <p>No upcoming deadlines.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Unread Notifications</h2>
          <p>No unread notifications.</p>
        </div>
      </div>
    </div>
  );
}
