FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
COPY public ./public
ENV NODE_ENV=production
# Persist the SQLite DB on a mounted volume at /app/data (see README).
VOLUME ["/app/data"]
EXPOSE 3000
CMD ["node", "server.js"]
