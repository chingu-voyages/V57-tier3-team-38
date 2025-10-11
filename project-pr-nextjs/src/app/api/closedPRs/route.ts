import { NextResponse } from "next/server";
import { Octokit } from "octokit";

let cachedClosedPRs: any = null;
let lastClosedFetchTime: number | null = null;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get("refresh") === "true";

    if (cachedClosedPRs && !refresh) {
      console.log("Returning closed PRs from cache");
      return NextResponse.json({
        source: "cache",
        count: cachedClosedPRs.length,
        data: cachedClosedPRs,
        lastFetchTime: lastClosedFetchTime,
      });
    }

    console.log("Fetching closed PRs from GitHub...");

    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    });

    const owner = process.env.NEXT_PUBLIC_GITHUB_ORG!;
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME!;

    const { data: closedPRs } = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls",
      {
        owner,
        repo,
        state: "closed",
        per_page: 100,
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      }
    );

    console.log(`Retrieved ${closedPRs.length} closed PRs`);

    // Add reviews
    const detailedClosedPRs = await Promise.all(
      closedPRs.map(async (pr: any) => {
        try {
          const { data: reviews } = await octokit.request(
            "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
            {
              owner,
              repo,
              pull_number: pr.number,
              headers: { "X-GitHub-Api-Version": "2022-11-28" },
            }
          );
          return { ...pr, reviews };
        } catch (err) {
          console.warn(
            `Error fetching reviews for closed PR #${pr.number}:`,
            err
          );
          return { ...pr, reviews: [] };
        }
      })
    );

    cachedClosedPRs = detailedClosedPRs;
    lastClosedFetchTime = Date.now();

    const totalReviews = detailedClosedPRs.reduce(
      (sum, pr) => sum + (pr.reviews?.length || 0),
      0
    );

    console.log(
      `Cached ${detailedClosedPRs.length} closed PRs with ${totalReviews} total reviews`
    );

    return NextResponse.json({
      source: "github",
      count: detailedClosedPRs.length,
      totalReviews,
      data: detailedClosedPRs,
      lastFetchTime: lastClosedFetchTime,
    });
  } catch (error: any) {
    console.error("Error in /api/closedPRs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch closed PRs" },
      { status: 500 }
    );
  }
}
