# Use a base image for Node.js
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the frontend code into the Docker image
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code into the Docker image
COPY . .

# Expose the necessary port for the frontend service
EXPOSE 3000

# Command to run the frontend service
CMD ["npm", "run", "dev"]
