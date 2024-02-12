# Dockerfile
FROM node:18-alpine

# create destination directory
RUN mkdir -p /home/app
WORKDIR /home/app

# # update and install dependency
# RUN apk update && apk upgrade
# RUN apk add git

# copy the app, note .dockerignore
COPY . .
# RUN yarn install
# RUN yarn build

EXPOSE 8080

ENV NUXT_HOST=0.0.0.0
ENV PORT=8080

CMD [ "node", ".output/server/index.mjs" ]
