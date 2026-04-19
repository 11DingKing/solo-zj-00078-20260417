FROM node:20-bookworm-slim

# Create app directory
WORKDIR /frontend

# Install app dependencies
COPY package.json yarn.lock ./

COPY . .

# Use yarn mirror for better network connectivity
RUN yarn config set registry https://registry.npmmirror.com

RUN yarn install

ENV NODE_ENV=development

CMD [ "yarn", "start" ]
