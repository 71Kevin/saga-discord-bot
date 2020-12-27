FROM mhart/alpine-node:12

RUN npm install --global yarn

ADD package.json /saga-discord-bot/
WORKDIR /saga-discord-bot/

RUN yarn
ADD . /saga-discord-bot/

EXPOSE 335

CMD ["npm","run","start"]