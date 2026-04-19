FROM node:20-bookworm

# Create app directory
WORKDIR /backend

RUN apt-get update && apt-get install -y vim

# Install app dependencies
COPY package*.json ./

# Use npm mirror for better network connectivity
RUN npm config set registry https://registry.npmmirror.com

# Install dependencies
RUN npm install

RUN npm i --location=global nodemon

# Copy source directory
COPY . .

CMD [ "nodemon" ]
