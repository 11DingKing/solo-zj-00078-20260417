FROM node:20-bookworm-slim

# Create app directory
WORKDIR /frontend

# Use yarn mirror for better network connectivity
RUN yarn config set registry https://registry.npmmirror.com

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn install

# Copy source directory
COPY . .

ENV NODE_ENV=development

CMD [ "yarn", "start" ]
