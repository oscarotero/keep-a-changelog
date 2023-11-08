FROM node:alpine

RUN npm install --omit=dev --no-audit -g keep-a-changelog@2.5.0

WORKDIR app
ENTRYPOINT changelog
