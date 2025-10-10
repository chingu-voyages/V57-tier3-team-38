import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const githubOrg = process.env.NEXT_PUBLIC_GITHUB_ORG;
  const githubRepoName = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME;
  const githubToken = process.env.GITHUB_TOKEN; // safer than NEXT_PUBLIC

  if (!githubOrg || !githubRepoName) {
    return NextResponse.json(
      { error: "Missing GitHub org or repo name" },
      { status: 400 }
    );
  }

  try {
    const octokit = new Octokit(
      githubToken ? { auth: githubToken } : undefined
    );

    const response = await octokit.request("GET /search/issues", {
      q: `${query} repo:${githubOrg}/${githubRepoName} type:pr in:title,body`,
    });

    const results = response.data.items.map((item: any) => ({
      id: item.number,
      title: item.title,
      author: item.user?.login,
      state: item.state,
      html_url: item.html_url,
      updated_at: item.updated_at,
      created_at: item.created_at,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Error fetching GitHub search results" },
      { status: 500 }
    );
  }
}
