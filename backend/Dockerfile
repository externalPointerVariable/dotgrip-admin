FROM oven/bun:1.1.0-alpine
WORKDIR /usr/src/app
COPY bun.lockb package.json ./
RUN bun install --production
COPY . .
EXPOSE 8000
CMD ["bun", "start"]