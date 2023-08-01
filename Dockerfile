FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS prod
COPY /server .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=prod /app .
COPY --from=build /app/web/dist ./dist
CMD [ "npm", "run", "serve" ]
EXPOSE 3000
