FROM buildkite/puppeteer:latest
ENV  PATH="${PATH}:/node_modules/.bin"
ADD ./scripts /scripts

RUN npm i request
RUN npm i commander

ENTRYPOINT node scripts/app.js -ds $DATA_SERVICE_URL

