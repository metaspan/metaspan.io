# https://docs.docker.com/build/building/multi-platform/
ARG BUILDPLATFORM
ARG TARGETPLATFORM

FROM --platform=$TARGETPLATFORM node:18-slim as build-stage
# FROM --platform=$TARGETPLATFORM node

RUN echo "I am running on ${BUILDPLATFORM}, building for ${TARGETPLATFORM}"

ENV HTTP_PORT 8080
ENV API_HOST ''
ENV API_PORT ''

RUN mkdir /app
WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

FROM --platform=$TARGETPLATFORM nginx as deploy-stage

COPY --from=build-stage /app/dist/. /usr/share/nginx/html/

COPY docker/etc/nginx/nginx.conf /etc/nginx/nginx.conf
# COPY docker/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY docker/etc/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/etc/nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# CMD [ "yarn", "dev" ]
# CMD [ "http-server", "dist", "--proxy", "http://localhost:8080?", "--proxy-options" ]
# CMD ["nginx", "-g", "daemon off;"]

EXPOSE ${HTTP_PORT}
CMD [ "/entrypoint.sh" ]
