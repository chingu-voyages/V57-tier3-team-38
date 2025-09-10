'use client';
import { usePR } from '@/context/PRContext';

export default function PRTable() {
  const { loading, items, total } = usePR(); // no `.state`

  if (loading && items.length === 0) return <p className="p-4">Loading…</p>;
  if (!loading && items.length === 0) return <p className="p-4">No pull requests found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        {/* ... render rows from items ... */}
      </table>
      <div className="p-2 text-sm opacity-70">Total: {total}</div>
    </div>
  );
}
