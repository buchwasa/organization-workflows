FROM node:lts-slim
WORKDIR /usr/src/app
COPY package.json yarn.lock tsconfig.json ./
COPY src src
RUN yarn install --immutable
RUN yarn run build
RUN yarn cache clean --force
ENV NODE_ENV="production"
ENV PORT=8080
EXPOSE 8080
COPY lib lib
CMD [ "yarn", "start" ]
