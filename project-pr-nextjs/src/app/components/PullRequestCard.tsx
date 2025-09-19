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
  age: string;
  reviewers: Reviewer[];
  status: "Need Review" | "In Review" | "Draft";
}

export default function PullRequestCard({ pr }: { pr: PullRequest }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 transition">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">
          #{pr.id} {pr.title}
        </h2>
        <span
          className={cn(
            "px-2 py-1 text-xs rounded-md font-medium",
            pr.status === "Need Review" && "bg-yellow-700 text-yellow-200",
            pr.status === "In Review" && "bg-blue-700 text-blue-200",
            pr.status === "Draft" && "bg-gray-600 text-gray-200"
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
            pr.age.includes("h old") && parseInt(pr.age) > 48
              ? "text-red-400"
              : "text-green-400"
          )}
        >
          {pr.age}
        </span>
      </p>

      <div className="flex gap-2 mt-3">
        {pr.reviewers.map((rev) => (
          <span
            key={rev.name}
            className="bg-purple-700 text-xs px-2 py-1 rounded-full"
          >
            {rev.name}
          </span>
        ))}
      </div>
    </div>
  );
}
