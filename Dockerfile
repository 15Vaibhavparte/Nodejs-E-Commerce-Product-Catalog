# Stage 1: Build & Install dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies (including dev for linting/testing)
RUN npm ci 
COPY . .

# Stage 2: Production Image
FROM node:20-alpine
WORKDIR /app
# Set environment to production
ENV NODE_ENV=production
# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production
# Copy application code from builder stage
COPY --from=builder /app/config ./config
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/public ./public
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/views ./views
COPY --from=builder /app/server.js ./

EXPOSE 3000
# Run as a non-root user for security
USER node
CMD ["node", "server.js"]