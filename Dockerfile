FROM node:alpine
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
## Install build toolchain, install node deps and compile native add-ons
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .


#node Port
EXPOSE 3000
# Entry point
CMD [ "node", "server.js" ]