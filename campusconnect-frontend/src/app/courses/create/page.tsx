import CreateCourseForm from "@/components/create-course-form";

export default function CreateCoursePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Create Course</h1>
      <div className="mt-4">
        <CreateCourseForm />
      </div>
    </div>
  );
}
