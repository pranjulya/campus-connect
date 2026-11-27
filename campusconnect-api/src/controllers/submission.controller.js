import * as submissionService from '../services/submission.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getSubmissionPublicPath, getSubmissionUploadsDir } from '../config/upload.config.js';

const parseBodyAttachments = (attachments) => {
  if (!attachments) {
    return [];
  }

  if (Array.isArray(attachments)) {
    return attachments.filter(Boolean);
  }

  if (typeof attachments === 'string') {
    try {
      const parsed = JSON.parse(attachments);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch (error) {
      // Ignore JSON parse errors and treat value as a raw string
    }

    return [attachments].filter(Boolean);
  }

  return [];
};

const buildSubmissionPayload = (req) => {
  const existingAttachments = parseBodyAttachments(req.body.attachments);
  const fileAttachments = Array.isArray(req.files)
    ? req.files.map((file) => getSubmissionPublicPath(file.filename))
    : [];

  // Only files that arrived in this request are trusted; the service drops any
  // other client-supplied path that isn't already on the student's own submission.
  const payload = {
    ...req.body,
    attachments: [...existingAttachments, ...fileAttachments],
    uploadedAttachments: fileAttachments,
  };

  if (payload.attachments.length === 0) {
    delete payload.attachments;
  }

  return payload;
};

export const submitAssignment = asyncHandler(async (req, res) => {
  const payload = buildSubmissionPayload(req);
  const submission = await submissionService.submitAssignment(
    req.params.courseId,
    req.params.assignmentId,
    req.user.id,
    payload
  );

  res.status(201).json(submission);
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await submissionService.getSubmissions(
    req.params.courseId,
    req.params.assignmentId,
    req.user
  );

  res.json(submissions);
});

export const getSubmission = asyncHandler(async (req, res) => {
  const submission = await submissionService.getSubmissionById(
    req.params.courseId,
    req.params.assignmentId,
    req.params.submissionId,
    req.user
  );

  res.json(submission);
});

export const updateSubmission = asyncHandler(async (req, res) => {
  const payload = buildSubmissionPayload(req);
  const submission = await submissionService.updateSubmission(
    req.params.courseId,
    req.params.assignmentId,
    req.params.submissionId,
    req.user.id,
    payload
  );

  res.json(submission);
});

export const reviewSubmission = asyncHandler(async (req, res) => {
  const submission = await submissionService.reviewSubmission(
    req.params.courseId,
    req.params.assignmentId,
    req.params.submissionId,
    req.user.id,
    req.body
  );

  res.json(submission);
});

export const downloadSubmissionFile = asyncHandler(async (req, res) => {
  await submissionService.authorizeSubmissionFileAccess(req.params.filename, req.user);

  res.sendFile(
    req.params.filename,
    {
      root: getSubmissionUploadsDir(),
      dotfiles: 'deny',
      headers: {
        'Content-Disposition': 'attachment',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, no-store',
      },
    },
    (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ msg: 'File not found' });
      }
    }
  );
});
