# Use an official Node runtime as a parent image
FROM node:16-alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN npm install -y
RUN npm run build

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 downalerts-web

USER downalerts-web

ENV REACT_APP_API_URL http://host.docker.internal:5000

EXPOSE 3000
CMD ["npm", "start"]