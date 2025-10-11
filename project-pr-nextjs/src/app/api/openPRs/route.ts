import { NextResponse } from "next/server";
import { Octokit } from "octokit";

let cachedData: any = null;
let lastFetchTime: number | null = null;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get("refresh") === "true";

    if (cachedData && !refresh) {
      return NextResponse.json({
        source: "cache",
        count: cachedData.length,
        data: cachedData,
        lastFetchTime,
      });
    }

    console.log("Fetching live data from GitHub.");

    const octokit = new Octokit({
      auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
    });

    const owner = process.env.NEXT_PUBLIC_GITHUB_ORG!;
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME!;

    const { data: pullRequests } = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls",
      {
        owner,
        repo,
        state: "open",
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      }
    );

    console.log(`Retrieved ${pullRequests.length} open PRs`);

    const detailedPRs = await Promise.all(
      pullRequests.map(async (pr: any) => {
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

          return {
            ...pr,
            reviews,
          };
        } catch (err) {
          console.error(`Error fetching reviews for PR #${pr.number}:`, err);
          return { ...pr, reviews: [] };
        }
      })
    );

    cachedData = detailedPRs;
    lastFetchTime = Date.now();

    const totalReviews = detailedPRs.reduce(
      (sum, pr) => sum + (pr.reviews?.length || 0),
      0
    );

    console.log(
      `Cached ${detailedPRs.length} PRs with total ${totalReviews} reviews`
    );

    // Return response
    return NextResponse.json({
      source: "github",
      count: detailedPRs.length,
      totalReviews,
      data: detailedPRs,
      lastFetchTime,
    });
  } catch (error: any) {
    console.error("Error in /api/openPRs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch PRs" },
      { status: 500 }
    );
  }
}
