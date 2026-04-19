# Use Bun official image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy rest of the code
COPY . .

# Install dependencies
RUN bun install


# Expose port (your app runs on 8000)
EXPOSE 8000

# Start the app
CMD ["bun", "start"]
