FROM --platform=linux/amd64 node:18.16-alpine
WORKDIR /app
COPY . .
RUN npm ci

CMD npx artillery run ${SCRIPT}

