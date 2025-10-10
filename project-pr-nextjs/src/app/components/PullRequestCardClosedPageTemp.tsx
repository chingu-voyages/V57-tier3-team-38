"use client";

import { cn } from "@/lib/utils";
import type { ClosedPullRequest } from "@/types/pr";

type Props = { pr: ClosedPullRequest };

export default function PullRequestCardClosed({ pr }: Props) {
  return (
    <div
      className={cn(
        "bg-[#161b22] mx-auto sm:mx-16 border border-[#30363D] rounded-lg p-4 hover:bg-[#30363D]/80 transition w-[500px] h-[180px] sm:w-auto sm:h-auto",
        parseInt(pr.age) > 48
          ? "border-l-2 border-l-red-400"
          : parseInt(pr.age) >= 24
          ? "border-l-2 border-l-yellow-400"
          : "border-l-2 border-l-green-400"
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">#{pr.id} {pr.title}</h2>
        <span
          className={cn(
            "px-2 py-1 text-xs rounded-md font-bold h-auto w-auto",
            pr.status === "Draft"  && "bg-gray-600 text-white",
            pr.status === "Closed" && "bg-red-600 text-white",
            pr.status === "Merged" && "bg-purple-600 text-white"
          )}
        >
          {pr.status}
        </span>
      </div>

      <p className="text-sm text-gray-400">
        by <span className="font-medium text-white">{pr.author}</span> •
        {" "}created {pr.createdAt} • updated {pr.updatedAt} •{" "}
        <span
          className={cn(
            parseInt(pr.age) > 48
              ? "text-red-400"
              : parseInt(pr.age) >= 24
              ? "text-yellow-400"
              : "text-green-400"
          )}
        >
          {pr.age}
        </span>{" "}
        • closed on {pr.closedOn}
      </p>
    </div>
  );
}
