# ============================================================
# Stage 1: Builder
# ============================================================
FROM node:22-alpine AS builder

# Upgrade all system packages to latest patched versions
RUN apk upgrade --no-cache

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.3 --activate

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build args are injected as environment variables at build time
# (Vite embeds them into the bundle at compile time, not runtime)
ARG VITE_GITHUB_TOKEN
ARG VITE_GITHUB_USERNAME
ARG VITE_FORMSPREE_ID
ARG VITE_RECAPTCHA_SITE_KEY
ARG VITE_LINKEDIN_USERNAME
ARG VITE_UMAMI_WEBSITE_ID
ARG VITE_SITE_URL

ENV VITE_GITHUB_TOKEN=$VITE_GITHUB_TOKEN
ENV VITE_GITHUB_USERNAME=$VITE_GITHUB_USERNAME
ENV VITE_FORMSPREE_ID=$VITE_FORMSPREE_ID
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY
ENV VITE_LINKEDIN_USERNAME=$VITE_LINKEDIN_USERNAME
ENV VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN pnpm run build

# ============================================================
# Stage 2: Production server
# ============================================================
# nginxinc/nginx-unprivileged: runs as non-root (uid 101),
# Debian slim base, minimal attack surface for static file serving
FROM nginxinc/nginx-unprivileged:1.27-alpine AS production

# Upgrade all system packages to latest patched versions
USER root
RUN apk upgrade --no-cache
USER nginx

# Copy custom nginx config
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# nginx-unprivileged listens on 8080 by default (non-root port)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
