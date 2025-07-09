# TLGIT Development Setup

This guide will help you set up the TLGIT development environment with GitHub OAuth integration.

## Prerequisites

- Node.js 18+ and npm/pnpm
- A GitHub account
- A code editor (VS Code recommended)

## 1. GitHub OAuth App Setup

Before running the application, you need to create a GitHub OAuth App:

### Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Fill in the application details:
   - **Application name**: `TLGIT Development` (or any name you prefer)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/app/callback`
3. Click "Register application"
4. Note down your **Client ID** and **Client Secret**

## 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
```

**Important**: Replace `your_github_client_id_here` and `your_github_client_secret_here` with the actual values from your GitHub OAuth App.

## 3. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install
```

## 4. Run the Development Server

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 5. Testing the GitHub Integration

1. Click "Try for free" on the landing page
2. Click "Connect GitHub Account"
3. You'll be redirected to GitHub for authorization
4. After authorizing, you'll be redirected back to the app
5. Your repositories should load automatically

## Application Structure

```
app/
├── page.tsx                 # Landing page
├── layout.tsx              # Root layout
├── app/
│   ├── page.tsx            # Main app dashboard
│   └── callback/
│       └── page.tsx        # GitHub OAuth callback handler
└── api/
    └── auth/
        └── github/
            └── route.ts    # GitHub OAuth token exchange API
```

## Features Implemented

- ✅ Landing page with "Try for free" button
- ✅ GitHub OAuth integration
- ✅ Repository fetching and display
- ✅ Repository selection with checkboxes
- ✅ Responsive UI with dark theme
- ✅ Error handling and loading states

## Development Notes

### GitHub API Rate Limits

- **Authenticated requests**: 5,000 per hour
- **Unauthenticated requests**: 60 per hour

The app uses authenticated requests once the user connects their GitHub account.

### Security Considerations

- The GitHub access token is stored in localStorage (for development)
- In production, consider using secure HTTP-only cookies
- Never expose the `GITHUB_CLIENT_SECRET` in client-side code

### Next Steps for Production

1. Set up proper session management
2. Add database for storing user data and repository selections
3. Implement commit fetching and AI analysis
4. Add proper error boundaries and logging
5. Set up GitHub App instead of OAuth App for better security

## Troubleshooting

### "GitHub OAuth credentials not configured" error

Make sure your `.env.local` file is properly set up with the correct GitHub OAuth credentials.

### "Failed to fetch repositories" error

This usually means:

1. The access token is invalid or expired
2. The user doesn't have access to any repositories
3. GitHub API rate limit has been exceeded

### OAuth redirect not working

Double-check that your GitHub OAuth App's callback URL is set to `http://localhost:3000/app/callback`.

## Environment Variables Reference

| Variable                       | Description                              | Required |
| ------------------------------ | ---------------------------------------- | -------- |
| `GITHUB_CLIENT_ID`             | GitHub OAuth App Client ID (server-side) | Yes      |
| `GITHUB_CLIENT_SECRET`         | GitHub OAuth App Client Secret           | Yes      |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | GitHub OAuth App Client ID (client-side) | Yes      |

---

Need help? Check the [GitHub OAuth documentation](https://docs.github.com/en/developers/apps/building-oauth-apps) or open an issue.
