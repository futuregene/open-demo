FROM node:lts-alpine AS base
RUN npm install pnpm -g
WORKDIR /app
COPY package.json .
COPY patches ./patches
RUN pnpm install

FROM base AS build
COPY . .
RUN pnpm run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY /server ./server
COPY processes.json .
CMD [ "npm", "run", "server" ]
EXPOSE 8708
