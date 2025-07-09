# TLGIT - GitHub Commit Analysis & Stand-up Generator

Transform your GitHub commit history into actionable stand-up notes and AI-powered insights.

## Features

- **Automatic Commit Tracking**: Watches your GitHub repositories for new commits
- **AI-Powered Summaries**: Creates professional summaries using OpenAI GPT-4o-mini
- **Individual Commit Insights**: AI explains what each commit does
- **Enhanced Stand-up Notes**: Generated from actual commit data
- **Real-time Updates**: Tracks commits since you started monitoring

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# Required: OpenAI API Key for AI summaries
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Required: GitHub OAuth Configuration
# Register your app at: https://github.com/settings/applications/new
# Set Authorization callback URL to: http://localhost:3000/app/callback
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start using TLGIT.

## How to Use

1. **Connect GitHub**: Link your GitHub account (currently uses personal access token)
2. **Select Repositories**: Choose which repos to track
3. **View Dashboard**: See all commits since tracking started
4. **Generate AI Summaries**: Click "AI Summary" button for intelligent analysis
5. **Review Insights**: Each commit gets AI-powered explanations

## AI Features

### Repository Summaries

- Analyzes all commits from tracked repositories
- Provides professional stand-up talking points
- Identifies patterns (bug fixes, features, refactoring)
- Suggests team communication points

### Individual Commit Insights

- Explains what each commit accomplishes
- Available for repositories with fewer commits
- Helps understand code changes quickly

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI components
- **AI**: OpenAI GPT-4o-mini via Vercel AI SDK
- **GitHub Integration**: GitHub REST API

## API Endpoints

- `POST /api/generate-summary` - Generate AI summaries for commits

## Development

The project uses:

- Modern React with Server Components
- TypeScript for type safety
- Tailwind CSS for styling
- OpenAI integration for AI features
- GitHub API for repository data

## Deployment

Deploy on Vercel or any platform supporting Next.js:

1. Set environment variables on your platform
2. Deploy the application
3. Ensure OpenAI API key is configured

For Vercel deployment, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
