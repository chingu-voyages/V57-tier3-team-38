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
  age: string; //need to calculate age
  reviewers: Reviewer[];
  status: "Closed" | "Merged";
  url: string;
    rawClosedAt: string; 

}

export default function PullRequestCard({ pr }: { pr: PullRequest }) {
// console.log(pr)
  const ageInHours = parseInt(pr.age.replace('h old', ''), 10);
  const ageClass =
    ageInHours > 72 // Changed to 72 hours (3 days) for visibility
      ? "border-l-red-400"
      : ageInHours >= 24
      ? "border-l-yellow-400"
      : "border-l-green-400";
      
  return (
      <div 
      className={cn(
        // Fixing styling for better responsiveness
        "bg-[#161b22] mx-auto sm:mx-16 border border-[#30363D] rounded-lg p-4 hover:bg-[#30363D]/80 transition",
        "w-full max-w-4xl h-auto",
        `border-l-4 ${ageClass}`
      )}
    >
      <a href={pr.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-semibold text-lg text-blue-300 hover:text-blue-200 transition">
            <span className="text-gray-500 font-normal">#{pr.id}</span> {pr.title}
          </h2>
          <span
            className={cn(
              "px-2 py-1 text-xs rounded-md font-bold h-auto w-auto min-w-[70px] text-center whitespace-nowrap",
              pr.status === "Closed" && "bg-red-600 text-white",
              pr.status === "Merged" && "bg-purple-600 text-white"
            )}
          >
            {pr.status}
          </span>
        </div>

        <p className="text-sm text-gray-400">
          by <span className="font-medium text-white">{pr.author}</span> • created{" "}
          {pr.createdAt} • **closed {pr.closedOn}** • open time:{" "}
          <span
            className={cn(
              // FIX: Use the calculated ageInHours instead of re-parsing the string
              ageInHours > 72
                ? "text-red-400"
                : ageInHours >= 24
                ? "text-yellow-400"
                : "text-green-400"
            )}
          >
            {pr.age}
          </span>
        </p>
      </a>

      <div className="flex gap-2 mt-3 flex-wrap items-center">
        <span className="text-xs text-gray-400 font-medium">Reviewers:</span>
        {pr.reviewers.length > 0 ? (
          pr.reviewers.map((rev) => (
            <span
              key={rev.name}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs 
              font-medium max-w-full border border-blue-700 text-blue-200 bg-blue-900"
            >
              {rev.name}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-500 italic">None assigned/found</span>
        )}
      </div>
    </div>
  );
}