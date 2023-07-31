FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json .
COPY patches ./patches
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

FROM base AS build
COPY . .
RUN pnpm run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY /server ./server
COPY .env .
CMD [ "npm", "run", "serve" ]
EXPOSE 5173
