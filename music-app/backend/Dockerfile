# Use a base image for Node.js
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the backend code into the Docker image
COPY . .

# Install dependencies
RUN npm install

# Expose the necessary port for the backend service
EXPOSE 3001

# Command to run the backend server
CMD ["node", "server.js"]
