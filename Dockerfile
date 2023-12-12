FROM node:18-alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=development
COPY . .
RUN npm run build


########################
# Production container #
########################

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY --from=development /usr/src/app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

ENV TZ="Europe/Berlin"

# set to 12 GB JavaScript Heap memory
CMD ["node", "--max-old-space-size=12225", "dist/main"]
