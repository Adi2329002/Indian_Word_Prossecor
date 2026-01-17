# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
# Copy package files to install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry (optional)
ENV NEXT_TELEMETRY_DISABLED 1

# Build the project
RUN npm run build

# Stage 3: Run the app
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary files from the build stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# Start the server
CMD ["node", "server.js"]