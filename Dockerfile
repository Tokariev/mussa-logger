# FROM node:18-alpine As development

# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install --only=development
# COPY . .
# RUN npm run build


# ########################
# # Production container #
# ########################

# FROM node:18-alpine as production
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}
# WORKDIR /usr/src/app
# COPY --from=development /usr/src/app/dist ./dist
# COPY package*.json ./
# RUN npm install --only=production

# # set to 12 GB JavaScript Heap memory
# CMD ["node", "--max-old-space-size=12225", "dist/main"]



# >>>>>>


FROM node:18.19-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn

# ================================
# Dependencies stage - Shared types
# ================================
FROM base AS shared-deps
WORKDIR /shared-types

# Copy package files first for better layer caching
COPY shared-types/package*.json ./
RUN npm ci --only=production --silent

# Copy minimal TypeScript config
COPY shared-types/tsconfig.json ./

# Install TypeScript only for building (will be removed)
RUN npm install --no-save typescript

# Copy source and build
COPY shared-types/ .
RUN npm run build

# Remove TypeScript and dev dependencies to reduce size
RUN npm prune --production

# ================================
# Dependencies stage - Service
# ================================
FROM base AS service-deps
WORKDIR /app

# Copy shared-types artifacts (smaller than full directory)
COPY --from=shared-deps /shared-types/dist /shared-types/dist
COPY --from=shared-deps /shared-types/package.json /shared-types/

# Copy service package files for caching
COPY logger/package*.json ./

# Install shared-types and production dependencies only
RUN npm install file:/shared-types --silent
RUN npm ci --only=production --silent && npm cache clean --force

# ================================
# Build stage - Only for compilation
# ================================
FROM service-deps AS builder

# Install dev dependencies (only needed for building)
RUN npm ci --silent

# Copy source
COPY logger/ .

# Build the application
RUN npm run build

# Remove dev dependencies immediately after build
RUN npm prune --production

# ================================
# Development stage
# ================================
FROM base AS development
WORKDIR /app

# Copy from builder stage (includes built app + production deps)
COPY --from=builder /app .

# Install dev dependencies and CLI tools for development
RUN npm ci --silent
RUN npm install -g @nestjs/cli@latest --silent

# Copy shared-types for development
COPY --from=shared-deps /shared-types /shared-types

ENV NODE_ENV=development
EXPOSE 3005
CMD ["npm", "run", "start:dev"]

# ================================
# Production stage - Minimal runtime
# ================================
FROM node:18.19-alpine AS production

WORKDIR /app

# Copy shared-types
COPY --from=shared-deps /shared-types /shared-types

# Copy only production artifacts
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# Switch to non-root user
# USER nestjs

# Environment
ENV NODE_ENV=production
ENV TZ="Europe/Berlin"

EXPOSE 3005

CMD ["node", "dist/main"]