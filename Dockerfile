FROM node:16

WORKDIR /services/gour-main-service

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

HEALTHCHECK --interval=12s --timeout=12s --start-period=30s \  
    CMD node healthcheck.mjs

CMD [ "node", "dist/main.js" ]
