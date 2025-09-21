"use client";

import { cn } from "@/lib/utils";

interface Reviewer {
  name: string;
  role: string;
}

export interface PullRequest {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  closedOn: string;
  age: string;
  reviewers: Reviewer[];
  status: "Need Review" | "In Review" | "Draft" | "Closed" | "Merged";
}

export default function PullRequestCard({ pr }: { pr: PullRequest }) {
  return (
   
    <div className={`bg-[#161b22] border border-[#30363D] rounded-lg p-4 hover:bg-[#30363D]/80 transition 
    ${cn(
      parseInt(pr.age) > 48
      ? " border border-l-red-400"
      :parseInt(pr.age) >= 24
      ? "border border-l-yellow-400"
      : "border border-l-green-400"
    )}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">
          #{pr.id} {pr.title}
        </h2>
        <span
          className={cn(
            "px-2 py-1 text-xs rounded-md font-bold",
            pr.status === "Need Review" && "bg-yellow-600 text-white",
            pr.status === "In Review" && "bg-blue-600 text-white",
            pr.status === "Draft" && "bg-gray-600 text-white",
            pr.status === "Closed" && "bg-red-600 text-white",
            pr.status === "Merged" && "bg-purple-600 text-white"
          )}
        >
          {pr.status}
        </span>
      </div>

      <p className="text-sm text-gray-400">
        by <span className="font-medium text-white">{pr.author}</span> • created{" "}
        {pr.createdAt} • updated {pr.updatedAt} •{" "}
        <span
          className={cn(
            parseInt(pr.age) > 48
              ? "text-red-400"
              : parseInt(pr.age) >= 24
              ? "text-yellow-400"
              : "text-green-400 "
          )}
        >
          {pr.age}
        </span>
      </p>

      <div className="flex gap-2 mt-3">
        {pr.reviewers.map((rev) => (
          <span
            key={rev.name}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs 
            font-medium max-w-full border border-blue-700 text-blue-200 bg-blue-900"
          >
            {rev.name}
          </span>
        ))}
      </div>
    </div>
  );
}
