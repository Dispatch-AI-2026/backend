# Stage 1 – Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm fetch
COPY . .
RUN pnpm install --offline && pnpm build

# Stage 2 – Runtime
FROM node:18-alpine AS runtime
WORKDIR /app

# 仅复制运行所需文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/templates ./templates
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm fetch && pnpm install --prod --offline

ENV NODE_ENV=production \
PORT=4000
EXPOSE 4000
CMD ["node", "dist/src/main"]