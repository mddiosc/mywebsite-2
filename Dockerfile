# ============================================================
# Stage 1: Builder
# ============================================================
# node:24.18.0-alpine3.24 (multi-arch manifest-list digest, amd64+arm64+s390x)
FROM node:24.18.0-alpine3.24@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd AS builder

# Upgrade all system packages to latest patched versions
RUN apk upgrade --no-cache

# Install pnpm (must match packageManager in package.json + mise.toml)
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build args are injected as environment variables at build time
# (Vite embeds them into the bundle at compile time, not runtime)
ARG GITHUB_TOKEN
ARG VITE_GITHUB_USERNAME
ARG VITE_FORMSPREE_ID
ARG VITE_RECAPTCHA_SITE_KEY
ARG VITE_LINKEDIN_USERNAME
ARG VITE_UMAMI_WEBSITE_ID
ARG VITE_SITE_URL

ENV VITE_GITHUB_USERNAME=$VITE_GITHUB_USERNAME
ENV VITE_FORMSPREE_ID=$VITE_FORMSPREE_ID
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY
ENV VITE_LINKEDIN_USERNAME=$VITE_LINKEDIN_USERNAME
ENV VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN GITHUB_TOKEN=$GITHUB_TOKEN pnpm run build

# ============================================================
# Stage 2: Production server
# ============================================================
# nginxinc/nginx-unprivileged: runs as non-root (uid 101),
# Alpine base, minimal attack surface for static file serving
# nginxinc/nginx-unprivileged:1.31.2-alpine3.23 (multi-arch manifest-list digest, amd64+arm64+arm/v7+ppc64le+s390x+riscv64)
FROM nginxinc/nginx-unprivileged:1.31.2-alpine3.23@sha256:054e14f543eb688809d59ec2ad1644d1a61678e247c87a318ad605977eb37eaf AS production

USER root
RUN apk upgrade --no-cache && rm -rf /var/cache/apk/*
USER nginx

# Copy custom nginx config
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder stage
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# nginx-unprivileged listens on 8080 by default (non-root port)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
