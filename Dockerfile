# Stage 1: Build the React application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock / pnpm-lock.yaml)
# Adjust if you use a different lock file name or package manager
COPY package*.json ./
# COPY yarn.lock ./
# COPY pnpm-lock.yaml ./

# Install dependencies
# Choose the command corresponding to your package manager
RUN npm install
# RUN yarn install
# RUN pnpm install

# Copy the rest of the application source code
# This includes src, public, vite.config.ts, tsconfig.json, index.html, tailwind.config.ts etc.
COPY . .

# Build the application
# Ensure your package.json has a "build" script (e.g., "vite build")
RUN npm run build
# RUN yarn build
# RUN pnpm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage (Vite typically outputs to 'dist' folder)
COPY --from=builder /app/dist .

# Expose port 80 (Nginx default port inside the container)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]