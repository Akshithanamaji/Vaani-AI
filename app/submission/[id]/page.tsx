'use client';

import { Suspense } from 'react';
import SubmissionDetailsContent from './SubmissionDetailsContent';

export default function SubmissionDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      }
    >
      <SubmissionDetailsContent />
    </Suspense>
  );
}
