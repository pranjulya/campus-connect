"use client";

import { useSubmissions } from "@/hooks/use-submissions";
import { useParams } from "next/navigation";
import GradeSubmissionForm from "@/components/grade-submission-form";

export default function GradeSubmissionsPage() {
  const params = useParams();
  const { id, aid } = params;
  const { submissions, isLoading, isError } = useSubmissions(id as string, aid as string);

  if (isLoading) {
    return <div>Loading...</div>;
  };

  if (isError) {
    return <div>Error fetching submissions.</div>;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Grade Submissions</h1>
      <div className="mt-4">
        {submissions && submissions.length === 0 && <p>No submissions for this assignment yet.</p>}
        {submissions && submissions.length > 0 && (
          <ul>
            {submissions.map((submission: any) => (
              <li key={submission._id} className="py-2 border-b">
                <p>Student: {submission.student.name}</p>
                <p>Content: {submission.content}</p>
                <GradeSubmissionForm submission={submission} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
