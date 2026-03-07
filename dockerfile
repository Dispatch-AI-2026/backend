# Stage 1 – Build
FROM node:20-alpine3.22 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm fetch
COPY . .
RUN pnpm install --offline \
&& pnpm build \
&& pnpm prune --prod

# Stage 2 – Runtime
FROM node:20-alpine3.22 AS runtime
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm fetch && pnpm install --prod --offline
# 仅复制运行所需文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/templates ./templates


ENV NODE_ENV=production \
PORT=4000
EXPOSE 4000
CMD ["node", "dist/src/main"]