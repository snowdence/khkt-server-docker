FROM node:14-alpine

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app

ADD package.json /app/
RUN yarn global add cross-env
RUN yarn --frozen-lockfile
ADD . /app
RUN rm -f yarn.lock
RUN rm -f package.lock

CMD ["npm", "run docker:start"]
