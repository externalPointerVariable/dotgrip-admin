FROM oven/bun:latest

# Use /app for consistency across containers
WORKDIR /app

# Copy the .env file explicitly so it's baked into the image context
COPY .env ./

# Copy everything else
COPY . .

# Install dependencies within the container
RUN bun install

EXPOSE 8000

CMD ["bun", "start"]