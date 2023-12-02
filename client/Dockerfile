FROM node:20.9


WORKDIR /profile

COPY package.json ./
RUN npm i @rollup/rollup-linux-arm64-gnu

RUN npm i

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
