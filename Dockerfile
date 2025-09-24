# ===== Base =====
FROM node:20-alpine AS base
WORKDIR /app
ENV NPM_CONFIG_LOGLEVEL=warn

# ================================
# Dependencies stage - Shared types
# ================================
FROM base AS shared-deps
WORKDIR /shared-types

COPY shared-types/package*.json ./
RUN npm ci --only=production --silent

# Copy minimal TypeScript config
COPY shared-types/tsconfig.json ./

# nur fürs Bauen
RUN npm install --no-save --silent typescript

COPY shared-types/ .
RUN npm run build

RUN npm prune --production


# ================================
# Dependencies stage - Service
# ================================
FROM base AS service-deps
WORKDIR /app

# Nur gebaute Artefakte der shared-types übernehmen
COPY --from=shared-deps /shared-types/dist /shared-types/dist
COPY --from=shared-deps /shared-types/package.json /shared-types/

# Service package-Dateien
COPY logger/package*.json ./

# shared-types + Prod-Deps
RUN npm install file:/shared-types --silent
RUN npm ci --only=production --silent && npm cache clean --force

# ================================
# Build stage
# ================================
FROM service-deps AS builder

# WICHTIG: Dev-Deps installieren
RUN npm ci --include=dev --silent

# Source kopieren & bauen
COPY logger/ .
RUN npm run build 

# Nach dem Build wieder abspecken
RUN npm prune --production

# ================================
# Development stage
# ================================
FROM base AS development
WORKDIR /app

COPY --from=builder /app .
RUN npm ci --silent
RUN npm install -g @nestjs/cli@latest --silent

COPY --from=shared-deps /shared-types /shared-types

ENV NODE_ENV=development
EXPOSE 3005
CMD ["npm", "run", "start:dev"]

# ================================
# Production stage
# ================================
FROM node:20-alpine AS production
WORKDIR /app

# Optional: shared-types nur, falls zur Runtime gebraucht
COPY --from=shared-deps /shared-types /shared-types

# Copy package files and install dependencies
# We cann't pre-compiled native binaries from the builder because were compiled for a different architecture -> linux/x86_64
COPY --from=builder /app/package*.json ./

# Install dependencies and rebuild native modules for production architecture
RUN npm install file:/shared-types --silent
RUN npm ci --only=production --silent

# Copy built application
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV TZ="Europe/Berlin"

EXPOSE 3005
CMD ["node", "dist/main"]
