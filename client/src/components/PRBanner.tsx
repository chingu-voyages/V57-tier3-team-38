'use client';
import { usePR } from '@/context/PRContext';

export default function PRBanner() {
  const { error } = usePR(); // no `.state`

  if (!error) return null;
  const msg = /403/.test(error) ? 'GitHub rate limit reached. Try again soon.' : error;

  return (
    <div className="p-3 rounded-md border bg-red-50 text-red-700">
      {msg}
    </div>
  );
}