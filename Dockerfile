FROM node:11-alpine
RUN npm install -g typescript && \
  mkdir -p /app/src
COPY package.json tsconfig.json /app/
COPY src /app/src/
WORKDIR /app
RUN npm i && \
  npm run build
CMD ["node", "dist/server.js"]
