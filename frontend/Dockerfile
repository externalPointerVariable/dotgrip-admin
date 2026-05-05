FROM oven/bun:latest AS build

WORKDIR /app

# Copy the frontend .env (Vite will look for VITE_ prefixed variables here)
COPY .env ./

COPY package.json bun.lock ./
RUN bun install

COPY . .

# This "bakes" the URL into the code during the build stage
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# IMPORTANT: Use /app/dist to match the WORKDIR above
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]