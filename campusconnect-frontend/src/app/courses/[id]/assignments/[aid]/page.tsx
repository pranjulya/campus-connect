"use client";

import { useAssignment } from "@/hooks/use-assignment";
import { useParams } from "next/navigation";
import SubmissionForm from "@/components/submission-form";
import { useMe } from "@/hooks/use-me";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AssignmentPage() {
  const params = useParams();
  const { id, aid } = params;
  const { assignment, isLoading, isError } = useAssignment(id as string, aid as string);
  const { me } = useMe();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching assignment.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
        {me?.role === "professor" && (
          <Link href={`/courses/${id}/assignments/${aid}/grade`}>
            <Button>Grade Submissions</Button>
          </Link>
        )}
      </div>
      <p className="mt-2">{assignment.description}</p>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Submit Your Work</h2>
        <SubmissionForm />
      </div>
    </div>
  );
}
