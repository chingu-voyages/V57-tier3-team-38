# PR Status Board
Monitor open and closed GitHub PRs with real-time status updates and intelligent caching.


## Quick Start

You can access the live deployed version here:
  **[https://v57-tier3-team-38.onrender.com](https://v57-tier3-team-38.onrender.com)**

Login using your **GitHub account** — Login isn't required to use the website.

If you are a developer and want to run this project locally:

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd project-pr-team38
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and include:

   ```bash
   NEXT_PUBLIC_GITHUB_TOKEN=<xyz>
   NEXT_PUBLIC_GITHUB_ORG=<xyz>
   NEXT_PUBLIC_GITHUB_REPO_NAME=<xyz>
   GITHUB_CLIENT_ID=<generated_client_id>
   GITHUB_CLIENT_SECRET=<generated_client_secret>
   NEXTAUTH_SECRET=<generated_secret>
   NEXTAUTH_URL=http://localhost:3000
   ```

   These variables are required for GitHub OAuth login via `next-auth`.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   npm start
   ```


## Major Features

* **GitHub Login:** Secure authentication using NextAuth and GitHub OAuth.
* **Open & Closed PR Views:**

  * Track open pull requests in real time.
  * View previously closed or merged PRs.
* **Advanced Filtering:**

  * Search by title, author, or PR status (`Unapproved`, `Pending`, `Requested changes`, `Approved`).
* **Sorting:**

  * Sort results by creation date, last update, or title.
* **Caching Mechanism:**

  * Uses browser **Local Storage** to cache results and minimize API requests.
* **Dynamic Time Display:**

  * Shows last activity in hours or days (e.g., “1 day 2 hours ago”).
* **Responsive UI:**

  * Clean, adaptive layout designed with TailwindCSS for desktop and mobile.
* **Deployed on Render** with automated build and serverless deployment.


## Tech Stack & Dependencies

**Framework:** Next.js (App Router)


**Language:** TypeScript


**Styling:** TailwindCSS


**Auth:** NextAuth (GitHub Provider)


**API Integration:** Octokit (GitHub REST API)


**Deployment:** Render (frontend & backend combined)


**Caching:** LocalStorage

Dependencies (see `package.json` for full list):

```json
"dependencies": {
  "@google/generative-ai": "^0.24.1",
  "next": "15.5.2",
  "next-auth": "^4.24.11",
  "octokit": "^5.0.3",
  "react": "19.1.0",
  "react-dom": "19.1.0"
},
"devDependencies": {
  "@eslint/eslintrc": "^3",
  "@tailwindcss/postcss": "^4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "15.5.2",
  "tailwindcss": "^4",
  "typescript": "^5.9.2"
}
```


## Deployment

Deployed using **Render** for both frontend and backend.
Caching handled via local storage.

Live site:
🔗 **[https://v57-tier3-team-38.onrender.com](https://v57-tier3-team-38.onrender.com)**


## Our Team

- Eoin McDonnell: [GitHub](https://github.com/oldmcdonnell) / [LinkedIn](https://www.linkedin.com/in/mcdonnell-eoin)
- Marissa Lamothe: [GitHub](https://github.com/msrissaxox) / [LinkedIn](https://www.linkedin.com/in/marissalamothe/)
- Spandan Mahat : [GitHub](https://github.com/spandanmahat00) / [LinkedIn](https://linkedin.com/in/spandan-mahat-078662266)
- Trevor Topolski : [GitHub](https://github.com/Trevor-04) / [LinkedIn](https://linkedin.com/in/trevortopolski)
- Adelola Abioye: [GitHub](https://github.com/Adel-abio) / [LinkedIn](https://www.linkedin.com/in/adelola-abioye/)


## About Chingu

This project was built as part of **Chingu Voyage 57**.

Learn more: [https://www.chingu.io](https://www.chingu.io)
