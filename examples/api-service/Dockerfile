# Multi-stage build for DataHub API Gateway

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build TypeScript
RUN npm run build

# Prune dev dependencies
RUN npm prune --omit=dev

# ============================================
# Stage 3: Production Runner
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 datahub

# Copy production files
COPY --from=builder --chown=datahub:nodejs /app/dist ./dist
COPY --from=builder --chown=datahub:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=datahub:nodejs /app/package.json ./

# Copy migrations
COPY --chown=datahub:nodejs migrations ./migrations

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Run as non-root
USER datahub

# Start application
CMD ["node", "dist/index.js"]
