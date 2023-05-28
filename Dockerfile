FROM node:16-alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN rm -r client
COPY . .
RUN npm install -y
RUN npm install --dev

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 downalerts-api

USER downalerts-api

ENV PORT 5000
EXPOSE 5000
CMD ["node", "dist/index.js"]