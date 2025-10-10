"use client";

import { cn } from "@/lib/utils";
import type { OpenPullRequest } from "@/types/pr";

export default function PullRequestCard({ pr }: { pr: OpenPullRequest }) {
  return (
    <a href={pr.url} target="_blank" rel="noopener noreferrer" className="block">
      <div
        className={cn(
          "bg-[#161b22] mx-auto sm:mx-16 border border-[#30363D] rounded-lg p-4 hover:bg-[#30363D]/80 transition w-[500px] h-[180px] sm:w-auto sm:h-auto",
          pr.status === "Unapproved" && "border-l-2 border-l-amber-600",
          pr.status === "Pending approvals" && "border-l-2 border-l-yellow-600",
          pr.status === "Requested changes" && "border-l-2 border-l-red-600",
          pr.status === "Approved" && "border-l-2 border-l-green-600"
        )}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">#{pr.id} {pr.title}</h2>
          <span
            className={cn(
              "px-3 py-2 text-xs rounded-md font-bold h-auto w-auto",
              pr.status === "Unapproved" && "bg-amber-600 text-white",
              pr.status === "Pending approvals" && "bg-yellow-600 text-white",
              pr.status === "Requested changes" && "bg-red-700 text-white",
              pr.status === "Approved" && "bg-green-600 text-white"
            )}
          >
            {pr.status}
          </span>
        </div>

        <p className="text-sm text-gray-400">
          by <span className="font-medium text-white">{pr.author}</span> •
          created {pr.createdAt} • updated {pr.updatedAt} • last action:{" "}
          <span
            className={cn(
              pr.lastAction === "Approved" && "text-green-600",
              pr.lastAction === "Requested changes" && "text-red-600",
              pr.lastAction === "Commented" && "text-yellow-600",
              pr.lastAction === "Unapproved" && "text-amber-600",
              !pr.lastAction && "text-gray-400"
            )}
          >
            {pr.lastAction}
          </span>{" "}
          • <span className="text-gray-400">{pr.lastActionAt}h ago</span>
        </p>

        <div className="mt-3 space-y-1 text-gray-400 text-sm">
          {pr.reviewersGrouped.pending.length > 0 && (
            <div>
              <span className="font-bold mr-2 text-gray-400">Pending:</span>
              {pr.reviewersGrouped.pending.map((name, i) => (
                <span key={name} className="text-gray-400 italic">
                  {name}{i < pr.reviewersGrouped.pending.length - 1 && " | "}
                </span>
              ))}
            </div>
          )}

          {pr.reviewersGrouped.approved.length > 0 && (
            <div>
              <span className="font-bold mr-2 text-gray-400">Approved:</span>
              {pr.reviewersGrouped.approved.map((name, i) => (
                <span key={name} className="text-gray-400 italic">
                  {name}{i < pr.reviewersGrouped.approved.length - 1 && " | "}
                </span>
              ))}
            </div>
          )}

          {pr.reviewersGrouped.changesRequested.length > 0 && (
            <div>
              <span className="font-bold mr-2 text-gray-400">Requested changes:</span>
              {pr.reviewersGrouped.changesRequested.map((name, i) => (
                <span key={name} className="text-gray-400 italic">
                  {name}{i < pr.reviewersGrouped.changesRequested.length - 1 && " | "}
                </span>
              ))}
            </div>
          )}

          {pr.reviewersGrouped.commented.length > 0 && (
            <div>
              <span className="font-bold mr-2 text-gray-400">Commented:</span>
              {pr.reviewersGrouped.commented.map((name, i) => (
                <span key={name} className="text-gray-400 italic">
                  {name}{i < pr.reviewersGrouped.commented.length - 1 && " | "}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
