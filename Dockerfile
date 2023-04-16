####################################################################
#Stage: 0 Downloading dependencies
FROM node:16.13.2-alpine@sha256:2f50f4a428f8b5280817c9d4d896dbee03f072e93f4e0c70b90cc84bd1fcfe0d AS dependencies

LABEL maintainer="Nikita Sachivko <nsachivko@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV PORT=9000

ENV NPM_CONFIG_LOGLEVEL=warn

ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

####################################################################
#Stage: 1 setting up build files
FROM node:16.13.2-alpine@sha256:2f50f4a428f8b5280817c9d4d896dbee03f072e93f4e0c70b90cc84bd1fcfe0d AS build

WORKDIR /app
COPY --from=dependencies /app /app

COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

CMD ["npm", "run", "start"]

EXPOSE 9000

