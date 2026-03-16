# Stage 1 - Build
ARG base_image_version=latest
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .

RUN pnpm install --offline \
 && pnpm build \
 && pnpm prune --prod


# Stage 2 - Runtime
FROM 437089831625.dkr.ecr.ap-southeast-2.amazonaws.com/base-image:${base_image_version} AS runtime

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/templates ./templates

ENV NODE_ENV=production \
PORT=4000
EXPOSE 4000

USER nonroot

CMD [ "dist/src/main.js"]