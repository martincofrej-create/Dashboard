# ─── Klassik Car Dashboard — Cloud Run ───
FROM node:18-alpine

WORKDIR /app

# Install dependencies first (Docker cache layer)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY src/ ./src/
COPY public/ ./public/

# Cloud Run uses PORT env variable (default 8080)
ENV PORT=8080
EXPOSE 8080

# Run as non-root for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

CMD ["node", "src/server.js"]
