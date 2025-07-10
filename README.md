# TLGIT - GitHub Commit Analysis & Stand-up Generator

Transform your GitHub commit history into actionable stand-up notes and AI-powered insights.

## ✨ Features

- **🤖 AI-Powered Summaries**: Creates professional summaries using OpenAI GPT-4o-mini
- **⚡ Automatic Commit Tracking**: Watches your GitHub repositories for new commits
- **📊 Individual Commit Insights**: AI explains what each commit does
- **📈 Enhanced Stand-up Notes**: Generated from actual commit data
- **🔄 Real-time Updates**: Tracks commits since you started monitoring
- **🚀 Production-Ready**: Optimized for performance, SEO, and monitoring

## 🎯 Production Optimizations

This app is production-ready with the following optimizations:

### Performance

- ✅ Next.js 15 with App Router and React 19
- ✅ Image optimization with WebP/AVIF support
- ✅ Bundle optimization and code splitting
- ✅ Caching for API responses and AI summaries
- ✅ React performance optimizations (memo, useMemo, useCallback)
- ✅ Lazy loading and suspense boundaries

### SEO & Metadata

- ✅ Comprehensive metadata and Open Graph tags
- ✅ Dynamic sitemap.xml and robots.txt
- ✅ Structured data (JSON-LD)
- ✅ Vercel OG for dynamic social images
- ✅ Twitter Card support
- ✅ Canonical URLs and meta optimization

### Monitoring & Analytics

- ✅ Vercel Analytics integration
- ✅ Vercel Speed Insights
- ✅ Error boundaries and comprehensive error handling
- ✅ Sentry integration ready
- ✅ Performance monitoring setup

### Security & Best Practices

- ✅ Security headers (CSP, HSTS, etc.)
- ✅ Environment variable validation
- ✅ Type safety with TypeScript
- ✅ ESLint configuration
- ✅ Production build optimization

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```bash
# Required: OpenAI API Key for AI summaries
OPENAI_API_KEY=your_openai_api_key_here

# Required: GitHub OAuth Configuration
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Optional: SEO verification codes
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_code
```

### 3. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App:
   - **Homepage URL**: `http://localhost:3000` (dev) or your domain (prod)
   - **Callback URL**: `http://localhost:3000/app/callback` (dev) or `https://yourdomain.com/app/callback` (prod)
3. Copy Client ID and Secret to your `.env.local`

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start using TLGIT.

## 📦 Production Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

```bash
# Optional: Analyze bundle before deploying
pnpm analyze
```

### Docker Deployment

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Performance Testing

```bash
# Type checking
pnpm type-check

# Bundle analysis
pnpm analyze

# Lighthouse testing (after starting the server)
pnpm test:lighthouse
```

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **AI**: OpenAI GPT-4o-mini via Vercel AI SDK
- **Analytics**: Vercel Analytics, Vercel Speed Insights
- **SEO**: next-seo, @vercel/og for social images
- **Monitoring**: Error boundaries, Sentry integration ready
- **GitHub Integration**: GitHub REST API

## 📊 API Endpoints

- `POST /api/generate-summary` - Generate AI summaries for commits
- `GET /api/og` - Dynamic Open Graph image generation
- `GET /sitemap.xml` - Dynamic sitemap
- `GET /robots.txt` - SEO robots configuration
- `GET /manifest.json` - PWA manifest

## 🔧 Development Tools

```bash
# Development with Turbopack
pnpm dev

# Production build
pnpm build && pnpm start

# Linting
pnpm lint

# Bundle analysis
pnpm analyze
```

## 📈 Performance Features

- **Caching**: API responses cached for 5-10 minutes
- **Batch Processing**: GitHub API calls processed in batches
- **Error Recovery**: Automatic retry logic for failed requests
- **Loading States**: Comprehensive skeleton loaders
- **Error Boundaries**: Graceful error handling
- **Image Optimization**: Next.js Image component ready
- **Code Splitting**: Automatic route-based splitting

## 🔒 Security

- Security headers configured in `next.config.ts`
- Environment variables validated
- GitHub OAuth for secure API access
- Rate limiting respect for GitHub API
- XSS protection and CSP headers

## 📱 Mobile & PWA Ready

- Responsive design with mobile-first approach
- Web App Manifest for PWA capabilities
- Touch-friendly interface
- Dark mode optimized
- Fast loading on mobile networks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for developer productivity**
