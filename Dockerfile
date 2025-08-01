# Step 1: Use official Node.js image for building
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all necessary files
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Use a minimal image for serving the app
FROM node:20-alpine AS runner

# Enable production mode
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the build output and other necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Start the Next.js server
EXPOSE 3000
CMD ["npm", "start"]
