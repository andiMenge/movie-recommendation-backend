FROM node:10-alpine
RUN mkdir -p /app/src
COPY package.json tsconfig.json /app/
COPY src /app/src/
WORKDIR /app
RUN npm i && \
  npm run build
EXPOSE 3000
CMD ["npm", "start"]
