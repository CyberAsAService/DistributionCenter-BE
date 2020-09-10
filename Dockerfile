FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc --build
EXPOSE 3000
ENTRYPOINT ["node"]
CMD ["./dist/server.js"]

