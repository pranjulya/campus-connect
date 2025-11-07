"use client";

import { useAssignment } from "@/hooks/use-assignment";
import { useParams } from "next/navigation";
import SubmissionForm from "@/components/submission-form";

export default function AssignmentPage() {
  const params = useParams();
  const { id, aid } = params;
  const { assignment, isLoading, isError } = useAssignment(id as string, aid as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching assignment.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{assignment.title}</h1>
      <p className="mt-2">{assignment.description}</p>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Submit Your Work</h2>
        <SubmissionForm />
      </div>
    </div>
  );
}
