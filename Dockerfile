# Use the official Node.js 18 image as the base image
FROM node:18-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy tsconfig.json for TypeScript build
COPY tsconfig.json ./

# Copy the rest of the application code
COPY . .

# Build TypeScript files
RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 8080

# Start the server using npm (loads .env if present)
CMD ["npm", "start"]
