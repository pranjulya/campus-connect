import CreateAssignmentForm from "@/components/create-assignment-form";

export default function CreateAssignmentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Create Assignment</h1>
      <div className="mt-4">
        <CreateAssignmentForm />
      </div>
    </div>
  );
}
